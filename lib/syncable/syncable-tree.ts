export class SyncableTree<T> {
    parent?: SyncableTree<T>;
    children: SyncableTree<T>[] = [];
    data?: T;

    private constructor(data?: T, parent?: SyncableTree<T>) {
        this.data = data;
        this.parent = parent;
    }

    public static root<R>(data?: R): SyncableTree<R> {
        return new SyncableTree<R>(data);
    }

    public addChild(data?: T): SyncableTree<T> {
        const child: SyncableTree<T> = new SyncableTree<T>(data, this);
        this.children.push(child);
        return child;
    }

    public getPathFromRoot(): number[] {
        const result: number[] = [];
        let parent: SyncableTree<T> | undefined = this.parent;
        while (parent) {
            result.push(parent.children.indexOf(this));
            parent = parent.parent;
        }
        return result.reverse();
    }

    public isRoot(): boolean {
        return !!this.parent;
    }
}