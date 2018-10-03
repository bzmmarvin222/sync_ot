import {Operation, OperationHandler} from "../operation";

export class InsertionHandler<T> extends OperationHandler<T> {


    transform(operation: Operation): void {
    }

    constructor(synced: T) {
        super(synced);
    }
}