import {BehaviorSubject, Observable, Subject} from "rxjs";
import {SyncableOperation} from "./syncable-operation";

export class SyncableResource<T> {
    private _operations$: Subject<SyncableOperation<T>>;

    constructor(ws: WebSocket) {
        this._operations$ = new Subject();
        // ws.
    }

    public applyOperation(operation: SyncableOperation<T>) {
        this._operations$.next(operation);
    }
}