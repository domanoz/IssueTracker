import { Express } from 'express';

import { BaseRoutes } from './routes/BaseRoutes';
import { IssueRoutes } from './routes/issue/IssueRoutes';

export class Routes {

    private routes: BaseRoutes[];

    constructor(app: Express) {
        this.routes = [
            new IssueRoutes(app),
        ]
    }

    public initRoutes(): void {
        for (const routes of this.routes) {
            routes.initRoutes();
        }
    }

}