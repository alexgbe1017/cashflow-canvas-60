import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useState } from 'react';

const BudgetChart = () => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');

  // Sample data for the past 6 months
  const monthlyData = [
    { month: 'Aug', income: 4800, expenses: 3100, business: 3200, personal: 1600 },
    { month: 'Sep', income: 5200, expenses: 2900, business: 3500, personal: 1700 },
    { month: 'Oct', income: 4900, expenses: 3200, business: 3300, personal: 1600 },
    { month: 'Nov', income: 5500, expenses: 3000, business: 3700, personal: 1800 },
    { month: 'Dec', income: 6200, expenses: 3500, business: 4200, personal: 2000 },
    { month: 'Jan', income: 5500, expenses: 3200, business: 3500, personal: 2000 }
  ];

  // Data for pie chart (current month breakdown)
  const expenseCategories = [
    { name: 'Rent', value: 2800, color: 'hsl(var(--rent-color))' },
    { name: 'Subscriptions', value: 150, color: 'hsl(var(--primary))' },
    { name: 'Baby Supplies', value: 200, color: 'hsl(var(--savings-color))' },
    { name: 'Misc', value: 50, color: 'hsl(var(--misc-color))' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.dataKey}: ${item.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="hsl(var(--business-color))" 
                strokeWidth={3}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="hsl(var(--rent-color))" 
                strokeWidth={3}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="hsl(var(--business-color))" name="Income" />
              <Bar dataKey="expenses" fill="hsl(var(--rent-color))" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Financial Trends
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'bar' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'line' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`p-2 rounded-md transition-colors ${
                chartType === 'pie' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <PieChartIcon className="h-4 w-4" />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">
            {chartType === 'pie' ? 'Current Month Expense Breakdown' : 'Income vs Expenses (6 Months)'}
          </h3>
        </div>
        {renderChart()}
        
        {/* Chart Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          {chartType === 'pie' ? (
            expenseCategories.map((category, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <span>{category.name}: ${category.value.toLocaleString()}</span>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-business"></div>
                <span>Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rent"></div>
                <span>Expenses</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetChart;