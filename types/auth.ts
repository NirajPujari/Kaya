import { User } from "./user";

export interface AuthContextType {
  user: User | null;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgot: (email: string) => Promise<void>;
}
