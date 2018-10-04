import {Operation, SyncableHandler, SyncableTree} from "..";
import {OperationHandler} from "../operation/operation-handler";
import {Observable} from "rxjs";

export class SyncableResource<T> {
    private _syncHandler: SyncableHandler;
    private _opHandler: OperationHandler<T>;

    constructor(syncHandler: SyncableHandler, resource?: T) {
        this._syncHandler = syncHandler;
        this._opHandler = new OperationHandler(syncHandler.operations$, resource);
    }

    public queueOperation(operation: Operation): void {
        this._syncHandler.queueOperation(operation);
    }

    public getTree$(): Observable<SyncableTree<T>> {
        return this._opHandler.synced;
    }
}