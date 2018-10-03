import {Operation, SyncableHandler} from "..";
import {Observable, Subject} from "rxjs";

export class ServerHandler implements SyncableHandler {
    private readonly _operations$: Subject<Operation>;

    constructor() {
        this._operations$ = new Subject();
    }

    queueOperation(operation: Operation): void {
        this._operations$.next(operation);
    }

    get operations$(): Observable<Operation> {
        return this._operations$;
    }


}