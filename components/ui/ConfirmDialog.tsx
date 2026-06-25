'use client';

import { useCallback, useState } from 'react';
import { Button } from './Button';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
  resolve?: (v: boolean) => void;
}

/**
 * Hook de confirmacion con promesa. Reemplaza window.confirm().
 * Uso:
 *   const { confirm, ConfirmDialog } = useConfirm();
 *   if (await confirm({ message: '...' })) { ... }
 *   // y renderiza <ConfirmDialog /> una vez en el componente.
 */
export const useConfirm = () => {
  const [state, setState] = useState<ConfirmState>({ open: false, message: '' });

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>(resolve => {
      setState({ ...opts, open: true, resolve });
    });
  }, []);

  const close = (value: boolean) => {
    state.resolve?.(value);
    setState(s => ({ ...s, open: false }));
  };

  const ConfirmDialog = () => {
    if (!state.open) return null;
    const danger = (state.variant ?? 'danger') === 'danger';
    return (
      <div
        className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={e => { if (e.target === e.currentTarget) close(false); }}
      >
        <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-200"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)' }}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4 ${danger ? 'bg-red-50' : 'bg-blue-50'}`}>
            {danger ? '⚠️' : 'ℹ️'}
          </div>
          {state.title && <h3 className="text-lg font-black text-slate-900 mb-1">{state.title}</h3>}
          <p className="text-slate-600 font-medium text-[15px] leading-relaxed mb-6">{state.message}</p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => close(false)}>
              {state.cancelLabel ?? 'Cancelar'}
            </Button>
            <Button variant={danger ? 'danger' : 'primary'} fullWidth onClick={() => close(true)}>
              {state.confirmLabel ?? 'Confirmar'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return { confirm, ConfirmDialog };
};
