import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DueDate {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  category: 'rent' | 'subscription' | 'card' | 'misc';
}

const DueDateTracker = () => {
  const [dueDates, setDueDates] = useLocalStorage<DueDate[]>('dueDates', [
    { id: '1', name: 'Rent Payment', amount: 2800, dueDate: '2024-02-01', isPaid: false, category: 'rent' },
    { id: '2', name: 'Netflix', amount: 15.99, dueDate: '2024-01-28', isPaid: true, category: 'subscription' },
    { id: '3', name: 'Credit Card', amount: 450, dueDate: '2024-01-30', isPaid: false, category: 'card' }
  ]);

  const [newDueDate, setNewDueDate] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: 'misc' as const
  });

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueBadge = (dueDate: string, isPaid: boolean) => {
    if (isPaid) {
      return <Badge className="bg-paid text-white">Paid</Badge>;
    }
    
    const days = getDaysUntilDue(dueDate);
    if (days < 0) {
      return <Badge className="bg-destructive text-white">Overdue</Badge>;
    } else if (days <= 3) {
      return <Badge className="bg-dueSoon text-white">Due Soon</Badge>;
    } else if (days <= 7) {
      return <Badge className="bg-unpaid text-white">This Week</Badge>;
    } else {
      return <Badge variant="outline">Due in {days} days</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'rent': return 'bg-rent text-white';
      case 'subscription': return 'bg-primary text-white';
      case 'card': return 'bg-destructive text-white';
      default: return 'bg-misc text-white';
    }
  };

  const addDueDate = () => {
    if (newDueDate.name && newDueDate.amount && newDueDate.dueDate) {
      const dueDate: DueDate = {
        id: Date.now().toString(),
        name: newDueDate.name,
        amount: parseFloat(newDueDate.amount),
        dueDate: newDueDate.dueDate,
        isPaid: false,
        category: newDueDate.category
      };
      setDueDates([...dueDates, dueDate]);
      setNewDueDate({ name: '', amount: '', dueDate: '', category: 'misc' });
    }
  };

  const togglePaid = (id: string) => {
    setDueDates(dueDates.map(due => 
      due.id === id ? { ...due, isPaid: !due.isPaid } : due
    ));
  };

  const deleteDueDate = (id: string) => {
    setDueDates(dueDates.filter(due => due.id !== id));
  };

  const sortedDueDates = [...dueDates].sort((a, b) => {
    if (a.isPaid !== b.isPaid) return a.isPaid ? 1 : -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const upcomingTotal = dueDates
    .filter(due => !due.isPaid && getDaysUntilDue(due.dueDate) >= 0)
    .reduce((sum, due) => sum + due.amount, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Due Dates
          </span>
          <div className="text-sm text-muted-foreground">
            Upcoming: ${upcomingTotal.toFixed(2)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Due Date */}
        <div className="flex flex-col gap-2 p-4 bg-muted/50 rounded-lg">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Payment name"
              value={newDueDate.name}
              onChange={(e) => setNewDueDate({ ...newDueDate, name: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="Amount"
              type="number"
              value={newDueDate.amount}
              onChange={(e) => setNewDueDate({ ...newDueDate, amount: e.target.value })}
              className="w-24"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="date"
              value={newDueDate.dueDate}
              onChange={(e) => setNewDueDate({ ...newDueDate, dueDate: e.target.value })}
              className="flex-1"
            />
            <select
              value={newDueDate.category}
              onChange={(e) => setNewDueDate({ ...newDueDate, category: e.target.value as any })}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="misc">Misc</option>
              <option value="rent">Rent</option>
              <option value="subscription">Subscription</option>
              <option value="card">Credit Card</option>
            </select>
            <Button onClick={addDueDate} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Due Dates List */}
        <div className="space-y-2">
          {sortedDueDates.map((dueDate) => {
            const days = getDaysUntilDue(dueDate.dueDate);
            const isOverdue = days < 0 && !dueDate.isPaid;
            const isDueSoon = days <= 3 && days >= 0 && !dueDate.isPaid;
            
            return (
              <div
                key={dueDate.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  dueDate.isPaid 
                    ? 'bg-paid/10 border-paid/20 opacity-75' 
                    : isOverdue
                    ? 'bg-destructive/10 border-destructive/20'
                    : isDueSoon
                    ? 'bg-dueSoon/10 border-dueSoon/20'
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getCategoryColor(dueDate.category)}`}>
                    {dueDate.isPaid ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isOverdue || isDueSoon ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <Calendar className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{dueDate.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ${dueDate.amount.toFixed(2)} • {new Date(dueDate.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getDueBadge(dueDate.dueDate, dueDate.isPaid)}
                  <Switch
                    checked={dueDate.isPaid}
                    onCheckedChange={() => togglePaid(dueDate.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDueDate(dueDate.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DueDateTracker;