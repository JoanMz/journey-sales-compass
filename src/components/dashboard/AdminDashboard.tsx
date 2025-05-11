
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

// Updated sample data for the map with Colombia as focus
const destinations = [
  { name: "París", lat: 48.8566, lng: 2.3522, popularity: 85 },
  { name: "Tokio", lat: 35.6762, lng: 139.6503, popularity: 72 },
  { name: "Cairo", lat: 30.0444, lng: 31.2357, popularity: 65 },
  { name: "Barcelona", lat: 41.3851, lng: 2.1734, popularity: 80 },
  { name: "Bali", lat: -8.3405, lng: 115.0920, popularity: 75 },
  { name: "Bogotá", lat: 4.7110, lng: -74.0721, popularity: 90 },
  { name: "Medellín", lat: 6.2442, lng: -75.5812, popularity: 60 },
  { name: "Cali", lat: 3.4516, lng: -76.5320, popularity: 55 },
  { name: "Cartagena", lat: 10.3997, lng: -75.5144, popularity: 70 }
];

const origins = [
  { name: "Bogotá", lat: 4.7110, lng: -74.0721, count: 120 },
  { name: "Medellín", lat: 6.2442, lng: -75.5812, count: 95 },
  { name: "Cali", lat: 3.4516, lng: -76.5320, count: 75 },
  { name: "Cartagena", lat: 10.3997, lng: -75.5144, count: 60 },
  { name: "Barranquilla", lat: 10.9639, lng: -74.7964, count: 85 },
  { name: "Bucaramanga", lat: 7.1254, lng: -73.1198, count: 70 }
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
