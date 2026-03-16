import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    const url = new URL(databaseUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port || '5432', 10),
      username: url.username,
      password: url.password,
      name: url.pathname.slice(1),
      url: databaseUrl,
      ssl: process.env.NODE_ENV === 'production',
    };
  }

  return {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'beep',
    password: process.env.POSTGRES_PASSWORD || 'changeme',
    name: process.env.POSTGRES_DB || 'beep',
    url: undefined,
    ssl: false,
  };
});
