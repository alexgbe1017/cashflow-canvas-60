import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Home, Car, Wifi, Baby } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: 'rent' | 'subscription' | 'misc' | 'baby';
  isPaid: boolean;
  isRecurring: boolean;
  purpose?: string;
}

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', [
    { id: '1', name: 'Rent', amount: 2800, category: 'rent', isPaid: true, isRecurring: true },
    { id: '2', name: 'Netflix', amount: 15.99, category: 'subscription', isPaid: true, isRecurring: true },
    { id: '3', name: 'Baby Supplies', amount: 150, category: 'baby', isPaid: false, isRecurring: false }
  ]);

  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    category: 'misc' as const,
    isRecurring: false,
    purpose: ''
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'rent': return <Home className="h-4 w-4" />;
      case 'subscription': return <Wifi className="h-4 w-4" />;
      case 'baby': return <Baby className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'rent': return 'bg-red-500 text-white';
      case 'subscription': return 'bg-blue-500 text-white';
      case 'baby': return 'bg-pink-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      const expense: Expense = {
        id: Date.now().toString(),
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        isPaid: false,
        isRecurring: newExpense.isRecurring,
        purpose: newExpense.purpose
      };
      setExpenses([...expenses, expense]);
      setNewExpense({ name: '', amount: '', category: 'misc', isRecurring: false, purpose: '' });
    }
  };

  const togglePaid = (id: string) => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, isPaid: !exp.isPaid } : exp
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const paidExpenses = expenses.filter(exp => exp.isPaid).reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            💳 Expense Tracker
            {paidExpenses/totalExpenses > 0.8 ? ' ✅' : paidExpenses/totalExpenses > 0.5 ? ' ⚠️' : ' 🚨'}
          </span>
          <div className="text-sm text-muted-foreground">
            ${paidExpenses.toFixed(2)} / ${totalExpenses.toFixed(2)}
            {paidExpenses >= totalExpenses ? ' 🎯' : ''}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Expense */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Expense name"
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="Amount"
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="w-24"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="What's this for? (e.g., business supplies, personal care)"
              value={newExpense.purpose}
              onChange={(e) => setNewExpense({ ...newExpense, purpose: e.target.value })}
              className="flex-1"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as any })}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="misc">Misc</option>
              <option value="rent">Rent</option>
              <option value="subscription">Subscription</option>
              <option value="baby">Baby</option>
            </select>
            <div className="flex items-center gap-2">
              <Switch
                checked={newExpense.isRecurring}
                onCheckedChange={(checked) => setNewExpense({ ...newExpense, isRecurring: checked })}
              />
              <span className="text-sm">Recurring</span>
            </div>
            <Button onClick={addExpense} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expense List */}
        <div className="space-y-2">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                expense.isPaid ? 'bg-paid/10 border-paid/20' : 'bg-card border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getCategoryColor(expense.category)}`}>
                  {getCategoryIcon(expense.category)}
                </div>
                <div>
                  <div className="font-medium">{expense.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ${expense.amount.toFixed(2)}
                    {expense.isRecurring && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Recurring
                      </Badge>
                    )}
                  </div>
                  {expense.purpose && (
                    <div className="text-xs text-muted-foreground mt-1">
                      For: {expense.purpose}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={expense.isPaid}
                  onCheckedChange={() => togglePaid(expense.id)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteExpense(expense.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseTracker;