import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';

const MonthlyOverview = () => {
  const { totalIncome, totalExpenses, businessIncome, personalIncome } = useFinancialData();
  
  // Calculate derived values
  const fixedExpenses = totalExpenses * 0.85; // Estimate 85% fixed
  const variableExpenses = totalExpenses * 0.15; // Estimate 15% variable
  const savings = totalIncome - totalExpenses;
  
  const monthlyData = {
    totalIncome,
    totalExpenses,
    businessIncome,
    personalIncome,
    fixedExpenses,
    variableExpenses,
    savings,
    currentMonth: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  };

  const netCashflow = monthlyData.totalIncome - monthlyData.totalExpenses;
  const savingsRate = (monthlyData.savings / monthlyData.totalIncome) * 100;
  const businessMargin = ((monthlyData.businessIncome - 1500) / monthlyData.businessIncome) * 100; // Assuming $1500 business expenses

  const getNetCashflowColor = () => {
    if (netCashflow > 2000) return 'text-paid';
    if (netCashflow > 1000) return 'text-business';
    if (netCashflow > 0) return 'text-savings';
    return 'text-destructive';
  };

  const getBadgeVariant = (value: number, thresholds: { good: number; ok: number }) => {
    if (value >= thresholds.good) return 'bg-paid text-white';
    if (value >= thresholds.ok) return 'bg-savings text-white';
    return 'bg-unpaid text-white';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Overview
          </span>
          <Badge variant="outline" className="text-xs">
            {monthlyData.currentMonth}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Income</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              ${monthlyData.totalIncome.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Total Expenses</span>
            </div>
            <div className="text-2xl font-bold text-destructive">
              ${monthlyData.totalExpenses.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Net Cashflow</span>
            </div>
            <div className={`text-2xl font-bold ${getNetCashflowColor()}`}>
              ${netCashflow.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-savings/5 rounded-lg border border-savings/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-savings" />
              <span className="text-sm font-medium">Savings Rate</span>
            </div>
            <div className="text-2xl font-bold text-savings">
              {savingsRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Income Breakdown */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Income Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-business/10 rounded-lg border border-business/20">
              <div>
                <div className="font-medium">Business Income</div>
                <div className="text-sm text-muted-foreground">Clothing brand sales</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-business">
                  ${monthlyData.businessIncome.toLocaleString()}
                </div>
                <Badge className={getBadgeVariant(businessMargin, { good: 50, ok: 30 })}>
                  {businessMargin.toFixed(0)}% margin
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-personal/10 rounded-lg border border-personal/20">
              <div>
                <div className="font-medium">Personal Income</div>
                <div className="text-sm text-muted-foreground">Side hustles & refunds</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-personal">
                  ${monthlyData.personalIncome.toLocaleString()}
                </div>
                <Badge variant="outline" className="text-xs">
                  Supplemental
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Expense Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-rent/10 rounded-lg border border-rent/20">
              <div>
                <div className="font-medium">Fixed Expenses</div>
                <div className="text-sm text-muted-foreground">Rent, subscriptions</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-rent">
                  ${monthlyData.fixedExpenses.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {((monthlyData.fixedExpenses / monthlyData.totalIncome) * 100).toFixed(0)}% of income
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-misc/10 rounded-lg border border-misc/20">
              <div>
                <div className="font-medium">Variable Expenses</div>
                <div className="text-sm text-muted-foreground">Baby supplies, misc</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-misc">
                  ${monthlyData.variableExpenses.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {((monthlyData.variableExpenses / monthlyData.totalIncome) * 100).toFixed(0)}% of income
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="p-4 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold mb-3">Quick Insights</h3>
          <div className="space-y-2 text-sm">
            {netCashflow > 2000 && (
              <div className="flex items-center gap-2 text-paid">
                <div className="w-2 h-2 bg-paid rounded-full"></div>
                Excellent cashflow! Consider increasing savings or business investment.
              </div>
            )}
            
            {savingsRate >= 40 && (
              <div className="flex items-center gap-2 text-business">
                <div className="w-2 h-2 bg-business rounded-full"></div>
                Outstanding savings rate! You're on track for your July 2026 goal.
              </div>
            )}
            
            {monthlyData.fixedExpenses / monthlyData.totalIncome > 0.5 && (
              <div className="flex items-center gap-2 text-unpaid">
                <div className="w-2 h-2 bg-unpaid rounded-full"></div>
                Fixed expenses are high. Consider ways to reduce recurring costs.
              </div>
            )}
            
            {businessMargin < 30 && (
              <div className="flex items-center gap-2 text-destructive">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                Business margins could improve. Review ad spend and costs.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyOverview;