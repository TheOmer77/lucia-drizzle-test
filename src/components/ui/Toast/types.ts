import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import type { Toast } from './Toast';
import type { ToastAction } from './ToastAction';

export type ToastProps = ComponentPropsWithoutRef<typeof Toast>;

export type ToastActionElement = ReactElement<typeof ToastAction>;
