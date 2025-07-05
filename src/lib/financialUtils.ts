
import { Transaction } from "@/types/transactions";

export const calculateTotalRevenue = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.status === "approved" || transaction.status === "terminado")
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export const calculateTotalProfit = (totalRevenue: number): number => {
  return totalRevenue * 0.15; // 15% profit margin
};

export const calculateTotalCommission = (transactions: Transaction[]): number => {
  return transactions
    .filter(transaction => transaction.status === "approved" || transaction.status === "terminado")
    .reduce((total, transaction) => total + (transaction.amount * 0.0225), 0); // 2.25% commission
};

export const calculateCommissionByVendor = (transactions: Transaction[]) => {
  const vendorMap = new Map<number, {
    sellerId: number;
    sellerName: string;
    sales: number;
    commission: number;
  }>();

  transactions
    .filter(transaction => transaction.status === "approved")
    .forEach(transaction => {
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
          commission
        });
      }
    });

  return Object.fromEntries(vendorMap);
};

export const filterTransactionsByPeriod = (transactions: Transaction[], period: "fortnight" | "month" | "all"): Transaction[] => {
  if (period === "all") return transactions;

  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "fortnight":
      startDate = new Date(now.getTime() - (15 * 24 * 60 * 60 * 1000));
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    default:
      return transactions;
  }

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.start_date);
    return transactionDate >= startDate;
  });
};
