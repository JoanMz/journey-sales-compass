import React from "react";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import TopDestinationsCard from "./TopDestinationsCard";

const AdminDashboard = () => {
  const { weeklyData, sales, metrics } = useData();
  
  // Calculate metrics specific for admin view
  const unansweredMessages = 35;
  const salesInProgress = sales.filter(sale => sale.status === "On Process").length;
  const completedSales = sales.filter(sale => sale.status === "Success").length;
  const sellerHighlightCount = 20;
  const sellerHighlight = "Selia";
  
  // Top destinations
  const topDestinations = [
    { name: "Plan terrestre Santamarta", value: 12 },
    { name: "Plan Migración España", value: 8 },
  ];

  return (
    <div className="space-y-6">
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
          
          {/* Top Destinations and Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Destinations */}
            <TopDestinationsCard />

            {/* Top Plans */}
            <Card className="bg-white border border-blue-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-lg">top planes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {topDestinations.map((destination, index) => (
                    <li key={index} className="p-2 border-b border-gray-100">
                      <div className="font-medium">{destination.name}</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Seller Leaderboard */}
          <div className="mt-6">
            <Card className="bg-white border border-blue-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-lg flex justify-between">
                  <span>Seller Leaderboard</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">PROMOTION ZONE</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-4 text-white">
                  <div className="text-center mb-4">
                    <div className="text-sm">You finished #3 last week</div>
                    <div className="flex justify-center space-x-4 my-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">2</div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-300 rounded-full"></div>
                      </div>
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">1</div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-300 rounded-full"></div>
                      </div>
                      <div className="relative">
                        <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">3</div>
                      </div>
                    </div>
                  </div>
                  
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center p-1">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">S</div>
                        <span>Sophie Lozanos</span>
                      </div>
                      <span>$45.5K</span>
                    </li>
                    <li className="flex justify-between items-center p-1">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">N</div>
                        <span>Nayeli</span>
                      </div>
                      <span>$32K</span>
                    </li>
                    <li className="flex justify-between items-center p-1 bg-gray-800 rounded">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">A</div>
                        <span>Andrea</span>
                      </div>
                      <span>$27K</span>
                    </li>
                    <li className="flex justify-between items-center p-1">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">V</div>
                        <span>Victoria</span>
                      </div>
                      <span>$20K</span>
                    </li>
                    <li className="flex justify-between items-center p-1">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">M</div>
                        <span>Mayra</span>
                      </div>
                      <span>$19K</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
