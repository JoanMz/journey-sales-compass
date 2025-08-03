import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ImageUpload from "../ui/image-upload";
import TravelerForm from "./TravelerForm";
import { SalesFormData, TravelerFormData } from "@/types/sales";
import axios from "axios";
import { endpoints } from "@/lib/endpoints";
import { useData } from "@/contexts/DataContext";

interface EnhancedSalesFormProps {
  onSubmit: (formData: FormData) => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
}

const EnhancedSalesForm: React.FC<EnhancedSalesFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTransaction, refreshTransactions } = useData();
  
  console.log("📋 EnhancedSalesForm montado");
  
  const [formData, setFormData] = useState<SalesFormData>({
    customerName: "Sofia",
    customerEmail: "sofia@sofia.com",
    customerPhone: "123456789",
    customerDni: "12345678",
    customerAddress: "123 Main St",
    package: "nacional",
    quotedFlight: "Vuelo 1",
    agencyCost: 10,
    amount: 120,
    paidAmount: 120,
    documentType: "dni",
    transactionType: "venta",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    travelers: [],
    invoiceImage: undefined,
    flightInfo: [{
      aerolinea: "",
      ruta: "",
      fecha: new Date().toISOString(),
      hora_salida: "",
      hora_llegada: "",
    }],
    hotelInfo: [{
      hotel: "",
      noches: 1,
      incluye: [],
      no_incluye: [],
      alimentacion: "",
      acomodacion: "",
      direccion_hotel: "",
      pais_destino: "",
      ciudad_destino: "",
      cuentas_recaudo: {
        banco: "",
        numero: "",
        nombre: "",
        nit: "",
      },
    }],
  });

  const updateField = async (field: keyof SalesFormData, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateFlightField = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      flightInfo: prev.flightInfo?.map((flight, i) => 
        i === index ? { ...flight, [field]: value } : flight
      ) || [],
    }));
  };

  const updateHotelField = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      hotelInfo: prev.hotelInfo?.map((hotel, i) => 
        i === index ? { ...hotel, [field]: value } : hotel
      ) || [],
    }));
  };

  const addFlight = () => {
    setFormData((prev) => ({
      ...prev,
      flightInfo: [
        ...(prev.flightInfo || []),
        {
          aerolinea: "",
          ruta: "",
          fecha: new Date().toISOString(),
          hora_salida: "",
          hora_llegada: "",
        },
      ],
    }));
  };

  const removeFlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      flightInfo: prev.flightInfo?.filter((_, i) => i !== index) || [],
    }));
  };

  const addHotel = () => {
    setFormData((prev) => ({
      ...prev,
      hotelInfo: [
        ...(prev.hotelInfo || []),
        {
          hotel: "",
          noches: 1,
          incluye: [],
          no_incluye: [],
          alimentacion: "",
          acomodacion: "",
          direccion_hotel: "",
          pais_destino: "",
          ciudad_destino: "",
          cuentas_recaudo: {
            banco: "",
            numero: "",
            nombre: "",
            nit: "",
          },
      },
      ],
    }));
  };

  const removeHotel = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      hotelInfo: prev.hotelInfo?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateCuentaRecaudoField = (hotelIndex: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      hotelInfo: prev.hotelInfo?.map((hotel, i) => 
        i === hotelIndex ? {
          ...hotel,
        cuentas_recaudo: {
            ...hotel.cuentas_recaudo,
          [field]: value,
        },
        } : hotel
      ) || [],
    }));
  };

  // Función para validar solo campos básicos requeridos para crear la venta
  const validateBasicFields = (data: SalesFormData): string[] => {
    const errors: string[] = [];
    
    // Solo campos esenciales para crear la venta
    if (!data.customerName.trim()) errors.push("• Nombre del cliente");
    if (!data.customerEmail.trim()) errors.push("• Email del cliente");
    if (!data.customerPhone.trim()) errors.push("• Teléfono del cliente");
    if (!data.customerDni.trim()) errors.push("• Documento del cliente");
    if (!data.customerAddress.trim()) errors.push("• Dirección del cliente");
    if (!data.package) errors.push("• Tipo de paquete");
    if (!data.amount || data.amount <= 0) errors.push("• Precio total");
    if (!data.paidAmount || data.paidAmount <= 0) errors.push("• Valor pagado");
    if (!data.documentType) errors.push("• Tipo de documento");
    if (!data.startDate) errors.push("• Fecha de inicio");
    if (!data.endDate) errors.push("• Fecha de fin");
    if (!data.invoiceImage) errors.push("• Comprobante de pago");
    if (data.travelers.length === 0) errors.push("• Al menos un viajero");
    
    // Validar que cada viajero tenga los campos básicos requeridos
    data.travelers.forEach((traveler, index) => {
      if (!traveler.name.trim()) errors.push(`• Nombre del viajero ${index + 1}`);
      if (!traveler.dni.trim()) errors.push(`• DNI del viajero ${index + 1}`);
      if (!traveler.date_birth) errors.push(`• Fecha de nacimiento del viajero ${index + 1}`);
      if (!traveler.phone.trim()) errors.push(`• Teléfono del viajero ${index + 1}`);
      // Documento del viajero no es obligatorio al crear la transacción
    });
    
    return errors;
  };

  // Función para validar campos completos según el tipo de paquete (para completar información)
  const validatePackageFields = (data: SalesFormData): string[] => {
    const errors: string[] = [];

    // Validar que todos los viajeros tengan documentos
    if (!data.travelers || data.travelers.length === 0) {
      errors.push("• Al menos un viajero es requerido");
    } else {
      const travelersWithoutDocuments = data.travelers.filter(traveler => !traveler.dniImage);
      if (travelersWithoutDocuments.length > 0) {
        const names = travelersWithoutDocuments.map(t => t.name).join(", ");
        errors.push(`• Los siguientes viajeros deben tener documentos: ${names}`);
      }
      
      // Validar que todos los viajeros tengan tipo de documento seleccionado
      const travelersWithoutDocumentType = data.travelers.filter(traveler => !traveler.tipo_documento || traveler.tipo_documento === "");
      if (travelersWithoutDocumentType.length > 0) {
        const names = travelersWithoutDocumentType.map(t => t.name).join(", ");
        errors.push(`• Los siguientes viajeros deben tener tipo de documento seleccionado: ${names}`);
      }
    }

    // Validar campos específicos según el tipo de paquete
    switch (data.package) {
      case "nacional":
      case "internacional":
        if (!data.flightInfo || data.flightInfo.length === 0) {
          errors.push("• Al menos un vuelo es requerido");
        } else {
          // Verificar que TODOS los campos del primer vuelo estén completos
          const firstFlight = data.flightInfo[0];
          const hasCompleteFlightData = firstFlight.aerolinea?.trim() &&
                                       firstFlight.ruta?.trim() &&
                                       firstFlight.fecha &&
                                       firstFlight.hora_salida?.trim() &&
                                       firstFlight.hora_llegada?.trim();

          if (!hasCompleteFlightData) {
            errors.push("• Información completa del vuelo (aerolínea, ruta, fecha, hora salida, hora llegada)");
          }
        }

        if (!data.hotelInfo || data.hotelInfo.length === 0) {
          errors.push("• Al menos un hotel es requerido");
        } else {
          // Verificar que TODOS los campos del primer hotel estén completos
          const firstHotel = data.hotelInfo[0];
          const hasCompleteHotelData = firstHotel.hotel?.trim() &&
                                      firstHotel.noches &&
                                      firstHotel.noches > 0;

          if (!hasCompleteHotelData) {
            errors.push("• Información completa del hotel (nombre y número de noches)");
          }
        }
        break;

      case "migratorio":
        if (!data.flightInfo || data.flightInfo.length === 0) {
          errors.push("• Al menos un vuelo es requerido");
        } else {
          // Verificar que TODOS los campos del primer vuelo estén completos
          const firstFlight = data.flightInfo[0];
          const hasCompleteFlightData = firstFlight.aerolinea?.trim() &&
                                       firstFlight.ruta?.trim() &&
                                       firstFlight.fecha &&
                                       firstFlight.hora_salida?.trim() &&
                                       firstFlight.hora_llegada?.trim();

          if (!hasCompleteFlightData) {
            errors.push("• Información completa del vuelo (aerolínea, ruta, fecha, hora salida, hora llegada)");
          }
        }
        break;

      case "terrestre":
        if (!data.hotelInfo || data.hotelInfo.length === 0) {
          errors.push("• Al menos un hotel es requerido");
        } else {
          // Verificar que TODOS los campos del primer hotel estén completos
          const firstHotel = data.hotelInfo[0];
          const hasCompleteHotelData = firstHotel.hotel?.trim() &&
                                      firstHotel.noches &&
                                      firstHotel.noches > 0;

          if (!hasCompleteHotelData) {
            errors.push("• Información completa del hotel (nombre y número de noches)");
          }
        }
        break;

      default:
        errors.push("• Tipo de paquete no válido");
    }

    return errors;
  };

  // Función para verificar si el paquete está completo para envío a confirmación
  const isPackageCompleteForConfirmation = (data: SalesFormData): boolean => {
    const errors = validatePackageFields(data);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 handleSubmit ejecutándose - Botón presionado");

    if (isSubmitting) {
      console.log("⚠️ Ya se está procesando una venta, ignorando...");
         return;
    }
    
    setIsSubmitting(true);
    console.log("🔄 Iniciando proceso de creación de venta...");
    
    // Validar solo campos básicos requeridos para crear la venta
    const basicValidationErrors = validateBasicFields(formData);
    if (basicValidationErrors.length > 0) {
      alert(`Por favor completa los siguientes campos básicos:\n${basicValidationErrors.join('\n')}`);
      setIsSubmitting(false);
      return;
    }

    let transactionId: string | number | undefined;
    
    try {
      // Preparar todas las imágenes para enviar al webhook
      const allImagesFormData = new FormData();
      const imageOrder = []; // Para mantener el orden de las imágenes
      
      // Agregar imagen del comprobante de pago
      if (formData.invoiceImage) {
        allImagesFormData.append("payment_evidence", formData.invoiceImage);
        imageOrder.push("evidence");
        console.log("✅ Agregando imagen del comprobante de pago:", formData.invoiceImage.name);
      } else {
        console.log("⚠️ No hay imagen de comprobante de pago");
      }
      
      // Agregar imágenes de documentos de viajeros
      formData.travelers.forEach((traveler, index) => {
        if (traveler.dniImage) {
          allImagesFormData.append(`traveler_dni_${index}`, traveler.dniImage);
          imageOrder.push(`traveler_${index}`);
          console.log(`✅ Agregando imagen del DNI del viajero ${index + 1}: ${traveler.name} - ${traveler.dniImage.name}`);
        } else {
          console.log(`⚠️ No hay imagen para el viajero ${index + 1}: ${traveler.name}`);
        }
      });
      
      // Enviar todas las imágenes al webhook
      let uploadedImageUrls = [];
      console.log("📋 FormData tiene payment_evidence:", allImagesFormData.has("payment_evidence"));
      console.log("📋 Viajeros con imágenes:", formData.travelers.filter(t => t.dniImage).length);
      
      if (allImagesFormData.has("payment_evidence") || formData.travelers.some(t => t.dniImage)) {
        console.log("✅ Subiendo todas las imágenes al webhook...");
        
        const imageResponse = await axios.post(
          "https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/6e0954b7-832f-4817-86cd-9c59f18d8a52",
          allImagesFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        console.log("Respuesta del webhook:", imageResponse.data);
        
        // Extraer las URLs de las imágenes del response
        if (imageResponse.data && imageResponse.data.length > 0) {
          uploadedImageUrls = imageResponse.data.map(item => item?.imageUrl || "");
          console.log("URLs de las imágenes obtenidas:", uploadedImageUrls);
        }
      }
      
      // Separar las URLs según el orden original
      let evidenceUrl = "";
      const travelerImageUrls = [];
      
      console.log("📋 Procesando URLs:", uploadedImageUrls);
      console.log("📋 Orden de imágenes:", imageOrder);
      
      uploadedImageUrls.forEach((url, index) => {
        console.log(`📋 Procesando URL ${index}: ${url} - Tipo: ${imageOrder[index]}`);
        if (imageOrder[index] === "evidence") {
          evidenceUrl = url;
          console.log(`✅ Evidence URL asignada: ${evidenceUrl}`);
        } else if (imageOrder[index].startsWith("traveler_")) {
          const travelerIndex = parseInt(imageOrder[index].split("_")[1]);
          travelerImageUrls[travelerIndex] = url;
          console.log(`✅ Traveler ${travelerIndex} URL asignada: ${url}`);
        }
      });
      
      console.log("📋 Evidence URL final:", evidenceUrl);
      console.log("📋 Traveler URLs finales:", travelerImageUrls);

      // Crear el array evidences con la URL obtenida
      const evidencesData = evidenceUrl ? [{
        evidence_file: evidenceUrl,
        amount: formData.paidAmount,
        filename: formData.invoiceImage ? formData.invoiceImage.name : "comprobante_pago.jpg"
      }] : [];

      // Crear array de documentos de viajeros
      const documentosData = [];
      console.log("🔍 Procesando documentos de viajeros:");
      formData.travelers.forEach((traveler, index) => {
        console.log(`   Viajero ${index + 1}: ${traveler.name} (DNI: ${traveler.dni})`);
        console.log(`   - Tiene imagen: ${!!traveler.dniImage}`);
        console.log(`   - URL obtenida: ${travelerImageUrls[index]}`);
        
        if (travelerImageUrls[index]) {
          const documento = {
            document_url: travelerImageUrls[index],
            viajero_id: traveler.dni, // Mantener como string
            tipo_documento: traveler.tipo_documento || "dni" // Usar el tipo específico del viajero
          };
          documentosData.push(documento);
          console.log(`   ✅ Documento agregado:`, documento);
        } else {
          console.log(`   ❌ No se pudo obtener URL para viajero ${traveler.name}`);
        }
      });
      
      console.log("📋 Array final de documentos:", documentosData);

    const NEW_BODY = {
      client_name: formData.customerName,
      client_email: formData.customerEmail,
      client_phone: formData.customerPhone,
      client_dni: formData.customerDni,
      client_address: formData.customerAddress,
      package: formData.package,
      quoted_flight: formData.quotedFlight,
      agency_cost: formData.agencyCost,
      amount: formData.amount,
      transaction_type: formData.transactionType,
      status: "pending",
      seller_id: 1,
      receipt: "mateo",
      start_date: formData.startDate,
      end_date: formData.endDate,
        travelers: formData.travelers.map((traveler) => ({
        name: traveler.name,
        dni: traveler.dni,
        date_birth: traveler.date_birth,
        phone: traveler.phone
      })),
        // Solo enviar travel_info si el paquete lo requiere
        ...(formData.package === "nacional" || formData.package === "internacional" || formData.package === "terrestre" ? {
          travel_info: (formData.hotelInfo || []).map((hotel: any) => ({
            hotel: hotel.hotel || "",
            noches: (parseInt(hotel?.noches) || 1).toString(),
            incluye: hotel.incluye || [],
            no_incluye: hotel.no_incluye || [],
            alimentacion: hotel.alimentacion || "",
            acomodacion: hotel.acomodacion || "",
            direccion_hotel: hotel.direccion_hotel || "",
            pais_destino: hotel.pais_destino || "",
            ciudad_destino: hotel.ciudad_destino || ""
          }))
        } : {}),
        // Solo enviar itinerario si el paquete lo requiere
        ...(formData.package === "nacional" || formData.package === "internacional" || formData.package === "migratorio" ? {
          itinerario: formData.flightInfo || []
        } : {})
      };

      console.log("Submitting form data:", NEW_BODY);
      console.log("Itinerario:", NEW_BODY.itinerario);
      console.log("Travel Info:", NEW_BODY.travel_info);
      console.log("Evidence URL:", evidenceUrl);
      console.log("Traveler Image URLs:", travelerImageUrls);
      console.log("Evidence Data:", evidencesData);
      console.log("Documents Data:", documentosData);
      console.log("JSON completo que se envía:", JSON.stringify(NEW_BODY, null, 2));
      
      // Log detallado de cada campo para debug
      console.log("🔍 Debug - Campos individuales:");
      console.log("🔍 client_name:", NEW_BODY.client_name);
      console.log("🔍 client_email:", NEW_BODY.client_email);
      console.log("🔍 client_phone:", NEW_BODY.client_phone);
      console.log("🔍 client_dni:", NEW_BODY.client_dni);
      console.log("🔍 client_address:", NEW_BODY.client_address);
      console.log("🔍 package:", NEW_BODY.package);
      console.log("🔍 quoted_flight:", NEW_BODY.quoted_flight);
      console.log("🔍 agency_cost:", NEW_BODY.agency_cost);
      console.log("🔍 amount:", NEW_BODY.amount);
      console.log("🔍 transaction_type:", NEW_BODY.transaction_type);
      console.log("🔍 status:", NEW_BODY.status);
      console.log("🔍 seller_id:", NEW_BODY.seller_id);
      console.log("🔍 receipt:", NEW_BODY.receipt);
      console.log("🔍 start_date:", NEW_BODY.start_date);
      console.log("🔍 end_date:", NEW_BODY.end_date);
      console.log("🔍 travelers:", NEW_BODY.travelers);
      console.log("🔍 travel_info:", NEW_BODY.travel_info);
      console.log("🔍 itinerario:", NEW_BODY.itinerario);

      // Log detallado de travel_info
      if (NEW_BODY.travel_info) {
        console.log("🔍 Debug - Travel Info detallado:");
        NEW_BODY.travel_info.forEach((hotel, index) => {
          console.log(`🔍 Hotel ${index + 1}:`, {
            hotel: hotel.hotel,
            noches: hotel.noches,
            incluye: hotel.incluye,
            no_incluye: hotel.no_incluye,
            alimentacion: hotel.alimentacion,
            acomodacion: hotel.acomodacion,
            direccion_hotel: hotel.direccion_hotel,
            pais_destino: hotel.pais_destino,
            ciudad_destino: hotel.ciudad_destino
          });
        });
      }

      // Log del formData original para comparar
      console.log("🔍 Debug - FormData original hotelInfo:");
      console.log("🔍 formData.hotelInfo:", formData.hotelInfo);

      // Crear la transacción usando axios directamente (como antes)
      const response = await axios.post(
        "https://fastapi-data-1-nc7j.onrender.com/transactions/",
        NEW_BODY,
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        }
      );

      console.log(
        "Transaction created successfully:",
        response
      );

      // Enviar evidencias y documentos usando los endpoints correctos
      const responseData = response.data as any;
      transactionId = responseData.transaction_id || responseData.id;
      
      console.log("🔍 Respuesta completa de la transacción:", responseData);
      console.log("🔍 Transaction ID:", transactionId);
      console.log("🔍 Travelers en responseData:", responseData.travelers);
      console.log("🔍 Keys de responseData:", Object.keys(responseData));

      if (transactionId) {
        console.log("🔄 Transaction ID obtenido:", transactionId);
        
        // Enviar evidencias
        if (evidencesData.length > 0) {
          console.log("📤 Enviando evidencias...");
          console.log("📤 Datos de evidencia:", evidencesData[0]);
          console.log("📤 JSON de evidencia:", JSON.stringify(evidencesData[0], null, 2));
          
          try {
            const evidenceResponse = await axios.post(
              `https://fastapi-data-1-nc7j.onrender.com/transactions/${transactionId}/evidence`,
              evidencesData[0], // Enviar solo el primer elemento del array
          {
            headers: {
                  "Content-Type": "application/json",
            },
          }
        );
            console.log("✅ Evidencias enviadas:", evidenceResponse.data);
          } catch (error) {
            console.error("❌ Error enviando evidencias:", error);
            if (error.response) {
              console.error("❌ Error response data:", error.response.data);
              console.error("❌ Error response status:", error.response.status);
            }
          }
        }
        
        // Enviar documentos de viajeros
        if (documentosData.length > 0) {
          console.log("📤 Enviando documentos de viajeros...");
          
          // Obtener los viajeros de la transacción creada
          console.log("🔍 Obteniendo viajeros de la transacción...");
          try {
            const transactionResponse = await axios.get(
              `https://fastapi-data-1-nc7j.onrender.com/transactions/${transactionId}`
            );
            const travelersFromResponse = transactionResponse.data.travelers || [];
            console.log("📋 Viajeros de la transacción:", travelersFromResponse);
            
            for (let i = 0; i < documentosData.length; i++) {
              const documento = documentosData[i];
              const travelerDni = documento.viajero_id; // Este es el DNI
              
              // Buscar el viajero por DNI para obtener su ID
              const traveler = travelersFromResponse.find(t => t.dni === travelerDni);
              if (!traveler || !traveler.id) {
                console.error(`❌ No se encontró el ID del viajero con DNI ${travelerDni}`);
                continue;
              }
              
              const travelerId = traveler.id; // Este es el ID numérico
              
              try {
                console.log(`🔍 Procesando documento para viajero ${travelerDni} (ID: ${travelerId}):`);
                console.log(`   - URL del documento: ${documento.document_url}`);
                console.log(`   - Tipo de documento: ${documento.tipo_documento}`);
                
                if (!documento.document_url || !documento.document_url.startsWith('http')) {
                  console.error(`❌ URL inválida para viajero ${travelerDni}: ${documento.document_url}`);
                  continue;
                }
                
                // Enviar URL directamente al backend
                const documentoData = {
                  document_file: documento.document_url,
                  tipo_documento: documento.tipo_documento,
                  filename: "" // Campo requerido pero vacío como especificaste
                };
                
                console.log(`📤 Enviando documento para viajero ${travelerDni} (ID: ${travelerId})...`);
                console.log(`📤 Datos del documento:`, documentoData);
                console.log(`📤 JSON que se envía:`, JSON.stringify(documentoData, null, 2));

                const documentoResponse = await axios.post(
                  endpoints.transactions.uploadTravelerDocument(transactionId.toString(), travelerId.toString()),
                  documentoData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
                console.log(`✅ Documento enviado para viajero ${travelerDni} (ID: ${travelerId}):`, documentoResponse.data);
              } catch (error) {
                console.error(`❌ Error enviando documento para viajero ${travelerDni} (ID: ${travelerId}):`, error);
                if (error.response) {
                  console.error(`❌ Error response data:`, error.response.data);
                  console.error(`❌ Error response status:`, error.response.status);
                } else if (error.request) {
                  console.error(`❌ Error de red:`, error.message);
                } else {
                  console.error(`❌ Error message:`, error.message);
                }
                // No lanzar el error para que no bloquee la creación de la venta
              }
            }
          } catch (error) {
            console.error("❌ Error obteniendo viajeros de la transacción:", error);
            console.log("⚠️ No se pudieron subir los documentos de viajeros");
          }
        }
      }

      // Verificar si la transacción está completa según el tipo de paquete (ANTES de refrescar)
      if (transactionId) {
        console.log("🔍 Debug - Validando transacción completa...");
        console.log("🔍 Debug - Tipo de paquete:", formData.package);
        console.log("🔍 Debug - Flight info:", formData.flightInfo);
        console.log("🔍 Debug - Hotel info:", formData.hotelInfo);
        
        const packageValidationErrors = validatePackageFields(formData);
        console.log("🔍 Debug - Errores de validación:", packageValidationErrors);
        
        const isComplete = packageValidationErrors.length === 0;
        console.log("🔍 Debug - ¿Está completa?:", isComplete);
        
        if (!isComplete) {
          console.log("⚠️ Transacción incompleta detectada. Actualizando estado a 'incompleta'...");
          console.log("❌ Campos faltantes:", packageValidationErrors);
          
          try {
            const statusResponse = await axios.patch(
              `https://fastapi-data-1-nc7j.onrender.com/transactions/${transactionId}/status?status=incompleta`,
              {},
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("✅ Estado actualizado a 'incompleta':", statusResponse.data);
          } catch (error) {
            console.error("❌ Error actualizando estado a 'incompleta':", error);
          }
        } else {
          console.log("✅ Transacción completa. Manteniendo estado por defecto.");
        }
      }

      alert("Venta creada correctamente");
      console.log("✅ Proceso completado exitosamente");

      // Refrescar las transacciones para que aparezcan en la lista (DESPUÉS de validar)
      await refreshTransactions();
      
    } catch (error) {
      console.error("❌ Failed to create sale:", error);
      
      // Log detallado del error
      if (error.response) {
        console.error("❌ Error response status:", error.response.status);
        console.error("❌ Error response data:", error.response.data);
        console.error("❌ Error response headers:", error.response.headers);
        
        // Mostrar detalles específicos del error 422
        if (error.response.status === 422 && error.response.data && error.response.data.detail) {
          console.error("❌ Detalles del error de validación:");
          error.response.data.detail.forEach((detail, index) => {
            console.error(`   ${index + 1}. Campo: ${detail.loc.join('.')} - Error: ${detail.msg}`);
          });
          
          // Mostrar alert con los errores específicos
          const errorMessages = error.response.data.detail.map(detail => 
            `${detail.loc.join('.')}: ${detail.msg}`
          ).join('\n');
          alert(`❌ Error de validación:\n${errorMessages}`);
        }
      } else if (error.request) {
        console.error("❌ Error request:", error.request);
        alert("❌ Error de conexión. Verifica tu conexión a internet.");
      } else {
        console.error("❌ Error message:", error.message);
        alert(`❌ Error: ${error.message}`);
      }
      
      throw error;
    } finally {
      setIsSubmitting(false);
      console.log("🔄 Estado de envío reseteado");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Customer Information */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-200 pb-2">
          Información del Cliente
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nombre completo *</Label>
            <Input
              value={formData.customerName}
              onChange={(e) => updateField("customerName", e.target.value)}
              placeholder="Nombre del cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Email *</Label>
            <Input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => updateField("customerEmail", e.target.value)}
              placeholder="email@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Teléfono *</Label>
            <Input
              value={formData.customerPhone}
              onChange={(e) => updateField("customerPhone", e.target.value)}
              placeholder="Número de teléfono"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Documento de identidad *</Label>
            <Input
              value={formData.customerDni}
              onChange={(e) => updateField("customerDni", e.target.value)}
              placeholder="Número de documento"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Dirección *</Label>
          <Textarea
            value={formData.customerAddress}
            onChange={(e) => updateField("customerAddress", e.target.value)}
            placeholder="Dirección completa del cliente"
            required
          />
        </div>
      </div>

      {/* Package Information */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex justify-between items-center border-b border-blue-200 pb-2">
          <h3 className="text-lg font-semibold text-blue-800">
          Información del Paquete
        </h3>
          <div className="text-sm">
            {(() => {
              const errors = validateBasicFields(formData);
              const totalFields = 11; // Campos básicos requeridos (sin documentos de viajeros)
              const completedFields = totalFields - errors.length;
              const percentage = Math.max(0, Math.min(100, (completedFields / totalFields) * 100));
              
              return (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">
                    {completedFields}/{totalFields} campos básicos completados
                  </span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        percentage === 100 ? 'bg-green-500' : 
                        percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-600">{Math.round(percentage)}%</span>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo de paquete *</Label>
            <Select
              value={formData.package}
              onValueChange={(value) => updateField("package", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de paquete" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="migratorio">Migratorio</SelectItem>
                <SelectItem value="terrestre">Terrestre</SelectItem>
                <SelectItem value="nacional">Nacional</SelectItem>
                <SelectItem value="internacional">Internacional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de transacción *</Label>
            <Select
              value={formData.transactionType}
              onValueChange={(value: "venta" | "abono") =>
                updateField("transactionType", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="venta">Venta</SelectItem>
                <SelectItem value="abono">Abono</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Vuelo cotizado</Label>
            <Input
              value={formData.quotedFlight}
              onChange={(e) => updateField("quotedFlight", e.target.value)}
              placeholder="Ruta del vuelo"
            />
          </div>

          <div className="space-y-2">
            <Label>Costo de agencia *</Label>
            <Input
              type="number"
              value={formData.agencyCost}
              onChange={(e) =>
                updateField("agencyCost", parseFloat(e.target.value))
              }
              placeholder="Costo para la agencia"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Precio total *</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                updateField("amount", parseFloat(e.target.value))
              }
              placeholder="Precio total del paquete"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Valor pagado *</Label>
            <Input
              type="number"
              value={formData.paidAmount}
              onChange={(e) =>
                updateField("paidAmount", parseFloat(e.target.value))
              }
              placeholder="Valor efectivamente pagado"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de documento *</Label>
            <Select
              value={formData.documentType}
              onValueChange={(value) => updateField("documentType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dni">DNI</SelectItem>
                <SelectItem value="pasaporte">Pasaporte</SelectItem>
                <SelectItem value="cedula">Cédula</SelectItem>
                <SelectItem value="tarjeta_identidad">Tarjeta de Identidad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fecha de inicio *</Label>
            <Input
              type="date"
              value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ""}
              onChange={(e) => updateField("startDate", new Date(e.target.value).toISOString())}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha de fin *</Label>
            <Input
              type="date"
              value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ""}
              onChange={(e) => updateField("endDate", new Date(e.target.value).toISOString())}
              required
            />
          </div>
        </div>

        <ImageUpload
          label="Comprobante de Pago"
          onImageSelect={(file) => updateField("invoiceImage", file)}
          required
        />
      </div>

      {/* Flight Information */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex justify-between items-center border-b border-blue-200 pb-2">
          <h3 className="text-lg font-semibold text-blue-800">
          Información del Vuelo
            {formData.package === "terrestre" && (
              <span className="text-sm text-gray-500 ml-2">(Opcional para paquetes terrestres)</span>
            )}
        </h3>
          <Button
            type="button"
            onClick={addFlight}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Vuelo
          </Button>
        </div>

        {formData.flightInfo?.map((flight, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Vuelo {index + 1}</h4>
              {formData.flightInfo && formData.flightInfo.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeFlight(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Aerolínea</Label>
            <Input
                  value={flight.aerolinea || ""}
                  onChange={(e) => updateFlightField(index, "aerolinea", e.target.value)}
              placeholder="Nombre de la aerolínea"
            />
          </div>

          <div className="space-y-2">
            <Label>Ruta</Label>
            <Input
                  value={flight.ruta || ""}
                  onChange={(e) => updateFlightField(index, "ruta", e.target.value)}
              placeholder="Origen - Destino"
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha del vuelo</Label>
            <Input
              type="date"
                  value={flight.fecha ? new Date(flight.fecha).toISOString().split('T')[0] : ""}
                  onChange={(e) => updateFlightField(index, "fecha", new Date(e.target.value).toISOString())}
            />
          </div>

          <div className="space-y-2">
            <Label>Hora de salida</Label>
            <Input
              type="time"
                  value={flight.hora_salida || ""}
                  onChange={(e) => updateFlightField(index, "hora_salida", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Hora de llegada</Label>
            <Input
              type="time"
                  value={flight.hora_llegada || ""}
                  onChange={(e) => updateFlightField(index, "hora_llegada", e.target.value)}
            />
          </div>
        </div>
          </div>
        ))}
      </div>

      {/* Hotel Information */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex justify-between items-center border-b border-blue-200 pb-2">
          <h3 className="text-lg font-semibold text-blue-800">
          Información del Hotel
            {formData.package === "migratorio" && (
              <span className="text-sm text-gray-500 ml-2">(Opcional para paquetes migratorios)</span>
            )}
        </h3>
          <Button
            type="button"
            onClick={addHotel}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Hotel
          </Button>
        </div>

        {formData.hotelInfo?.map((hotel, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Hotel {index + 1}</h4>
              {formData.hotelInfo && formData.hotelInfo.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeHotel(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nombre del hotel</Label>
            <Input
                  value={hotel.hotel || ""}
                  onChange={(e) => updateHotelField(index, "hotel", e.target.value)}
              placeholder="Nombre del hotel"
            />
          </div>

          <div className="space-y-2">
            <Label>Número de noches</Label>
            <Input
              type="number"
                  value={hotel.noches || 1}
                  onChange={(e) => updateHotelField(index, "noches", parseInt(e.target.value) || 1)}
              min="1"
              placeholder="Número de noches"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Incluye</Label>
            <Textarea
                  value={hotel.incluye?.join(", ") || ""}
                  onChange={(e) => updateHotelField(index, "incluye", e.target.value.split(", ").filter(item => item.trim()))}
              placeholder="Servicios incluidos (separados por comas)"
            />
          </div>

          <div className="space-y-2">
            <Label>No incluye</Label>
            <Textarea
                  value={hotel.no_incluye?.join(", ") || ""}
                  onChange={(e) => updateHotelField(index, "no_incluye", e.target.value.split(", ").filter(item => item.trim()))}
              placeholder="Servicios no incluidos (separados por comas)"
            />
          </div>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Alimentación</Label>
                <Input
                  value={hotel.alimentacion || ""}
                  onChange={(e) => updateHotelField(index, "alimentacion", e.target.value)}
                  placeholder="Tipo de alimentación (ej: Todo incluido, Media pensión)"
                />
              </div>

              <div className="space-y-2">
                <Label>Acomodación</Label>
                <Input
                  value={hotel.acomodacion || ""}
                  onChange={(e) => updateHotelField(index, "acomodacion", e.target.value)}
                  placeholder="Tipo de acomodación (ej: Habitación doble, Suite)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dirección del hotel</Label>
              <Input
                value={hotel.direccion_hotel || ""}
                onChange={(e) => updateHotelField(index, "direccion_hotel", e.target.value)}
                placeholder="Dirección completa del hotel"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>País de destino</Label>
                <Input
                  value={hotel.pais_destino || ""}
                  onChange={(e) => updateHotelField(index, "pais_destino", e.target.value)}
                  placeholder="País de destino"
                />
              </div>

              <div className="space-y-2">
                <Label>Ciudad de destino</Label>
                <Input
                  value={hotel.ciudad_destino || ""}
                  onChange={(e) => updateHotelField(index, "ciudad_destino", e.target.value)}
                  placeholder="Ciudad de destino"
            />
          </div>
        </div>

        {/* Cuentas de Recaudo */}
        <div className="border-t pt-4">
          <h4 className="text-md font-semibold text-blue-700 mb-4">
            Cuentas de Recaudo
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Banco</Label>
              <Input
                    value={hotel.cuentas_recaudo?.banco || ""}
                    onChange={(e) => updateCuentaRecaudoField(index, "banco", e.target.value)}
                placeholder="Nombre del banco"
              />
            </div>

            <div className="space-y-2">
              <Label>Número de cuenta</Label>
              <Input
                    value={hotel.cuentas_recaudo?.numero || ""}
                    onChange={(e) => updateCuentaRecaudoField(index, "numero", e.target.value)}
                placeholder="Número de cuenta"
              />
            </div>

            <div className="space-y-2">
              <Label>Nombre del titular</Label>
              <Input
                    value={hotel.cuentas_recaudo?.nombre || ""}
                    onChange={(e) => updateCuentaRecaudoField(index, "nombre", e.target.value)}
                placeholder="Nombre del titular de la cuenta"
              />
            </div>

            <div className="space-y-2">
              <Label>NIT</Label>
              <Input
                    value={hotel.cuentas_recaudo?.nit || ""}
                    onChange={(e) => updateCuentaRecaudoField(index, "nit", e.target.value)}
                placeholder="Número de identificación tributaria"
              />
            </div>
          </div>
        </div>
          </div>
        ))}
      </div>

      {/* Travelers */}
      <div className="bg-white p-6 rounded-lg border">
        <TravelerForm
          travelers={formData.travelers}
          onTravelersChange={(travelers) => updateField("travelers", travelers)}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading || isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting ? "Guardando..." : "Crear Venta"}
        </Button>
      </div>
    </form>
  );
};

export default EnhancedSalesForm;