
import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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
  const [open, setOpen] = useState(false);

  // Extract unique sellers from transactions
  useEffect(() => {
    if (transactions.length > 0) {
      const uniqueSellers: Record<number, Seller> = {};
      
      transactions.forEach(transaction => {
        if (!uniqueSellers[transaction.seller_id]) {
          uniqueSellers[transaction.seller_id] = {
            id: transaction.seller_id,
            name: transaction.seller_name
          };
        }
      });
      
      setSellers(Object.values(uniqueSellers));
    }
  }, [transactions]);
  
  const handleReset = () => {
    onSellerChange(null);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedSellerId
              ? sellers.find((seller) => seller.id === selectedSellerId)?.name || "Seleccionar vendedor"
              : "Seleccionar vendedor"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Buscar vendedor..." />
            <CommandEmpty>No se encontraron vendedores.</CommandEmpty>
            <CommandGroup>
              {sellers.map((seller) => (
                <CommandItem
                  key={seller.id}
                  value={seller.name}
                  onSelect={() => {
                    onSellerChange(seller.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSellerId === seller.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {seller.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
          <div className="border-t p-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs"
              onClick={handleReset}
            >
              Mostrar todos
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SellerFilter;
