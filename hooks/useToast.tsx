// react
import { useState, useContext, createContext } from 'react';

// types
import { FC } from '../types';

// mui
import {
  Snackbar,
  Alert,
} from '@mui/material';

export type ToastType = "error" | "warning" | "info" | "success"

export interface ToastProviderProps {

}

export const ToastProvider: FC<ToastProviderProps> = (props) => {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("info");

  const generateToast = (message: string, type?: ToastType) => {
    setOpen(true);
    setMessage(message);
    setToastType(type ?? "info");
  }

  return (
    <ToastContext.Provider value={{ generateToast }}>
      {props.children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => { setOpen(false); }}
      >
        <Alert severity={toastType} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export interface useToastHook {
  /** Render a toast message for the next 6 seconds */
  generateToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext({} as useToastHook);

/**
 * use generateToast function to render toast message
 */
export function useToast(): useToastHook {
  return useContext(ToastContext);
}
