export interface SyncableOperation<T> {
    transform(t: T): T;
}