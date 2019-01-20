import {OperationUtil} from "./operations/operation-util";
import {Operation, OperationType} from "./operation";
import {SyncableTree} from "../syncable/syncable-tree";
import {combineLatest, Observable, ReplaySubject, Subscription} from "rxjs";
import {filter, take} from "rxjs/operators";

export class OperationHandler<T> {
    private readonly _synced: ReplaySubject<SyncableTree<T>> = new ReplaySubject(1);
    private _tree!: SyncableTree<T>;
    private _operationSub!: Subscription;

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
                this._tree = SyncableTree.fromParsedJson((<Operation>init).data);
                this._synced.next(this._tree);
            });
        }
    }

    get synced(): Observable<SyncableTree<T>> {
        return this._synced;
    }

    get tree(): SyncableTree<T> {
        return this._tree;
    }

    private listen(operations$: Observable<Operation>): void {
        this._operationSub = combineLatest(this._synced, operations$)
            .subscribe(([tree, operation]: [SyncableTree<T>, Operation]) => {
                if (operation.type === OperationType.CLOSE) {
                    this.close();
                } else {
                    OperationUtil.transform(tree, operation)
                }
            });
    }

    public close(): void {
        this._operationSub.unsubscribe();
    }
}
