import { BasePart } from './BasePart';
import { OUT_DATE_PATTERN } from './config';

import { IStringDatePart } from './interfaces';
import { date, IFilter } from 'ts-utils';


export class StringDatePart extends BasePart<IStringDatePart> {

    protected dateProcessor: IFilter<Date, string>;

    constructor(config: IStringDatePart, path?: string) {
        super(config, path);
        this.dateProcessor = date(this.options.outPattern || OUT_DATE_PATTERN);
    }

    protected getValue(data: any): string {
        let date;

        if (data instanceof Date) {
            date = data;
        }

        if (typeof data === 'number') {
            date = new Date(data);
        }

        if (date) {
            return this.dateProcessor(date);
        }

        return null;
    }

}
