import {Operation} from "./operation";

export interface SyncableOperation {
    transform(operation: Operation): void;
}