import { Auth } from '../auth/entities/auth.entity';

declare global {
  namespace Express {
    interface Request {
      user?: Auth;
    }
  }
}