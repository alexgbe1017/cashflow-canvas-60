import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, TrendingUp, Calendar, Target, Menu, X, ShoppingCart } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

import ExpenseTracker from '@/components/ExpenseTracker';
import IncomeTracker from '@/components/IncomeTracker';
import DueDateTracker from '@/components/DueDateTracker';
import SavingsTracker from '@/components/SavingsTracker';
import MonthlyOverview from '@/components/MonthlyOverview';
import BudgetChart from '@/components/BudgetChart';
import DailySpendingTracker from '@/components/DailySpendingTracker';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'income', label: 'Income', icon: Wallet },
    { id: 'expenses', label: 'Expenses', icon: Calendar },
    { id: 'daily', label: 'Daily Spending', icon: ShoppingCart },
    { id: 'due-dates', label: 'Due Dates', icon: Calendar },
    { id: 'savings', label: 'Savings', icon: Target },
    { id: 'charts', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-primary to-business rounded-lg">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">💰 FinanceHub</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Personal & Business Finance Tracker
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-600 flex items-center gap-1">
                  $5,500 🚀
                </div>
                <div className="text-xs text-muted-foreground">Monthly Income</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-600 flex items-center gap-1">
                  $3,200 📊
                </div>
                <div className="text-xs text-muted-foreground">Monthly Expenses</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600 flex items-center gap-1">
                  $32.5K 🎯
                </div>
                <div className="text-xs text-muted-foreground">Current Savings</div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 bg-card border-r transition-transform lg:relative lg:top-0 lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Desktop Tab Navigation */}
            <div className="hidden lg:block">
              <TabsList className="grid w-full grid-cols-7">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <TabsTrigger key={item.id} value={item.id} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden xl:inline">{item.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            {/* Tab Content */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <MonthlyOverview />
                <BudgetChart />
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Net Cashflow</span>
                      <span className="font-semibold text-business">$2,300</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Savings Rate</span>
                      <span className="font-semibold text-savings">42%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Goal Progress</span>
                      <span className="font-semibold text-primary">93%</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Upcoming Bills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Rent</span>
                        <span className="text-rent">Feb 1st</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credit Card</span>
                        <span className="text-unpaid">Jan 30th</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subscriptions</span>
                        <span className="text-muted-foreground">Various</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Days Remaining</span>
                        <span className="font-semibold">15</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Budget Used</span>
                        <span className="font-semibold text-business">58%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bills Paid</span>
                        <span className="font-semibold text-paid">3/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="income">
              <IncomeTracker />
            </TabsContent>

            <TabsContent value="expenses">
              <ExpenseTracker />
            </TabsContent>

            <TabsContent value="daily">
              <DailySpendingTracker />
            </TabsContent>

            <TabsContent value="due-dates">
              <DueDateTracker />
            </TabsContent>

            <TabsContent value="savings">
              <SavingsTracker />
            </TabsContent>

            <TabsContent value="charts">
              <BudgetChart />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;