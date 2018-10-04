import {SyncableOperation} from "./syncable-operation";
import {OperationUtil} from "./operations/operation-util";
import {Operation} from "./operation";
import {SyncableTree} from "../syncable/syncable-tree";

export class OperationHandler<T extends object> implements SyncableOperation {
    private readonly _synced: SyncableTree<T>;

    constructor(synced?: T) {
        this._synced = SyncableTree.root(synced);
    }

    get synced(): SyncableTree<T> {
        return this._synced;
    }

    public transform(operation: Operation): void {
        OperationUtil.transform(this._synced, operation);
    }
}