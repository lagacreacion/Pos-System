import { format, startOfMonth, endOfMonth } from 'date-fns';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm');
};

export const getStartOfMonth = (date: Date): Date => {
  return startOfMonth(date);
};

export const getEndOfMonth = (date: Date): Date => {
  return endOfMonth(date);
};

export const getMonthYear = (date: Date): string => {
  return format(date, 'MMMM yyyy', { locale: require('date-fns/locale/es') });
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
