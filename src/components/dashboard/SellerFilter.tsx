
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUsers } from "@/lib/api";

interface SellerFilterProps {
  selectedSellerId: number | null;
  onSellerChange: (sellerId: number | null) => void;
}

interface User {
  id: number;
  role: string;
  phone_number: string | null;
  name: string;
  email: string;
  password: string;
}

const SellerFilter: React.FC<SellerFilterProps> = ({
  selectedSellerId,
  onSellerChange,
}) => {
  const [sellers, setSellers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const users = await getUsers();
        
        // Filter users with role "seller" or "vendedor"
        const sellersList = users.filter((user: User) => 
          user.role === "seller" || user.role === "vendedor"
        );
        
        setSellers(sellersList);
      } catch (error) {
        console.error("Failed to fetch sellers:", error);
        setSellers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

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
        disabled={loading}
      >
        <SelectTrigger className="w-full bg-white border-blue-200 focus:ring-blue-500">
          <SelectValue placeholder={loading ? "Cargando..." : "Todos los vendedores"} />
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
