import { get } from 'ts-utils';
import { IPartialOptions } from './interfaces';


export abstract class BasePart<T extends IPartialOptions<any>> {

    protected options: T;
    protected path: string;

    constructor(options: T, path?: string) {
        this.options = options;
        this.path = path;

        if (this.options.isEmpty) {
            this.isEmpty = this.options.isEmpty;
        }

        if (this.options.isValid) {
            this.isValid = this.options.isValid;
        }

        if (this.options.required && ('defaultValue' in this.options)) {
            throw new Error('Wrong params! Conflict options "required" and defaultValue');
        }
    }

    public process(data: any, roots: Array<any>): Promise<any> {
        const path = this.getPath();
        const result = this.getValue(this.getDataByPath(data, path), roots);

        return BasePart.toPromise(result).then((value) => {
            const isEmpty = this.isEmpty(value);
            const isValid = this.isValid(value);
            const type = (this.options.type as any).name || (this.options.type as any).prototype.constructor.name;

            if (this.options.required) {
                if (isEmpty) {
                    throw new Error(`Required field type "${type}" "${path}" is empty!`);
                }
            }

            if (('defaultValue' in this.options) && isEmpty) {
                value = this.options.defaultValue;
            } else {
                if (!isValid) {
                    throw new Error(`Field "${path}" is invalid!`);
                }
            }

            return value;
        });
    }

    protected getPath(): string {
        return this.options.path === null ? null : this.options.path || this.path;
    }

    protected isEmpty(data: any): boolean {
        return data == null;
    }

    protected isValid(data: any): boolean {
        return true;
    }

    protected getDataByPath(data: any, path: string): any {
        if (this.options.parseValue) {
            if (path) {
                return this.options.parseValue(get(data, path));
            } else {
                return this.options.parseValue(data);
            }
        } else if (path != null) {
            return get(data, path);
        } else {
            return data;
        }
    }

    protected abstract getValue(data: any, roots?: Array<any>): any

    private static isPromise(some: any): boolean {
        return some && some.then && typeof some.then === 'function';
    }

    private static toPromise<T>(some: T | Promise<T>): Promise<T> {
        return BasePart.isPromise(some) ? some as Promise<T> : Promise.resolve(some as T);
    }

}
