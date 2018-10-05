import {Operation, OperationType} from "..";

export const CHILD_KEY = 'children';
export const DATA_KEY = 'data';

interface SyncableTreeJson<T> {
    children: SyncableTreeJson<T>[],
    data?: T
}

export class SyncableTree<T> {
    parent?: SyncableTree<T>;
    children: SyncableTree<T>[] = [];
    data?: T;

    private constructor(data?: T, parent?: SyncableTree<T>) {
        this.data = data;
        this.parent = parent;
    }

    /**
     * creates an empty node for usage as the root of a tree
     * @param data the optional initial data to use, may be overridden on client on connection
     */
    public static root<R>(data?: R): SyncableTree<R> {
        return new SyncableTree<R>(data);
    }

    /**
     * recreates a fully instantiated tree from its non recursive json string representation
     * @param json the json to parse
     */
    public static fromJson<R>(json: string): SyncableTree<R> {
        return SyncableTree.fromParsedJson(JSON.parse(json));
    }

    public static fromParsedJson<R>(json: SyncableTreeJson<R>): SyncableTree<R> {
        const result = new SyncableTree<R>();
        result.data = json.data;
        const children: SyncableTreeJson<R>[] = json.children || [];
        result.children = children.map(child => SyncableTree.fromParsedJson(child));
        return result;
    }

    /**
     * adds a child and marks its parent as this
     * @param data the initial data of the child
     */
    public addChild(data?: T): SyncableTree<T> {
        const child: SyncableTree<T> = new SyncableTree<T>(data, this);
        this.children.push(child);
        return child;
    }

    /**
     * calculates the indices on the child nodes to traverse to get from the root to the current node and inserts the children key before each
     */
    public getPathFromRoot(): (number | string)[] {
        const result: (number | string)[] = [];
        let parent: SyncableTree<T> | undefined = this.parent;
        while (parent) {
            result.push(parent.children.indexOf(this));
            result.push(CHILD_KEY);
            parent = parent.parent;
        }
        return result.reverse();
    }

    /**
     * calculates the indices on the child nodes to traverse to get from the root to the current node and appends the data accessor key
     */
    public getDataPathFromRoot(): (number | string)[] {
        const pathFromRoot = this.getPathFromRoot() as (number | string)[];
        return pathFromRoot.concat([DATA_KEY]);
    }

    /**
     * determinates if the current node has a parent and therefore must be the root
     */
    public isRoot(): boolean {
        return !!this.parent;
    }

    /**
     * creates an insertion operation for the current node
     * @param index the index to insert after
     * @param insertion the string to insert
     */
    public createInsertion(index: number, insertion: string): Operation {
        return {
            type: OperationType.INSERT,
            range: {start: index, end: -1},
            data: insertion,
            objectPath: this.getDataPathFromRoot()
        };
    }

    public createNodeDeletion(): Operation {
        return {
            type: OperationType.DELETE,
            objectPath: this.getPathFromRoot()
        }
    }

    public createNodeDataDeletion(): Operation {
        return {
            type: OperationType.DELETE,
            objectPath: this.getDataPathFromRoot()
        }
    }

    public createReplacement(data: T): Operation {
        return {
            type: OperationType.FULL_REPLACEMENT,
            objectPath: this.getDataPathFromRoot(),
            data: data
        }
    }

    /**
     * creates a non circular structure of the subtree with this node as the root
     */
    public toJson(): string {
        return JSON.stringify(this.toNonRecursive());
    }

    /**
     * removes the parents from all children to remove recursion for JSON.stringify()
     * works not in place
     */
    public toNonRecursive(): SyncableTreeJson<T> {
        const childrenNonRecursive = this.children.map(child => child.toNonRecursive());
        return {
            data: this.data,
            children: childrenNonRecursive
        };
    }
}