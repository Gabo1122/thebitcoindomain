import { existsSync, rename } from 'fs';
import { copy, readdir, readJSONSync, writeFile } from 'fs-extra';
import { TaskFunction } from 'gulp';
import { extname, join } from 'path';
import { IMetaJSON, IPackageJSON } from '../ts-scripts/interface';

export function createElectronDebugTask(): TaskFunction {
    return function electronDebugTask() {
        const root = join(__dirname, '..', 'dist', 'desktop', 'electron-debug');
        const srcDir = join(__dirname, '..', 'electron');
        const meta: IMetaJSON = readJSONSync(join(__dirname, '..', 'ts-scripts', 'meta.json'));
        const pack: IPackageJSON = readJSONSync(join(__dirname, '..', 'package.json'));

        const copyItem = name => copy(join(srcDir, name), join(root, name));
        const makePackageJSON = () => {
            const targetPackage = Object.create(null);

            meta.electron.createPackageJSONFields.forEach((name) => {
                targetPackage[name] = pack[name];
            });

            Object.assign(targetPackage, meta.electron.defaults);
            targetPackage.server = 'localhost:8080';

            return writeFile(join(root, 'package.json'), JSON.stringify(targetPackage));
        };

        const excludeTypeScrip = list => list.filter(name => extname(name) !== '.ts');
        const copyNodeModules = () => Promise.all(meta.copyNodeModules.map(name => copy(name, join(root, name))));
        const copyI18next = () => copy(join(__dirname, '..', 'node_modules', 'i18next', 'dist'), join(root, 'i18next'));
        const copyLocales = () => copy(join(__dirname, '..', 'locale'), join(root, 'locales'));

        return readdir(srcDir)
            .then(excludeTypeScrip)
            .then(list => Promise.all(list.map(copyItem)))
            .then(makePackageJSON)
            .then(copyLocales)
            .then(copyNodeModules)
            .then(copyI18next);
    }
}
