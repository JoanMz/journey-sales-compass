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
import { SalesFormData, TravelerFormData } from "@/types/sales";
import ImageUpload from "../ui/image-upload";
import TravelerForm from "./TravelerForm";
import { useData } from "@/contexts/DataContext";
import axios from "axios";
import { endpoints } from "@/lib/endpoints";
import { baseUrl } from "@/lib/endpoints";



interface CompleteTransactionFormProps {
  transactionId: string;
  currentData: SalesFormData;
  onComplete: () => void;
  onCancel: () => void;
}

const CompleteTransactionForm: React.FC<CompleteTransactionFormProps> = ({
  transactionId,
  currentData,
  onComplete,
  onCancel,
}) => {
  console.log("🔍 CompleteTransactionForm recibió currentData:", currentData);
  console.log("🔍 hotelInfo en currentData:", currentData.hotelInfo);
  if (currentData.hotelInfo && currentData.hotelInfo.length > 0) {
    console.log("🔍 Primer hotel en currentData:", currentData.hotelInfo[0]);
    console.log("🔍 Campos del primer hotel:", {
      hotel: currentData.hotelInfo[0].hotel,
      alimentacion: currentData.hotelInfo[0].alimentacion,
      acomodacion: currentData.hotelInfo[0].acomodacion,
      direccion_hotel: currentData.hotelInfo[0].direccion_hotel,
      pais_destino: currentData.hotelInfo[0].pais_destino,
      ciudad_destino: currentData.hotelInfo[0].ciudad_destino,
    });
  }

  const { refreshTransactions } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SalesFormData>(currentData);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);

  const updateField = (field: keyof SalesFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateFlightField = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      flightInfo:
        prev.flightInfo?.map((flight, i) =>
          i === index ? { ...flight, [field]: value } : flight
        ) || [],
    }));
  };

  const updateHotelField = (index: number, field: string, value: any) => {
    console.log(
      `🔍 updateHotelField llamado - index: ${index}, field: ${field}, value:`,
      value
    );
    setFormData((prev) => {
      // Asegurar que hotelInfo existe y tiene el índice correcto
      const currentHotelInfo = prev.hotelInfo || [];
      const updatedHotelInfo = [...currentHotelInfo];

      // Si el índice no existe, crear un hotel vacío
      if (!updatedHotelInfo[index]) {
        updatedHotelInfo[index] = {
          hotel: "",
          noches: 1,
          alimentacion: "",
          acomodacion: "",
          direccion_hotel: "",
          pais_destino: "",
          ciudad_destino: "",
        };
      }

      // Actualizar el campo específico
      updatedHotelInfo[index] = {
        ...updatedHotelInfo[index],
        [field]: value,
      };

      const newData = {
        ...prev,
        hotelInfo: updatedHotelInfo,
      };

      console.log(
        `🔍 Estado actualizado - hotelInfo[${index}].${field}:`,
        newData.hotelInfo[index]?.[field]
      );
      console.log(
        `🔍 Estado completo del hotel ${index}:`,
        newData.hotelInfo[index]
      );
      console.log(`🔍 Estado completo de hotelInfo:`, newData.hotelInfo);
      return newData;
    });
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

  // Función para validar campos completos según el tipo de paquete
  const validatePackageFields = (data: SalesFormData): string[] => {
    const errors: string[] = [];

    // Validar información de vuelo
    if (
      data.package === "nacional" ||
      data.package === "internacional" ||
      data.package === "migratorio"
    ) {
      if (!data.flightInfo || data.flightInfo.length === 0) {
        errors.push("• Al menos un vuelo es requerido");
      } else {
        const firstFlight = data.flightInfo[0];
        if (
          !firstFlight.aerolinea ||
          !firstFlight.ruta ||
          !firstFlight.hora_salida ||
          !firstFlight.hora_llegada
        ) {
          errors.push(
            "• Información completa del vuelo (aerolínea, ruta, hora salida, hora llegada)"
          );
        }
      }
    }

    // Validar información de hotel
    if (
      data.package === "nacional" ||
      data.package === "internacional" ||
      data.package === "terrestre"
    ) {
      if (!data.hotelInfo || data.hotelInfo.length === 0) {
        errors.push("• Al menos un hotel es requerido");
      } else {
        const firstHotel = data.hotelInfo[0];
        if (!firstHotel.hotel || !firstHotel.noches || firstHotel.noches <= 0) {
          errors.push(
            "• Información completa del hotel (nombre y número de noches)"
          );
        }
      }
    }

    return errors;
  };

  // Función para validar y preparar datos del hotel
  const validateAndPrepareHotelData = (hotelData: any) => {
    console.log("🔍 Validando datos del hotel:", hotelData);

    if (!hotelData) {
      console.error("❌ No hay datos del hotel para validar");
      return null;
    }

    // Validar que los campos requeridos estén presentes
    if (!hotelData.hotel || hotelData.hotel.trim() === "") {
      console.error("❌ Nombre del hotel es requerido");
      return null;
    }

    if (!hotelData.noches || hotelData.noches <= 0) {
      console.error("❌ Número de noches debe ser mayor a 0");
      return null;
    }

    // Preparar datos limpios
    const cleanData = {
      hotel: hotelData.hotel.trim(),
      noches: parseInt(hotelData.noches.toString()) || 0,
      incluye: Array.isArray(hotelData.incluye) ? hotelData.incluye : [],
      no_incluye: Array.isArray(hotelData.no_incluye)
        ? hotelData.no_incluye
        : [],
      alimentacion: hotelData.alimentacion?.trim() || "",
      acomodacion: hotelData.acomodacion?.trim() || "",
      direccion_hotel: hotelData.direccion_hotel?.trim() || "",
      pais_destino: hotelData.pais_destino?.trim() || "",
      ciudad_destino: hotelData.ciudad_destino?.trim() || "",
    };

    console.log("✅ Datos del hotel validados y preparados:", cleanData);
    return cleanData;
  };

  // Función para verificar si el paquete está completo para envío a confirmación
  const isPackageCompleteForConfirmation = (data: SalesFormData): boolean => {
    const errors = validatePackageFields(data);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Validar que al menos se haya llenado algo según el tipo de paquete
      let hasFlightInfo =
        formData.flightInfo &&
        formData.flightInfo.length > 0 &&
        formData.flightInfo[0] &&
        (formData.flightInfo[0].aerolinea?.trim() ||
          formData.flightInfo[0].ruta?.trim() ||
          formData.flightInfo[0].hora_salida?.trim() ||
          formData.flightInfo[0].hora_llegada?.trim());

      let hasHotelInfo =
        formData.hotelInfo &&
        formData.hotelInfo.length > 0 &&
        (formData.hotelInfo[0].hotel?.trim() ||
          formData.hotelInfo[0].noches > 0);

      // Validar según el tipo de paquete
      let validationMessage = "";
      switch (formData.package) {
        case "migratorio":
          if (!hasFlightInfo) {
            validationMessage =
              "Para paquetes migratorios, debes completar al menos la información del vuelo.";
          }
          break;
        case "terrestre":
          if (!hasHotelInfo) {
            validationMessage =
              "Para paquetes terrestres, debes completar al menos la información del hotel.";
          }
          break;
        case "nacional":
        case "internacional":
          if (!hasFlightInfo && !hasHotelInfo) {
            validationMessage =
              "Para paquetes nacionales e internacionales, debes completar al menos la información del vuelo o del hotel.";
          }
          break;
      }

      if (validationMessage) {
        alert(validationMessage);
        setIsSubmitting(false);
        return;
      }

      // Obtener la transacción actual del backend para enviar toda la información
      let currentTransaction;
      try {
        console.log("🔍 Obteniendo transacción actual...");
        const getResponse = await axios.get(
          `${baseUrl}/transactions/${transactionId}`
        );
        currentTransaction = getResponse.data;
        console.log("✅ Transacción actual obtenida:", currentTransaction);
        console.log(
          "✅ Campos disponibles en la transacción:",
          Object.keys(currentTransaction)
        );
        console.log(
          "✅ Estructura de itinerario:",
          currentTransaction.itinerario
        );
        console.log(
          "✅ Estructura de travel_info:",
          currentTransaction.travel_info
        );
        console.log(
          "✅ Estructura de flight_info:",
          currentTransaction.flight_info
        );
        console.log(
          "✅ Estructura de hotel_info:",
          currentTransaction.hotel_info
        );

        // Verificar qué datos ya existían
        console.log("📋 Datos existentes antes de actualizar:");
        console.log(
          "📋 Itinerario existente:",
          currentTransaction.itinerario?.length > 0 ? "SÍ" : "NO"
        );
        console.log(
          "📋 Travel info existente:",
          currentTransaction.travel_info?.length > 0 ? "SÍ" : "NO"
        );
      } catch (getError) {
        console.error(
          "❌ Error obteniendo transacción actual:",
          getError.response?.status,
          getError.response?.data
        );
        alert(
          `Error: No se pudo obtener la transacción ${transactionId}. Verifica que el ID sea correcto.`
        );
        setIsSubmitting(false);
        return;
      }

      console.log("📤 Preparando actualización con endpoints específicos...");
      console.log("📤 Datos de vuelo a enviar:", formData.flightInfo);
      console.log("📤 Datos de hotel a enviar:", formData.hotelInfo);

      // Variables para rastrear qué se actualizó
      let itinerarioActualizado = false;
      let travelInfoActualizado = false;

      try {
        console.log("🔍 Verificando que la transacción existe...");
        const currentTransactionResponse = await axios.get(
          `${baseUrl}/transactions/${transactionId}`
        );
        const currentTransaction = currentTransactionResponse.data;
        console.log("✅ Transacción encontrada:", currentTransaction);

        // Determinar qué campos actualizar según el tipo de paquete
        console.log("📋 Tipo de paquete:", formData.package);

        // Verificar si hay datos de vuelo para enviar
        const hasFlightInfo =
          formData.flightInfo &&
          formData.flightInfo.length > 0 &&
          (formData.flightInfo[0]?.aerolinea?.trim() ||
            formData.flightInfo[0]?.ruta?.trim() ||
            formData.flightInfo[0]?.hora_salida?.trim() ||
            formData.flightInfo[0]?.hora_llegada?.trim());

        // Verificar si hay datos de hotel para enviar
        const hasHotelInfo =
          formData.hotelInfo &&
          formData.hotelInfo.length > 0 &&
          (formData.hotelInfo[0]?.hotel?.trim() ||
            formData.hotelInfo[0]?.noches > 0);

        console.log("📋 Tiene información de vuelo:", hasFlightInfo);
        console.log("📋 Tiene información de hotel:", hasHotelInfo);

        // Actualizar itinerario solo si es necesario según el tipo de paquete
        if (
          hasFlightInfo &&
          (formData.package === "migratorio" ||
            formData.package === "nacional" ||
            formData.package === "internacional")
        ) {
          console.log(
            "📤 Actualizando itinerario (requerido para este tipo de paquete)..."
          );

          try {
            // Verificar si ya existe un itinerario
            console.log(
              "🔍 Itinerario actual en la transacción:",
              currentTransaction.itinerario
            );

            if (
              currentTransaction.itinerario &&
              currentTransaction.itinerario.length > 0
            ) {
              // Actualizar itinerario existente
              const itinerarioId = currentTransaction.itinerario[0].id;
              console.log(
                "📤 Actualizando itinerario existente con ID:",
                itinerarioId
              );
              console.log(
                "📤 Itinerario completo:",
                currentTransaction.itinerario[0]
              );

              console.log(
                "📤 URL del endpoint itinerario:",
                `${baseUrl}/transactions/${transactionId}/itinerario/${itinerarioId}`
              );
              console.log(
                "📤 Payload itinerario:",
                JSON.stringify(formData.flightInfo[0], null, 2)
              );
              console.log("📤 Headers:", {
                "Content-Type": "application/json",
              });

              const itinerarioResponse = await axios.patch(
                `${baseUrl}/transactions/${transactionId}/itinerario/${itinerarioId}`,
                formData.flightInfo[0],
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              console.log(
                "✅ Itinerario actualizado exitosamente:",
                itinerarioResponse.data
              );
              itinerarioActualizado = true;
            } else {
              // Crear nuevo itinerario
              console.log("📤 Creando nuevo itinerario...");

              const itinerarioResponse = await axios.post(
                `${baseUrl}/transactions/${transactionId}/itinerario`,
                formData.flightInfo[0],
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              console.log(
                "✅ Nuevo itinerario creado exitosamente:",
                itinerarioResponse.data
              );
              itinerarioActualizado = true;
            }
          } catch (itinerarioError) {
            console.error("❌ Error actualizando itinerario:", itinerarioError);
            console.error("❌ Error response:", itinerarioError.response?.data);
            console.error("❌ Error status:", itinerarioError.response?.status);

            // Mostrar alerta específica para itinerario
            alert(
              "⚠️ ADVERTENCIA: La información del vuelo no se pudo actualizar. Contacta al administrador para verificar el endpoint de itinerario."
            );
          }
        } else if (hasFlightInfo) {
          console.log(
            "ℹ️ Información de vuelo disponible pero no requerida para paquete",
            formData.package
          );
        }

        // Actualizar travel_info solo si es necesario según el tipo de paquete
        if (
          hasHotelInfo &&
          (formData.package === "terrestre" ||
            formData.package === "nacional" ||
            formData.package === "internacional")
        ) {
          console.log(
            "📤 Actualizando travel_info (requerido para este tipo de paquete)..."
          );
          console.log("📤 formData.hotelInfo completo:", formData.hotelInfo);
          console.log(
            "📤 formData.hotelInfo[0] completo:",
            formData.hotelInfo[0]
          );

          // Validar y preparar datos del hotel
          const validatedHotelData = validateAndPrepareHotelData(
            formData.hotelInfo[0]
          );
          if (!validatedHotelData) {
            console.error(
              "❌ Datos del hotel no válidos, saltando actualización"
            );
            alert(
              "❌ Los datos del hotel no son válidos. Verifica que el nombre del hotel y número de noches estén completos."
            );
            return;
          }

          const travelInfoPayload = validatedHotelData;

          console.log(
            "🔍 TravelInfoPayload que se va a enviar:",
            travelInfoPayload
          );
          console.log(
            "🔍 formData.hotelInfo[0] actual:",
            formData.hotelInfo[0]
          );
          console.log("🔍 Verificando campos específicos:");
          console.log("   - hotel:", formData.hotelInfo[0]?.hotel);
          console.log(
            "   - noches:",
            formData.hotelInfo[0]?.noches,
            "tipo:",
            typeof formData.hotelInfo[0]?.noches
          );

          console.log(
            "   - alimentacion:",
            formData.hotelInfo[0]?.alimentacion
          );
          console.log("   - acomodacion:", formData.hotelInfo[0]?.acomodacion);
          console.log(
            "   - direccion_hotel:",
            formData.hotelInfo[0]?.direccion_hotel
          );
          console.log(
            "   - pais_destino:",
            formData.hotelInfo[0]?.pais_destino
          );
          console.log(
            "   - ciudad_destino:",
            formData.hotelInfo[0]?.ciudad_destino
          );

          try {
            // Verificar si ya existe travel_info
            console.log(
              "🔍 Travel info actual en la transacción:",
              currentTransaction.travel_info
            );

            if (
              currentTransaction.travel_info &&
              currentTransaction.travel_info.length > 0
            ) {
              // Actualizar travel_info existente
              const travelInfoId = currentTransaction.travel_info[0].id;
              console.log(
                "📤 Actualizando travel_info existente con ID:",
                travelInfoId
              );
              console.log(
                "📤 Travel info completo:",
                currentTransaction.travel_info[0]
              );

              console.log(
                "📤 URL del endpoint travel_info:",
                `${baseUrl}/transactions/${transactionId}/travel_info/${travelInfoId}`
              );
              console.log(
                "📤 Payload travel_info:",
                JSON.stringify(travelInfoPayload, null, 2)
              );
              console.log("📤 Headers:", {
                "Content-Type": "application/json",
              });

              const travelInfoResponse = await axios.patch(
                `${baseUrl}/transactions/${transactionId}/travel_info/${travelInfoId}`,
                travelInfoPayload,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              console.log(
                "✅ Travel info actualizado exitosamente:",
                travelInfoResponse.data
              );
              travelInfoActualizado = true;
            } else {
              // Crear nuevo travel_info
              console.log("📤 Creando nuevo travel_info...");

              const travelInfoResponse = await axios.post(
                `${baseUrl}/transactions/${transactionId}/travel_info`,
                travelInfoPayload,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              console.log(
                "✅ Nuevo travel_info creado exitosamente:",
                travelInfoResponse.data
              );
              travelInfoActualizado = true;
            }
          } catch (travelInfoError) {
            console.error(
              "❌ Error actualizando travel_info:",
              travelInfoError
            );
            console.error("❌ Error response:", travelInfoError.response?.data);
            console.error("❌ Error status:", travelInfoError.response?.status);

            // Mostrar alerta específica para travel_info
            alert(
              "⚠️ ADVERTENCIA: La información del hotel no se pudo actualizar. Revisa la consola para más detalles."
            );
          }
        } else if (hasHotelInfo) {
          console.log(
            "ℹ️ Información de hotel disponible pero no requerida para paquete",
            formData.package
          );
        }

        // Verificar que los datos se actualizaron correctamente
        console.log("🔍 Verificando actualización...");
        const verifyResponse = await axios.get(
          `${baseUrl}/transactions/${transactionId}`
        );
        console.log(
          "✅ Datos actualizados en el backend:",
          verifyResponse.data
        );
        console.log(
          "✅ Itinerario en backend:",
          verifyResponse.data.itinerario
        );
        console.log(
          "✅ Travel info en backend:",
          verifyResponse.data.travel_info
        );

        // Mostrar resultado
        if (itinerarioActualizado || travelInfoActualizado) {
          console.log(
            "✅ Los datos se actualizaron correctamente en el backend"
          );
          const updatedFields = [];
          if (itinerarioActualizado)
            updatedFields.push("información del vuelo");
          if (travelInfoActualizado)
            updatedFields.push("información del hotel");
          console.log("✅ Campos actualizados:", updatedFields.join(" y "));

          // Mostrar mensaje de éxito específico
          const successMessage = `✅ Información actualizada correctamente: ${updatedFields.join(
            " y "
          )}`;
          alert(successMessage);
        } else {
          console.log("ℹ️ No se actualizó ningún campo");
          alert(
            "ℹ️ No se actualizó ningún campo. Verifica que hayas llenado al menos un campo."
          );
        }
      } catch (patchError) {
        console.error("❌ Error en PATCH request:", patchError);
        console.error("❌ Error response:", patchError.response?.data);
        console.error("❌ Error status:", patchError.response?.status);
        console.error("❌ Error headers:", patchError.response?.headers);

        // Mostrar detalles específicos del error de validación
        if (patchError.response?.data?.detail) {
          console.error("❌ Detalles de validación:");
          patchError.response.data.detail.forEach(
            (error: any, index: number) => {
              console.error(`❌ Error ${index + 1}:`, error);
              console.error(`❌ Campo: ${error.loc?.join(".")}`);
              console.error(`❌ Tipo: ${error.type}`);
              console.error(`❌ Mensaje: ${error.msg}`);
            }
          );
        }

        throw patchError; // Re-lanzar el error para que se maneje en el catch principal
      }

      // Mostrar mensaje específico de qué se actualizó
      const updatedFields = [];
      if (itinerarioActualizado) updatedFields.push("información del vuelo");
      if (travelInfoActualizado) updatedFields.push("información del hotel");

      const successMessage = `Información actualizada correctamente: ${updatedFields.join(
        " y "
      )}`;
      console.log("✅", successMessage);

      // Subir documentos de viajeros si hay alguno con documento
      const travelersWithDocuments = formData.travelers.filter(
        (traveler) => traveler.dniImage
      );
      console.log("📋 Viajeros con documentos:", travelersWithDocuments.length);
      console.log("📋 Tipo de documento seleccionado:", formData.documentType);

      let documentosExitosos = 0;

      if (travelersWithDocuments.length > 0) {
        // Validar que se haya seleccionado un tipo de documento
        if (!formData.documentType || formData.documentType === "") {
          alert(
            "Debes seleccionar un tipo de documento para los viajeros antes de continuar."
          );
          setIsSubmitting(false);
          return;
        }

        console.log("📤 Subiendo documentos de viajeros...");

        try {
          // Preparar todas las imágenes para enviar al webhook
          const allImagesFormData = new FormData();
          const imageOrder = [];

          // Agregar imágenes de documentos de viajeros
          travelersWithDocuments.forEach((traveler, index) => {
            if (traveler.dniImage) {
              allImagesFormData.append(
                `traveler_dni_${index}`,
                traveler.dniImage
              );
              imageOrder.push(`traveler_${index}`);
              console.log(
                `✅ Agregando imagen del DNI del viajero ${index + 1}: ${
                  traveler.name
                } (DNI: ${traveler.dni}) - ${traveler.dniImage.name}`
              );
            }
          });

          // Enviar todas las imágenes al webhook
          if (allImagesFormData.has("traveler_dni_0")) {
            console.log("✅ Subiendo documentos al webhook...");

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
            let uploadedImageUrls = [];
            if (imageResponse.data && imageResponse.data.length > 0) {
              uploadedImageUrls = imageResponse.data.map(
                (item) => item?.imageUrl || ""
              );
              console.log(
                "URLs de los documentos obtenidas:",
                uploadedImageUrls
              );
            }

            // Enviar documentos al backend
            for (let i = 0; i < travelersWithDocuments.length; i++) {
              const traveler = travelersWithDocuments[i];
              const documentUrl = uploadedImageUrls[i];

              if (documentUrl) {
                try {
                  const documentoData = {
                    document_file: documentUrl,
                    tipo_documento: formData.documentType,
                  };

                  console.log(
                    `📤 Enviando documento para viajero ${traveler.dni}...`
                  );

                  const documentoResponse = await axios.post(
                    `${baseUrl}/transactions/${transactionId}/documentos/${traveler.dni}`,
                    documentoData,
                    {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  );

                  console.log(
                    `✅ Documento enviado para viajero ${traveler.dni}:`,
                    documentoResponse.data
                  );
                  documentosExitosos++;
                } catch (error) {
                  console.error(
                    `❌ Error enviando documento para viajero ${traveler.dni}:`,
                    error
                  );
                  console.log(
                    "💡 Nota: El backend actual espera archivos binarios. Cambia el backend para recibir URLs."
                  );
                }
              }
            }

            console.log(
              `📊 Resumen de documentos: ${documentosExitosos}/${travelersWithDocuments.length} enviados exitosamente`
            );
          }
        } catch (error) {
          console.error("❌ Error subiendo documentos de viajeros:", error);
          // No fallar la transacción por errores en documentos
        }
      } else {
        console.log("📋 No hay documentos de viajeros para subir");
      }

      // Mensaje final que incluya información sobre documentos
      let finalMessage = successMessage;
      if (travelersWithDocuments.length > 0) {
        finalMessage += `\n\nDocumentos de viajeros: ${travelersWithDocuments.length} documento(s) procesado(s)`;
        if (typeof documentosExitosos !== "undefined") {
          finalMessage += ` (${documentosExitosos} enviados exitosamente)`;
        }
      }

      alert(finalMessage);
      onComplete();
    } catch (error) {
      console.error("❌ Error actualizando transacción:", error);
      if (error.response) {
        console.error("❌ Error response data:", error.response.data);
        console.error("❌ Error response status:", error.response.status);
      }
      alert("Error al completar la información");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          Completar Información de Transacción #{transactionId}
        </h2>
        <p className="text-blue-700">
          Tipo de paquete:{" "}
          <span className="font-semibold">{formData.package}</span>
        </p>
        <p className="text-sm text-blue-600 mt-2">
          Completa la información faltante según el tipo de paquete
          seleccionado.
        </p>
      </div>

      {/* Flight Information */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex justify-between items-center border-b border-blue-200 pb-2">
          <h3 className="text-lg font-semibold text-blue-800">
            Información del Vuelo
            {formData.package === "terrestre" && (
              <span className="text-sm text-gray-500 ml-2">
                (Opcional para paquetes terrestres)
              </span>
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
                  onChange={(e) =>
                    updateFlightField(index, "aerolinea", e.target.value)
                  }
                  placeholder="Nombre de la aerolínea"
                />
              </div>

              <div className="space-y-2">
                <Label>Ruta</Label>
                <Input
                  value={flight.ruta || ""}
                  onChange={(e) =>
                    updateFlightField(index, "ruta", e.target.value)
                  }
                  placeholder="Origen - Destino"
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha del vuelo</Label>
                <Input
                  type="date"
                  value={
                    flight.fecha
                      ? new Date(flight.fecha).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateFlightField(
                      index,
                      "fecha",
                      new Date(e.target.value).toISOString()
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Hora de salida</Label>
                <Input
                  type="time"
                  value={flight.hora_salida || ""}
                  onChange={(e) =>
                    updateFlightField(index, "hora_salida", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Hora de llegada</Label>
                <Input
                  type="time"
                  value={flight.hora_llegada || ""}
                  onChange={(e) =>
                    updateFlightField(index, "hora_llegada", e.target.value)
                  }
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
              <span className="text-sm text-gray-500 ml-2">
                (Opcional para paquetes migratorios)
              </span>
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
                  onChange={(e) =>
                    updateHotelField(index, "hotel", e.target.value)
                  }
                  placeholder="Nombre del hotel"
                />
              </div>

              <div className="space-y-2">
                <Label>Número de noches</Label>
                <Input
                  type="number"
                  value={hotel.noches || 1}
                  onChange={(e) =>
                    updateHotelField(index, "noches", parseInt(e.target.value))
                  }
                  min="1"
                  placeholder="Número de noches"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Alimentación</Label>
                <Input
                  value={hotel.alimentacion || ""}
                  onChange={(e) =>
                    updateHotelField(index, "alimentacion", e.target.value)
                  }
                  placeholder="Tipo de alimentación (ej: Todo incluido, Media pensión)"
                />
              </div>

              <div className="space-y-2">
                <Label>Acomodación</Label>
                <Input
                  value={hotel.acomodacion || ""}
                  onChange={(e) =>
                    updateHotelField(index, "acomodacion", e.target.value)
                  }
                  placeholder="Tipo de acomodación (ej: Habitación doble, Suite)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dirección del hotel</Label>
              <Input
                value={hotel.direccion_hotel || ""}
                onChange={(e) =>
                  updateHotelField(index, "direccion_hotel", e.target.value)
                }
                placeholder="Dirección completa del hotel"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>País de destino</Label>
                <Input
                  value={hotel.pais_destino || ""}
                  onChange={(e) =>
                    updateHotelField(index, "pais_destino", e.target.value)
                  }
                  placeholder="País de destino"
                />
              </div>

              <div className="space-y-2">
                <Label>Ciudad de destino</Label>
                <Input
                  value={hotel.ciudad_destino || ""}
                  onChange={(e) =>
                    updateHotelField(index, "ciudad_destino", e.target.value)
                  }
                  placeholder="Ciudad de destino"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Documentos de Viajeros */}
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <div className="flex justify-between items-center border-b border-blue-200 pb-2">
          <h3 className="text-lg font-semibold text-blue-800">
            Documentos de Viajeros
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowDocumentUpload(!showDocumentUpload)}
          >
            {showDocumentUpload ? "Ocultar" : "Agregar Documentos"}
          </Button>
        </div>

        {showDocumentUpload && (
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                <strong>Nota:</strong> Si los viajeros no tienen documentos
                subidos, puedes agregarlos aquí. Los documentos se enviarán
                automáticamente al backend después de completar la información.
              </p>
            </div>

            <TravelerForm
              travelers={formData.travelers}
              onTravelersChange={(travelers) =>
                updateField("travelers", travelers)
              }
            />

            <div className="space-y-2">
              <Label>Tipo de documento para todos los viajeros</Label>
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
                  <SelectItem value="tarjeta_identidad">
                    Tarjeta de Identidad
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progreso de completado
          </span>
          <span className="text-sm text-gray-500">
            {isPackageCompleteForConfirmation(formData)
              ? "✅ Completo"
              : "⚠️ Incompleto"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              isPackageCompleteForConfirmation(formData)
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
            style={{
              width: isPackageCompleteForConfirmation(formData)
                ? "100%"
                : "70%",
            }}
          ></div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          className="bg-green-600 hover:bg-green-700"
          disabled={!isPackageCompleteForConfirmation(formData) || isSubmitting}
          onClick={async () => {
            try {
              setIsSubmitting(true);

              // Debug: Mostrar información del paquete y datos
              console.log("🔍 Debug - Tipo de paquete:", formData.package);
              console.log("🔍 Debug - Flight info:", formData.flightInfo);
              console.log("🔍 Debug - Hotel info:", formData.hotelInfo);
              console.log(
                "🔍 Debug - Estado completo del formulario:",
                formData
              );

              // Verificar específicamente los datos del hotel
              if (formData.hotelInfo && formData.hotelInfo.length > 0) {
                console.log("🔍 Debug - Primer hotel:", formData.hotelInfo[0]);
                console.log("🔍 Debug - Campos del hotel:");
                Object.entries(formData.hotelInfo[0]).forEach(
                  ([key, value]) => {
                    console.log(`   ${key}:`, value, "tipo:", typeof value);
                  }
                );
              }

              // Validar que todo esté completo ANTES de procesar nada
              const validationErrors = validatePackageFields(formData);
              console.log(
                "🔍 Debug - Errores de validación:",
                validationErrors
              );

              if (validationErrors.length > 0) {
                alert(
                  `❌ Validación fallida. Por favor completa los siguientes campos:\n${validationErrors.join(
                    "\n"
                  )}`
                );
                return; // Detiene todo el proceso aquí
              }

              console.log(
                "✅ Validación exitosa - todos los campos requeridos están completos"
              );

              // Obtener la transacción actual para ver qué datos existen
              console.log("🔍 Obteniendo transacción actual...");
              const getResponse = await axios.get(
                `${baseUrl}/transactions/${transactionId}`
              );
              const currentTransaction = getResponse.data;
              console.log(
                "✅ Transacción actual obtenida:",
                currentTransaction
              );

              // Procesar vuelos (itinerario) - solo si el paquete lo requiere
              const requiresFlight = [
                "nacional",
                "internacional",
                "migratorio",
              ].includes(formData.package);
              if (
                requiresFlight &&
                formData.flightInfo &&
                formData.flightInfo.length > 0
              ) {
                console.log("📤 Procesando vuelos...");
                for (let i = 0; i < formData.flightInfo.length; i++) {
                  const flight = formData.flightInfo[i];

                  // Verificar si este vuelo tiene datos válidos (no está vacío)
                  const hasValidFlightData =
                    flight.aerolinea &&
                    flight.aerolinea.trim() !== "" &&
                    flight.ruta &&
                    flight.ruta.trim() !== "" &&
                    flight.fecha &&
                    flight.hora_salida &&
                    flight.hora_llegada;

                  if (!hasValidFlightData) {
                    console.log(
                      `⏭️ Saltando vuelo ${i + 1} - datos incompletos`
                    );
                    continue;
                  }

                  // Verificar si este vuelo ya tiene ID (existe en el backend)
                  // Si el vuelo viene del currentData y tiene ID, es porque ya existe
                  const existingFlight =
                    currentData.flightInfo && currentData.flightInfo[i];

                  if (existingFlight && (existingFlight as any).id) {
                    // PATCH - Actualizar vuelo existente
                    console.log(
                      `📤 Actualizando vuelo existente ID: ${
                        (existingFlight as any).id
                      }`
                    );
                    await axios.patch(
                      `${baseUrl}/transactions/${transactionId}/itinerario/${
                        (existingFlight as any).id
                      }`,
                      {
                        aerolinea: flight.aerolinea,
                        ruta: flight.ruta,
                        fecha: flight.fecha,
                        hora_salida: flight.hora_salida,
                        hora_llegada: flight.hora_llegada,
                      },
                      {
                        headers: { "Content-Type": "application/json" },
                      }
                    );
                  } else {
                    // POST - Crear nuevo vuelo
                    console.log(`📤 Creando nuevo vuelo ${i + 1}`);
                    await axios.post(
                      `${baseUrl}/transactions/${transactionId}/itinerario`,
                      {
                        aerolinea: flight.aerolinea,
                        ruta: flight.ruta,
                        fecha: flight.fecha,
                        hora_salida: flight.hora_salida,
                        hora_llegada: flight.hora_llegada,
                      },
                      {
                        headers: { "Content-Type": "application/json" },
                      }
                    );
                  }
                }
              }

              // Procesar hoteles (travel_info) - solo si el paquete lo requiere
              const requiresHotel = [
                "nacional",
                "internacional",
                "terrestre",
              ].includes(formData.package);
              if (
                requiresHotel &&
                formData.hotelInfo &&
                formData.hotelInfo.length > 0
              ) {
                console.log("📤 Procesando hoteles...");
                for (let i = 0; i < formData.hotelInfo.length; i++) {
                  const hotel = formData.hotelInfo[i];

                  // Validar datos del hotel
                  const validatedHotelData = validateAndPrepareHotelData(hotel);
                  if (!validatedHotelData) {
                    console.log(
                      `⏭️ Saltando hotel ${i + 1} - datos no válidos`
                    );
                    continue;
                  }

                  // Verificar si este hotel ya tiene ID (existe en el backend)
                  // Si el hotel viene del currentData y tiene ID, es porque ya existe
                  const existingHotel =
                    currentData.hotelInfo && currentData.hotelInfo[i];

                  if (existingHotel && (existingHotel as any).id) {
                    // PATCH - Actualizar hotel existente
                    console.log(
                      `📤 Actualizando hotel existente ID: ${
                        (existingHotel as any).id
                      }`
                    );
                    await axios.patch(
                      `${baseUrl}/transactions/${transactionId}/travel_info/${
                        (existingHotel as any).id
                      }`,
                      validatedHotelData,
                      {
                        headers: { "Content-Type": "application/json" },
                      }
                    );
                  } else {
                    // POST - Crear nuevo hotel
                    console.log(`📤 Creando nuevo hotel ${i + 1}`);
                    await axios.post(
                      `${baseUrl}/transactions/${transactionId}/travel_info`,
                      validatedHotelData,
                      {
                        headers: { "Content-Type": "application/json" },
                      }
                    );
                  }
                }
              }

              // Actualizar estado a "pending"
              console.log("📤 Actualizando estado a 'pending'...");
              const statusResponse = await axios.put(
                endpoints.transactions.patchStatus(transactionId),
                // `http://localhost:3000/transactions/${transactionId}/status`,
                { status: "pending" }
              );

              console.log(
                "✅ Estado actualizado a 'pending':",
                statusResponse.data
              );

              // Refrescar los datos para que se actualice la vista
              console.log("🔄 Refrescando datos...");
              await refreshTransactions();

              alert(
                "✅ Información completada y enviada a confirmación exitosamente"
              );
              onComplete(); // Cierra el modal
            } catch (error) {
              console.error("❌ Error enviando a confirmación:", error);
              if (error.response) {
                console.error("❌ Error response:", error.response.data);
                alert(
                  `❌ Error al enviar a confirmación: ${
                    error.response.data?.detail || error.message
                  }`
                );
              } else {
                alert("❌ Error al enviar a confirmación. Intenta nuevamente.");
              }
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {isSubmitting ? "Enviando..." : "Enviar a Confirmación"}
        </Button>
      </div>
    </div>
  );
};

export default CompleteTransactionForm;
