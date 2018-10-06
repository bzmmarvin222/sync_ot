import {OperationUtil} from "./operations/operation-util";
import {Operation, OperationType} from "./operation";
import {SyncableTree} from "..";
import {combineLatest, Observable, ReplaySubject} from "rxjs";
import {filter, take} from "rxjs/operators";

export class OperationHandler<T> {
    private readonly _synced: ReplaySubject<SyncableTree<T>> = new ReplaySubject(1);

    constructor(operations$: Observable<Operation>, synced?: T) {
        if (synced) {
            this.listen(operations$);
            this._synced.next(SyncableTree.root(synced));
        } else {
            operations$.pipe(
                filter(op => op.type === OperationType.INIT),
                take(1)
            ).subscribe(init => {
                this.listen(operations$);
                this._synced.next(SyncableTree.fromParsedJson(init.data));
            });
        }
    }

    get synced(): Observable<SyncableTree<T>> {
        return this._synced;
    }

    private listen(operations$: Observable<Operation>): void {
        combineLatest(this._synced, operations$)
            .subscribe(([tree, operation]: [SyncableTree<T>, Operation]) => OperationUtil.transform(tree, operation));
    }
}