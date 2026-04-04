export const validators = {
  productName: (name: string): boolean => name.trim().length > 0,

  stock: (stock: number): boolean => stock >= 0 && Number.isInteger(stock),

  price: (price: number): boolean => price > 0,

  customerName: (name: string): boolean => name.trim().length > 0,

  phone: (phone: string): boolean => {
    if (!phone) return true;
    return phone.trim().length >= 7;
  },

  promotionName: (name: string): boolean => name.trim().length > 0,

  promotionProducts: (products: { productId: string; quantity: number }[]): boolean => {
    return products.length > 0 && products.every(p => p.quantity > 0);
  },

  amount: (amount: number): boolean => amount > 0,

  dueDate: (date: Date): boolean => date > new Date(),
};
