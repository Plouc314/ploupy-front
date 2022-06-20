import type { AppProps } from 'next/app'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Fade } from '@mui/material';

// notistack
import { SnackbarProvider } from 'notistack';

// hooks
import { CommProvider } from '../src/hooks/useComm'
import { GameDataProvider } from '../src/hooks/useGameData'
import { ToastProvider } from '../src/hooks/useToast'
import { AuthProvider } from '../src/utils/Firebase'


const theme = createTheme({
  typography: {
    h1: {
      fontSize: "1.8rem",
      fontWeight: 500,
      letterSpacing: "0.0075em",
    },
    h2: {
      fontSize: "1.6rem",
      fontWeight: 500,
      letterSpacing: "0.0075em",
    },
    h3: {
      fontSize: "1.4rem",
      fontWeight: 500,
      letterSpacing: "0.0075em",
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1.2rem",
      fontWeight: 500,
    },
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CommProvider>
          <GameDataProvider>
            <SnackbarProvider TransitionComponent={Fade}>
              <ToastProvider>
                <Component {...pageProps} />
              </ToastProvider>
            </SnackbarProvider>
          </GameDataProvider>
        </CommProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default MyApp
