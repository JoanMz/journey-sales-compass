
import AppLayout from "../components/layout/AppLayout";
import { useData } from "../contexts/DataContext";
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
  Bar
} from "recharts";

const Metrics = () => {
  const { sales, customers, metrics } = useData();
  
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Metrics & Analytics</h1>
        
        {/* Top stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalSales}</div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">+12.5%</span> vs last month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">+8.3%</span> vs last month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sales.length > 0 ? 
                  `${Math.round((sales.filter(s => s.status === 'Success').length / sales.length) * 100)}%` : 
                  '0%'
                }
              </div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">+2.1%</span> vs last month
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
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
