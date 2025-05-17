
import { Transaction } from "../types/transactions";

export const calculateTotalRevenue = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateTotalProfit = (revenue: number): number => {
  // 15% of total revenue as profit
  return revenue * 0.15;
};

export const calculateTotalCommission = (transactions: Transaction[]): number => {
  // Total commission to be paid to salesmen
  return transactions.reduce((total, transaction) => {
    // 2.25% commission rate for each transaction
    return total + (transaction.amount * 0.0225);
  }, 0);
};

export const filterTransactionsByPeriod = (
  transactions: Transaction[],
  period: "fortnight" | "month" | "all"
): Transaction[] => {
  if (period === "all") return transactions;

  const currentDate = new Date();
  let startDate: Date;

  if (period === "fortnight") {
    // Last 15 days
    startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 15);
  } else {
    // Last 30 days
    startDate = new Date(currentDate);
    startDate.setMonth(currentDate.getMonth() - 1);
  }

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.start_date);
    return transactionDate >= startDate && transactionDate <= currentDate;
  });
};

export const calculateCommissionByVendor = (transactions: Transaction[]): Record<string, { sellerId: number, sellerName: string, commission: number, sales: number }> => {
  const vendorCommissions: Record<string, { sellerId: number, sellerName: string, commission: number, sales: number }> = {};

  transactions.forEach(transaction => {
    const { seller_id, seller_name, amount } = transaction;
    const key = `${seller_id}`;
    
    if (!vendorCommissions[key]) {
      vendorCommissions[key] = {
        sellerId: seller_id,
        sellerName: seller_name,
        commission: 0,
        sales: 0
      };
    }
    
    vendorCommissions[key].commission += amount * 0.0225;
    vendorCommissions[key].sales += amount;
  });

  return vendorCommissions;
};
