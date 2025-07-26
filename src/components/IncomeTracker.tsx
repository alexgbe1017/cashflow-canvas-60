import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Store, User, TrendingUp } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Income {
  id: string;
  source: string;
  amount: number;
  type: 'business' | 'personal';
  date: string;
}

const IncomeTracker = () => {
  const [incomes, setIncomes] = useLocalStorage<Income[]>('incomes', [
    { id: '1', source: 'Clothing Sales', amount: 3500, type: 'business', date: '2024-01-15' },
    { id: '2', source: 'Side Hustle', amount: 800, type: 'personal', date: '2024-01-10' },
    { id: '3', source: 'Tax Refund', amount: 1200, type: 'personal', date: '2024-01-05' }
  ]);

  const [newIncome, setNewIncome] = useState({
    source: '',
    amount: '',
    type: 'business' as const
  });

  const getTypeIcon = (type: string) => {
    return type === 'business' ? <Store className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    return type === 'business' ? 'bg-business text-white' : 'bg-personal text-white';
  };

  const addIncome = () => {
    if (newIncome.source && newIncome.amount) {
      const income: Income = {
        id: Date.now().toString(),
        source: newIncome.source,
        amount: parseFloat(newIncome.amount),
        type: newIncome.type,
        date: new Date().toISOString().split('T')[0]
      };
      setIncomes([...incomes, income]);
      setNewIncome({ source: '', amount: '', type: 'business' });
    }
  };

  const deleteIncome = (id: string) => {
    setIncomes(incomes.filter(inc => inc.id !== id));
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const businessIncome = incomes.filter(inc => inc.type === 'business').reduce((sum, inc) => sum + inc.amount, 0);
  const personalIncome = incomes.filter(inc => inc.type === 'personal').reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Income Tracker</span>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-business" />
            <span className="text-muted-foreground">${totalIncome.toFixed(2)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Income Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-business/10 rounded-lg border border-business/20">
            <div className="text-sm text-muted-foreground">Business</div>
            <div className="text-xl font-bold text-business">${businessIncome.toFixed(2)}</div>
          </div>
          <div className="p-3 bg-personal/10 rounded-lg border border-personal/20">
            <div className="text-sm text-muted-foreground">Personal</div>
            <div className="text-xl font-bold text-personal">${personalIncome.toFixed(2)}</div>
          </div>
        </div>

        {/* Add New Income */}
        <div className="flex flex-col sm:flex-row gap-2 p-4 bg-muted/50 rounded-lg">
          <Input
            placeholder="Income source"
            value={newIncome.source}
            onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
            className="flex-1"
          />
          <Input
            placeholder="Amount"
            type="number"
            value={newIncome.amount}
            onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
            className="w-24"
          />
          <select
            value={newIncome.type}
            onChange={(e) => setNewIncome({ ...newIncome, type: e.target.value as any })}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            <option value="business">Business</option>
            <option value="personal">Personal</option>
          </select>
          <Button onClick={addIncome} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Income List */}
        <div className="space-y-2">
          {incomes.map((income) => (
            <div
              key={income.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getTypeColor(income.type)}`}>
                  {getTypeIcon(income.type)}
                </div>
                <div>
                  <div className="font-medium">{income.source}</div>
                  <div className="text-sm text-muted-foreground">
                    ${income.amount.toFixed(2)} • {new Date(income.date).toLocaleDateString()}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {income.type}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteIncome(income.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeTracker;