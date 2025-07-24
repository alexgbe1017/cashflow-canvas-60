import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { PiggyBank, Target, TrendingUp, Plus, Minus } from 'lucide-react';

const SavingsTracker = () => {
  const [currentSavings, setCurrentSavings] = useState(32500);
  const [savingsGoal] = useState(35000);
  const [targetDate] = useState('2026-07-01');
  const [adjustmentAmount, setAdjustmentAmount] = useState('');

  const progressPercentage = (currentSavings / savingsGoal) * 100;
  const remainingAmount = savingsGoal - currentSavings;
  
  const calculateMonthsToGoal = () => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  };

  const monthlyTarget = remainingAmount > 0 ? remainingAmount / calculateMonthsToGoal() : 0;

  const adjustSavings = (amount: number) => {
    setCurrentSavings(prev => Math.max(0, prev + amount));
    setAdjustmentAmount('');
  };

  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'bg-paid';
    if (progressPercentage >= 80) return 'bg-business';
    if (progressPercentage >= 60) return 'bg-savings';
    return 'bg-primary';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-savings" />
          Savings Goal Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Progress */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">${currentSavings.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Current Savings</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-savings">${savingsGoal.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Goal by July 2026</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{progressPercentage.toFixed(1)}% Complete</span>
              <span>${remainingAmount > 0 ? remainingAmount.toLocaleString() : 0} remaining</span>
            </div>
            <Progress 
              value={Math.min(progressPercentage, 100)} 
              className="h-3"
            />
          </div>
        </div>

        {/* Monthly Target */}
        <div className="p-4 bg-savings/10 rounded-lg border border-savings/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-savings" />
            <span className="font-medium">Monthly Target</span>
          </div>
          <div className="text-xl font-bold text-savings">
            ${monthlyTarget > 0 ? monthlyTarget.toFixed(0) : '0'}
          </div>
          <div className="text-sm text-muted-foreground">
            {calculateMonthsToGoal()} months remaining
          </div>
        </div>

        {/* Progress Milestones */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold">25K</div>
            <div className="text-xs text-muted-foreground">Emergency Fund</div>
            <div className="text-xs mt-1">
              {currentSavings >= 25000 ? '✅' : `$${(25000 - currentSavings).toLocaleString()} to go`}
            </div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold">30K</div>
            <div className="text-xs text-muted-foreground">Safety Buffer</div>
            <div className="text-xs mt-1">
              {currentSavings >= 30000 ? '✅' : `$${(30000 - currentSavings).toLocaleString()} to go`}
            </div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold">35K</div>
            <div className="text-xs text-muted-foreground">Final Goal</div>
            <div className="text-xs mt-1">
              {currentSavings >= 35000 ? '🎉 Goal!' : `$${(35000 - currentSavings).toLocaleString()} to go`}
            </div>
          </div>
        </div>

        {/* Quick Adjustments */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Quick Adjustments</div>
          <div className="flex gap-2">
            <Input
              placeholder="Amount"
              type="number"
              value={adjustmentAmount}
              onChange={(e) => setAdjustmentAmount(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustmentAmount && adjustSavings(parseFloat(adjustmentAmount))}
              className="text-business border-business hover:bg-business hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustmentAmount && adjustSavings(-parseFloat(adjustmentAmount))}
              className="text-destructive border-destructive hover:bg-destructive hover:text-white"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Preset amounts */}
          <div className="flex gap-2 flex-wrap">
            {[100, 500, 1000, 2000].map(amount => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => adjustSavings(amount)}
                className="text-business border-business/50 hover:bg-business hover:text-white"
              >
                +${amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Status Message */}
        {currentSavings >= savingsGoal && (
          <div className="p-4 bg-paid/10 border border-paid/20 rounded-lg text-center">
            <div className="text-paid font-semibold">🎉 Congratulations!</div>
            <div className="text-sm text-muted-foreground">You've reached your savings goal!</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsTracker;