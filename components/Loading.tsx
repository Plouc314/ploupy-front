// types
import { FC } from "../types"

// mui
import {
  CircularProgress,
  Typography,
  Container,
  Grid,
  Backdrop,
} from "@mui/material"

export interface LoadingProps {
  hidden?: boolean
  label: string
}

const Loading: FC<LoadingProps> = (props) => {

  return (
    <Container>
      <Backdrop
        open={!props.hidden}
        sx={{
          zIndex: 'zIndex.drawer + 1',
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      >

        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress
            color="secondary"
            sx={{ margin: 2 }}
          />
          <Typography variant="h5">
            {props.label}
          </Typography>
        </Grid>
      </Backdrop>
    </Container>
  )
}

export default Loading