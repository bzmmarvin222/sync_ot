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

    //TODO: this should not ignore the state of operations
    /**
     * returns the current state of data
     */
    get operations$(): Observable<Operation> {
        return this._operations$;
    }


}