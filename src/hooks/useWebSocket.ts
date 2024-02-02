import { useEffect, useRef, useState, useCallback } from "react";
import { Socket, io } from "socket.io-client";


const BASEURL = 'wss://free.blr2.piesocket.com/v3/1?api_key=y6geV6iaULTRxAPkpQ8G0M314bwQLmYmrE5AkZXy&notify_self=1';
// const BASEURL = 'ws://192.168.1.49:8000'

export default function useWebSocket() {
  const socketRef = useRef<Socket<any>>({} as Socket<any>);

  const [response, setResponse] = useState<any[]>([])

  const writeResponse = useCallback((res: any) => {
    setResponse((data) => ([...data, res]))
  }, [setResponse])

  useEffect(() => {
    socketRef.current = io(BASEURL, { 
      autoConnect: false,  
      reconnection: false,
      addTrailingSlash: false,
      path: undefined

    })

    socketRef.current.connect()

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected!')
    })

    socketRef.current.on('data', (data: any) => {
      console.log('Websocket data: ', data)

    })

    socketRef.current.io.on('open', () => {
      console.log('WebSocket connected!')
    })

  }, [])


  return { response }
}