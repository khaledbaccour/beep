import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'changeme-jwt-secret',
  expirationSeconds: parseInt(process.env.JWT_EXPIRATION || '3600', 10),
}));
