'use client';

import { useState } from 'react';
import { Product, Promotion, CartItem, Customer } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
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
    dueDate?: Date
  ) => Promise<void>;
  onCreateCustomer: (name: string, phone?: string) => Promise<void>;
}

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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAddProduct = (product: Product) => {
    const existingItem = cartItems.find(
      item => item.id === product.id && item.type === 'product'
    );

    if (existingItem) {
      if (existingItem.quantity + 1 <= product.stock) {
        updateCartItem(cartItems.indexOf(existingItem), existingItem.quantity + 1);
      } else {
        setAlert({ type: 'error', message: 'Stock insuficiente' });
      }
    } else {
      if (product.stock > 0) {
        setCartItems([
          ...cartItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            type: 'product',
            productId: product.id,
          },
        ]);
      } else {
        setAlert({ type: 'error', message: 'Producto sin stock' });
      }
    }
  };

  const handleAddPromotion = (promotion: Promotion) => {
    const existingItem = cartItems.find(
      item => item.id === promotion.id && item.type === 'promotion'
    );

    if (existingItem) {
      updateCartItem(cartItems.indexOf(existingItem), existingItem.quantity + 1);
    } else {
      setCartItems([
        ...cartItems,
        {
          id: promotion.id,
          name: promotion.name,
          price: promotion.finalPrice,
          quantity: 1,
          type: 'promotion',
          promotionId: promotion.id,
        },
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
    if (cartItems.length === 0) {
      setAlert({ type: 'error', message: 'Carrito vacío' });
      return;
    }

    if (!paymentMethod) {
      setAlert({ type: 'error', message: 'Selecciona un método de pago' });
      return;
    }

    if (paymentMethod === 'credit' && !dueDate) {
      setAlert({ type: 'error', message: 'Ingresa la fecha límite de pago' });
      return;
    }

    try {
      setIsLoading(true);
      await onCreateSale(
        cartItems,
        paymentMethod,
        selectedCustomer?.id,
        dueDate
      );

      setCartItems([]);
      setPaymentMethod(null);
      setDueDate(undefined);
      setSelectedCustomer(null);
      setAlert({ type: 'success', message: 'Venta realizada correctamente' });

      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al completar venta',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [activeTab, setActiveTab] = useState<'products' | 'cart'>('products');

  return (
    <div className="flex flex-col gap-4 pb-20 lg:pb-0">
      {/* Mobile Tabs */}
      <div className="flex lg:hidden bg-white rounded-lg p-1 shadow-sm border border-gray-200">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 text-sm font-bold rounded-md transition-all ${
            activeTab === 'products' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500'
          }`}
        >
          🛍️ Productos
        </button>
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex-1 py-3 text-sm font-bold rounded-md transition-all relative ${
            activeTab === 'cart' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500'
          }`}
        >
          🛒 Carrito
          {cartItems.length > 0 && (
            <span className="absolute top-2 right-4 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products and Promotions */}
        <div className={`lg:col-span-2 space-y-4 ${activeTab === 'cart' ? 'hidden lg:block' : 'block'}`}>
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          {/* Products */}
          <Card title="Productos Disponibles">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto pr-1">
              {products.filter(p => !p.stock || p.stock > 0).map(product => (
                <button
                  key={product.id}
                  onClick={() => handleAddProduct(product)}
                  className="flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-blue-500 active:scale-95 transition-all text-left group shadow-sm hover:shadow-md"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 truncate group-hover:text-blue-600">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold mr-2">
                        {formatCurrency(product.price)}
                      </span>
                      {product.stock !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          product.stock > 10 ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                        }`}>
                          {product.stock} en stock
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Promotions */}
          {promotions.length > 0 && (
            <Card title="Promociones">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {promotions.map(promotion => (
                  <button
                    key={promotion.id}
                    onClick={() => handleAddPromotion(promotion)}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-100 rounded-xl hover:border-purple-500 active:scale-95 transition-all text-left shadow-sm group"
                  >
                    <div>
                      <div className="font-bold text-purple-900 group-hover:text-purple-600">{promotion.name}</div>
                      <div className="text-sm font-bold text-purple-700 mt-1">{formatCurrency(promotion.finalPrice)}</div>
                    </div>
                    <div className="bg-purple-200 p-2 rounded-lg text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <span className="text-xl">✨</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar / Cart View */}
        <div className={`space-y-4 ${activeTab === 'products' ? 'hidden lg:block' : 'block'}`}>
          {/* Customer */}
          <Card title="Cliente">
            <CustomerSelector
              customers={customers}
              selectedCustomer={selectedCustomer}
              onSelect={setSelectedCustomer}
              onCreateNew={onCreateCustomer}
            />
          </Card>

          {/* Cart */}
          <Card title="Carrito de Compras">
            <Cart
              items={cartItems}
              onRemove={removeCartItem}
              onQuantityChange={updateCartItem}
            />
          </Card>

          {/* Payment */}
          <Card title="Método de Pago">
            <PaymentMethod
              onMethodSelect={(method, date) => {
                setPaymentMethod(method);
                setDueDate(date);
              }}
            />
          </Card>

          {/* Total and Button */}
          <div className="sticky bottom-20 lg:bottom-4 bg-blue-600 p-6 rounded-2xl shadow-2xl text-white transform transition-all">
            <div className="flex justify-between items-center mb-6 border-b border-blue-400 pb-4">
              <span className="text-blue-100 font-medium">Total a Pagar</span>
              <div className="text-3xl font-black">
                {formatCurrency(total)}
              </div>
            </div>
            <Button
              variant="secondary"
              fullWidth
              loading={isLoading}
              onClick={handleCompletePayment}
              disabled={cartItems.length === 0}
              className="py-4 text-lg font-bold bg-white text-blue-700 hover:bg-blue-50 border-none shadow-lg active:translate-y-1 transition-all"
            >
              🚀 Finalizar Venta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
