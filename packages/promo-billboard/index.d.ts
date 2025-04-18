export namespace PROMO_BILLBOARD {
  export type BillboardNostrConfig = {
    private_key: string;
    relays: string[];
  }
  
  export type BillboardEnvironmentConfig = {
    log_level: string;
  }
  
  export type BillboardServerConfig = {
    name: string;
    description: string;
    image: string;
    url: string;
    kinds: number[];
  }
  // Types
  export type BillboardConfig = {
    nostr: BillboardNostrConfig;
    server: BillboardServerConfig;
    environment: BillboardEnvironmentConfig;
  }
  
  export type ApiConfig = {
    nostr: {
      privateKey: string;
      relayUrls: string[];
    };
    mcp: {
      version: string;
      name: string;
      about: string;
      clientName: string;
      clientVersion: string;
    };
    whitelist: {
      allowedDVMs: string[];
    };
  }
}
