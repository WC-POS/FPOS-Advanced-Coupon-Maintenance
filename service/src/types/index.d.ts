declare global {
  export interface SimpleSaleItem {
    saleItemId: string;
    itemName: string;
    itemIndex: number;
  }
  export interface SettingsConfig {
    SQL: {
      host: string;
      user: string;
      password: string;
    };
    appDB: string;
    fposDB: string;
    encrypted?: boolean;
  }
}

export {};
