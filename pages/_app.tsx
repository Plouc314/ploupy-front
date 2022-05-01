import type { AppProps } from 'next/app'

// hooks
import { ToastProvider } from '../hooks/useToast';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  )
}

export default MyApp
