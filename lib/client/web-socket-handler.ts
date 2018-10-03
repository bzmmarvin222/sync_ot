export class WebSocketHandler {
    private _ws: WebSocket;

    constructor(webSocketUri: string) {
        this._ws = new WebSocket(webSocketUri);
        this._ws.onmessage = this.handleMessage;
    }

    private handleMessage(event: MessageEvent): void {
        console.log(event);
    }
}