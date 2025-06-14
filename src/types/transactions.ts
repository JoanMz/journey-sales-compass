
export interface Traveler {
  id: number;
  name: string;
  dni: string;
  age: number;
  phone: string;
  dni_image: string;
}

export interface Transaction {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_dni: string;
  client_address: string;
  invoice_image: string;
  id_image: string;
  package: string;
  quoted_flight?: string;
  agency_cost: number;
  amount: number;
  transaction_type?: "venta" | "abono";
  status: "pending"| "approved" | "rejected"| "terminado";
  seller_id: number;
  seller_name: string;
  receipt: string;
  start_date: string;
  end_date: string;
  travelers: Traveler[];
}
