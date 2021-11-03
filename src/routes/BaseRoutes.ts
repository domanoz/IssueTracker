import { Express, Request, Response, NextFunction } from 'express-serve-static-core';
import { EServerErrorType, ServerError } from '../helpers/ServerError';

type TRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export abstract class BaseRoutes {
    constructor(private readonly app: Express) {
    }

    public abstract initRoutes(): void;

    protected addGetRoute(url: string, handler: TRouteHandler): void {
        this.app.route(url).get(this.commonRouteHandler(handler));
    }

    protected addPostRoute(url: string, handler: TRouteHandler): void {
        this.app.route(url).post(this.commonRouteHandler(handler));
    }

    protected addPutRoute(url: string, handler: TRouteHandler): void {
        this.app.route(url).put(this.commonRouteHandler(handler));
    }

    protected addPatchRoute(url: string, handler: TRouteHandler): void {
        this.app.route(url).patch(this.commonRouteHandler(handler));
    }

    protected addDeleteRoute(url: string, handler: TRouteHandler): void {
        this.app.route(url).delete(this.commonRouteHandler(handler));
    }

    private commonRouteHandler(handler: TRouteHandler) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await handler(req, res, next);
            } catch (e) {
                const err = e as Error;
                this.handleError(err, req, res);
            }
        };
    }

    protected handleError(error: Error, req: Request, res: Response): void {
        console.log(error.message, req.hostname);
        if (error instanceof ServerError) {
            res.status(error.httpCode);
            res.send({ error: error.message });
        } else {
            const internalError = new ServerError(EServerErrorType.InternalError);

            res.status(internalError.httpCode);
            res.send({ error: internalError.message });
        }
    }
}