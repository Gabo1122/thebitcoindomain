import { BasePart } from './BasePart';
import { each, isObject } from 'ts-utils';

import { IBaseItemConstructor, IHash, IObjectPart, TSomePart } from './interfaces';


export class ObjectPart extends BasePart<IObjectPart> {

    private _childHash: IHash<BasePart<any>>;


    constructor(config: IObjectPart, path?: string) {
        super(config, path);

        const myPath = this.getPath();

        this._childHash = Object.create(null);

        each(this.options.content, (config: TSomePart, key) => {
            const Component = config.type as IBaseItemConstructor<any>;
            const localPath = path == null ? String(key) : `${myPath}.${key}`;
            this._childHash[key] = new Component(config, localPath);
        });
    }

    public process(data: any, rootList: Array<any>): Promise<any> {
        return super.process(data, rootList).then((value) => {
            if (value && isObject(value)) {
                const promises = [];
                const result = Object.create(null);
                Object.keys(this._childHash).forEach((name) => {
                    const promise = this._childHash[name].process(data, rootList).then((itemValue) => {
                        result[name] = itemValue;
                    });
                    promises.push(promise);
                });
                return Promise.all(promises).then(() => result);
            } else {
                return value;
            }
        });
    }

    protected getValue(data: any): Array<any> {
        if (isObject(data)) {
            return data;
        } else {
            return null;
        }
    }

}
