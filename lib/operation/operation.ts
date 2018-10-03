import {OperationType} from "./operation-type";
import {OperationRange} from "./operation-range";
import {SyncableOperation} from "./syncable-operation";
import {OperationUtil} from "./operations/operation-util";

export interface Operation {
    objectPath: (string | number)[];
    type: OperationType;
    range: OperationRange;
    data: (string | number | boolean | object);
}

export abstract class OperationHandler<T extends object> implements SyncableOperation {
    protected _synced: T;

    protected constructor(synced: T) {
        this._synced = synced;
    }

    public transform(operation: Operation): void {
        OperationUtil.transform(this._synced, operation);
    }
}