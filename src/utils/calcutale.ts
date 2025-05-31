import { ProductDataType } from "@/types/productDataTypes";

const calculateSubtotal = (products: ProductDataType[]): number => {
  return products.reduce((acc, item) => {
    return acc + item.price * (item.price ?? 1);
  }, 0);
};

const calculateTransactionFee = (subtotal: number, value: number): number => {
  return subtotal * value;
};

const calculateApplicationFee = (subtotal: number, value: number): number => {
  return subtotal * value;
};

const calculateTax = (subtotal: number, taxRate: number): number => {
  return subtotal * taxRate;
};

const calculateTotal = (
  products: ProductDataType[],
  transactionValue: number,
  applicationValue: number,
  taxRate: number
) => {
  const subtotal = calculateSubtotal(products);
  const transactionFee = calculateTransactionFee(subtotal, transactionValue);
  const applicationFee = calculateApplicationFee(subtotal, applicationValue);
  const tax = calculateTax(subtotal, taxRate);
  const total = subtotal + transactionFee + applicationFee + tax;
  return total;
};

export {
  calculateSubtotal,
  calculateTransactionFee,
  calculateApplicationFee,
  calculateTax,
  calculateTotal,
};
