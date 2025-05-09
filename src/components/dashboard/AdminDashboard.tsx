
import React from "react";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import TopDestinationsCard from "./TopDestinationsCard";
import CombinedPlansLeaderboardCard from "./CombinedPlansLeaderboardCard";
import PendingTransactions from "../admin/PendingTransactions";

const AdminDashboard = () => {
  const { weeklyData, sales, metrics } = useData();
  
  // Calculate metrics specific for admin view
  const unansweredMessages = 35;
  const salesInProgress = sales.filter(sale => sale.status === "On Process").length;
  const completedSales = sales.filter(sale => sale.status === "Success").length;
  const sellerHighlightCount = 20;
  const sellerHighlight = "Selia";

  return (
    <div className="space-y-6">
      {/* Pending Transactions Section - Added at the top for visibility */}
      <PendingTransactions />
      
      <Card className="bg-blue-50 border-blue-200 mb-6">
        <CardHeader className="pb-2 border-b border-blue-200">
          <CardTitle className="text-blue-700">Sales Metrics Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-blue-700 mb-3">
            Welcome to the administration metrics dashboard. Here you can monitor all sales activity.
          </p>
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white border border-blue-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm text-gray-500 text-center">
                  # mensajes sin responder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center">{unansweredMessages}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-blue-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm text-gray-500 text-center">
                  # ventas en progreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center">{salesInProgress}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-blue-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm text-gray-500 text-center">
                  # ventas hechas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">{completedSales}</div>
                  <div className="text-sm text-green-500">{sellerHighlightCount} de {sellerHighlight}</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Weekly Sales Chart */}
          <div className="bg-white p-4 rounded-md border border-blue-200 mb-6">
            <h3 className="text-lg font-medium mb-2">ventas</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    labelFormatter={(label) => `${label}`}
                    cursor={{fill: 'rgba(0, 0, 0, 0.05)'}}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#4F46E5"
                    radius={[5, 5, 0, 0]} 
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Top Destinations and Combined Plans & Leaderboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Destinations */}
            <TopDestinationsCard />

            {/* Combined Plans & Leaderboard */}
            <CombinedPlansLeaderboardCard />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
