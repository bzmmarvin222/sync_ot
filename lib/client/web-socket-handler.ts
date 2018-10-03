import {Operation} from "..";
import {Observable, Subject} from "rxjs";

export class WebSocketHandler<T> {
    private _ws: WebSocket;
    private readonly _operations$: Subject<Operation>;

    constructor(webSocketUri: string) {
        this._operations$ = new Subject();
        this._ws = new WebSocket(webSocketUri);
        this._ws.onmessage = (ev: MessageEvent) => this.handleMessage(ev);
        this._ws.onclose = (ev: CloseEvent) => this.handleClose(ev);
    }

    get operations$(): Observable<Operation> {
        return this._operations$;
    }

    private handleMessage(event: MessageEvent): void {
        const operation: Operation = JSON.parse(event.data);
        this._operations$.next(operation);
    }

    private handleClose(event: CloseEvent): void {
        this._operations$.complete();
    }

    public queueOperation(operation: Operation): void {
        this._ws.send(JSON.stringify(operation));
    }
}