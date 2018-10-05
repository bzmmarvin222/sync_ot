import {Operation, SyncableHandler} from "..";
import {Observable, Subject} from "rxjs";

export class ServerHandler implements SyncableHandler {
    private readonly _operations$: Subject<Operation>;

    constructor() {
        this._operations$ = new Subject();
    }

    /**
     * instantly performs the operation on the server
     * @param operation
     */
    queueOperation(operation: Operation): void {
        this._operations$.next(operation);
    }

    get operations$(): Observable<Operation> {
        return this._operations$;
    }


}