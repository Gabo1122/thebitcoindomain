import { BasePart } from './BasePart';
import { isArray } from 'ts-utils';

import { IArrayPart, IBaseItemConstructor } from './interfaces';


export class ArrayPart extends BasePart<IArrayPart> {

    private _child: BasePart<any>;

    constructor(config: IArrayPart, path?: string) {
        super(config, path);
        const Component = this.options.content.type as IBaseItemConstructor<any>;
        this._child = new Component(this.options.content);
    }

    public process(data: any, rootList: Array<any>): Promise<any> {
        return super.process(data, rootList).then((value) => {
            if (value && isArray(value)) {
                return Promise.all(value.map((item) => this._child.process(item, rootList.concat(data))));
            } else {
                return value;
            }
        });
    }

    protected getValue(data: any): Array<any> {
        if (isArray(data)) {
            return data;
        } else {
            return null;
        }
    }

}
