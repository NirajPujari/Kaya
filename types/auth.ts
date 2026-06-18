import type React from "react";
import type { LucideIcon } from "lucide-react";
import type { Input } from "@components/ui/input";

import type { ForgotPasswordUser, LogInUser, SignUpUser, User } from "./user";

export type AuthMode = "login" | "register" | "forgot";

export type AuthResult =
  | {
      success: boolean;
      error?: undefined;
    }
  | {
      success: boolean;
      error: unknown;
    };

export type AuthFormProps = {
  setMode: (mode: AuthMode) => void;
};

export type FormHeaderProps = {
  title: string;
  description: string;
};

export type InputFieldProps = {
  label: string;
  icon: LucideIcon;
} & React.ComponentProps<typeof Input>;

export type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  toggle: () => void;
};

export type LoginFunction = (data: LogInUser) => Promise<AuthResult>;
export type SignUpFunction = (data: SignUpUser) => Promise<AuthResult>;
export type LogOutFunction = () => Promise<AuthResult>;
export type ForgotFunction = (data: ForgotPasswordUser) => Promise<AuthResult>;
export type AutoFunction = () => Promise<AuthResult | undefined>;

export type AuthContextType = {
  user: User | null;
  login: LoginFunction;
  signup: SignUpFunction;
  logout: LogOutFunction;
  autoLog: AutoFunction;
  forgot: ForgotFunction;
};

export type LoginFormProps = {
  login: LoginFunction;
};

export type SignUpFormProps = {
  signup: SignUpFunction;
};

export type ForgotPasswordFormProps = {
  forgot: ForgotFunction;
};
