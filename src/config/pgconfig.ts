import {PoolConfig} from "pg";

export function createConfig(): PoolConfig {
  const config: PoolConfig = {
    max: 20,
    min: 5,
    user: 'postgres',
    password: 'postgres',
    database: 'dev',
    host: 'localhost'
  };

  return config;
}
