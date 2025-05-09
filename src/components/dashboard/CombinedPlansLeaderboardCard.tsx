
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CombinedPlansLeaderboardCard = () => {
  // Top destinations/plans data
  const topPlans = [
    { name: "Plan terrestre Santamarta", value: 12 },
    { name: "Plan Migración España", value: 8 },
  ];

  return (
    <Card className="bg-white border border-blue-200">
      <CardHeader className="pb-1">
        <CardTitle className="text-lg flex justify-between">
          <span>Top planes & Seller Leaderboard</span>
          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">PROMOTION ZONE</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Top plans section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Top planes</h3>
          <ul className="space-y-2 mb-4">
            {topPlans.map((plan, index) => (
              <li key={index} className="p-2 border-b border-gray-100">
                <div className="font-medium">{plan.name}</div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t border-gray-200 my-4"></div>
        
        {/* Seller Leaderboard */}
        <div className="bg-gray-900 rounded-lg p-4 text-white">
          <div className="text-center mb-4">
            <div className="text-sm">You finished #3 last week</div>
            <div className="flex justify-center space-x-4 my-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">2</div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-300 rounded-full"></div>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">1</div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-300 rounded-full"></div>
              </div>
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">3</div>
              </div>
            </div>
          </div>
          
          <ul className="space-y-2">
            <li className="flex justify-between items-center p-1">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">S</div>
                <span>Sophie Lozanos</span>
              </div>
              <span>$45.5K</span>
            </li>
            <li className="flex justify-between items-center p-1">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">N</div>
                <span>Nayeli</span>
              </div>
              <span>$32K</span>
            </li>
            <li className="flex justify-between items-center p-1 bg-gray-800 rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">A</div>
                <span>Andrea</span>
              </div>
              <span>$27K</span>
            </li>
            <li className="flex justify-between items-center p-1">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">V</div>
                <span>Victoria</span>
              </div>
              <span>$20K</span>
            </li>
            <li className="flex justify-between items-center p-1">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">M</div>
                <span>Mayra</span>
              </div>
              <span>$19K</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CombinedPlansLeaderboardCard;
