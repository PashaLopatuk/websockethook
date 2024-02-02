

// const STATE = {
//   CONNECTING: 0,
//   OPEN: 1,
//   CLOSING: 2,
//   CLOSED: 3,
// };

export default class WebSocketPromise {
  private url: string;
  private options: object | undefined;
  private ws: WebSocket | null = null

  constructor(url: string, options?: object) {
    this.url = url
    this.options = options
    
  }

  Open() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url)
      this.ws.onopen = (e) => {
        resolve(e)
      }
    })
  }

  Send(Data: string) {
    if ( this.ws )
      this.ws?.send(Data)
  }

  get isOpening() {
    return Boolean(this.ws && this.ws.readyState === 0);
  }
}