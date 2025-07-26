import React, { useRef, useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ArrowRight, FileText, CheckSquare, FileCheck, BarChart3 } from 'lucide-react';
import { useCountAnimation } from '@/hooks/useCountAnimation';
import WaitlistDialog from '@/components/WaitlistDialog';
import AITravelServicesSection from '@/components/AITravelServicesSection';

// Create the Counter Animation Component
const AnimatedCounter = ({ value, label, prefix = '', suffix = '', duration = 2000 }) => {
  const counterRef = useRef(null);
  const isVisible = useIntersectionObserver({
    elementRef: counterRef,
    threshold: 0.1
  });
  
  const count = useCountAnimation({
    end: parseInt(value),
    start: 0,
    duration: duration,
    isTriggered: isVisible
  });

  return (
    <div className="text-center" ref={counterRef}>
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {prefix}{count}{suffix}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

// Create the Process Step Component
const ProcessStep = ({ number, title, description, icon }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 reveal-animation">
      <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 text-primary">
        {icon}
      </div>
    </div>
  );
};

const WhatsAppAssistant = () => {
  useScrollReveal();
  const { t } = useLanguage();
  const phoneImageRef = useRef(null);
  const isPhoneVisible = useIntersectionObserver({
    elementRef: phoneImageRef,
    threshold: 0.1
  });
  
  // Add state for waitlist dialog
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  // Function to open waitlist dialog
  const openWaitlistDialog = () => {
    setIsWaitlistOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 reveal-animation">
                Ahorra Tiempo y <span className="text-green-400">Aumenta tus Ventas</span>
              </h1>
              <p className="text-xl mb-8 reveal-animation">
                Nuestro asistente de ventas por WhatsApp automatiza tu proceso, organiza tus clientes y aumenta tu eficiencia para que puedas cerrar más ventas.
              </p>
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6 reveal-animation"
                onClick={() => window.open('https://wa.me/573159381236?text=Hola,%20estoy%20interesado%20en%20saber%20más%20sobre%20el%20asistente%20de%20ventas', '_blank')}
              >
                Comenzar ahora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div 
              className="md:w-1/2 flex justify-center" 
              ref={phoneImageRef}
            >
              <div className={`transform transition-all duration-1000 ${isPhoneVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                <div className="relative">
                  <div className="phone-mockup w-64 h-auto relative">
                    <svg className="w-full" viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10" y="10" width="280" height="580" rx="40" fill="#222" stroke="#000" strokeWidth="10" />
                      <rect x="20" y="40" width="260" height="520" rx="5" fill="#fff" />
                      <circle cx="150" cy="580" r="15" fill="#333" />
                    </svg>
                    <div className="absolute top-[50px] left-[30px] right-[30px] bottom-[90px] bg-gray-100 overflow-hidden">
                      {/* WhatsApp Interface */}
                      <div className="h-full flex flex-col">
                        <div className="bg-green-500 p-3 flex items-center">
                          <div className="w-10 h-10 bg-white rounded-full"></div>
                          <div className="ml-3">
                            <div className="text-white font-semibold">Asistente de Ventas</div>
                            <div className="text-green-100 text-xs">en línea</div>
                          </div>
                        </div>
                        <div className="flex-1 bg-[url('https://i.imgur.com/7k5dCtH.png')] p-2">
                          <div className="ml-auto max-w-[70%] bg-green-100 p-2 rounded-lg mb-2">
                            ¡Hola! ¿Cómo puedo ayudarte?
                          </div>
                          <div className="mr-auto max-w-[70%] bg-white p-2 rounded-lg mb-2">
                            Necesito información sobre paquetes
                          </div>
                          <div className="ml-auto max-w-[70%] bg-green-100 p-2 rounded-lg">
                            ¡Claro! Aquí tienes nuestras opciones...
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 reveal-animation">Resultados Impactantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <AnimatedCounter value="40" suffix="%" label="Aumento en ventas" />
            <AnimatedCounter value="15" suffix=" hrs" label="Tiempo ahorrado por semana" />
            <AnimatedCounter value="90" suffix="%" label="Satisfacción del cliente" />
          </div>
        </div>
      </section>
      
      {/* Before/After Comparison */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 reveal-animation">Antes vs. Después</h2>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-16 reveal-animation">
            Descubre la diferencia que nuestro asistente de ventas puede hacer en tu proceso de trabajo.
          </p>
          
          <Tabs defaultValue="quotation" className="reveal-animation">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="quotation">Cotizaciones</TabsTrigger>
                <TabsTrigger value="organization">Organización</TabsTrigger>
                <TabsTrigger value="tracking">Seguimiento</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="quotation" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Antes</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                      <span>Cotizaciones manuales que toman 30+ minutos</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                      <span>Errores en los cálculos y precios</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                      <span>Formatos inconsistentes</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                      <span>Dificultad para hacer seguimiento</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4 text-green-600">Después</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                      <span>Cotizaciones automáticas en segundos</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                      <span>Cálculos precisos sin errores</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                      <span>Formato profesional consistente</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                      <span>Seguimiento automático y recordatorios</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="organization" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Antes</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                      <span>Conversaciones mezcladas con clientes</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                      <span>Información dispersa en notas y chats</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                      <span>Difícil encontrar historiales de clientes</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                      <span>Sin categorización de prospectos</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4 text-green-600">Después</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                      <span>Chats organizados por cliente y etapa</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                      <span>Toda la información centralizada</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                      <span>Historial completo y búsqueda rápida</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">���</span>
                      <span>Clasificación automática de prospectos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tracking" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Antes</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                      <span>Seguimiento manual poco consistente</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                      <span>Se olvidan clientes potenciales</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                      <span>Sin métricas de desempeño</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white mr-3">✗</span>
                      <span>Tiempos de respuesta lentos</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4 text-green-600">Después</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                      <span>Seguimiento automatizado con recordatorios</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                      <span>Ningún cliente se queda sin atención</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                      <span>Dashboard con métricas en tiempo real</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">✓</span>
                      <span>Respuestas rápidas preconfiguradas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Process Visualization */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 reveal-animation">Nuestro Proceso</h2>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-16 reveal-animation">
            Un flujo de trabajo optimizado para maximizar tu eficiencia y cerrar más ventas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProcessStep 
              number="1" 
              title="Cotización" 
              description="Genera cotizaciones profesionales automáticamente con solo unos clics"
              icon={<FileText size={24} />}
            />
            <ProcessStep 
              number="2" 
              title="Confirmación" 
              description="Procesa confirmaciones y pagos directamente a través de WhatsApp"
              icon={<CheckSquare size={24} />}
            />
            <ProcessStep 
              number="3" 
              title="Documentos" 
              description="Envía itinerarios y documentación necesaria automáticamente"
              icon={<FileCheck size={24} />}
            />
            <ProcessStep 
              number="4" 
              title="Seguimiento" 
              description="Mantén a tus clientes informados con actualizaciones programadas"
              icon={<BarChart3 size={24} />}
            />
          </div>
        </div>
      </section>
      
      {/* WhatsApp Experience Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 reveal-animation">Experiencia WhatsApp Fluida</h2>
              <div className="space-y-6 reveal-animation">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-xl mb-2">Respuestas instantáneas</h3>
                  <p className="text-gray-600">Tus clientes reciben respuestas inmediatas, incluso cuando estás ocupado con otros asuntos.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-xl mb-2">Personalización automática</h3>
                  <p className="text-gray-600">Cada mensaje se adapta al cliente, incluyendo su nombre y detalles específicos de su consulta.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-xl mb-2">Múltiples idiomas</h3>
                  <p className="text-gray-600">Comunícate con clientes internacionales con soporte para español, inglés y otros idiomas.</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end reveal-animation">
              <div className="relative">
                <div className="chat-bubble absolute -top-10 -left-16 bg-green-500 text-white p-3 rounded-lg max-w-xs">
                  Hola, ¿podrían enviarme información sobre paquetes a Cancún?
                  <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-4 h-4 bg-green-500"></div>
                </div>
                
                <div className="phone-mockup w-64 h-auto relative">
                  <svg className="w-full" viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="280" height="580" rx="40" fill="#222" stroke="#000" strokeWidth="10" />
                    <rect x="20" y="40" width="260" height="520" rx="5" fill="#fff" />
                    <circle cx="150" cy="580" r="15" fill="#333" />
                  </svg>
                  <div className="absolute top-[50px] left-[30px] right-[30px] bottom-[90px] bg-gray-100 overflow-hidden">
                    {/* WhatsApp Interface with More Detailed Conversation */}
                    <div className="h-full flex flex-col">
                      <div className="bg-green-500 p-3 flex items-center">
                        <div className="w-10 h-10 bg-white rounded-full"></div>
                        <div className="ml-3">
                          <div className="text-white font-semibold">Asistente de Viajes</div>
                          <div className="text-green-100 text-xs">escribiendo...</div>
                        </div>
                      </div>
                      <div className="flex-1 bg-[url('https://i.imgur.com/7k5dCtH.png')] p-2 overflow-y-auto">
                        <div className="mr-auto max-w-[70%] bg-white p-2 rounded-lg mb-2">
                          Hola, ¿podrían enviarme información sobre paquetes a Cancún?
                        </div>
                        <div className="ml-auto max-w-[70%] bg-green-100 p-2 rounded-lg mb-2">
                          ¡Hola! Por supuesto, tenemos excelentes opciones para Cancún. ¿Para cuántas personas y en qué fechas estás pensando viajar?
                        </div>
                        <div className="mr-auto max-w-[70%] bg-white p-2 rounded-lg mb-2">
                          Para 2 adultos, del 15 al 22 de julio
                        </div>
                        <div className="ml-auto max-w-[70%] bg-green-100 p-2 rounded-lg mb-2">
                          ¡Perfecto! Aquí tienes nuestras 3 mejores opciones para esas fechas:
                        </div>
                        <div className="ml-auto max-w-[70%] bg-green-100 p-2 rounded-lg">
                          [Cotización PDF] Opciones Cancún Jul 15-22
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="chat-bubble absolute -bottom-12 -right-16 bg-white border border-gray-300 p-3 rounded-lg max-w-xs shadow-lg">
                  ¡Gracias! Me interesa la opción 2. ¿Cómo puedo reservar?
                  <div className="absolute top-0 left-8 transform -translate-y-1/2 rotate-45 w-4 h-4 bg-white border-l border-t border-gray-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Travel Services Section - NEW SECTION */}
      <AITravelServicesSection />
      
      {/* CRM Integration */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 reveal-animation">Integración con CRM</h2>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto mb-16 reveal-animation">
            Todos tus datos sincronizados automáticamente con tu sistema CRM para un análisis completo.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start reveal-animation">
            <div className="lg:col-span-2">
              <div className="phone-mockup w-48 h-auto mx-auto">
                <svg className="w-full" viewBox="0 0 300 600" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="10" width="280" height="580" rx="40" fill="#222" stroke="#000" strokeWidth="10" />
                  <rect x="20" y="40" width="260" height="520" rx="5" fill="#fff" />
                  <circle cx="150" cy="580" r="15" fill="#333" />
                </svg>
                <div className="absolute top-[40px] left-0 right-0 bottom-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 text-green-500">
                      {/* WhatsApp Icon */}
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.941 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.214 3.074.149.198 2.097 3.2 5.077 4.363.71.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 5.363h-.001a8.77 8.77 0 01-4.473-1.231l-.321-.191-3.326.868.889-3.24-.209-.332a8.725 8.725 0 01-1.334-4.627c.001-4.825 3.936-8.756 8.764-8.756 2.342 0 4.541.912 6.19 2.566a8.68 8.68 0 012.571 6.184c-.003 4.825-3.937 8.759-8.75 8.759zm7.149-15.909A10.449 10.449 0 0012.05 1.5C6.229 1.5 1.5 6.229 1.5 12.048c0 1.795.469 3.541 1.353 5.073L1.06 22.939a1 1 0 001.242 1.242l5.818-1.792a10.44 10.44 0 004.93 1.26h.004c5.819 0 10.548-4.729 10.548-10.547a10.41 10.41 0 00-3.058-7.634z"/>
                      </svg>
                    </div>
                    <div className="text-xs text-center font-medium">Datos de WhatsApp</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <div className="w-6 h-20 border-r-4 border-dashed border-primary"></div>
              </div>
            </div>

            <div className="lg:col-span-1 flex justify-center items-center">
              <div className="transform animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-4 overflow-hidden">
                <div className="bg-primary text-white p-2 rounded-t-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <div className="text-sm">CRM Dashboard</div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="text-xs text-blue-600">Leads Nuevos</div>
                      <div className="text-2xl font-bold">128</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="text-xs text-green-600">Ventas Cerradas</div>
                      <div className="text-2xl font-bold">47</div>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded p-2 mb-3">
                    <div className="text-xs font-medium">Tasa de Conversión</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="text-right text-xs mt-1">65%</div>
                  </div>
                  <div className="text-xs font-medium mb-1">Clientes Recientes</div>
                  <ul className="text-xs">
                    <li className="border-b py-1 flex justify-between">
                      <span>María López</span>
                      <span className="text-green-600">Reservado</span>
                    </li>
                    <li className="border-b py-1 flex justify-between">
                      <span>Carlos García</span>
                      <span className="text-blue-600">Cotización enviada</span>
                    </li>
                    <li className="py-1 flex justify-between">
                      <span>Andrea Ruiz</span>
                      <span className="text-orange-600">Interesado</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 reveal-animation">¿Listo para impulsar tus ventas?</h2>
            <p className="text-xl mb-8 reveal-animation">
              Comienza a utilizar nuestro asistente de ventas por WhatsApp hoy mismo y transforma tu proceso de ventas.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 reveal-animation">
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6 w-full sm:w-auto"
                onClick={() => window.open('https://wa.me/573159381236?text=Hola,%20estoy%20interesado%20en%20saber%20más%20sobre%20el%20asistente%20de%20ventas', '_blank')}
              >
                Contactar por WhatsApp <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                className="bg-white hover:bg-gray-100 text-primary text-lg px-8 py-6 w-full sm:w-auto"
                onClick={openWaitlistDialog}
              >
                Solicitar Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Form */}
      <section className="py-20" id="contact-form">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 reveal-animation">Solicitar Demo</h2>
            <p className="text-xl text-center text-gray-600 mb-12 reveal-animation">
              Completa el formulario y te contactaremos para programar una demostración personalizada.
            </p>
            
            <form className="space-y-6 reveal-animation">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block mb-2">Nombre</label>
                  <input id="name" className="w-full p-3 border border-gray-300 rounded-md" placeholder="Tu nombre" />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2">Correo electrónico</label>
                  <input id="email" type="email" className="w-full p-3 border border-gray-300 rounded-md" placeholder="tu@email.com" />
                </div>
              </div>
              
              <div>
                <label htmlFor="company" className="block mb-2">Empresa</label>
                <input id="company" className="w-full p-3 border border-gray-300 rounded-md" placeholder="Nombre de tu empresa" />
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-2">Mensaje</label>
                <textarea id="message" rows={4} className="w-full p-3 border border-gray-300 rounded-md" placeholder="Cuéntanos más sobre tus necesidades..."></textarea>
              </div>
              
              <Button 
                className="w-full bg-primary hover:bg-secondary text-white py-4"
                onClick={(e) => {
                  e.preventDefault();
                  openWaitlistDialog();
                }}
              >
                Enviar Solicitud
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      <Footer />
      <WhatsAppButton />
      
      {/* Waitlist Dialog */}
      <WaitlistDialog open={isWaitlistOpen} onOpenChange={setIsWaitlistOpen} />
    </div>
  );
};

export default WhatsAppAssistant;
