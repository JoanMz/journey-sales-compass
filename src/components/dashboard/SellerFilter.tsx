
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction } from "@/types/transactions";

interface SellerFilterProps {
  transactions: Transaction[];
  selectedSellerId: number | null;
  onSellerChange: (sellerId: number | null) => void;
}

interface Seller {
  id: number;
  name: string;
}

const SellerFilter: React.FC<SellerFilterProps> = ({
  transactions,
  selectedSellerId,
  onSellerChange,
}) => {
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    // Extract unique sellers from transactions
    const uniqueSellers = new Map<number, string>();
    
    transactions.forEach((transaction) => {
      if (transaction.seller_id && transaction.seller_name) {
        uniqueSellers.set(transaction.seller_id, transaction.seller_name);
      }
    });
    
    const sellersList = Array.from(uniqueSellers).map(([id, name]) => ({
      id,
      name,
    }));
    
    setSellers(sellersList);
  }, [transactions]);

  const handleSellerChange = (value: string) => {
    if (value === "all") {
      onSellerChange(null);
    } else {
      onSellerChange(Number(value));
    }
  };

  return (
    <div className="w-full md:w-52">
      <Select
        value={selectedSellerId ? selectedSellerId.toString() : "all"}
        onValueChange={handleSellerChange}
      >
        <SelectTrigger className="w-full bg-white border-blue-200 focus:ring-blue-500">
          <SelectValue placeholder="Todos los vendedores" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">Todos los vendedores</SelectItem>
          {sellers.map((seller) => (
            <SelectItem key={seller.id} value={seller.id.toString()}>
              {seller.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SellerFilter;
