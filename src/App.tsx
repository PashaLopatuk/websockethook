import React, { useState } from 'react'
import './App.css'
import { Box, Button, Checkbox, Stack, Typography } from '@mui/joy'
// import Apple from './components/WorkingWithBadHook/Apple'
// import Orange from './components/NewWithMyHook/Orange'
import Strawberry from './components/Strawberry/Strawberry'


const App = () => {
  const [mountOrange, setMountOrange] = useState(true)
  return (
    <Box>
      <Stack direction={'row'} spacing='0.5rem'>
        <Typography>Mount websocket: </Typography>
        <Checkbox
          checked={mountOrange}
          onChange={() => { setMountOrange(data => !data) }}
        />
      </Stack>
      {/* <Apple /> */}
      {
        mountOrange ?
          // <Orange />
          <Strawberry />
          :
          <></>
      }


    </Box>
  )
}

export default App