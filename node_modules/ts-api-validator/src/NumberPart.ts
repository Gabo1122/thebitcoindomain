import { BasePart } from './BasePart';
import { IPartialOptions } from './interfaces';


export class NumberPart extends BasePart<IPartialOptions<number>> {

    protected getValue(data: any): number {
        switch (typeof data) {
            case 'number':
                return data;
            case 'string':
                return Number(data);
            default:
                return null;
        }
    }

    protected isEmpty(data: any): boolean {
        return data == null || isNaN(data);
    }

}
