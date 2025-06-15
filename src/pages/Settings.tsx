import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../contexts/AuthContext";
import { useData, User } from "../contexts/DataContext";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { user, isAdmin } = useAuth();
  const { users, addUser, updateUser, deleteUser } = useData();
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "seller" as User["role"],
  });
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    phone_number: "",
    role: "seller" as User["role"],
  });
  const [isLoading, setIsLoading] = useState(false);


  const roleLabels = {
    admin: 'Administrador',
    manager: 'Gerente',
    seller: 'Vendedor',
  };

  
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Name, email, and password are required");
      return;
    }
    
    setIsLoading(true);
    try {
      await addUser({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        phone_number: newUser.phone_number,
        role: newUser.role,
      });
      
      setIsAddUserOpen(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        phone_number: "",
        role: "seller",
      });
    } catch (error) {
      // Error handling is done in the DataContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    if (!editUser.name || !editUser.email) {
      toast.error("Name and email are required");
      return;
    }
    
    setIsLoading(true);
    try {
      await updateUser(selectedUser.id, {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
        phone_number: editUser.phone_number,
      });
      
      setIsEditUserOpen(false);
    } catch (error) {
      // Error handling is done in the DataContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      // Error handling is done in the DataContext
    }
  };

  const handleUpdateUser = async (userId: number, userProps) => {
    try {
      await updateUser(userId, userProps);
    } catch (error) {
      // Error handling is done in the DataContext
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
      phone_number: user.phone_number || "",
    });
    setIsEditUserOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <Tabs defaultValue="account">
          <TabsList className="mb-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            {isAdmin && <TabsTrigger value="users">User Management</TabsTrigger>}
            <TabsTrigger value="whatsapp">WhatsApp Integration</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          {/* Account Settings Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200 mr-6">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user?.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-brand-purple text-white text-2xl">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{user?.name}</h3>
                      <p className="text-sm text-gray-500">
                        {user?.email} · <span className="capitalize">{user?.role}</span>
                      </p>
                      <Button size="sm" className="mt-2 bg-brand-purple hover:bg-brand-purple-dark">
                        Change Avatar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input defaultValue={user?.name} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input defaultValue={user?.email} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role</label>
                      <Input defaultValue={user?.role} disabled />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password</label>
                      <Input type="password" defaultValue="********" />
                    </div>
                  </div>
                </div>
                
                <Button className="bg-brand-purple hover:bg-brand-purple-dark">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* User Management Tab (Admin only) */}
          {isAdmin && (
            <TabsContent value="users">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <Button 
                    onClick={() => setIsAddUserOpen(true)}
                    className="bg-brand-purple hover:bg-brand-purple-dark"
                  >
                    <UserPlus className="h-4 w-4 mr-2" /> Add User
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                                  {u.avatar ? (
                                    <img src={u.avatar} alt={u.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-brand-purple text-white">
                                      {u.name.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{u.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-brand-purple-light text-brand-purple-dark capitalize">
                                {roleLabels[u.role] || `${u.role} otro`}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => openEditDialog(u)}
                                className="text-brand-purple-dark hover:text-brand-purple hover:bg-brand-purple-light mr-2"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteUser(u.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                disabled={user?.id === u.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {/* WhatsApp Integration Tab */}
          <TabsContent value="whatsapp">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Integration</CardTitle>
                <CardDescription>Configure your WhatsApp Business API integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">WhatsApp Business API</h3>
                      <p className="text-xs text-green-600">Connected and active</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number ID</label>
                      <Input defaultValue="123456789012345" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Business Account ID</label>
                      <Input defaultValue="987654321098765" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">API Access Token</label>
                    <Input type="password" defaultValue="••••••••••••••••••••••••••••••••" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Webhook URL</label>
                    <div className="flex">
                      <Input defaultValue="https://your-domain.com/api/whatsapp/webhook" readOnly />
                      <Button variant="outline" className="ml-2">Copy</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message Templates</label>
                    <div className="border rounded-md divide-y">
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Welcome Message</p>
                          <p className="text-xs text-gray-500">Sent when a new customer is added to the system</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Sale Confirmation</p>
                          <p className="text-xs text-gray-500">Sent when a sale is marked as successful</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Travel Reminder</p>
                          <p className="text-xs text-gray-500">Sent 3 days before the customer's trip</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button className="bg-brand-purple hover:bg-brand-purple-dark">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-medium">New Sale Notifications</h3>
                      <p className="text-sm text-gray-500">Get notified when a new sale is added</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t">
                    <div>
                      <h3 className="font-medium">Sale Status Updates</h3>
                      <p className="text-sm text-gray-500">Get notified when a sale status changes</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t">
                    <div>
                      <h3 className="font-medium">WhatsApp Messages</h3>
                      <p className="text-sm text-gray-500">Get notified of new WhatsApp messages from customers</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive daily digest emails of your sales activity</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-purple"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-2">
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-2 overflow-y-auto">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Phone Number (Optional)</label>
              <Input
                placeholder="Enter phone number"
                value={newUser.phone_number}
                onChange={(e) => setNewUser({...newUser, phone_number: e.target.value})}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({...newUser, role: value as User["role"]})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="seller">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="mt-4 sm:mt-2">
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddUser}
              className="bg-brand-purple hover:bg-brand-purple-dark"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-2">
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-2 overflow-y-auto">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Enter full name"
                value={editUser.name}
                onChange={(e) => setEditUser({...editUser, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={editUser.email}
                onChange={(e) => setEditUser({...editUser, email: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Phone Number (Optional)</label>
              <Input
                placeholder="Enter phone number"
                value={editUser.phone_number}
                onChange={(e) => setEditUser({...editUser, phone_number: e.target.value})}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={editUser.role}
                onValueChange={(value) => setEditUser({...editUser, role: value as User["role"]})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="seller">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="mt-4 sm:mt-2">
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleEditUser}
              className="bg-brand-purple hover:bg-brand-purple-dark"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Settings;
