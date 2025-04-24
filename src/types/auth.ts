// types/auth.ts
export type AuthProvider = 'google' | 'facebook' | 'email';

export interface AuthError {
    message: string;
    code?: string;
}

export interface AuthResponse {
    user: any; // Replace with your Supabase user type
    error?: AuthError;
}

export interface EmailFormData {
    email: string;
    password: string;
}