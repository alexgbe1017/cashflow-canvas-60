import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DailySpend {
  id: string;
  date: string;
  category: 'food' | 'gas' | 'clothing' | 'entertainment' | 'misc' | 'groceries' | 'utilities';
  amount: number;
  description: string;
}

const DailySpendingTracker = () => {
  const [dailySpends, setDailySpends] = useLocalStorage<DailySpend[]>('dailySpends', []);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSpend, setNewSpend] = useState({
    category: 'food' as const,
    amount: '',
    description: ''
  });

  const categories = {
    food: { emoji: '🍽️', color: 'bg-orange-500', limit: 50 },
    groceries: { emoji: '🛒', color: 'bg-green-500', limit: 150 },
    gas: { emoji: '⛽', color: 'bg-blue-500', limit: 80 },
    clothing: { emoji: '👕', color: 'bg-purple-500', limit: 100 },
    entertainment: { emoji: '🎮', color: 'bg-pink-500', limit: 75 },
    utilities: { emoji: '💡', color: 'bg-yellow-500', limit: 200 },
    misc: { emoji: '🛍️', color: 'bg-gray-500', limit: 60 }
  };

  const addSpend = () => {
    if (newSpend.amount && newSpend.description) {
      const spend: DailySpend = {
        id: Date.now().toString(),
        date: selectedDate,
        category: newSpend.category,
        amount: parseFloat(newSpend.amount),
        description: newSpend.description
      };
      setDailySpends([...dailySpends, spend]);
      setNewSpend({ category: 'food', amount: '', description: '' });
    }
  };

  const deleteSpend = (id: string) => {
    setDailySpends(dailySpends.filter(spend => spend.id !== id));
  };

  const getDaySpends = (date: string) => {
    return dailySpends.filter(spend => spend.date === date);
  };

  const getDayTotal = (date: string) => {
    return getDaySpends(date).reduce((sum, spend) => sum + spend.amount, 0);
  };

  const getCurrentMonthSpends = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return dailySpends.filter(spend => {
      const spendDate = new Date(spend.date);
      return spendDate.getMonth() === currentMonth && spendDate.getFullYear() === currentYear;
    });
  };

  const getMonthlyAnalysis = () => {
    const monthSpends = getCurrentMonthSpends();
    const categoryTotals = monthSpends.reduce((acc, spend) => {
      acc[spend.category] = (acc[spend.category] || 0) + spend.amount;
      return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .map(([category, amount]) => ({ category, amount }));

    const totalSpent = monthSpends.reduce((sum, spend) => sum + spend.amount, 0);
    const avgDaily = totalSpent / new Date().getDate();

    return { categoryTotals, sortedCategories, totalSpent, avgDaily };
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).toISOString().split('T')[0];
      days.push(date);
    }
    
    return days;
  };

  const getDayEmoji = (date: string) => {
    const dayTotal = getDayTotal(date);
    const daySpends = getDaySpends(date);
    
    if (dayTotal === 0) return '💰'; // No spending
    if (dayTotal > 100) return '🚨'; // High spending
    if (dayTotal > 50) return '⚠️'; // Medium spending
    if (daySpends.length > 5) return '🛒'; // Many transactions
    return '✅'; // Good spending day
  };

  const { sortedCategories, totalSpent, avgDaily } = getMonthlyAnalysis();
  const today = new Date().toISOString().split('T')[0];
  const selectedDaySpends = getDaySpends(selectedDate);
  const selectedDayTotal = getDayTotal(selectedDate);

  return (
    <div className="space-y-6">
      {/* Monthly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            📊 Monthly Spending Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total This Month</div>
              <div className="text-lg">{totalSpent > 2000 ? '😰' : totalSpent > 1000 ? '😐' : '😊'}</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold">${avgDaily.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Daily Average</div>
              <div className="text-lg">{avgDaily > 80 ? '🔥' : avgDaily > 40 ? '📈' : '👍'}</div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold">{sortedCategories.length}</div>
              <div className="text-sm text-muted-foreground">Categories Used</div>
              <div className="text-lg">🏷️</div>
            </div>
          </div>

          {/* Top Spending Categories */}
          {sortedCategories.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold">💸 Top Spending Categories</h4>
              {sortedCategories.slice(0, 3).map(({ category, amount }) => (
                <div key={category} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{categories[category as keyof typeof categories].emoji}</span>
                    <span className="capitalize">{category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">${amount.toFixed(2)}</span>
                    {amount > categories[category as keyof typeof categories].limit && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Smart Tips */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">💡 Smart Tips</h4>
            <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              {avgDaily > 60 && <div>• Try setting a daily spending limit of $50 💪</div>}
              {sortedCategories[0]?.category === 'food' && sortedCategories[0]?.amount > 300 && (
                <div>• Consider meal prepping to reduce food costs 🥗</div>
              )}
              {sortedCategories.find(c => c.category === 'entertainment')?.amount > 200 && (
                <div>• Look for free entertainment options like parks or libraries 🎪</div>
              )}
              {totalSpent < 800 && <div>• Great job staying under budget! You can afford to treat yourself 🎉</div>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>📅 Daily Spending Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-semibold text-sm">
                {day}
              </div>
            ))}
            {generateCalendarDays().map((date, index) => (
              <div key={index} className="aspect-square">
                {date ? (
                  <button
                    onClick={() => setSelectedDate(date)}
                    className={`w-full h-full p-1 rounded-lg border text-xs transition-all hover:scale-105 ${
                      date === selectedDate
                        ? 'bg-primary text-primary-foreground border-primary'
                        : date === today
                        ? 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700'
                        : 'bg-muted/30 border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="font-semibold">{new Date(date).getDate()}</div>
                    <div className="text-lg">{getDayEmoji(date)}</div>
                    <div className="font-bold text-xs">
                      ${getDayTotal(date).toFixed(0)}
                    </div>
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            ➕ Add Spending for {new Date(selectedDate).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <select
              value={newSpend.category}
              onChange={(e) => setNewSpend({ ...newSpend, category: e.target.value as any })}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              {Object.entries(categories).map(([key, { emoji }]) => (
                <option key={key} value={key}>
                  {emoji} {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
            <Input
              placeholder="Amount"
              type="number"
              value={newSpend.amount}
              onChange={(e) => setNewSpend({ ...newSpend, amount: e.target.value })}
            />
            <Input
              placeholder="What did you buy?"
              value={newSpend.description}
              onChange={(e) => setNewSpend({ ...newSpend, description: e.target.value })}
              className="md:col-span-1"
            />
            <Button onClick={addSpend} className="w-full">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Category Spending Limits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {Object.entries(categories).map(([key, { emoji, limit }]) => {
              const todaySpent = getDaySpends(today)
                .filter(spend => spend.category === key)
                .reduce((sum, spend) => sum + spend.amount, 0);
              const isOverLimit = todaySpent > limit;
              
              return (
                <div key={key} className={`p-2 rounded border text-center ${isOverLimit ? 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800' : 'bg-muted/30'}`}>
                  <div>{emoji} {key}</div>
                  <div className={`font-semibold ${isOverLimit ? 'text-red-600' : ''}`}>
                    ${todaySpent.toFixed(0)}/${limit}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      {selectedDaySpends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>📝 {new Date(selectedDate).toLocaleDateString()} Details</span>
              <Badge variant="outline">
                Total: ${selectedDayTotal.toFixed(2)} {selectedDayTotal > 60 ? '😅' : '😊'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedDaySpends.map((spend) => (
                <div key={spend.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{categories[spend.category].emoji}</span>
                    <div>
                      <div className="font-medium">{spend.description}</div>
                      <div className="text-sm text-muted-foreground capitalize">{spend.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">${spend.amount.toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSpend(spend.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailySpendingTracker;