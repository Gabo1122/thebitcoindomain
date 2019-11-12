(function () {
    'use strict';

    /**
     * @param Base
     * @param $scope
     * @param $state
     * @param user
     * @param modalManager
     * @param {app.utils} appUtils
     * @return {SignInCtrl}
     */
    const controller = function (Base, $scope, $state, user, modalManager, appUtils) {

        const ds = require('data-service');
        const analytics = require('@waves/event-sender');
        const PATH = 'modules/signIn/templates';

        class SignInCtrl extends Base {

            /**
             * @type {boolean}
             */
            networkError = false;
            /**
             * @type {string}
             */
            password = '';
            /**
             * @type {null}
             */
            loginForm = null;
            /**
             * @type {string}
             */
            activeUserAddress = null;
            /**
             * @type {boolean}
             */
            needPassword = true;
            /**
             * @type {number}
             * @private
             */
            _activeUserIndex = null;

            get user() {
                return this.userList[this._activeUserIndex];
            }

            get encryptedSeed() {
                return this.user.encryptedSeed;
            }

            constructor() {
                super($scope);

                this.observe('activeUserAddress', this._calculateActiveIndex);
                this.observe('password', this._updatePassword);

                analytics.send({ name: 'Onboarding Sign In Show', target: 'ui', params: { from: 'sign-in' } });
                this._initUserList();
            }

            /**
             * @public
             */
            showTutorialModals() {
                return modalManager.showTutorialModals();
            }


            /**
             * @private
             */
            _updatePassword() {
                if (this.password) {
                    this.showPasswordError = false;
                    this.networkError = false;
                }
            }

            login() {
                try {
                    this.networkError = false;
                    this.showPasswordError = false;
                    const userSettings = user.getSettingsByUser(this.user);
                    const activeUser = { ...this.user, password: this.password, settings: userSettings };
                    const api = ds.signature.getDefaultSignatureApi(activeUser);
                    const adapterAvailablePromise = api.isAvailable(true);

                    let canLoginPromise;

                    if (this._isSeedAdapter(api) || this._isPrivateKeyAdapter(api)) {
                        canLoginPromise = adapterAvailablePromise.then(() => api.getAddress())
                            .then(address => address === activeUser.address ? true : Promise.reject('Wrong address!'));
                    } else {
                        canLoginPromise = modalManager.showLoginByDevice(adapterAvailablePromise, api.type);
                    }

                    return canLoginPromise.then(() => {
                        return user.login({
                            api,
                            userType: api.type,
                            password: this.password,
                            address: activeUser.address
                        });
                    }, () => {
                        if (!this._isSeedAdapter(api) && !this._isPrivateKeyAdapter(api)) {
                            const errorData = {
                                error: 'load-user-error',
                                userType: api.type,
                                address: activeUser.address
                            };
                            return modalManager.showSignDeviceError(errorData)
                                .catch(() => Promise.resolve());
                        } else {
                            this._showPasswordError();
                        }
                    });
                } catch (e) {
                    this._showPasswordError();
                }
            }

            /**
             * @param {string} address
             */
            removeUser(address) {
                const user = this.userList.find((user) => user.address === address);

                modalManager.showConfirmDeleteUser(user)
                    .then(() => this._deleteUser(address))
                    .then(() => {
                        if (!this.userList.length) {
                            $state.go('welcome');
                        }
                    });
            }

            /**
             * @param {Adapter} api
             * @return boolean
             * @private
             */
            _isSeedAdapter(api) {
                return api.type && api.type === 'seed';
            }

            /**
             * @param {Adapter} api
             * return boolean
             * @private
             */
            _isPrivateKeyAdapter(api) {
                return api.type && api.type === 'privateKey';
            }

            /**
             * @private
             */
            _showPasswordError() {
                this.password = '';
                this.showPasswordError = true;
                this.networkError = this.user.networkError;
            }

            /**
             * @return {Promise}
             * @private
             */
            _deleteUser(address) {
                return user.removeUserByAddress(address).then(() => {
                    this.userList = this.userList.filter((user) => user.address !== address);
                    this._updateActiveUserAddress();
                    appUtils.safeApply($scope);
                });
            }

            /**
             * @private
             */
            _initUserList() {
                user.getFilteredUserList()
                    .then((list) => {
                        this.userList = list;
                        this.pendingRestore = false;
                        this._updateActiveUserAddress();
                        appUtils.safeApply($scope);
                    });
            }

            /**
             * @private
             */
            _updateActiveUserAddress() {
                if (this.userList.length) {
                    this.activeUserAddress = this.userList[0].address;
                    this.needPassword = !this.userList[0].userType ||
                                        this.userList[0].userType === 'seed' ||
                                        this.userList[0].userType === 'privateKey';
                } else {
                    this.activeUserAddress = null;
                    this.needPassword = true;
                }
                this._updatePageUrl();
            }

            /**
             * @private
             */
            _updatePageUrl() {
                if (this.userList.length) {
                    this.pageUrl = `${PATH}/signInHasUsers.html`;
                } else {
                    this.pageUrl = `${PATH}/signInNoUsers.html`;
                }
            }

            /**
             * @private
             */
            _calculateActiveIndex() {
                const activeAddress = this.activeUserAddress;
                let index = null;

                if (!activeAddress) {
                    return null;
                }

                this.userList.some(({ address }, i) => {
                    if (address === activeAddress) {
                        index = i;
                        return true;
                    }
                    return false;
                });

                this._activeUserIndex = index;
                this.needPassword = !this.userList[index].userType ||
                                    this.userList[index].userType === 'seed' ||
                                    this.userList[index].userType === 'privateKey';
            }

        }

        return new SignInCtrl();
    };

    controller.$inject = ['Base', '$scope', '$state', 'user', 'modalManager', 'utils'];

    angular.module('app.signIn')
        .controller('SignInCtrl', controller);
})();
