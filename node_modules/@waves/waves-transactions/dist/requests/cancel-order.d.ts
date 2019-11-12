import { ICancelOrderParams, ICancelOrder } from '../transactions';
export declare const cancelOrderParamsToBytes: (cancelOrderParams: {
    sender: string;
    orderId: string;
}) => Uint8Array;
export declare function cancelOrder(params: ICancelOrderParams, seed?: string): ICancelOrder;
