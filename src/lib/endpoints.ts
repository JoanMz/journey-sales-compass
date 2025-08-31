// const baseUrl = "http://127.0.0.1:3001";
// const baseUrl = "https://fastapi3-production.up.railway.app";
const baseUrl = "https://fastapi-data-1-nc7j.onrender.com";
//const baseUrl = "http://127.0.0.1:3000";
// const baseUrl = "http://vivecolbalancer-939205903.us-west-2.elb.amazonaws.com";
// const baseUrl = "https://medium-server3.vercel.app/api/transactions";
// const baseUrl = "http://localhost:3000";

export const endpoints = {
  transactions: {
    // all: `${baseUrl}/api/transactions`,
    all: `${baseUrl}/transactions`,
    dateRange: (
      startDate: any,
      endDate: any,
      dateField: string = "created_at"
    ) =>
      `${baseUrl}/transactions/date-range/?start_date=${startDate}&end_date=${endDate}&date_field=${dateField}`,
    updateStatus: (transactionId: number | string, status: string) =>
      `${baseUrl}/transactions/${transactionId}/status?status=${status}`,
    patchStatus: (transactionId: number | string) =>
      `${baseUrl}/transactions/${transactionId}/status`,
      // `${baseUrl}/transactions/${transactionId}/status?status=pending`,
    patchStatusIncomplete: (transactionId: number | string) =>
      `${baseUrl}/transactions/${transactionId}/status`,
      // `${baseUrl}/transactions/${transactionId}/status?status=incompleta`,
    postTransaction:  `${baseUrl}/transactions/`,
    getById: (transactionId: number | string) =>
      `${baseUrl}/transactions/${transactionId}`,
    generateInvoice: `https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/dbed831e-3512-49a5-a50c-add211cc645f`,
    saveTransactions: `${baseUrl}/saveTransactions`,
    saveCompleteTransaction: (transactionId: number) =>
      `${baseUrl}/transactions/${transactionId}`,
    createTransaction: `${baseUrl}/transactions`,
    uploadTravelerDocument: (transactionId: string, travelerId: string) =>
      `${baseUrl}/transactions/${transactionId}/documentos/${travelerId}`,
    getUserUnpaid: (userId: string) =>
      `${baseUrl}/transactions/user/unpaid/${userId}`,
    getUserPaid: (userId: string) =>
      `${baseUrl}/transactions/user/paid/${userId}`,
    filterMixed: (
      sellerId?: number,
      status?: string,
      startDate?: string,
      endDate?: string
    ) => {
      const params = new URLSearchParams();
      if (sellerId) params.append("seller_id", sellerId.toString());
      if (status) params.append("status", status);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      return `${baseUrl}/transactions/filter-mixed/?${params.toString()}`;
    },
    getAccountData: `${baseUrl}/cuentas-recaudo/`,
    postNewAbono: (transactionId: number | string = 2313) =>
      `${baseUrl}/transactions/${transactionId}/factura`,
    addEvidence: (transactionId: number | string) =>
      `${baseUrl}/transactions/${transactionId}/evidence`,
  },
  evidence: {
    getPending: (
      transactionStatus: string = "approved",
      status: string = "pending"
    ) =>
      `${baseUrl}/transactions/evidence/filter/${status}?transaction_status=${transactionStatus}`,
    getPendingToApproved: `${baseUrl}/transactions/evidence/filter/pending?transaction_status=approved`,
    getPendingEvidence: `${baseUrl}/transactions/evidence/filter/approved/not-invoiced?transaction_status=approved&payment_status=pago_incompleto`,
    getInvoicedEvidence: `${baseUrl}/transactions/evidence/filter/approved/not-invoiced?transaction_status=approved&payment_status=pago_incompleto&invoice=facturado`,
    updateStatus: (evidenceId: number | string, status: string) =>
      `${baseUrl}/transactions/evidence/${evidenceId}/status?status=${status}`,
  },
  travelManagement: {
    getManageFliesBySeller: (sellerId: number, currentDate: string) =>
      `${baseUrl}/transactions/manageFlies/by-seller/${sellerId}?current_date=${currentDate}`,
  },
  metrics: {
    getTotalIncome: (fecha_inicio?: string, fecha_fin?: string, user_id?: number | string) => {
      const params = new URLSearchParams();
      if (fecha_inicio) params.append("fecha_inicio", fecha_inicio);
      if (fecha_fin) params.append("fecha_fin", fecha_fin);
      if (user_id) params.append("user_id", user_id.toString());
      const query = params.toString();
      return `${baseUrl}/transactions/ingresos-totales/${query ? "?" + query : ""}`;
    },
    getMonthlyIncomeByPeriod: (fecha_inicio: string, fecha_fin: string) => {
      return `${baseUrl}/transactions/ingresos-totales-mensual/?fecha_inicio=${encodeURIComponent(fecha_inicio)}&fecha_fin=${encodeURIComponent(fecha_fin)}`;
    },
    getCommissionsByUser: (fecha_inicio: string, fecha_fin: string) => {
      return `${baseUrl}/transactions/comisiones-por-usuario/?fecha_inicio=${encodeURIComponent(fecha_inicio)}&fecha_fin=${encodeURIComponent(fecha_fin)}`;
    },
  },
  users: {
    all: `${baseUrl}/users`,
    delete: (userId: number | string) => `${baseUrl}/users/${userId}`,
    update: (userId: number | string) => `${baseUrl}/users/${userId}`,
  },
};
