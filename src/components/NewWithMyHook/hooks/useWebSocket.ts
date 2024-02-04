import {useCallback, useEffect, useMemo, useRef, useState} from "react";

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

interface IWS {
    lastMessage: MessageEvent | undefined
    onConnect: Event
    reconnect: () => void
    sendMessage: (data: string) => void
    connect: () => void
    disconnect: (code?: number, reason?: string) => void
    readyState: React.MutableRefObject<number | undefined>
    Socket: WebSocket | null
}

/*
  * Provides a connection to WebSocket
  * @param {String} url The url of WebSocket
  * @param {IWSOptions} options Configuration of the websocket connection
  * @return {IWS} An object with methods and state of WebSocket
  * */
export default function useWebSocket(
    url: string,
    options: IWSOptions = {
        autoconnect: true,
        autoreconnect: true,
        autoreconnectTimeout: 2000,
    }
): IWS {
    const memoizedOptions = useMemo<IWSOptions>(() => (options), [])

    const [lastMessage, setLastMessage] = useState<MessageEvent>()
    const [onConnect, setOnConnect] = useState<Event>({} as Event)

    const readyState = useRef<WebSocket['readyState'] | undefined>(undefined)

    const WS = useRef<WebSocket | null>(null)

    const sendMessage = (data: string) => {
        WS.current?.send(data)
    }

    const connect = useCallback(() => {
        WS.current = new WebSocket(url, memoizedOptions?.protocols)

        WS.current.addEventListener(WSCONSTS.OPEN, (event: Event) => {
            setOnConnect(event)
        })

        readyState.current = WS.current.readyState

        WS.current.onclose = () => {
            if (memoizedOptions.autoreconnect) {
                setTimeout(() => {
                    connect()
                }, memoizedOptions.autoreconnectTimeout)
            }

        }

        WS.current.onmessage = (e: MessageEvent) => {
            setLastMessage(e)
        }

    }, [url, memoizedOptions])

    useEffect(() => {
        console.log('options: ', memoizedOptions)
        if (memoizedOptions.autoconnect) {
            connect()
        }

    }, [url, connect, memoizedOptions])

    const reconnect = () => {
        if (WS.current) {
            WS.current.onclose = () => {}
            WS.current?.close()
        }
        connect()
    }

    const disconnect = (code?: number, reason?: string) => {
        if (WS.current) {
            WS.current.onclose = () => {}
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