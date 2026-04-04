'use client';

import { useState, useEffect } from 'react';
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Products and Promotions */}
      <div className="lg:col-span-2 space-y-4">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Products */}
        <Card title="Productos">
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {products.filter(p => p.stock > 0).map(product => (
              <Button
                key={product.id}
                variant="secondary"
                onClick={() => handleAddProduct(product)}
                className="text-left flex-col items-start h-auto py-2"
              >
                <span className="font-medium">{product.name}</span>
                <span className="text-sm opacity-75">
                  {formatCurrency(product.price)} ({product.stock} stock)
                </span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Promotions */}
        {promotions.length > 0 && (
          <Card title="Promociones">
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {promotions.map(promotion => (
                <Button
                  key={promotion.id}
                  variant="success"
                  onClick={() => handleAddPromotion(promotion)}
                  className="text-left flex-col items-start h-auto py-2"
                >
                  <span className="font-medium">{promotion.name}</span>
                  <span className="text-sm opacity-75">
                    {formatCurrency(promotion.finalPrice)}
                  </span>
                </Button>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
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
        <Card title="Carrito">
          <Cart
            items={cartItems}
            onRemove={removeCartItem}
            onQuantityChange={updateCartItem}
          />
        </Card>

        {/* Payment */}
        <Card title="Pago">
          <PaymentMethod
            total={total}
            onMethodSelect={(method, date) => {
              setPaymentMethod(method);
              setDueDate(date);
            }}
          />
        </Card>

        {/* Total and Button */}
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <div className="text-2xl font-bold text-blue-600 mb-4">
            {formatCurrency(total)}
          </div>
          <Button
            variant="primary"
            fullWidth
            loading={isLoading}
            onClick={handleCompletePayment}
            disabled={cartItems.length === 0}
          >
            Completar Venta
          </Button>
        </div>
      </div>
    </div>
  );
};
