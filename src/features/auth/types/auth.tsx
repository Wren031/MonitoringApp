interface BaseUser {
  email: string;
}

export interface LoginCredentials extends BaseUser {
  password: string;
}

export interface UserProfile {
  id?: string;
  email: string;
  password?: string; // Required for the Auth.signUp call
  full_name: string;
  gender: string;
  address: string;
  status?: 'Active' | 'Not Active'; 
}