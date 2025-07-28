// const baseUrl = "http://127.0.0.1:3001";
// const baseUrl = "https://fastapi3-production.up.railway.app";
const baseUrl = "https://fastapi-data-1-nc7j.onrender.com";
const baseUrl2 = "http://127.0.0.1:3000";
// const baseUrl = "http://vivecolbalancer-939205903.us-west-2.elb.amazonaws.com";
// const baseUrl = "https://medium-server3.vercel.app/api/transactions";
// const baseUrl = "http://localhost:3000";

const endpoints = {
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
    getById: (transactionId: number | string) =>
      `${baseUrl}/transactions/${transactionId}`,
    generateInvoice: `https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/dbed831e-3512-49a5-a50c-add211cc645f`,
    saveTransactions: `${baseUrl}/saveTransactions`,
    saveCompleteTransaction: (transactionId: number) => `${baseUrl}/transactions/${transactionId}`,
    createTransaction: `${baseUrl}/transactions`,
  },
  users: {
    all: `${baseUrl}/users`,
    delete: (userId: number | string) => `${baseUrl}/users/${userId}`,
    update: (userId: number | string) => `${baseUrl}/users/${userId}`,
  },
};

export default endpoints;
