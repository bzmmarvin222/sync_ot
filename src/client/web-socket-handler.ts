import {SyncableHandler} from "../syncable/syncable-handler";
import {Operation} from "../operation/operation";
import {Observable, Subject} from "rxjs";
import Socket from 'socket.io-client';

export class WebSocketHandler implements SyncableHandler {
    private _socket;
    private readonly _operations$: Subject<Operation>;

    constructor(webSocketUri: string, sessionId: string, headers: {[k: string]: string} = {}) {
        this._operations$ = new Subject();
        this._socket = Socket(webSocketUri, {
            query: {
                sessionId
            },
            transportOptions: {
                polling: {
                    extraHeaders: headers
                }
            }});
        this._socket.on('init', (init) => this._operations$.next(init));
        this._socket.on('message', (ev) => this.handleMessage(ev));
        this._socket.on('close', (ev: CloseEvent) => this.handleClose(ev));
    }

    get operations$(): Observable<Operation> {
        return this._operations$;
    }

    /**
     * sends the operation to the server to broadcast to all users
     * @param operation to broadcast
     */
    public queueOperation(operation: Operation): void {
        this._socket.send(JSON.stringify(operation));
    }

    private handleMessage(event): void {
        const operation: Operation = JSON.parse(event);
        this._operations$.next(operation);
    }

    private handleClose(event: CloseEvent): void {
        this._operations$.complete();
    }
}
