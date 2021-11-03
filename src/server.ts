import express from 'express';
import { makeDb } from './db';
import { ErrorRoutes } from './helpers/ErrorRoutes';
import { Routes } from './Routes';
import {Config} from './config/config';

export const createServer = async (config: typeof Config) => {
    await makeDb(config);

    const app = express();
    app.use(express.json());
    const routes = new Routes(app);
    routes.initRoutes();
    app.use(ErrorRoutes);

    return app;
}