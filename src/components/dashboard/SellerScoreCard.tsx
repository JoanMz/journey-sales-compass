
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

const sellers = [
  {
    name: "Sophia Valentine",
    score: "568 XP",
    avatar: "/lovable-uploads/f2000505-8241-4c03-8e2c-c4bf80ca2ba9.png",
    position: 1
  },
  {
    name: "Raquel",
    score: "544 XP",
    avatar: "",
    position: 2
  },
  {
    name: "Andrea",
    score: "270 XP",
    avatar: "",
    position: 3
  },
  {
    name: "Victoria",
    score: "209 XP",
    avatar: "",
    position: 4
  },
  {
    name: "Mayra",
    score: "199 XP",
    avatar: "",
    position: 5
  },
];

const SellerScoreCard = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <span>Score de vendedores</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="pt-4">
          <div className="bg-black text-white rounded-t-lg p-4 text-center">
            <div className="flex justify-center gap-6 mb-3">
              <div className="relative">
                <div className="w-10 h-10 bg-red-500 rounded-full absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-6 h-6 bg-blue-500 rounded-full absolute -top-4 left-0"></div>
                <div className="w-8 h-8 bg-gray-500 rounded-full absolute -top-1 right-0"></div>
              </div>
            </div>
            <p className="text-sm font-medium">You finished #9 last week</p>
          </div>
          
          <div className="border border-gray-200 rounded-b-lg overflow-hidden">
            {sellers.map((seller, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  
                  {seller.avatar ? (
                    <img 
                      src={seller.avatar} 
                      alt={seller.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-700 font-medium text-sm">
                        {seller.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <span className="text-sm font-medium">{seller.name}</span>
                </div>
                
                <span className="text-sm font-medium">{seller.score}</span>
              </div>
            ))}
            <div className="bg-green-100 py-2 px-4 text-center text-green-800 text-sm font-medium">
              ✦ PROMOTION ZONE ✦
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerScoreCard;
