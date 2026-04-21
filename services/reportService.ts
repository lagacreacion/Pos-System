import { salesService } from './salesService';
import { customerService } from './customerService';
import { debtService } from './debtService';
import { DailyReport, MonthlyReport, Analytics } from '@/types';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

export const reportService = {
  async getDailyReport(date: Date): Promise<DailyReport> {
    const startDate = startOfDay(date);
    const endDate = endOfDay(date);

    const sales = await salesService.getByDateRange(startDate, endDate);
    const debts = await debtService.getAll();
    const debtMap = new Map(debts.map(d => [d.saleId, d]));

    const totalSold = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    let totalCollected = 0;
    let totalPending = 0;

    sales.forEach(sale => {
      if (sale.paymentMethod !== 'credit') {
        totalCollected += sale.totalAmount;
      } else {
        const debt = debtMap.get(sale.id);
        if (debt) {
          totalCollected += (debt.paidAmount || 0);
          totalPending += (debt.amount - (debt.paidAmount || 0));
        } else {
          // Fallback if debt not found
          totalPending += sale.totalAmount;
        }
      }
    });

    const uniqueCustomers = new Set(
      sales.filter(sale => sale.customerId).map(sale => sale.customerId)
    );

    return {
      date: startDate,
      totalSold,
      totalCollected,
      totalPending,
      customersServed: uniqueCustomers.size,
      sales,
    };
  },

  async getMonthlyReport(date: Date): Promise<MonthlyReport> {
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);

    const sales = await salesService.getByDateRange(startDate, endDate);
    const debts = await debtService.getAll();
    const debtMap = new Map(debts.map(d => [d.saleId, d]));

    const totalSold = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    let totalCollected = 0;
    let totalPending = 0;

    sales.forEach(sale => {
      if (sale.paymentMethod !== 'credit') {
        totalCollected += sale.totalAmount;
      } else {
        const debt = debtMap.get(sale.id);
        if (debt) {
          totalCollected += (debt.paidAmount || 0);
          totalPending += (debt.amount - (debt.paidAmount || 0));
        } else {
          totalPending += sale.totalAmount;
        }
      }
    });

    return {
      month: format(startDate, 'MMMM yyyy'),
      totalSold,
      totalCollected,
      totalPending,
    };
  },

  async getYearlyReport(year: number): Promise<MonthlyReport[]> {
    const sales = await salesService.getByYear(year);
    const debts = await debtService.getAll();
    const debtMap = new Map(debts.map(d => [d.saleId, d]));

    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const reportByMonth = months.map((monthName, index) => {
      const monthNum = index + 1;
      const monthlySales = sales.filter(s => {
        const date = s.date;
        if (s.month && s.year) {
          return s.month === monthNum && s.year === year;
        }
        return date.getMonth() + 1 === monthNum && date.getFullYear() === year;
      });

      let totalSold = 0;
      let totalCollected = 0;
      let totalPending = 0;

      monthlySales.forEach(sale => {
        totalSold += sale.totalAmount;
        if (sale.paymentMethod !== 'credit') {
          totalCollected += sale.totalAmount;
        } else {
          const debt = debtMap.get(sale.id);
          if (debt) {
            totalCollected += (debt.paidAmount || 0);
            totalPending += (debt.amount - (debt.paidAmount || 0));
          } else {
            totalPending += sale.totalAmount;
          }
        }
      });

      return {
        month: `${monthName} ${year}`,
        totalSold,
        totalCollected,
        totalPending,
      };
    });

    return reportByMonth;
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
