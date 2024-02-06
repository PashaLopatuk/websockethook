import { Box, Button, Chip, Select, Stack, Typography, Option as SelectOption } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import useWebSocket from '../NewWithMyHook/hooks/useWebSocket'
import CustomTable, { ISchema } from '../CustomTable/CustomTable'
import useNetworkState from '../../hooks/useNetworkState'
import useMyNetworkState from '../../hooks/useMyNetworkState'

// const BASEURL = 'ws://192.168.1.49:8000/ws'
const BASEURL = 'wss://free.blr2.piesocket.com/v3/1?api_key=y6geV6iaULTRxAPkpQ8G0M314bwQLmYmrE5AkZXy&notify_self=1'

const Strawberry = () => {
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

  const [selectedFilters, setSelectedFilters] = useState<any[]>([])
  const [response, setresponse] = useState<any[]>([])

  useEffect(() => {
    if (lastMessage && lastMessage.data) {

      setresponse((data) => (
        [
          JSON.parse(JSON.parse(lastMessage.data),),
          ...data.slice(0, 500),
        ]
      ))
      // console.log(JSON.parse(lastMessage.data))
    }
  }, [lastMessage])

  console.log(response)

  // const { online } = useNetworkState()
  const online = useMyNetworkState()


  return (
    <Box>
      <Stack
        direction='row'
        spacing={'1rem'}
        alignItems={'center'}
        sx={{
          padding: '0.5rem'
        }}
      >
        <Select
          multiple
          onChange={(e, newV) => {
            sendMessage(JSON.stringify({
              filters: {
                'assigment': newV
              }
            }))
          }}>
          <SelectOption value={'загальнобудинковий'}>Загальнобудинкові</SelectOption>
          <SelectOption value={'поквартирний'}>поквартирний</SelectOption>
          <SelectOption value={'юр.особа'}>юр.особа</SelectOption>
          <SelectOption value={null}>null</SelectOption>
        </Select>
        <Button
          // disabled={readyState === 1 }
          onClick={() => {
            reconnect()
          }}>Reconnect</Button>
        <Button
          disabled={readyState === 1}
          onClick={() => {
            connect()
          }}>Connect</Button>
        <Button
          disabled={readyState !== 1}
          onClick={() => {
            disconnect()
          }}>Disconnect</Button>
        <Button
          disabled={readyState !== 1}

          onClick={() => {
            sendMessage('')
          }}>
          Send
        </Button>
        <Typography
        >readyState: {JSON.stringify(readyState)}</Typography>
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
      <CustomTable
        title={''}
        data={response}
        columns={
          response.length ?
            {
              ...Object.keys(response[0])
                .map(Key => ({ [Key]: { dataField: Key } }))
                .reduce((Keys: ISchema, key: ISchema) => (
                  {
                    ...Keys,
                    ...key,
                  }
                ))
            }
            :
            {}
        }
      />
    </Box>
  )
}

export default Strawberry