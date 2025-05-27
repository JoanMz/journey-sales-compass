import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData, Sale } from "../contexts/DataContext";
import AppLayout from "../components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Plus, Check, Clock, X, Users, CreditCard, ShoppingCart } from "lucide-react";
import ManagerDashboard from "../components/dashboard/ManagerDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";

const Home = () => {
  const { isAdmin, isSeller, isManager, user } = useAuth();
  const { sales, weeklyData, customers, addSale, updateSaleStatus, metrics } = useData();

  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [newSale, setNewSale] = useState({
    customerName: "",
    customerId: "",
    package: "",
    amount: 0,
    status: "Pendiente" as Sale["status"],
    date: new Date().toISOString().split('T')[0],
  });

  // Filter sales for the current user if not admin
  const filteredSales = isAdmin
    ? sales
    : sales.filter(sale => sale.sellerId === user?.id);

  // Group sales by status for Kanban view
  const kanbanGroups = {
    "Pendiente": filteredSales.filter(sale => sale.status === "Pendiente"),
    "Aprobado": filteredSales.filter(sale => sale.status === "Aprobado"),
    "Rechazado": filteredSales.filter(sale => sale.status === "Rechazado"),
  };

  const handleAddSale = () => {
    if (!user) return;

    // Find customer by name
    const customer = customers.find(c => c.name === newSale.customerName);

    if (!customer) {
      alert("Customer not found. Please enter a valid customer name.");
      return;
    }

    addSale({
      customerId: customer.id,
      customerName: customer.name,
      customerAvatar: customer.avatar,
      package: newSale.package,
      amount: newSale.amount,
      status: newSale.status,
      date: newSale.date,
      sellerName: user.name,
      sellerId: user.id
    });

    setIsAddSaleOpen(false);

    // Reset form
    setNewSale({
      customerName: "",
      customerId: "",
      package: "",
      amount: 0,
      status: "Pendiente",
      date: new Date().toISOString().split('T')[0],
    });
  };

  // Handle dropping a sale card to a new status column
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: Sale["status"]) => {
    e.preventDefault();
    const saleId = e.dataTransfer.getData("text/plain");
    updateSaleStatus(saleId, targetStatus);
  };

  // Allow dropping
  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Start drag
  const startDrag = (e: React.DragEvent<HTMLDivElement>, saleId: string) => {
    e.dataTransfer.setData("text/plain", saleId);
  };

  // Role-specific dashboard components
  const RoleSpecificDashboard = () => {
    if (isAdmin) {
      return <AdminDashboard />;
    } else if (isManager) {
      // Return the specialized manager dashboard
      return <ManagerDashboard />;
    } else if (isSeller) {
      return (
        <Card className="bg-green-50 border-green-200 mb-6">
          <CardHeader className="pb-2 border-b border-green-200">
            <CardTitle className="text-green-700">Sales Agent Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-green-700 mb-3">
              Welcome to your sales dashboard. Track your performance and manage your customer interactions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-md border border-green-200 flex items-center">
                <CreditCard className="h-10 w-10 text-green-500 mr-3" />
                <div>
                  <div className="font-semibold text-green-700">Your Commission</div>
                  <div className="text-sm text-green-600">Track your earnings this month</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-md border border-green-200 flex items-center">
                <Users className="h-10 w-10 text-green-500 mr-3" />
                <div>
                  <div className="font-semibold text-green-700">Customer List</div>
                  <div className="text-sm text-green-600">Access your customer contacts</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      return null;
    }
  };

  // If user is a manager, show only the specialized manager dashboard
  if (isManager) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <RoleSpecificDashboard />
        </div>

        {/* Add Sale Dialog */}
        <Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Sale</DialogTitle>
              <DialogDescription>
                Add a new sale to your dashboard.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer</label>
                <Input
                  list="customers"
                  placeholder="Enter customer name"
                  value={newSale.customerName}
                  onChange={(e) => setNewSale({...newSale, customerName: e.target.value})}
                />
                <datalist id="customers">
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.name} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Travel Package</label>
                <Input
                  placeholder="Enter package name"
                  value={newSale.package}
                  onChange={(e) => setNewSale({...newSale, package: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount ($)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    min="0"
                    value={newSale.amount || ""}
                    onChange={(e) => setNewSale({...newSale, amount: parseFloat(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={newSale.date}
                    onChange={(e) => setNewSale({...newSale, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={newSale.status}
                  onValueChange={(value) => setNewSale({...newSale, status: value as Sale["status"]})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Aprobado">Aprobada</SelectItem>
                    <SelectItem value="Rechazado">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddSaleOpen(false)}>Cancel</Button>
              <Button
                onClick={handleAddSale}
                className="bg-brand-purple hover:bg-brand-purple-dark"
              >
                Add Sale
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppLayout>
    );
  }

  // If user is an admin, show only the admin dashboard
  if (isAdmin) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <RoleSpecificDashboard />
        </div>
      </AppLayout>
    );
  }

  // Regular dashboard for other roles
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Role-specific dashboard section */}
        <RoleSpecificDashboard />

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">+6.32%</span> vs last week
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">+3.54%</span> vs last month
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(metrics.totalRevenue * 0.3).toLocaleString()}</div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">+8.12%</span> vs last week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Management */}
        <Card className="stats-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Sales Management</CardTitle>
              <Button onClick={() => setIsAddSaleOpen(true)} className="bg-brand-purple hover:bg-brand-purple-dark">
                <Plus className="h-4 w-4 mr-1" /> Add Sale
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="kanban">
              <TabsList className="mb-4">
                <TabsTrigger value="kanban">Kanban View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="kanban">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* On Process Column */}
                  <div
                    className="kanban-column border-t-4 border-blue-400"
                    onDrop={(e) => handleDrop(e, "Pendiente")}
                    onDragOver={allowDrop}
                  >
                    <div className="flex items-center mb-4">
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      <h3 className="font-semibold">On Process</h3>
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {kanbanGroups["Pendiente"].length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {kanbanGroups["Pendiente"].map((sale) => (
                        <div
                          key={sale.id}
                          draggable
                          onDragStart={(e) => startDrag(e, sale.id)}
                          className="kanban-card border-l-blue-400"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              {sale.customerAvatar ? (
                                <img
                                  src={sale.customerAvatar}
                                  alt={sale.customerName}
                                  className="h-8 w-8 rounded-full mr-2"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                                  {sale.customerName.charAt(0)}
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium">{sale.customerName}</h4>
                                <span className="text-xs text-gray-500">Seller: {sale.sellerName}</span>
                              </div>
                            </div>
                            <span className="text-sm font-semibold">${sale.amount}</span>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm">{sale.package}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">{new Date(sale.date).toLocaleDateString()}</span>
                              <span className="status-badge status-process">On Process</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Success Column */}
                  <div
                    className="kanban-column border-t-4 border-green-400"
                    // onDrop={(e) => handleDrop(e, "Aprobado")}
                    onDragOver={allowDrop}
                  >
                    <div className="flex items-center mb-4">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <h3 className="font-semibold">Success</h3>
                      <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {kanbanGroups["Aprobado"].length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {kanbanGroups["Aprobado"].map((sale) => (
                        <div
                          key={sale.id}
                          draggable
                          onDragStart={(e) => startDrag(e, sale.id)}
                          className="kanban-card border-l-green-400"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              {sale.customerAvatar ? (
                                <img
                                  src={sale.customerAvatar}
                                  alt={sale.customerName}
                                  className="h-8 w-8 rounded-full mr-2"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                                  {sale.customerName.charAt(0)}
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium">{sale.customerName}</h4>
                                <span className="text-xs text-gray-500">Seller: {sale.sellerName}</span>
                              </div>
                            </div>
                            <span className="text-sm font-semibold">${sale.amount}</span>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm">{sale.package}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">{new Date(sale.date).toLocaleDateString()}</span>
                              <span className="status-badge status-success">Success</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Canceled Column */}
                  <div
                    className="kanban-column border-t-4 border-red-400"
                    onDrop={(e) => handleDrop(e, "Rechazado")}
                    onDragOver={allowDrop}
                  >
                    <div className="flex items-center mb-4">
                      <X className="h-5 w-5 mr-2 text-red-500" />
                      <h3 className="font-semibold">Canceled</h3>
                      <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {kanbanGroups["Rechazado"].length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {kanbanGroups["Rechazado"].map((sale) => (
                        <div
                          key={sale.id}
                          draggable
                          onDragStart={(e) => startDrag(e, sale.id)}
                          className="kanban-card border-l-red-400"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              {sale.customerAvatar ? (
                                <img
                                  src={sale.customerAvatar}
                                  alt={sale.customerName}
                                  className="h-8 w-8 rounded-full mr-2"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2">
                                  {sale.customerName.charAt(0)}
                                </div>
                              )}
                              <div>
                                <h4 className="font-medium">{sale.customerName}</h4>
                                <span className="text-xs text-gray-500">Seller: {sale.sellerName}</span>
                              </div>
                            </div>
                            <span className="text-sm font-semibold">${sale.amount}</span>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm">{sale.package}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">{new Date(sale.date).toLocaleDateString()}</span>
                              <span className="status-badge status-canceled">Canceled</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="list">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSales.map((sale) => (
                        <tr key={sale.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {sale.customerAvatar ? (
                                <img className="h-10 w-10 rounded-full" src={sale.customerAvatar} alt="" />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  {sale.customerName.charAt(0)}
                                </div>
                              )}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{sale.customerName}</div>
                                <div className="text-sm text-gray-500">Seller: {sale.sellerName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{sale.package}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(sale.date).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`status-badge ${
                              sale.status === "Aprobado"
                                ? "status-success"
                                : sale.status === "Pendiente"
                                ? "status-process"
                                : "status-canceled"
                            }`}>
                              {sale.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            ${sale.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add Sale Dialog */}
      <Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Sale</DialogTitle>
            <DialogDescription>
              Add a new sale to your dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer</label>
              <Input
                list="customers"
                placeholder="Enter customer name"
                value={newSale.customerName}
                onChange={(e) => setNewSale({...newSale, customerName: e.target.value})}
              />
              <datalist id="customers">
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.name} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Travel Package</label>
              <Input
                placeholder="Enter package name"
                value={newSale.package}
                onChange={(e) => setNewSale({...newSale, package: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount ($)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  min="0"
                  value={newSale.amount || ""}
                  onChange={(e) => setNewSale({...newSale, amount: parseFloat(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={newSale.date}
                  onChange={(e) => setNewSale({...newSale, date: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={newSale.status}
                onValueChange={(value) => setNewSale({...newSale, status: value as Sale["status"]})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">On Process</SelectItem>
                  <SelectItem value="Aprobado">Success</SelectItem>
                  <SelectItem value="Rechazado">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSaleOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddSale}
              className="bg-brand-purple hover:bg-brand-purple-dark"
            >
              Add Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Home;
