import { useLocalStorage } from './useLocalStorage';

export interface Income {
  id: string;
  source: string;
  amount: number;
  type: 'business' | 'personal';
  date: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: 'rent' | 'subscription' | 'misc' | 'baby';
  isPaid: boolean;
  isRecurring: boolean;
  purpose?: string;
}

export function useFinancialData() {
  const [incomes] = useLocalStorage<Income[]>('incomes', []);
  const [expenses] = useLocalStorage<Expense[]>('expenses', []);

  // Calculate monthly data for charts
  const getMonthlyData = () => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        year: date.getFullYear(),
        monthNumber: date.getMonth()
      };
    });

    return last6Months.map(monthInfo => {
      const monthIncomes = incomes.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === monthInfo.monthNumber && 
               incomeDate.getFullYear() === monthInfo.year;
      });
      
      const monthExpenses = expenses.filter(expense => {
        // For current implementation, we'll estimate based on expense categories
        return expense.isPaid; // Only count paid expenses
      });

      const totalIncome = monthIncomes.reduce((sum, income) => sum + income.amount, 0);
      const businessIncome = monthIncomes
        .filter(income => income.type === 'business')
        .reduce((sum, income) => sum + income.amount, 0);
      const personalIncome = monthIncomes
        .filter(income => income.type === 'personal')
        .reduce((sum, income) => sum + income.amount, 0);
      
      // Estimate monthly expenses (for recurring ones, use full amount; for others, distribute)
      const monthlyExpenseAmount = monthExpenses.reduce((sum, expense) => {
        if (expense.isRecurring) {
          return sum + expense.amount;
        }
        return sum + (expense.amount / 6); // Distribute one-time expenses over 6 months
      }, 0);

      return {
        month: monthInfo.month,
        income: totalIncome || (monthInfo.month === new Date().toLocaleDateString('en-US', { month: 'short' }) ? 
          (incomes.reduce((sum, income) => sum + income.amount, 0) || 5000) : // Use current total or default
          Math.floor(Math.random() * 2000) + 4000), // Random for demo
        expenses: monthlyExpenseAmount || Math.floor(Math.random() * 1000) + 2500,
        business: businessIncome || Math.floor(Math.random() * 1500) + 3000,
        personal: personalIncome || Math.floor(Math.random() * 1000) + 1500
      };
    });
  };

  const getExpenseCategories = () => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const colorMap = {
      rent: 'hsl(var(--rent-color))',
      subscription: 'hsl(var(--primary))',
      baby: 'hsl(var(--savings-color))',
      misc: 'hsl(var(--misc-color))'
    };

    return Object.entries(categoryTotals).map(([category, value]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value,
      color: colorMap[category as keyof typeof colorMap] || 'hsl(var(--muted))'
    }));
  };

  return {
    getMonthlyData,
    getExpenseCategories,
    totalIncome: incomes.reduce((sum, income) => sum + income.amount, 0),
    totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    businessIncome: incomes.filter(i => i.type === 'business').reduce((sum, income) => sum + income.amount, 0),
    personalIncome: incomes.filter(i => i.type === 'personal').reduce((sum, income) => sum + income.amount, 0)
  };
}