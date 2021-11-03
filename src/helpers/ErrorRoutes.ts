import {Request, Response} from 'express';
import { EServerErrorType, ServerError } from './ServerError';

export const ErrorRoutes = (_: Request, res: Response) => {
    const error = new ServerError(EServerErrorType.InvalidRequest);
    res.status(error.httpCode);
    res.send({ error: error.message });
}