export type User = {
    token: string;
    name: string;
    email: string;
    age?: string;
}
export type SignUpUser = 
  Omit<User, "token" | "age"> &
  { password: string };

export type LogInUser = 
  Omit<User, "token" | "age" | "name"> &
  { password: string };

export type ForgotPasswordUser = 
  Omit<User, "token" | "age" | "name"> &
  { password: string };
