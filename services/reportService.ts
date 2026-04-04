import { salesService } from './salesService';
import { customerService } from './customerService';
import { DailyReport, MonthlyReport, Analytics } from '@/types';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

export const reportService = {
  async getDailyReport(date: Date): Promise<DailyReport> {
    const startDate = startOfDay(date);
    const endDate = endOfDay(date);

    const sales = await salesService.getByDateRange(startDate, endDate);

    const totalSold = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalCollected = sales
      .filter(sale => sale.paymentMethod !== 'credit')
      .reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalPending = sales
      .filter(sale => sale.paymentMethod === 'credit')
      .reduce((sum, sale) => sum + sale.totalAmount, 0);

    const uniqueCustomers = new Set(
      sales.filter(sale => sale.customerId).map(sale => sale.customerId)
    );

    return {
      date: startDate,
      totalSold,
      totalCollected,
      totalPending,
      customersServed: uniqueCustomers.size,
    };
  },

  async getMonthlyReport(date: Date): Promise<MonthlyReport> {
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);

    const sales = await salesService.getByDateRange(startDate, endDate);

    const totalSold = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalCollected = sales
      .filter(sale => sale.paymentMethod !== 'credit')
      .reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalPending = sales
      .filter(sale => sale.paymentMethod === 'credit')
      .reduce((sum, sale) => sum + sale.totalAmount, 0);

    return {
      month: format(startDate, 'MMMM yyyy'),
      totalSold,
      totalCollected,
      totalPending,
    };
  },

  async getAnalytics(): Promise<Analytics> {
    const sales = await salesService.getAll();
    const customers = await customerService.getAll();

    // Products calculation
    const productMap = new Map<string, number>();
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const current = productMap.get(item.name) || 0;
        productMap.set(item.name, current + item.quantity);
      });
    });

    const sortedProducts = Array.from(productMap.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);

    const topProducts = sortedProducts.slice(0, 5);
    const bottomProducts = sortedProducts.slice(-5).reverse();

    // Customers calculation
    const customerSpending = new Map<string, number>();
    sales.forEach(sale => {
      if (sale.customerId) {
        const customer = customers.find(c => c.id === sale.customerId);
        if (customer) {
          const current = customerSpending.get(customer.name) || 0;
          customerSpending.set(customer.name, current + sale.totalAmount);
        }
      }
    });

    const topCustomers = Array.from(customerSpending.entries())
      .map(([name, totalSpent]) => ({ name, totalSpent }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    return {
      topProducts,
      bottomProducts,
      topCustomers,
      totalRevenue,
    };
  },
};
