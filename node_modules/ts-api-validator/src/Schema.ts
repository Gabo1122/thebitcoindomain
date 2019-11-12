import { IBaseItemConstructor, TSomePart } from './interfaces';
import { BasePart } from './BasePart';


export class Schema {

    private _children: BasePart<any>;


    constructor(config: TSomePart) {
        const Component = config.type as IBaseItemConstructor<any>;
        this._children = new Component(config);
    }

    public parse(data: any): Promise<any> {
        return this._children.process(data, []);
    }

}
