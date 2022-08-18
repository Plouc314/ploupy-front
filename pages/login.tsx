// next
import { useRouter } from 'next/router'

// react
import { useState } from 'react'

// types
import { FC } from '../types'

// mui
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';

// firebase
import {
  setPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'

// utils
import { auth, SessionPersistence, LocalPersistence, getErrorMessage, providerGoogle } from '../src/utils/Firebase'

// hooks
import useSingleEffect from '../src/hooks/useSingleEffect'
import { useSnackbar } from 'notistack'

// comm
import API from '../src/comm/api'

// pixi
import { AVATARS } from '../src/pixi/constants'
import Textures from '../src/pixi/textures'
import useSio from '../src/comm/sio'

const theme = createTheme()

const getRandomAvatar = () => {
  const idx = Math.floor(Math.random() * AVATARS.length)
  return AVATARS[idx]
}

export interface PageLoginProps { }

const PageLogin: FC<PageLoginProps> = (props) => {

  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [state, setState] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [displayAvatar, setDisplayAvatar] = useState(getRandomAvatar())

  const reset = () => {
    setEmail("")
    setUsername("")
    setPassword("")
    setRemember(false)
    setErrorMessage('')
  }

  /**
   * Called after successful sign up / sign in
   */
  const afterLoggedIn = () => {
    reset()
    router.push("/")
  }

  const submit = async () => {
    if (state === "signin") {
      signInWithEmailAndPassword(auth, email, password)
        .then((response) => {
          afterLoggedIn()
        })
        .catch((error: any) => {
          setErrorMessage(getErrorMessage(error))
        })
    } else {
      // first assert for username unicity
      const data = await API.getUserData({ username: username })
      if (data) {
        setErrorMessage(`Username ${username} is already taken.`)
        return
      }
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (response) => {
          const user = {
            uid: response.user.uid,
            username: username,
            email: email,
            avatar: getRandomAvatar(),
            is_bot: false,
            owner: null,
            bots: [],
            joined_on: new Date().toISOString(),
          }
          await API.createUser(user)

          afterLoggedIn()
        })
        .catch((error: any) => {
          setErrorMessage(getErrorMessage(error))
        })
    }
  }

  const signInGoogle = () => {
    signInWithPopup(auth, providerGoogle)
      .then(async (result) => {
        if (!result.user.email) {
          enqueueSnackbar("No email provided.", { variant: "error" })
          return
        }

        const username = result.user.displayName ?? result.user.email?.split("@")[0]

        // check if user already exists
        const data = await API.getUserData({ username: username })
        if (data) {
          if (data.email != result.user.email) {
            enqueueSnackbar(`Username ${username} is already taken.`, { variant: "error" })
            enqueueSnackbar("Please contact site administrator", { variant: "error" })
            return
          }
        } else {
          // user don't exists -> create it first
          const user = {
            uid: result.user.uid,
            username: username,
            email: result.user.email as string,
            avatar: getRandomAvatar(),
            is_bot: false,
            owner: null,
            bots: [],
            joined_on: new Date().toISOString(),
          }
          await API.createUser(user)
        }

        afterLoggedIn()

      }).catch((error) => {
        enqueueSnackbar(`${error.message} (${error.code})`, { variant: "error" })
      })
  }


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            src={Textures.getAvatarURL(displayAvatar)}
            sx={{ m: 1, bgcolor: 'secondary.main' }}
          />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            {state === 'signup' &&
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => { setUsername(e.target.value) }}
              />
            }
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
            <FormControlLabel
              control={<Checkbox
                value="remember"
                color="primary"
                id="checkRemember"
                onChange={(e) => {
                  // select the persitence type (session | local)
                  setPersistence(auth, remember ? SessionPersistence : LocalPersistence)
                  setRemember(!remember)
                }}
              />}
              label="Remember me"
              value={remember}
              sx={{ mb: 1 }}
            />
            <Typography
              variant="body2"
              sx={{
                "color": "error.main"
              }}
              align="center"
            >
              {errorMessage}
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 1, mb: 1 }}
              onClick={signInGoogle}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 2 }}
              onClick={submit}
            >
              {state === "signin" ? "Sign In" : "Sign Up"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => { enqueueSnackbar("Too bad for you !", { variant: "info" }) }}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => {
                    console.log(remember)
                    setState(state === "signup" ? "signin" : "signup")
                  }}
                >
                  {state === "signin" && "Don't have an account? Sign Up"}
                  {state === "signup" && "Have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default PageLogin