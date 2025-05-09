
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, MoreHorizontal, Users, HeadsetIcon, MessageSquare } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../contexts/AuthContext";
import { useData, User } from "../contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";
import { Headset } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  position: string;
  progress: number;
};

const Team = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { users } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("All");

  // Customer service team members data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Henry Paulista",
      email: "henry.paulista@email.com",
      position: "ADMINISTRADOR",
      progress: 100,
    },
    {
      id: "2",
      name: "Evan Jefferson",
      email: "evan.jefferson@email.com",
      position: "VENDEDOR",
      progress: 82,
    },
    {
      id: "3",
      name: "Mark Thomson",
      email: "mark.thomson@email.com",
      position: "VENDEDOR SENIOR",
      progress: 66,
    },
    {
      id: "4",
      name: "Alice McKenzie",
      email: "alice.mckenzie@email.com",
      position: "SUPERVISOR DE VENTAS",
      progress: 100,
    },
    {
      id: "5",
      name: "Jack Ro",
      email: "jack.ro@email.com",
      position: "VENDEDOR",
      progress: 33,
    },
    {
      id: "6",
      name: "Anastasia Groetze",
      email: "anastasia.groetze@email.com",
      position: "VENDEDOR",
      progress: 45,
    }
  ]);

  // Stats for the right sidebar
  const stats = {
    timeLog: 74,
    total: 148,
    completed: 56,
    inProgress: 76,
    waiting: 16
  };

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!isAdmin) {
      toast.error("You don't have permission to view this page");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  // Filter team members by search term
  const filteredTeamMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) return null;

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Equipo de Servicio al Cliente</h1>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="organization">Organización</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre"
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 items-center">
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Equipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Todos</SelectItem>
                  <SelectItem value="Ventas">Ventas</SelectItem>
                  <SelectItem value="Soporte">Soporte</SelectItem>
                  <SelectItem value="Administración">Administración</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Todos</SelectItem>
                  <SelectItem value="Name">Nombre</SelectItem>
                  <SelectItem value="Role">Rol</SelectItem>
                  <SelectItem value="Progress">Progreso</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex bg-gray-100 rounded-md">
                <Button
                  variant={view === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-l-md"
                  onClick={() => setView("grid")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                  </svg>
                </Button>
                <Button
                  variant={view === "list" ? "default" : "ghost"}
                  size="icon"
                  className="rounded-r-md"
                  onClick={() => setView("list")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredTeamMembers.map(member => (
              view === "grid" ? (
                <Card key={member.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col items-center">
                        <Avatar className="h-24 w-24 border-4 border-blue-100 mb-3">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-medium text-lg text-center">{member.name}</h3>
                        <p className="text-gray-500 text-sm mb-2">{member.email}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-xs text-gray-500">{member.progress}%</span>
                      </div>
                      <Progress value={member.progress} className="h-1.5" />
                    </div>
                    
                    <div className="mt-4 pt-4 border-t text-center">
                      <p className="text-xs font-medium text-gray-500">{member.position}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card key={member.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-gray-500 text-sm">{member.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <div className="flex items-center mb-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-xs text-gray-500">{member.progress}%</span>
                        </div>
                        <Progress value={member.progress} className="h-1.5" />
                      </div>
                      
                      <p className="text-xs font-medium text-gray-500 w-40">{member.position}</p>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="w-full md:w-80 shrink-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  <div className="text-lg font-medium">Equipo de Servicio al Cliente</div>
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Time Log */}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">TIEMPO ACTIVO</div>
                      <div className="text-3xl font-bold">{stats.timeLog}%</div>
                    </div>
                  </div>
                  <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 45 * (stats.timeLog / 100)} ${2 * Math.PI * 45 * (1 - stats.timeLog / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Tickets Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Tickets de Soporte</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-500 mb-1">TOTAL</p>
                      <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-500 mb-1">RESUELTOS</p>
                      <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-500 mb-1">EN PROGRESO</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-500 mb-1">EN ESPERA</p>
                      <p className="text-2xl font-bold text-amber-500">{stats.waiting}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Team Messages */}
              <Card className="bg-blue-50">
                <CardContent className="p-4 flex gap-3">
                  <div className="bg-blue-500 rounded-md p-2 text-white">
                    <Headset className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">CENTRO DE SOPORTE</div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Mensajes internos</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Team;
