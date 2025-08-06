import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Check, X, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import AppLayout from "../components/layout/AppLayout";
import PendingEvidence from "../components/admin/PendingEvidence";

const PendingEvidencePage = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Inicio
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Evidencias Pendientes</h1>
                <p className="text-gray-600">Revisa y aprueba las evidencias de pago enviadas por los vendedores</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-orange-800">Panel de Evidencias</h3>
                <p className="text-orange-600">
                  Gestiona las evidencias de pago pendientes de aprobación
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-orange-500" />
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  En Revisión
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Check className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-blue-800">Instrucciones de Aprobación</h4>
                <p className="text-sm text-blue-600">
                  Revisa cada evidencia de pago cuidadosamente. Haz clic en "Aprobar" si el comprobante es válido 
                  o "Rechazar" si hay algún problema. Las evidencias aprobadas se procesarán automáticamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Evidence Component */}
        <div className="space-y-4">
          <PendingEvidence />
        </div>
      </div>
    </AppLayout>
  );
};

export default PendingEvidencePage; 