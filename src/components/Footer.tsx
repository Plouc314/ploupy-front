// react
import { useState } from 'react';

// types
import { FC, ICore } from '../../types'

// mui
import {
  Container,
  Grid,
  Button,
  Stack,
  Tooltip,
  Typography,
  IconButton
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

// comm
import { VERSION } from '../comm/config';
import Link from 'next/link';


export interface FooterProps { }

const Footer: FC<FooterProps> = (props) => {

  const [copyMsg, setCopyMsg] = useState("")

  const email = "alexandre.goumaz@plouc314.ch"

  const onClickEmail = () => {
    navigator.clipboard.writeText(email)
      .then(() => setCopyMsg("Copied."))
  }

  return (

    <Container
      maxWidth="xl"
      sx={{
        position: "absolute",
        bottom: 0,
        pb: 1,
        pt: 1,
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: "text.disabled"
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {"V" + VERSION}
          </Typography>

        </Grid>
        <Grid item >
          <a href='https://github.com/Plouc314' style={{ color: "inherit" }}>
            <Tooltip arrow title="Github">
              <GitHubIcon fontSize="large" />
            </Tooltip>
          </a>
        </Grid>
        <Grid item >
          <Stack direction="row" alignItems="center">
            <Tooltip
              arrow
              title={copyMsg}
              onOpen={() => setCopyMsg("Click to copy")}
            >
              <IconButton onClick={onClickEmail} sx={{ color: "inherit" }}>
                <EmailIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Stack>
        </Grid>

        <Grid item>
          <Link href="/credits">
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Credits
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Container>

  )
}

export default Footer
