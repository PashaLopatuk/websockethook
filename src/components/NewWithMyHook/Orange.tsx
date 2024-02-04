import { useEffect, useState,  } from 'react';

// import useWebSocket from './hooks/useWebSocket';
import useNetworkState from '../../hooks/useNetworkState';

import { Box, Button, Chip, Input, List, ListItem, Sheet, Stack, Typography } from '@mui/joy';

import useWebSocket from './hooks/useWebSocket';

// const BASEURL = 'ws://192.168.1.49:8000/ws'
const BASEURL = 'wss://echo.websocket.orgx';

function Orange() {
  // const [, render] = useReducer( p => !p, false)
  const [response, setResponse] = useState<MessageEvent[]>([])

    const {
      lastMessage,
      reconnect,
      sendMessage,
      connect,
        disconnect,
        readyState,
  } = useWebSocket(BASEURL, {
      // autoconnect: false
    })

  const [InputText, setInputText] = useState('')
  // const InputRef = useRef<HTMLInputElement | null>(null)

  const { online } = useNetworkState()

  useEffect(() => {
      if (lastMessage) {
          setResponse(data => [...data, lastMessage])
      }
  }, [lastMessage])

  // console.log({ lastMessage, OnConnect })

  const handleSend = () => {
    // if (InputRef.current) {
    //   // console.log(InputRef.current.value)
    //   sendMessage(InputRef.current.value)
    //   InputRef.current.value = ''
    //   render()
    //   // setInputText('')
    // }
    sendMessage(InputText)
    setInputText('')
  }

  // console.log({ ref: InputRef.current.value})

  return (
    <>
      <Stack
        direction='row'
        spacing={'1rem'}
        alignItems={'center'}
        sx={{
          padding: '0.5rem'
        }}
      >
        <Button onClick={() => {
            reconnect()
        }}>Reconnect</Button>
          <Button onClick={() => {
              connect()
          }}>Connect</Button>
          <Button onClick={() => {
              disconnect()
          }}>Disconnect</Button>
        {/* <Typography >Connection status: <Chip color={
          WSState.connected === 0 ?
            'success'
            :
            'neutral'
        }
        >{
            readyState === 0 ?
              'Online'
              :
              'Offline'
          }</Chip>
        </Typography> */}
          <Typography
              ref={readyState}
          >State: {JSON.stringify(readyState.current)}</Typography>
        <Box sx={{ display: 'flex' }}>
            <Typography>Network status:</Typography>
            <Chip color={
          online ?
            'success'
            :
            'danger'
        }
        >{online ? "Online" : "Offline"}</Chip>
        </Box>
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
              response.map((message: MessageEvent) => (
                <Stack
                  direction={'row'}
                  spacing='0.5rem'
                  key={message.timeStamp}
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
          <Input
            // ref={InputRef}
            type="text"
            value={InputText}
            onChange={(e) => {setInputText(e.target.value)}}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            //   if (InputRef.current) {
            //     InputRef.current.value = e.target.value
            //   }
            // }}
            // value={InputRef.current ? InputRef.current.value : ''}
          />
          <Button onClick={handleSend}>Send!</Button>
        </Stack>
      </Sheet>
    </>
  )
}

export default Orange
