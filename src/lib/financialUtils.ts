import { Transaction } from "@/types/transactions";

export const calculateTotalRevenue = (transactions: Transaction[]): number => {
  return transactions
    .filter(
      (transaction) =>
        transaction.status === "approved" || transaction.status === "terminado"
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateTotalProfit = (totalRevenue: number): number => {
  return totalRevenue * 0.15; // 15% profit margin
};

export const calculateTotalCommission = (transactions: Transaction[]): any => {
  const VALUE = transactions
    .filter(
      (transaction) =>
        transaction.status === "approved" || transaction.status === "terminado"
    )
    .reduce((total, transaction) => total + transaction.amount * 0.0225, 0); // 2.25% commission

  // return VALUE;
  return VALUE.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
  });
};

export const calculateCommissionByVendor = (transactions: Transaction[]) => {
  const vendorMap = new Map<
    number,
    {
      sellerId: number;
      sellerName: string;
      sales: number;
      commission: number;
    }
  >();

  transactions
    .filter((transaction) => transaction.status === "approved")
    .forEach((transaction) => {
      const sellerId = transaction.seller_id;
      const amount = transaction.amount;
      const commission = amount * 0.0225;

      if (vendorMap.has(sellerId)) {
        const vendor = vendorMap.get(sellerId)!;
        vendor.sales += amount;
        vendor.commission += commission;
      } else {
        vendorMap.set(sellerId, {
          sellerId,
          sellerName: transaction.seller_name,
          sales: amount,
          commission,
        });
      }
    });

  return Object.fromEntries(vendorMap);
};

export const filterTransactionsByPeriod = (
  transactions: Transaction[],
  period: "fortnight" | "month" | "all"
): Transaction[] => {
  if (period === "all") return transactions;

  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "fortnight":
      startDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      break;
    default:
      return transactions;
  }

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.start_date);
    return transactionDate >= startDate;
  });
};

// Función para obtener las fechas de inicio y fin de una quincena
export const getQuincenaDates = (year: number, month: number, quincena: 1 | 2) => {
  const startDate = new Date(year, month - 1, quincena === 1 ? 1 : 16);
  const endDate = new Date(year, month - 1, quincena === 1 ? 15 : new Date(year, month, 0).getDate());
  endDate.setHours(23, 59, 59, 999); // Fin del día
  
  const result = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
  
  console.log('🔍 === DEBUG FECHAS QUINCENA ===');
  console.log('🔍 Año:', year, 'Mes:', month, 'Quincena:', quincena);
  console.log('🔍 Fecha inicio calculada:', startDate.toLocaleString('es-CO'));
  console.log('🔍 Fecha fin calculada:', endDate.toLocaleString('es-CO'));
  console.log('🔍 Fecha inicio ISO:', result.startDate);
  console.log('🔍 Fecha fin ISO:', result.endDate);
  console.log('🔍 === FIN DEBUG FECHAS QUINCENA ===');
  
  return result;
};

// Función para obtener todas las quincenas del año actual
export const getCurrentYearQuincenas = () => {
  const currentYear = new Date().getFullYear();
  const quincenas = [];
  
  for (let month = 1; month <= 12; month++) {
    for (let quincena = 1; quincena <= 2; quincena++) {
      const dates = getQuincenaDates(currentYear, month, quincena as 1 | 2);
      quincenas.push({
        year: currentYear,
        month,
        quincena,
        startDate: dates.startDate,
        endDate: dates.endDate,
        label: `Q${quincena} - ${new Date(currentYear, month - 1).toLocaleDateString('es-CO', { month: 'long' })} ${currentYear}`
      });
    }
  }
  
  return quincenas;
};

// Función para calcular comisiones quincenales de un seller
export const calculateQuincenalCommission = async (
  sellerId: number, 
  startDate: string, 
  endDate: string
): Promise<{ total: number; formatted: string; transactions: Transaction[] }> => {
  try {
    const { endpoints } = await import('./endpoints');
    const url = endpoints.transactions.filterMixed(sellerId, 'approved', startDate, endDate);
    
    console.log('🔍 === DEBUG COMISIONES QUINCENALES ===');
    console.log('🔍 Seller ID:', sellerId);
    console.log('🔍 URL completa:', url);
    console.log('🔍 Fecha inicio:', startDate);
    console.log('🔍 Fecha fin:', endDate);
    console.log('🔍 Fecha inicio (formato legible):', new Date(startDate).toLocaleString('es-CO'));
    console.log('🔍 Fecha fin (formato legible):', new Date(endDate).toLocaleString('es-CO'));
    
    const response = await fetch(url);
    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response ok:', response.ok);
    console.log('🔍 Response headers:', response.headers);
    
    if (!response.ok) {
      console.error('❌ Error fetching quincenal transactions:', response.status);
      console.error('❌ Error text:', await response.text());
      return { total: 0, formatted: 'COP 0', transactions: [] };
    }
    
    const data = await response.json();
    console.log('🔍 Respuesta completa del endpoint:', data);
    console.log('🔍 Tipo de data:', typeof data);
    console.log('🔍 Es array?', Array.isArray(data));
    console.log('🔍 Longitud del array:', Array.isArray(data) ? data.length : 'No es array');
    console.log('🔍 JSON.stringify completo:', JSON.stringify(data, null, 2));
    
    // Asegurar que data sea un array
    const transactions = Array.isArray(data) ? data : [];
    console.log('🔍 Transacciones encontradas:', transactions.length);
    
    if (transactions.length > 0) {
      console.log('🔍 Detalle de transacciones:');
      transactions.forEach((transaction, index) => {
        console.log(`🔍 Transacción ${index + 1}:`, {
          id: transaction.id,
          amount: transaction.amount,
          status: transaction.status,
          seller_id: transaction.seller_id,
          start_date: transaction.start_date,
          created_at: transaction.created_at
        });
      });
    }
    
    // Calcular comisión (2.25%)
    const total = transactions.reduce((sum, transaction) => {
      const commission = transaction.amount * 0.0225;
      console.log(`🔍 Comisión para transacción ${transaction.id}: $${transaction.amount} * 0.0225 = $${commission}`);
      return sum + commission;
    }, 0);
    
    const formatted = total.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
    
    console.log('🔍 Total de comisiones calculado:', total);
    console.log('🔍 Total formateado:', formatted);
    console.log('🔍 === FIN DEBUG COMISIONES QUINCENALES ===');
    
    return { total, formatted, transactions };
    
  } catch (error) {
    console.error('❌ Error calculating quincenal commission:', error);
    return { total: 0, formatted: 'COP 0', transactions: [] };
  }
};

// Función para calcular comisiones quincenales de todos los sellers
export const calculateAllSellersQuincenalCommissions = async (
  sellers: { id: number; name: string }[],
  startDate: string,
  endDate: string
): Promise<Array<{
  sellerId: number;
  sellerName: string;
  commission: number;
  formatted: string;
  transactionCount: number;
}>> => {
  const results = [];
  
  for (const seller of sellers) {
    const result = await calculateQuincenalCommission(seller.id, startDate, endDate);
    results.push({
      sellerId: seller.id,
      sellerName: seller.name,
      commission: result.total,
      formatted: result.formatted,
      transactionCount: result.transactions.length
    });
  }
  
  return results;
};
