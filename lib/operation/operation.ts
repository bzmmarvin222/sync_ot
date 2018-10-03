import {OperationType} from "./operation-type";
import {OperationRange} from "./operation-range";
import {SyncableOperation} from "./syncable-operation";

export interface Operation {
    objectPath: (string | number)[];
    type: OperationType;
    range: OperationRange;
    data: (string | number | boolean | object);
}

export abstract class OperationHandler<T> implements SyncableOperation {
    protected _synced: T;
    abstract transform(operation: Operation): void;

    constructor(synced: T) {
        this._synced = synced;
    }
}