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

// firebase
import {
  setPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'

// utils
import { auth, SessionPersistence, LocalPersistence, getErrorMessage } from '../src/utils/Firebase'

// hooks
import { useToast } from '../src/hooks/useToast'

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
  const { generateToast } = useToast()

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
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={submit}
            >
              {state === "signin" ? "Sign In" : "Sign Up"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => { generateToast("Too bad for you !", "info") }}
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