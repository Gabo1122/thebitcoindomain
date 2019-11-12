import { BasePart } from './BasePart';
import { StringDatePart } from './StringDatePart';
import { ObjectPart } from './ObjectPart';
import { ArrayPart } from './ArrayPart';

export interface IPartialOptions<T> {
    path?: string;
    type: IBaseItemConstructor<T>;
    defaultValue?: T;
    required?: boolean;
    isEmpty?: (value: any) => boolean;
    isValid?: (value: any) => boolean;
    parseValue?: (value: any) => T;
}

export interface IStringDatePart extends IPartialOptions<string> {
    type: typeof StringDatePart;
    outPattern?: string;
}

export interface IObjectPart extends IPartialOptions<IHash<any>> {
    type: typeof ObjectPart;
    content: IHash<TSomePart>;
}

export interface IArrayPart extends IPartialOptions<Array<any>> {
    type: typeof ArrayPart;
    content: TSomePart;
}

export type TSomePart =
    IStringDatePart
    | IObjectPart
    | IArrayPart
    | IPartialOptions<any>;

export interface IHash<T> {
    [key: string]: T;
}

export interface IBaseItemConstructor<T> {
    new (options: IPartialOptions<T>, path?: string): BasePart<IPartialOptions<T>>
}
