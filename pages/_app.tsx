import type { AppProps } from 'next/app'

// hooks
import { ToastProvider } from '../hooks/useToast'
import { AuthProvider } from '../utils/Firebase'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </AuthProvider>
  )
}

export default MyApp
