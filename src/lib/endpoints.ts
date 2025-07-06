const baseUrl = "http://127.0.0.1:3001";
// const baseUrl = "http://vivecolbalancer-939205903.us-west-2.elb.amazonaws.com";
// const baseUrl = "https://medium-server3.vercel.app/api/transactions";
// const baseUrl = "http://localhost:3000";


const endpoints = {
  transactions: {
    // all: `${baseUrl}/api/transactions`,
    all: `${baseUrl}/transactions`,
    dateRange: (startDate: any, endDate: any, dateField: string = 'created_at') => 
      `${baseUrl}/transactions/date-range/?start_date=${startDate}&end_date=${endDate}&date_field=${dateField}`,
    updateStatus: (transactionId: number | string, status: string) =>
      `${baseUrl}/transactions/${transactionId}/status?status=${status}`,
  getById: (transactionId: number | string) => `${baseUrl}/transactions/${transactionId}`,
  },
  users: {
    all: `${baseUrl}/users`,
  },
};

export default endpoints;