import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import PendingTransactions from "../components/admin/PendingTransactions";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart, 
  Area
} from "recharts";

const Metrics = () => {
  const { sales, customers, metrics } = useData();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to home if not admin
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);
  
  // If not admin, don't render the page content
  if (!isAdmin) {
    return null;
  }

  // Calculate sales by status
  const salesByStatus = [
    { 
      name: 'Success', 
      value: sales.filter(sale => sale.status === 'Success').length 
    },
    { 
      name: 'On Process', 
      value: sales.filter(sale => sale.status === 'On Process').length 
    },
    { 
      name: 'Canceled', 
      value: sales.filter(sale => sale.status === 'Canceled').length 
    }
  ];
  
  // Calculate monthly sales trend (mock data for now)
  const monthlySalesTrend = [
    { month: 'Jan', sales: 1200, customers: 12 },
    { month: 'Feb', sales: 1900, customers: 18 },
    { month: 'Mar', sales: 1700, customers: 15 },
    { month: 'Apr', sales: 2100, customers: 20 },
    { month: 'May', sales: 2400, customers: 22 },
    { month: 'Jun', sales: 1800, customers: 17 },
  ];

  // Calculate top packages
  const packageCount: Record<string, { count: number, revenue: number }> = {};
  sales.forEach(sale => {
    if (!packageCount[sale.package]) {
      packageCount[sale.package] = { count: 0, revenue: 0 };
    }
    packageCount[sale.package].count += 1;
    if (sale.status === 'Success') {
      packageCount[sale.package].revenue += sale.amount;
    }
  });

  const topPackages = Object.entries(packageCount)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Colors for the pie chart
  const COLORS = ['#4ade80', '#0ea5e9', '#f87171'];

  // Weekly income data
  const weeklyIncomeData = [
    { day: 'Sun', value: 1850 },
    { day: 'Mon', value: 2100 },
    { day: 'Tue', value: 1900 },
    { day: 'Wed', value: 1600, today: true },
    { day: 'Thu', value: 2200 },
    { day: 'Fri', value: 1800 },
    { day: 'Sat', value: 2000 }
  ];

  // Social source data
  const socialSourceData = { 
    website: 2300,
    ecommerce: 3304,
    instagram: 443,
    travelSales: 18378
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Métricas y Analíticas</h1>
        
        {/* Pending Transactions Section - Added at the top for visibility */}
        <div className="mb-6">
          <PendingTransactions />
        </div>
        
        {/* Admin-specific metrics section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Income ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$210'600.000</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">nr ventas hechas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Profit aproximado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$60'900.000</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Meta de ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">60</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Income Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
            <CardDescription>
              Total income in week: <span className="text-green-500 font-medium">$10,823.43</span> <span className="text-green-500 text-xs">+2.32%</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyIncomeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-blue-900 text-white p-2 rounded text-sm">
                            {data.today && <div className="font-medium">Today</div>}
                            <div>${data.value}</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3b82f6" 
                    radius={[5, 5, 0, 0]}
                    maxBarSize={30}
                  >
                    {weeklyIncomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.today ? '#0f172a' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Social Source Card */}
        <Card>
          <CardHeader>
            <CardTitle>Social Source</CardTitle>
            <CardDescription>Total traffic in a week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Website</p>
                  <p className="text-xl font-semibold">{socialSourceData.website}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">E-Commerce</p>
                  <p className="text-xl font-semibold">{socialSourceData.ecommerce}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Instagram</p>
                  <p className="text-xl font-semibold">{socialSourceData.instagram}</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-48 w-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Website', value: socialSourceData.website },
                          { name: 'E-Commerce', value: socialSourceData.ecommerce },
                          { name: 'Instagram', value: socialSourceData.instagram },
                          { name: 'Travel Sales', value: socialSourceData.travelSales }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        <Cell fill="#4338ca" />
                        <Cell fill="#0284c7" />
                        <Cell fill="#7c3aed" />
                        <Cell fill="#0f766e" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-gray-500 text-xs">Travel Sales</p>
                    <p className="font-semibold text-lg">${socialSourceData.travelSales.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-indigo-100 text-indigo-700 text-xs font-medium px-4 py-2 rounded-full">
                See Details
              </button>
            </div>
          </CardContent>
        </Card>
        
        {/* Original charts - keep them as they provide additional insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sales by Status */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Sales by Status</CardTitle>
              <CardDescription>Distribution of sales across different statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {salesByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Monthly Trends */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Sales and customer acquisition trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlySalesTrend}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#9b87f5" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Packages */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Top Travel Packages</CardTitle>
              <CardDescription>Most popular and highest revenue generating packages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topPackages}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#9b87f5" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#9b87f5" />
                    <Bar yAxisId="right" dataKey="count" name="Number of Sales" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Geographic Distribution - Using a placeholder for now */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Geographic Distribution</CardTitle>
            <CardDescription>Where your customers are located</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="relative h-96 w-full bg-gray-100 rounded-md flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-2">World map visualization would be displayed here</p>
                <p className="text-sm text-gray-400">Connect to a mapping service to enable this feature</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Metrics;
