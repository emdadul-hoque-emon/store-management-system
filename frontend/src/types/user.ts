export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  EMPLOYEE = "employee",
}

export interface IUser {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  store: {
    name: string;
    id: string;
  };
}
