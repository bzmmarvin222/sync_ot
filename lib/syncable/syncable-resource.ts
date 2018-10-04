import {Operation, SyncableHandler, SyncableTree} from "..";
import {OperationHandler} from "../operation/operation-handler";

export class SyncableResource<T extends object> {
    private _syncHandler: SyncableHandler;
    private _opHandler: OperationHandler<T>;

    constructor(syncHandler: SyncableHandler, resource?: T) {
        this._opHandler = new OperationHandler(resource);
        this._syncHandler = syncHandler;
        this._syncHandler.operations$.subscribe((operation: Operation) => {
            this._opHandler.transform(operation);
        });
    }

    public queueOperation(operation: Operation): void {
        this._syncHandler.queueOperation(operation);
    }

    public getCurrentState(): SyncableTree<T> {
        return this._opHandler.synced;
    }
}