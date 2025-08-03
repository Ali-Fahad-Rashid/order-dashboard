import {
  Order,
  OrderStatus,
  Customer,
  OrderItem,
  ShippingAddress,
} from "@shared/orders";

const customers: Customer[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    phone: "+1-555-0101",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@email.com",
    phone: "+1-555-0102",
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol.williams@email.com",
    phone: "+1-555-0103",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "+1-555-0104",
  },
  {
    id: "5",
    name: "Eva Davis",
    email: "eva.davis@email.com",
    phone: "+1-555-0105",
  },
  {
    id: "6",
    name: "Frank Miller",
    email: "frank.miller@email.com",
    phone: "+1-555-0106",
  },
  {
    id: "7",
    name: "Grace Wilson",
    email: "grace.wilson@email.com",
    phone: "+1-555-0107",
  },
  {
    id: "8",
    name: "Henry Moore",
    email: "henry.moore@email.com",
    phone: "+1-555-0108",
  },
  {
    id: "9",
    name: "Ivy Taylor",
    email: "ivy.taylor@email.com",
    phone: "+1-555-0109",
  },
  {
    id: "10",
    name: "Jack Anderson",
    email: "jack.anderson@email.com",
    phone: "+1-555-0110",
  },
];

const products: Omit<OrderItem, "id" | "quantity">[] = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 99.99,
    image: "/placeholder.svg",
  },
  { name: "Smart Watch Series 8", price: 299.99, image: "/placeholder.svg" },
  { name: "Laptop Stand Adjustable", price: 49.99, image: "/placeholder.svg" },
  { name: "USB-C Hub 7-in-1", price: 79.99, image: "/placeholder.svg" },
  { name: "Mechanical Keyboard RGB", price: 149.99, image: "/placeholder.svg" },
  { name: "Wireless Mouse Ergonomic", price: 69.99, image: "/placeholder.svg" },
  { name: "Monitor 27 inch 4K", price: 399.99, image: "/placeholder.svg" },
  { name: "Desk Organizer Bamboo", price: 29.99, image: "/placeholder.svg" },
  { name: "Phone Case Protective", price: 19.99, image: "/placeholder.svg" },
  { name: "Tablet Stand Aluminum", price: 39.99, image: "/placeholder.svg" },
];

const addresses: ShippingAddress[] = [
  {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
  },
  {
    street: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    country: "USA",
  },
  {
    street: "789 Pine Rd",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    country: "USA",
  },
  {
    street: "321 Elm St",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    country: "USA",
  },
  {
    street: "654 Maple Dr",
    city: "Phoenix",
    state: "AZ",
    zipCode: "85001",
    country: "USA",
  },
  {
    street: "987 Cedar Ln",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19101",
    country: "USA",
  },
  {
    street: "147 Birch Way",
    city: "San Antonio",
    state: "TX",
    zipCode: "78201",
    country: "USA",
  },
  {
    street: "258 Spruce Ct",
    city: "San Diego",
    state: "CA",
    zipCode: "92101",
    country: "USA",
  },
  {
    street: "369 Willow St",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    country: "USA",
  },
  {
    street: "741 Poplar Ave",
    city: "San Jose",
    state: "CA",
    zipCode: "95101",
    country: "USA",
  },
];

const statuses: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(daysBack: number): Date {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysBack);
  return new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
}

function generateOrderItems(): OrderItem[] {
  const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items
  const selectedProducts = [];

  for (let i = 0; i < itemCount; i++) {
    const product = getRandomElement(products);
    selectedProducts.push({
      id: `item-${Math.random().toString(36).substr(2, 9)}`,
      ...product,
      quantity: Math.floor(Math.random() * 3) + 1, // 1-3 quantity
    });
  }

  return selectedProducts;
}

function calculateTotal(items: OrderItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function generateMockOrders(count: number = 50): Order[] {
  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const items = generateOrderItems();
    const customer = getRandomElement(customers);
    const status = getRandomElement(statuses);

    const order: Order = {
      id: `ORD-${(1000 + i).toString()}`,
      customer,
      status,
      total: calculateTotal(items),
      orderDate: getRandomDate(30), // Orders from last 30 days
      items,
      shippingAddress: getRandomElement(addresses),
      trackingNumber:
        status === "shipped" || status === "delivered"
          ? `TRK${Math.random().toString(36).substr(2, 8).toUpperCase()}`
          : undefined,
      notes: Math.random() > 0.7 ? `Note for order ${i + 1}` : undefined,
    };

    orders.push(order);
  }

  return orders;
}

export function generateNewOrder(): Order {
  const items = generateOrderItems();
  const customer = getRandomElement(customers);

  return {
    id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
    customer,
    status: "pending",
    total: calculateTotal(items),
    orderDate: new Date(),
    items,
    shippingAddress: getRandomElement(addresses),
  };
}

export function getRandomStatusUpdate(): OrderStatus {
  return getRandomElement(statuses);
}
