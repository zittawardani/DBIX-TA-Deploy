export default interface OrderDataTypes {
  id: string; // <- penting!
  orderId: string;
  userId: string;
  status: string;
  orderDate: string;
  paymentMethods: string;
  paymentProof: string;
  products: {
    id: string;
    name?: string;
    price?: number;
    qty?: number;
  }[];
}
