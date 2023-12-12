import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'

export const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {},
      '& + .MuiSwitch-track': {
        /* border: '2px solid #0974F1', */
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#5eead4'
      }
    }
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#213d59',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#f3f7fc',
    borderRadius: 20 / 2
  }
}))
