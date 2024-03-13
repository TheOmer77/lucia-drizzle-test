'use client';

import { Toast, ToastProvider } from './Toast';
import { ToastClose } from './ToastClose';
import { ToastDescription } from './ToastDescription';
import { ToastTitle } from './ToastTitle';
import { ToastViewport } from './ToastViewport';
import { useToast } from '@/hooks/useToast';

export const Toaster = () => {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className='grid gap-1'>
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
};
