export interface TokenResponse {
    token: string;
  }
  

export interface DecodedToken {
    fullName: string;
    roles:string[];
    email: string;
    code: string;
    id: string;
  }