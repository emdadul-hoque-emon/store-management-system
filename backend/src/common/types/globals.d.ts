import { UserRole } from '../../modules/users/dto/query-user.dto';

// extend JwtPayload interface to include role
declare global {
  namespace JsonWebToken {
    interface JwtPayload {
      role: UserRole;
      sub: string;
      email: string;
    }
  }
}
declare module 'jsonwebtoken' {
  export interface JwtPayload {
    role: UserRole;
    sub: string;
    email: string;
  }
}

// extend request interface to include user
declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
  interface Multer {
    file: Express.Multer.File;
  }
}
