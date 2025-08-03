export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  customer: Customer;
  status: OrderStatus;
  total: number;
  orderDate: Date;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderFilters {
  search: string;
  status: OrderStatus | "all";
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  amountRange: {
    min: number;
    max: number;
  };
}

export interface SortConfig {
  key: keyof Order | "customerName";
  direction: "asc" | "desc";
}
