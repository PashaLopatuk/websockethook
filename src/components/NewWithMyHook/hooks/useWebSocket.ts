import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

const WSCONSTS = {
    OPEN: 'open',
    MESSAGE: 'message'
}


export enum ReadyState {
    UNINSTANTIATED = -1,
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}

interface IWSOptions {
    autoconnect?: boolean
    autoreconnect?: boolean
    autoreconnectTimeout?: number
    protocols?: string | string[]
}
const defaultOptions: IWSOptions = {
    autoconnect: true,
    autoreconnect: true,
    autoreconnectTimeout: 2000,
}

interface IWSHook {
    lastMessage: MessageEvent | undefined
    onConnect: Event
    reconnect: () => void
    sendMessage: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void
    connect: () => void
    disconnect: (code?: number, reason?: string) => void
    // readyState: React.MutableRefObject<number | undefined>
    readyState: number | undefined 
    Socket: WebSocket | null
}

const clientClosedConnectionCode = 1005;

/*
  * Provides a connection to WebSocket
  * @param {String} url The url of WebSocket
  * @param {IWSOptions} options Configuration of the websocket connection
  * @return {IWSHook} An object with methods and state of WebSocket
  * */
export default function useWebSocket(
    url: string,
    options?: IWSOptions,
): IWSHook {
    const memoizedOptions = useMemo<IWSOptions>(() => ({ ...defaultOptions, ...options }), [])

    const [lastMessage, setLastMessage] = useState<MessageEvent>()
    const [onConnect, setOnConnect] = useState<Event>({} as Event)

    const tm = useRef<NodeJS.Timeout>({} as NodeJS.Timeout)

    const WS = useRef<WebSocket | null>(null)

    // const readyState = useRef<WebSocket['readyState'] | undefined>(undefined)
    const readyState = useSyncExternalStore<WebSocket['readyState'] | undefined>(
        (callBack: () => void) => {

            console.log('useSyncExternalStore worked!')
            // read State function
            WS.current?.addEventListener('open', callBack)
            WS.current?.addEventListener('error', callBack)
            // WS.current?.addEventListener('message', callBack)
            WS.current?.addEventListener('close', callBack)
            return () => {
                WS.current?.removeEventListener('open', callBack)
                WS.current?.removeEventListener('error', callBack)
                // WS.current?.removeEventListener('message', callBack)
                WS.current?.removeEventListener('close', callBack)
            }
        },
        () => { 
            // snapshot function
            return WS.current?.readyState
        }
    )

    const sendMessage = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
        WS.current?.send(data)
    }

    function ping() {
        if (WS.current) {
            sendMessage('__ping__');
            tm.current = setTimeout(function () {

                /// ---connection closed ///
                connect()

            }, defaultOptions.autoreconnectTimeout);
        }
    }

    function pong() {
        clearTimeout(tm.current);
    }



    const connect = useCallback(() => {
        if (WS.current) {
            WS.current.close()
        }

        WS.current = new WebSocket(url, memoizedOptions?.protocols)

        WS.current.addEventListener(WSCONSTS.OPEN, (event: Event) => {
            setOnConnect(event)
            // setInterval(ping, 30000); // use this code if you want to ping connection to server every 30s
        })

        // readyState.current = WS.current.readyState

        WS.current.onclose = (ev: CloseEvent) => {
            console.log('Websocket closed! ', ev)

            if (memoizedOptions.autoreconnect) {
                if (ev.code !== clientClosedConnectionCode) {
                    ping()
                }
            }
        }

        WS.current.onmessage = (e: MessageEvent) => {
            setLastMessage(e)

            if (e.data) {
                pong();
                return;
            }
        }

        return (() => {
            disconnect()
            // console.log('useEffect return!')
        })

    }, [url, memoizedOptions])

    useEffect(() => {
        console.log('options: ', memoizedOptions)
        if (memoizedOptions.autoconnect) {
            connect()
        }
        return (() => {
            console.log('useEffect return!')
        })

    }, [url, connect, memoizedOptions])

    useEffect(() => {
        return () => {
            WS.current?.close()
        }
    }, [])

    const reconnect = () => {
        disconnect()
        connect()
    }

    const disconnect = (code?: number, reason?: string) => {
        if (WS.current) {
            WS.current.onclose = () => { }
            WS.current?.close(code, reason)
        }
    }

    return ({
        lastMessage,
        onConnect,
        reconnect,
        sendMessage,
        connect,
        disconnect,
        readyState,
        Socket: WS.current,
    })
}