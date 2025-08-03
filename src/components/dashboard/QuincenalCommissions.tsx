import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Users, User } from 'lucide-react';
import { 
  getCurrentYearQuincenas, 
  calculateQuincenalCommission,
  calculateAllSellersQuincenalCommissions 
} from '@/lib/financialUtils';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/hooks/useTransactions';

interface QuincenalCommissionsProps {
  sellers?: { id: number; name: string }[];
}

export const QuincenalCommissions: React.FC<QuincenalCommissionsProps> = ({ sellers = [] }) => {
  const { user, isAdmin } = useAuth();
  const { filteredTransactions } = useTransactions();
  const [selectedQuincena, setSelectedQuincena] = useState<string>('');
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [quincenas] = useState(getCurrentYearQuincenas());

  // Obtener lista de vendedores únicos de las transacciones
  const getUniqueSellers = () => {
    const sellerMap = new Map<number, string>();
    
    filteredTransactions.forEach(transaction => {
      if (transaction.seller_id && transaction.seller_name) {
        sellerMap.set(transaction.seller_id, transaction.seller_name);
      }
    });
    
    return Array.from(sellerMap.entries()).map(([id, name]) => ({ id, name }));
  };

  const uniqueSellers = getUniqueSellers();

  // Seleccionar la quincena actual por defecto
  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const currentQuincena = currentDay <= 15 ? 1 : 2;
    
    const currentQuincenaKey = `${now.getFullYear()}-${currentMonth.toString().padStart(2, '0')}-${currentQuincena}`;
    setSelectedQuincena(currentQuincenaKey);
  }, []);

  const calculateCommissions = async () => {
    if (!selectedQuincena) return;

    setLoading(true);
    try {
      const [year, month, quincena] = selectedQuincena.split('-');
      const quincenaData = quincenas.find(q => 
        q.year === parseInt(year) && 
        q.month === parseInt(month) && 
        q.quincena === parseInt(quincena)
      );

      if (!quincenaData) {
        console.error('Quincena no encontrada');
        return;
      }

      let results = [];

      if (isAdmin) {
        if (selectedSeller && selectedSeller !== 'all') {
          // Calcular solo para el vendedor seleccionado
          const sellerId = parseInt(selectedSeller);
          const seller = uniqueSellers.find(s => s.id === sellerId);
          if (seller) {
            const result = await calculateQuincenalCommission(
              sellerId,
              quincenaData.startDate,
              quincenaData.endDate
            );
            results = [{
              sellerId: seller.id,
              sellerName: seller.name,
              commission: result.total,
              formatted: result.formatted,
              transactionCount: result.transactions.length
            }];
          }
        } else {
          // Calcular para todos los vendedores
          results = await calculateAllSellersQuincenalCommissions(
            uniqueSellers,
            quincenaData.startDate,
            quincenaData.endDate
          );
        }
      } else if (user?.id) {
        // Calcular solo para el seller logueado
        const result = await calculateQuincenalCommission(
          user.id,
          quincenaData.startDate,
          quincenaData.endDate
        );
        results = [{
          sellerId: user.id,
          sellerName: user.name,
          commission: result.total,
          formatted: result.formatted,
          transactionCount: result.transactions.length
        }];
      }

      setCommissions(results);
    } catch (error) {
      console.error('Error calculating commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedQuincena) {
      calculateCommissions();
    }
  }, [selectedQuincena, selectedSeller]);

  const getQuincenaLabel = (key: string) => {
    const [year, month, quincena] = key.split('-');
    const quincenaData = quincenas.find(q => 
      q.year === parseInt(year) && 
      q.month === parseInt(month) && 
      q.quincena === parseInt(quincena)
    );
    return quincenaData?.label || key;
  };

  const totalCommission = commissions.reduce((sum, c) => sum + c.commission, 0);
  const totalTransactions = commissions.reduce((sum, c) => sum + c.transactionCount, 0);

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-2 border-b border-blue-200">
        <CardTitle className="text-blue-700 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Comisiones Quincenales
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <Select value={selectedQuincena} onValueChange={setSelectedQuincena}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Seleccionar quincena" />
              </SelectTrigger>
              <SelectContent>
                {quincenas.map((quincena) => (
                  <SelectItem 
                    key={`${quincena.year}-${quincena.month.toString().padStart(2, '0')}-${quincena.quincena}`}
                    value={`${quincena.year}-${quincena.month.toString().padStart(2, '0')}-${quincena.quincena}`}
                  >
                    {quincena.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Filtro por vendedor solo para administradores */}
            {isAdmin && (
              <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Seleccionar vendedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Todos los vendedores
                  </SelectItem>
                  {uniqueSellers.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id.toString()}>
                      {seller.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Button 
              onClick={calculateCommissions} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Calculando...' : 'Recalcular'}
            </Button>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-md border border-blue-200 flex items-center">
              <DollarSign className="h-10 w-10 text-blue-500 mr-3" />
              <div>
                <div className="font-semibold text-blue-700">Total Comisiones Quincenales</div>
                <div className="text-2xl font-bold text-blue-600">
                  {totalCommission.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}
                </div>
                <div className="text-sm text-blue-500">2.25% por venta aprobada en la quincena</div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-blue-200 flex items-center">
              <Users className="h-10 w-10 text-blue-500 mr-3" />
              <div>
                <div className="font-semibold text-blue-700">Sellers con Ventas</div>
                <div className="text-2xl font-bold text-blue-600">{commissions.length}</div>
                <div className="text-sm text-blue-500">Con ventas aprobadas en la quincena</div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md border border-blue-200 flex items-center">
              <Calendar className="h-10 w-10 text-blue-500 mr-3" />
              <div>
                <div className="font-semibold text-blue-700">Ventas Aprobadas</div>
                <div className="text-2xl font-bold text-blue-600">{totalTransactions}</div>
                <div className="text-sm text-blue-500">Transacciones aprobadas en la quincena</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de comisiones por seller */}
        <div className="space-y-3">
          <h3 className="font-semibold text-blue-700 mb-3">
            Comisiones Quincenales por Seller - {getQuincenaLabel(selectedQuincena)}
            {isAdmin && selectedSeller && selectedSeller !== 'all' && (
              <span className="text-sm text-blue-500 ml-2">
                (Filtrado por vendedor)
              </span>
            )}
          </h3>
          
          {loading ? (
            <div className="text-center py-8 text-blue-500">Calculando comisiones...</div>
          ) : commissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay comisiones para esta quincena
            </div>
          ) : (
            commissions.map((commission) => (
              <div
                key={commission.sellerId}
                className="bg-white p-4 rounded-md border border-blue-200 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    {commission.sellerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700">{commission.sellerName}</h4>
                    <div className="text-sm text-blue-500">
                      {commission.transactionCount} venta{commission.transactionCount !== 1 ? 's' : ''} aprobada{commission.transactionCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {commission.formatted}
                  </div>
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    Comisión Quincenal 2.25%
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 