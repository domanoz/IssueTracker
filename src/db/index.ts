import 'reflect-metadata';
import { Config } from '../config/config';
import { createConnection } from 'typeorm';
import { Issue } from './entities/Issue';

export const makeDb = async (config: typeof Config) => {
  await createConnection({
    type: "postgres",
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    synchronize: config.synchronize,
    logging: config.logging,
    entities: [Issue]
});
console.log('DB connected');
}
