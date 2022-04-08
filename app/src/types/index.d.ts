declare global {
  export interface ErrorMsg {
    createdAt: number;
    title: string;
    body: string;
    error: Error;
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

  export interface StatusInfo {
    connected: boolean;
    host: string;
    database: string;
    name: "FPOS" | "ACM";
  }
}

export {};
