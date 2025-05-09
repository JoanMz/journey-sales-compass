
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CombinedPlansLeaderboardCard = () => {
  // Top issue categories data
  const topCategories = [
    { name: "Authentication Issues", value: 12 },
    { name: "Payment Processing", value: 8 },
  ];

  return (
    <Card className="bg-white border border-blue-200">
      <CardHeader className="pb-1">
        <CardTitle className="text-lg flex justify-between">
          <span>Top Issues & Developer Leaderboard</span>
          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">PRIORITY ZONE</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Top issues section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Top Issues</h3>
          <ul className="space-y-2 mb-4">
            {topCategories.map((category, index) => (
              <li key={index} className="p-2 border-b border-gray-100">
                <div className="font-medium">{category.name}</div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t border-gray-200 my-4"></div>
        
        {/* Developer Leaderboard */}
        <div className="bg-gray-900 rounded-lg p-4 text-white">
          <div className="text-center mb-4">
            <div className="text-sm">You solved #3 most tickets last week</div>
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
                <span>Sophia Lorenzo</span>
              </div>
              <span>42 tickets</span>
            </li>
            <li className="flex justify-between items-center p-1">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">N</div>
                <span>Noah Miller</span>
              </div>
              <span>37 tickets</span>
            </li>
            <li className="flex justify-between items-center p-1 bg-gray-800 rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">A</div>
                <span>Alex Chen</span>
              </div>
              <span>29 tickets</span>
            </li>
            <li className="flex justify-between items-center p-1">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">V</div>
                <span>Victoria Kim</span>
              </div>
              <span>23 tickets</span>
            </li>
            <li className="flex justify-between items-center p-1">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">M</div>
                <span>Miguel Santos</span>
              </div>
              <span>19 tickets</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CombinedPlansLeaderboardCard;
