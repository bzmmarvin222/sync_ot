import {SyncableOperation} from "./syncable-operation";
import {OperationUtil} from "./operations/operation-util";
import {Operation} from "./operation";

export class OperationHandler<T extends object> implements SyncableOperation {
    private readonly _synced: T;

    constructor(synced: T) {
        this._synced = synced;
    }

    public transform(operation: Operation): void {
        OperationUtil.transform(this._synced, operation);
    }
}