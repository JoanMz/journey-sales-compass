
import React from "react";
import { useData } from "../../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import TopDestinationsCard from "./TopDestinationsCard";
import CombinedPlansLeaderboardCard from "./CombinedPlansLeaderboardCard";
import PendingTransactions from "../admin/PendingTransactions";
import KeyMetricsCard from "../bi/KeyMetricsCard";
import TravelMap from "../bi/TravelMap";
import TransaccionesClientes from "./TransaccionesClientes";
import { TrendingUp, Users, CreditCard } from "lucide-react";

// Sample data for the map
const destinations = [
  { name: "Cancún", lat: 21.1619, lng: -86.8515, popularity: 85 },
  { name: "Ciudad de México", lat: 19.4326, lng: -99.1332, popularity: 72 },
  { name: "Guanajuato", lat: 21.0190, lng: -101.2574, popularity: 65 },
  { name: "Los Cabos", lat: 22.8905, lng: -109.9167, popularity: 80 },
  { name: "Puerto Vallarta", lat: 20.6534, lng: -105.2253, popularity: 75 },
  { name: "Riviera Maya", lat: 20.6274, lng: -87.0799, popularity: 90 },
  { name: "Oaxaca", lat: 17.0732, lng: -96.7266, popularity: 60 },
  { name: "Acapulco", lat: 16.8531, lng: -99.8237, popularity: 55 }
];

const origins = [
  { name: "Nueva York", lat: 40.7128, lng: -74.0060, count: 120 },
  { name: "Los Ángeles", lat: 34.0522, lng: -118.2437, count: 95 },
  { name: "Chicago", lat: 41.8781, lng: -87.6298, count: 75 },
  { name: "Madrid", lat: 40.4168, lng: -3.7038, count: 60 },
  { name: "Londres", lat: 51.5074, lng: -0.1278, count: 85 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832, count: 70 }
];

const AdminDashboard = () => {
  const { weeklyData, sales, metrics } = useData();
  
  // Calculate metrics specific for admin view
  const mensajesSinResponder = 35;
  const ventasEnProgreso = sales.filter(sale => sale.status === "On Process").length;
  const ventasCompletadas = sales.filter(sale => sale.status === "Success").length;
  const vendedorDestacadoCount = 20;
  const vendedorDestacado = "Selia";

  // Key metrics data
  const keyMetricsData = [
    { 
      id: "revenue", 
      name: "Ingresos Totales", 
      value: `$${metrics.totalRevenue.toLocaleString()}`, 
      change: 12.5, 
      changeTimeframe: "vs mes anterior",
      icon: TrendingUp
    },
    { 
      id: "visitors", 
      name: "Visitantes", 
      value: "45,650", 
      change: 8.2, 
      changeTimeframe: "vs mes anterior",
      icon: Users
    },
    { 
      id: "avgSpend", 
      name: "Gasto Promedio", 
      value: "$3,250", 
      change: 5.1, 
      changeTimeframe: "vs mes anterior",
      icon: CreditCard
    }
  ];

  return (
    <div className="space-y-6">
      {/* Transacciones Pendientes - Prioridad alta */}
      <PendingTransactions />
      
      {/* Panel Principal */}
      <Card className="bg-white border-blue-200 mb-6">
        <CardHeader className="pb-2 border-b border-blue-200">
          <CardTitle className="text-blue-700">Panel de Control de Ventas</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-blue-700 mb-3">
            Bienvenido al panel de administración de métricas. Aquí puede monitorear toda la actividad de ventas.
          </p>
          
          {/* Métricas Principales */}
          <KeyMetricsCard metrics={keyMetricsData} />
          
          {/* Mapa Interactivo de Viajes */}
          <div className="my-6">
            <TravelMap destinations={destinations} origins={origins} />
          </div>
          
          {/* Estadísticas de Ventas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white border border-blue-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm text-gray-500 text-center">
                  Mensajes sin responder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center">{mensajesSinResponder}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-blue-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm text-gray-500 text-center">
                  Ventas en progreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center">{ventasEnProgreso}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-blue-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm text-gray-500 text-center">
                  Ventas completadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">{ventasCompletadas}</div>
                  <div className="text-sm text-green-500">{vendedorDestacadoCount} de {vendedorDestacado}</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabla de Transacciones de Clientes */}
          <div className="mb-6">
            <TransaccionesClientes sales={sales} />
          </div>
          
          {/* Gráfico de Ventas Semanales */}
          <div className="bg-white p-4 rounded-md border border-blue-200 mb-6">
            <h3 className="text-lg font-medium mb-2">Ventas Semanales</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Ingresos']}
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
          
          {/* Destinos Principales y Planes & Ranking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopDestinationsCard />
            <CombinedPlansLeaderboardCard />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
