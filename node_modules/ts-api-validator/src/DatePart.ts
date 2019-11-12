import { BasePart } from './BasePart';
import { IPartialOptions } from './interfaces';


export class DatePart extends BasePart<IPartialOptions<Date>> {

    protected getValue(data: any): Date {

        if (data instanceof Date) {
            return data;
        }

        if (typeof data === 'number') {
            return new Date(data);
        }

        return null;
    }

}
