'use client';

import { useMemo, useState } from 'react';
import { Product, Promotion, CartItem, Customer } from '@/types';
import { Alert } from '@/components/ui/Alert';
import { Cart } from './Cart';
import { PaymentMethod } from './PaymentMethod';
import { CustomerSelector } from './CustomerSelector';
import { formatCurrency } from '@/lib/utils';

interface SalesFormProps {
  products: Product[];
  promotions: Promotion[];
  customers: Customer[];
  onCreateSale: (
    items: CartItem[],
    paymentMethod: 'cash' | 'transfer' | 'credit',
    customerId?: string,
    dueDate?: Date,
    initialPayment?: number
  ) => Promise<void>;
  onCreateCustomer: (name: string, phone?: string) => Promise<Customer>;
}

const haptic = (ms = 10) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(ms);
};

export const SalesForm = ({
  products,
  promotions,
  customers,
  onCreateSale,
  onCreateCustomer,
}: SalesFormProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'credit' | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [initialPayment, setInitialPayment] = useState<number | undefined>();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false); // hoja inferior del carrito en movil

  const handleAddProduct = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id && item.type === 'product');
    if (existingItem) {
      if (existingItem.quantity + 1 <= product.stock) {
        haptic();
        updateCartItem(cartItems.indexOf(existingItem), existingItem.quantity + 1);
      } else {
        setAlert({ type: 'error', message: 'Stock insuficiente' });
      }
    } else if (product.stock > 0) {
      haptic();
      setCartItems([
        ...cartItems,
        { id: product.id, name: product.name, price: product.price, quantity: 1, type: 'product', productId: product.id },
      ]);
    } else {
      setAlert({ type: 'error', message: 'Producto sin stock' });
    }
  };

  const handleAddPromotion = (promotion: Promotion) => {
    const existingItem = cartItems.find(item => item.id === promotion.id && item.type === 'promotion');
    if (existingItem) {
      haptic();
      updateCartItem(cartItems.indexOf(existingItem), existingItem.quantity + 1);
    } else {
      haptic();
      setCartItems([
        ...cartItems,
        { id: promotion.id, name: promotion.name, price: promotion.finalPrice, quantity: 1, type: 'promotion', promotionId: promotion.id },
      ]);
    }
  };

  const updateCartItem = (index: number, quantity: number) => {
    const newItems = [...cartItems];
    newItems[index].quantity = quantity;
    setCartItems(newItems);
  };

  const removeCartItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleCompletePayment = async () => {
    if (cartItems.length === 0) { setAlert({ type: 'error', message: 'Carrito vacio' }); return; }
    if (!paymentMethod) { setAlert({ type: 'error', message: 'Selecciona un metodo de pago' }); setCartOpen(true); return; }
    if (paymentMethod === 'credit' && !dueDate) { setAlert({ type: 'error', message: 'Ingresa la fecha limite de pago' }); setCartOpen(true); return; }

    try {
      setIsLoading(true);
      await onCreateSale(cartItems, paymentMethod, selectedCustomer?.id, dueDate, initialPayment);
      haptic(20);
      setCartItems([]);
      setPaymentMethod(null);
      setDueDate(undefined);
      setInitialPayment(undefined);
      setSelectedCustomer(null);
      setCartOpen(false);
      setAlert({ type: 'success', message: 'Venta realizada correctamente' });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({ type: 'error', message: error instanceof Error ? error.message : 'Error al completar venta' });
    } finally {
      setIsLoading(false);
    }
  };

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const term = search.trim().toLowerCase();
  const visibleProducts = useMemo(
    () => products.filter(p => (!p.stock || p.stock > 0) && (!term || p.name.toLowerCase().includes(term))),
    [products, term]
  );
  const visiblePromotions = useMemo(
    () => promotions.filter(p => !term || p.name.toLowerCase().includes(term)),
    [promotions, term]
  );

  return (
    <div className="relative">
      {alert && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============ PRODUCTOS ============ */}
        <div className="lg:col-span-2 space-y-4 pb-40 lg:pb-0">
          {/* Buscador fijo */}
          <div className="sticky top-14 sm:top-16 z-20 -mx-1 px-1 py-2 bg-slate-50/95 backdrop-blur">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">&#128269;</span>
              <input
                type="text"
                inputMode="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full h-12 pl-11 pr-10 bg-white border-2 border-slate-100 rounded-2xl font-semibold text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 active:scale-90"
                  aria-label="Limpiar busqueda"
                >
                  &#10005;
                </button>
              )}
            </div>
          </div>

          {/* Promociones */}
          {visiblePromotions.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Promociones</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {visiblePromotions.map(promotion => (
                  <button
                    key={promotion.id}
                    onClick={() => handleAddPromotion(promotion)}
                    className="flex flex-col justify-between p-3 min-h-[88px] bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 rounded-2xl text-left active:scale-95 transition-transform shadow-sm"
                  >
                    <span className="text-lg">&#10024;</span>
                    <div>
                      <div className="font-bold text-purple-900 text-sm leading-tight line-clamp-2">{promotion.name}</div>
                      <div className="text-sm font-black text-purple-700 mt-0.5">{formatCurrency(promotion.finalPrice)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Productos */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Productos</p>
            {visibleProducts.length === 0 ? (
              <div className="text-center py-12 text-slate-400 font-semibold bg-white rounded-2xl border border-slate-100">
                Sin resultados para &ldquo;{search}&rdquo;
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {visibleProducts.map(product => {
                  const inCart = cartItems.find(i => i.id === product.id && i.type === 'product');
                  return (
                    <button
                      key={product.id}
                      onClick={() => handleAddProduct(product)}
                      className="relative flex flex-col justify-between p-3 min-h-[88px] bg-white border-2 border-slate-100 rounded-2xl text-left active:scale-95 active:border-blue-400 transition-all shadow-sm"
                    >
                      {inCart && (
                        <span className="absolute top-2 right-2 min-w-[22px] h-[22px] px-1.5 flex items-center justify-center bg-blue-600 text-white text-xs font-black rounded-full">
                          {inCart.quantity}
                        </span>
                      )}
                      <div className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 pr-6">{product.name}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-black text-blue-700">{formatCurrency(product.price)}</span>
                        {product.stock !== undefined && (
                          <span className={`text-[10px] font-bold ${product.stock > 10 ? 'text-emerald-500' : 'text-orange-500'}`}>
                            {product.stock}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ============ CARRITO DESKTOP (columna fija) ============ */}
        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 sticky top-20">
            <CartPanel
              cartItems={cartItems}
              customers={customers}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              onCreateCustomer={onCreateCustomer}
              removeCartItem={removeCartItem}
              updateCartItem={updateCartItem}
              onPaymentSelect={(m, d, i) => { setPaymentMethod(m); setDueDate(d); setInitialPayment(i); }}
              total={total}
              isLoading={isLoading}
              onCheckout={handleCompletePayment}
            />
          </div>
        </div>
      </div>

      {/* ============ BARRA COBRAR FIJA (movil) ============ */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 pt-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)' }}
      >
        <button
          onClick={() => { if (cartItems.length > 0) { haptic(); setCartOpen(true); } }}
          disabled={cartItems.length === 0}
          className="w-full h-14 flex items-center justify-between px-5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-transform disabled:bg-slate-300 disabled:shadow-none"
        >
          <span className="flex items-center gap-2 font-bold">
            <span className="relative text-xl">
              &#128722;
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full">
                  {itemCount}
                </span>
              )}
            </span>
            {cartItems.length === 0 ? 'Carrito vacio' : 'COBRAR'}
          </span>
          <span className="text-xl font-black tabular-nums">{formatCurrency(total)}</span>
        </button>
      </div>

      {/* ============ HOJA INFERIOR DEL CARRITO (movil) ============ */}
      <div
        className={`lg:hidden fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity ${cartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setCartOpen(false)}
      />
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-[101] transition-transform duration-300 ease-out ${cartOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="bg-slate-50 rounded-t-3xl shadow-2xl max-h-[88vh] flex flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 bg-slate-300 rounded-full" />
          </div>
          <div className="flex items-center justify-between px-5 py-2 shrink-0">
            <h3 className="text-lg font-black text-slate-900">Carrito ({itemCount})</h3>
            <button onClick={() => setCartOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 active:scale-90">&#10005;</button>
          </div>
          <div className="overflow-y-auto px-4 pb-4 flex-1">
            <CartPanel
              cartItems={cartItems}
              customers={customers}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              onCreateCustomer={onCreateCustomer}
              removeCartItem={removeCartItem}
              updateCartItem={updateCartItem}
              onPaymentSelect={(m, d, i) => { setPaymentMethod(m); setDueDate(d); setInitialPayment(i); }}
              total={total}
              isLoading={isLoading}
              onCheckout={handleCompletePayment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/** Panel reutilizable: cliente + carrito + pago + boton cobrar. */
const CartPanel = ({
  cartItems, customers, selectedCustomer, setSelectedCustomer, onCreateCustomer,
  removeCartItem, updateCartItem, onPaymentSelect, total, isLoading, onCheckout,
}: {
  cartItems: CartItem[];
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (c: Customer | null) => void;
  onCreateCustomer: (name: string, phone?: string) => Promise<Customer>;
  removeCartItem: (i: number) => void;
  updateCartItem: (i: number, q: number) => void;
  onPaymentSelect: (m: 'cash' | 'transfer' | 'credit', d?: Date, i?: number) => void;
  total: number;
  isLoading: boolean;
  onCheckout: () => void;
}) => (
  <div className="space-y-4">
    <Cart items={cartItems} onRemove={removeCartItem} onQuantityChange={updateCartItem} />

    {cartItems.length > 0 && (
      <>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Cliente</p>
          <CustomerSelector
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelect={setSelectedCustomer}
            onCreateNew={onCreateCustomer}
          />
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Metodo de pago</p>
          <PaymentMethod onMethodSelect={onPaymentSelect} />
        </div>

        <button
          onClick={onCheckout}
          disabled={isLoading || cartItems.length === 0}
          className="w-full h-16 flex items-center justify-between px-6 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          <span className="text-lg font-black">{isLoading ? 'Procesando...' : 'COBRAR'}</span>
          <span className="text-2xl font-black tabular-nums">{formatCurrency(total)}</span>
        </button>
      </>
    )}
  </div>
);
