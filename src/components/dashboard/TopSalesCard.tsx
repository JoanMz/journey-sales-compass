
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const topSales = [
  {
    id: 1,
    customer: {
      name: "John Doe",
      avatar: "",
    },
    agent: "Jeremy Jenkins",
    date: "Air May 19",
    year: "25 Aug 2022"
  },
  {
    id: 2,
    customer: {
      name: "Jeremy Jenkins",
      avatar: "",
    },
    agent: "Jordan Delia",
    date: "18 Aug 2022",
    year: ""
  },
  {
    id: 3,
    customer: {
      name: "Maria Garcia",
      avatar: "",
    },
    agent: "Alex Smith",
    date: "15 Aug 2022",
    year: ""
  },
  {
    id: 4,
    customer: {
      name: "Robert Chen",
      avatar: "",
    },
    agent: "Emily Johnson",
    date: "12 Aug 2022",
    year: ""
  }
];

const TopSalesCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span>Top ventas la semana</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topSales.map((sale) => (
            <div key={sale.id} className="flex items-center gap-4 border-b border-gray-100 pb-3 last:border-0">
              <div className="flex-shrink-0">
                {sale.customer.avatar ? (
                  <img 
                    src={sale.customer.avatar} 
                    alt={sale.customer.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-700 font-medium">
                      {sale.customer.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{sale.customer.name}</p>
                <p className="text-xs text-gray-500 truncate">{sale.agent}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-900">{sale.date}</p>
                {sale.year && (
                  <p className="text-xs text-gray-500">{sale.year}</p>
                )}
              </div>
            </div>
          ))}
          
          <button className="w-full text-center text-sm text-purple-600 hover:text-purple-800 pt-2">
            View all sales
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopSalesCard;
