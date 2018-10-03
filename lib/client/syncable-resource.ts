import {Subject} from "rxjs";
import {SyncableOperation} from "../operation/syncable-operation";
import {WebSocketHandler} from "./web-socket-handler";

export class SyncableResource<T> {
    private _operations$: Subject<SyncableOperation>;
    private _wsHandler: WebSocketHandler;

    constructor(webSocketUri: string) {
        this._operations$ = new Subject();
        this._wsHandler = new WebSocketHandler(webSocketUri);
    }

    public applyOperation(operation: SyncableOperation) {
        this._operations$.next(operation);
    }
}