import type { AppProps } from 'next/app'

// hooks
import { ToastProvider } from '../src/hooks/useToast'
import { AuthProvider } from '../src/utils/Firebase'

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
