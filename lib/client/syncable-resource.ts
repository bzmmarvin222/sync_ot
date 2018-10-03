import {WebSocketHandler} from "./web-socket-handler";
import {Operation} from "..";
import {OperationHandler} from "../operation/operation-handler";

export class SyncableResource<T extends object> {
    private _wsHandler: WebSocketHandler;
    private _opHandler: OperationHandler<T>;

    constructor(webSocketUri: string, resource: T) {
        this._opHandler = new OperationHandler(resource);
        this._wsHandler = new WebSocketHandler(webSocketUri);
        this._wsHandler.operations$.subscribe((operation: Operation) => {
            this._opHandler.transform(operation);
        });
    }

    public queueOperation(operation: Operation): void {
        this._wsHandler.queueOperation(operation);
    }
}