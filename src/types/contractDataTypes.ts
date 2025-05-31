import { ProductDataType } from "./productDataTypes";

export interface Feedback {
  id: string;
  content: string;
  createdAt: string;
}

export interface ContractDataType {
  id: string;
  userId: string;
  productId: string;
  contractName: string;
  fullName: string;
  address: string;
  cost: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  descriptionContract: string;
  features: string[];
  scopeOfWork: string;
  filename: string;
  signature: string;
  status: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  product: ProductDataType;
  feedback: Feedback[];
}
