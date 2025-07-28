// const baseUrl = "http://127.0.0.1:3001";
// const baseUrl = "https://fastapi3-production.up.railway.app";
const baseUrl = "https://fastapi-data-qit7.onrender.com";
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
    generateInvoice: `https://elder-link-staging-n8n.fwoasm.easypanel.host/webhook/11de8c01-b4e2-4bf1-a672-29512e8751c7`,
    saveTransactions: `${baseUrl}/saveTransactions`,
  },
  users: {
    all: `${baseUrl}/users`,
    delete: (userId: number | string) => `${baseUrl}/users/${userId}`,
    update: (userId: number | string) => `${baseUrl}/users/${userId}`,
  },
};

export default endpoints;
