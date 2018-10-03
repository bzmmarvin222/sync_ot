import {Subject} from "rxjs";
import {SyncableOperation} from "../operation/syncable-operation";

export class SyncableResource<T> {
    private _operations$: Subject<SyncableOperation<T>>;

    constructor(webSocketUri: string) {
        this._operations$ = new Subject();
        // ws.
    }

    public applyOperation(operation: SyncableOperation<T>) {
        this._operations$.next(operation);
    }
}