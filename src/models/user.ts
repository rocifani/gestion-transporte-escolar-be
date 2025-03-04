export interface User {
    id: number;
    email: string;
    password: string;
    role_id: number; 
    active: boolean;
    full_name: string;
    phone_number?: string;
    address?: string;
    created_at: string;
    updated_at: string;
    profile_picture?: string;
    birth_date?: string;
  }
  