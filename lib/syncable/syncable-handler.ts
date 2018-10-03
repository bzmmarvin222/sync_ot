import {Observable} from "rxjs";
import {Operation} from "..";

export interface SyncableHandler {
    operations$: Observable<Operation>;
    queueOperation(operation: Operation): void;
}