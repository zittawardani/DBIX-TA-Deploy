export namespace InvoiceDataType {
  export interface Main {
    id: string;
    externalId: string;
    userId: string;
    description: string;
    status: string;
    merchantName: string;
    merchantProfilePictureUrl: string;
    amount: number;
    expiryDate: Date;
    invoiceUrl: string;
    availableBanks: AvailableBank[];
    availableRetailOutlets: AvailableRetailOutlet[];
    availableEwallets: AvailableEwallet[];
    availableQrCodes: AvailableQrCode[];
    availableDirectDebits: AvailableDirectDebit[];
    availablePaylaters: AvailablePaylater[];
    shouldExcludeCreditCard: boolean;
    shouldSendEmail: boolean;
    created: Date;
    updated: Date;
    currency: string;
    reminderDate: Date;
  }

  export interface AvailableBank {
    bankCode: string;
    collectionType: string;
    bankBranch: string;
    accountHolderName: string;
    transferAmount: number;
  }

  export interface AvailableDirectDebit {
    directDebitType: string;
  }

  export interface AvailableEwallet {
    ewalletType: string;
  }

  export interface AvailablePaylater {
    paylaterType: string;
  }

  export interface AvailableQrCode {
    qrCodeType: string;
  }

  export interface AvailableRetailOutlet {
    retailOutletName: string;
  }
}
