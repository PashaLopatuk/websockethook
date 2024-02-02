import { useEffect, useState } from 'react';

// import useWebSocket from './hooks/useWebSocket';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import useNetworkState from '../../hooks/useNetworkState';
import { Box, Button, Chip, Input as InputBar, List, ListItem, Sheet, Stack, Typography } from '@mui/joy';
// import WebSocketPromise from './hooks/webSocketPromise/websocket';

const BASEURL = 'ws://192.168.1.49:8000/ws'

// const WebSocketClient = require('websocket').client

// const BASEURL = 'wss://free.blr2.piesocket.com/v3/1?api_key=y6geV6iaULTRxAPkpQ8G0M314bwQLmYmrE5AkZXy&notify_self=1';
// const WS = new WebSocket(BASEURL)

// const socket = io(BASEURL, {
//   reconnection: false,
//   rejectUnauthorized: true,
//   auth: {'': ''},
//   secure: false,
//   withCredentials: false,
//   // autoConnect: false,
// })

function Apple() {
  const [ServerResponse, setServerResponse] = useState<Array<string | any | object>>([])
  const [Input, setInput] = useState('')

  useEffect(() => {

    // const client = new WebSocketClient();

    // client.on('connectFailed', function (error: any) {
    //   console.log('Connect Error: ' + error.toString());
    // });

    // client.connect(BASEURL)
    // client.on('text', (e: any) => {
    //   console.log(e)
    // })


  }, [])

  const [BaseUrl, setBaseUrl] = useState(BASEURL);
  // const [ WS, setWS] = useState<any>()

  // const { response } = useWebSocket()

  const { lastMessage, readyState, sendMessage, lastJsonMessage, getWebSocket } = useWebSocket(BASEURL)

  useEffect(() => {
    console.log('getWebSocket: ', getWebSocket())
  }, [])

  useEffect(() => {
    if (lastMessage?.data) {
      // console.log(new Date(lastMessage?.timeStamp).toString())
      console.log(lastMessage?.timeStamp)
      setServerResponse(data => ([...data, lastMessage]))


    }
  }, [lastMessage])

  useEffect(() => {
    console.log(lastJsonMessage)
  }, [lastJsonMessage])

  const { online } = useNetworkState()




  // useEffect(() => {
  //   // setWS(new WebSocket('ws://192.168.1.49:8000'))

  //   WS.onopen = () => {
  //     console.log('Websocket opened!')
  //   }
  //   WS.onmessage = (e) => {
  //     setServerResponse(data => ([...data, e.data]))
  //     // console.log(e.data)
  //   }

  // }, [])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const handleSend = () => {
    console.log('Send!', Input)
    sendMessage(Input)
    setInput('')
  }

  // // console.log({Input, ServerResponse})

  const Reconnect = () => {
    
  }

  return (
    <>
      <Stack direction='row' spacing={'1rem'} sx={{ padding: '0.5rem' }}>

        <Typography >Connection status: <Chip color={
          connectionStatus === 'Open' ?
            'success'
            :
            'neutral'
        }
        >{connectionStatus}</Chip>
        </Typography>
        <Button onClick={Reconnect}>Reconnect</Button>
        <Typography >Network status: <Chip color={
          online ?
            'success'
            :
            'danger'
        }
        >{online ? "Online" : "Offline"}</Chip>
        </Typography>
      </Stack>
      <Sheet variant='outlined'
        sx={{
          borderRadius: '8px',
          padding: '8px',
          flex: '1 0 auto',
          height: '100%',
        }}>

        <Box>
          <List
            sx={{
              flex: '1 0 auto',
              height: '100%',
            }}
          >
            {
              ServerResponse.map((message: any) => (
                <Stack
                  direction={'row'}
                  spacing='0.5rem'
                  key={message}
                >
                  <Button
                    variant='soft'
                    disabled
                  >{message.timeStamp}
                  </Button>
                  <ListItem

                  >
                    {message.data}
                  </ListItem>
                </Stack>
              ))
            }
          </List>
        </Box>
        <Stack direction={'row'} spacing={'0.5rem'}>
          <InputBar
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={Input}
          />
          <Button onClick={handleSend}>Send!</Button>
        </Stack>
      </Sheet>
    </>
  )
}

export default Apple
