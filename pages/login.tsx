// next
import { useRouter } from 'next/router';

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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

// firebase
import {
  setPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

// utils
import { auth, SessionPersistence, LocalPersistence } from '../utils/Firebase';

// hooks
import { useToast } from '../hooks/useToast'


const theme = createTheme()

export interface PageLoginProps { }

const PageLogin: FC<PageLoginProps> = (props) => {

  const router = useRouter();
  const { generateToast } = useToast();

  const [state, setState] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false)

  const reset = () => {
    setEmail("")
    setUsername("")
    setPassword("")
    setRemember(false)
  }

  const submit = async () => {

    // select the persitence type (session | local)
    const persistence = remember ? LocalPersistence : SessionPersistence;

    const authFunc = state === "signin" ?
      signInWithEmailAndPassword : createUserWithEmailAndPassword

    // Set correct persistence
    setPersistence(auth, persistence)
      .then(() => {
        // sign in
        authFunc(auth, email, password)
          .then(() => {
            // sign in succesful -> redirect to home page
            reset();
            // setErrorMessage("");

            router.push("/");
          })
          .catch((error) => {
            // sign in failed -> display error message
            // setErrorMessage(error.message);
            console.log(error.message)
          });
      })
      .catch((error) => {
        // persitence failed -> display error message
        // setErrorMessage(error.message);
        console.log(error.message)
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
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
              control={<Checkbox value="remember" color="primary" id="checkRemember" />}
              label="Remember me"
            />
            <Button
              type="submit"
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
                  onClick={() => { generateToast("Too bad for you !", "warning") }}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => {
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