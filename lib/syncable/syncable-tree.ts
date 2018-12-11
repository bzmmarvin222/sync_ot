import {Operation, OperationType} from "../operation/operation";
import {BehaviorSubject, Observable} from "rxjs";
import {Guid} from "guid-typescript/dist/guid";
import {ObjectPath, ObjectTraversingUtil} from "../operation/object-traversing-util";
import {map} from "rxjs/operators";

export const CHILD_KEY = 'children';
export const DATA_KEY = 'data';

interface SyncableTreeJson<T> {
    children: SyncableTreeJson<T>[],
    data?: T,
    nodeId: string
}

export class SyncableTree<T> {
    private readonly _parent?: SyncableTree<T>;
    private _children: SyncableTree<T>[] = [];
    private readonly _nodeId: Guid;
    private _data?: T;
    private readonly _dataChanges$: BehaviorSubject<T | undefined>;

    private constructor(data?: T, parent?: SyncableTree<T>, nodeId?: Guid) {
        this._data = data;
        this._nodeId = nodeId || Guid.create();
        this._parent = parent;
        this._dataChanges$ = new BehaviorSubject(data);
    }

    get dataChanges$(): BehaviorSubject<T | undefined> {
        return this._dataChanges$;
    }

    get data(): T | undefined {
        return this._data;
    }

    get nodeId(): Guid {
        return this._nodeId;
    }

    get children(): SyncableTree<T>[] {
        return this._children;
    }

    get parent(): SyncableTree<T> | undefined {
        return this._parent;
    }

    set data(value: T | undefined) {
        this._data = value;
    }

    /**
     * returns changes for the passed path inside the data object
     * will totally crash if the path does not exist
     * * @param dataObjectPath additional path information for the object held in data field
     */
    public getDataChangesFor$(...dataObjectPath: ObjectPath): Observable<any> {
        return this.dataChanges$.pipe(
            map(data => ObjectTraversingUtil.findValue(data as any, dataObjectPath))
        );
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

    public static fromParsedJson<R>(json: SyncableTreeJson<R>, parent?: SyncableTree<R>): SyncableTree<R> {
        const result = new SyncableTree<R>(json.data, parent, Guid.parse(json.nodeId));
        const children: SyncableTreeJson<R>[] = json.children || [];
        result._children = children.map(child => SyncableTree.fromParsedJson(child, result));
        return result;
    }

    /**
     * adds a child and marks its parent as this
     * @param data the initial data of the child
     */
    public addChild(data?: T): SyncableTree<T> {
        const child: SyncableTree<T> = new SyncableTree<T>(data, this);
        this._children.push(child);
        return child;
    }

    /**
     * calculates the indices on the child nodes to traverse to get from the root to the current node and inserts the children key before each
     */
    public getPathFromRoot(): ObjectPath {
        return this.getPathToRoot().reverse();
    }

    /**
     * calculates the path to the root by indices and keys
     */
    private getPathToRoot(): ObjectPath {
        let result: ObjectPath = [];
        let parent: SyncableTree<T> | undefined = this._parent;
        if (parent) {
            result.push(parent._children.indexOf(this));
            result.push(CHILD_KEY);
            result = result.concat(parent.getPathToRoot());
        }
        return result;
    }

    /**
     * calculates the indices on the child nodes to traverse to get from the root to the current node and appends the data accessor key
     * @param dataObjectPath additional path information for the object held in data field
     */
    public getDataPathFromRoot(...dataObjectPath: ObjectPath): ObjectPath {
        const pathFromRoot = this.getPathFromRoot();
        return pathFromRoot.concat([DATA_KEY]).concat(dataObjectPath);
    }

    /**
     * determinates if the current node has a parent and therefore must be the root
     */
    public isRoot(): boolean {
        return !!this._parent;
    }

    /**
     * creates an insertion operation for the current node
     * @param index the index to insert after
     * @param insertion the string to insert
     * @param dataObjectPath additional path information for the object held in data field
     */
    public createInsertion(index: number, insertion: string, ...dataObjectPath: ObjectPath): Operation {
        return {
            type: OperationType.INSERT,
            range: {start: index, end: -1},
            data: insertion,
            objectPath: this.getDataPathFromRoot(...dataObjectPath),
            nodeId: this.nodeId.toString()
        };
    }

    /**
     * creates a deletion for the current node to delete it from the tree, including its full subtree
     */
    public createNodeDeletion(): Operation {
        return {
            type: OperationType.DELETE,
            objectPath: this.getPathFromRoot(),
            nodeId: this.nodeId.toString()
        }
    }

    /**
     * creates a deletion for the data of the current node
     */
    public createNodeDataDeletion(): Operation {
        return {
            type: OperationType.DELETE,
            objectPath: this.getDataPathFromRoot(),
            nodeId: this.nodeId.toString()
        }
    }

    /**
     * creates a full replacement of the data the node holds or any of the data's sub objects
     * @param data the data to replace with
     * @param dataObjectPath additional path information for the object held in data field
     */
    public createReplacement(data: T, ...dataObjectPath: ObjectPath): Operation {
        return {
            type: OperationType.FULL_REPLACEMENT,
            objectPath: this.getDataPathFromRoot(...dataObjectPath),
            data: data,
            nodeId: this.nodeId.toString()
        }
    }

    /**
     * creates a child append
     * @param data the initial data of the child
     */
    public createChildAppend(data: T): Operation {
        return {
            type: OperationType.CHILD_APPEND,
            objectPath: this.getPathFromRoot(),
            data: data,
            nodeId: this.nodeId.toString()
        };
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
        const childrenNonRecursive = this._children.map(child => child.toNonRecursive());
        return {
            nodeId: this._nodeId.toString(),
            data: this._data,
            children: childrenNonRecursive
        };
    }

    /**
     * emits the current state of the data
     */
    public emitUpdates(): void {
        this._dataChanges$.next(this._data);
    }

    /**
     * searches the node to a generated object path
     * @param path
     */
    public findNode(path: ObjectPath): SyncableTree<T> {
        const dataEntry = path.findIndex(value => value === DATA_KEY);
        if (dataEntry > -1) {
            path = path.slice(0, dataEntry);
        }
        if (path.length < 1) {
            return this;
        }
        return ObjectTraversingUtil.findValue(this, path) as SyncableTree<T>;
    }
}