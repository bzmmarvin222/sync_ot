import {Observable} from "rxjs";
import {Operation} from "../operation/operation";

export interface SyncableHandler {
    operations$: Observable<Operation>;
    queueOperation(operation: Operation): void;
}