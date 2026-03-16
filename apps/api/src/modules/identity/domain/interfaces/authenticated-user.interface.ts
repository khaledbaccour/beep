import { UserRole } from '@beep/shared';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}
