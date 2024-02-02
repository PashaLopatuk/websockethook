import { useCallback, useEffect, useRef, useState } from "react";

const WSCONSTS = {
  OPEN: 'open',
  MESSAGE: 'message'
}

interface IWSOptions {
  autoconnect?: boolean
  protocols?: string | string[]
}

export default function useWebSocket(url: string, options?: IWSOptions) {
  const [lastMessage, setLastMessage] = useState<MessageEvent>()
  const [OnConnect, setOnConnect] = useState<any>({})

  const [readyState, setReadyState] = useState<WebSocket['readyState']>()

  const WS = useRef<WebSocket | null>(null)

  const sendMessage = (data: string) => {
    WS.current?.send(data)
  }

  const Connect = useCallback(() => {
    WS.current = new WebSocket(url, options?.protocols)
    
    WS.current.addEventListener(WSCONSTS.OPEN, (event: any) => {
      setOnConnect(event)
    })

    setReadyState(WS.current.readyState)

    WS.current.onclose = () => {
      setTimeout(() => {
        Connect()
      }, 2000)
    }

    WS.current.onmessage = (e: MessageEvent) => {
      setLastMessage(e)
    }

  }, [])

  useEffect(() => {
    Connect()
  }, [])

  const Reconnect = () => {
    Connect()
  }

  return ({
    lastMessage, OnConnect, Reconnect, sendMessage, readyState, Connect
  })
}