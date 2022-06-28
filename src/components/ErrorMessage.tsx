// types
import { FC } from '../../types'

// mui
import {
  Box,
  Divider,
  Stack,
  Typography
} from '@mui/material'


export interface ErrorMessageProps {
  label: string
}

const ErrorMessage: FC<ErrorMessageProps> = (props) => {

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="95vh"
    >
      <Stack direction="row" >
        <Typography
          variant="h3"
          color="error.dark"
          letterSpacing="0.05em"
          sx={{ p: 1 }}
        >
          Error
        </Typography>
        <Divider
          flexItem
          orientation='vertical'
          sx={{ mr: 1, ml: 1, borderColor: "rgba(0,0,0,0.4)" }}
        />
        <Typography variant="h6" sx={{ p: 1 }}>
          {props.label}
        </Typography>
      </Stack>
    </Box>
  )
}

export default ErrorMessage