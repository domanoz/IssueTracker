import { Request, Response } from 'express';
import { BaseRoutes } from '../BaseRoutes';
import { IssueHandler } from '../../db/handlers/IssueHandler';
import { RequestValidator } from '../../helpers/RequestValidator';
import { EServerErrorType, ServerError } from '../../helpers/ServerError';
import { Issue, IssueState } from '../../db/entities/Issue';
import { DeepPartial } from 'typeorm';

export class IssueRoutes extends BaseRoutes {

    public initRoutes(): void {
        // GETs
        this.addGetRoute('/api/issues', this.getIssues.bind(this));
        this.addGetRoute('/api/issues/:id', this.getIssueById.bind(this));
  
        // POSTs
        this.addPostRoute('/api/issues', this.createIssue.bind(this));

        // PUTs
        this.addPutRoute('/api/issues/:id', this.updateIssueById.bind(this));

        // DELETEs
        this.addDeleteRoute('/api/issues/:id', this.deleteIssueById.bind(this));
    }

    private async getIssues(_: Request, res: Response): Promise<void> {
        const result = await IssueHandler.getIssues();
        res.status(200);
        
        res.send(result);
    }

    private async createIssue(req: Request, res: Response): Promise<void> {
        if (!RequestValidator.requiredOnBody(req, ['title', 'description', 'state'])) {
            throw new ServerError(EServerErrorType.InvalidRequest);
        }        
        const body = req.body as Issue;

        const isValid = this.validate(body);
        if(!isValid.valid) {
            throw new ServerError(EServerErrorType.InvalidRequest, isValid.msg);
        }

        const result = await IssueHandler.createIssue(body);
        if(!result) {
            throw new ServerError(EServerErrorType.InternalError, 'Could not create new issue.');
        }

        res.status(200);
        res.send(result);
    }

    private async updateIssueById(req: Request, res: Response): Promise<void> {
        if (!RequestValidator.paramsAreIntegers(req, ['id']) || 
            !RequestValidator.requiredOnParams(req, ['id'] )) {
            throw new ServerError(EServerErrorType.InvalidRequest);
        }
        
        const issueId = parseInt(req.params.id, 10);
        const issue = await IssueHandler.getIssueById(issueId);
        if(!issue) {
            throw new ServerError(EServerErrorType.NotFound);
        }

        const body = req.body as {
            title?: string;
            description?: string;
            state?: IssueState;
        }
    
        const updateIssue = {
            id: issue.id,
            title: body.title ?? issue.title,
            description: body.description ?? issue.description,
            state: body.state === undefined ? issue.state : body.state
        }

        const isValid = this.validate(updateIssue);
        if(!isValid.valid) {
            throw new ServerError(EServerErrorType.InvalidRequest, isValid.msg);
        }

        if(issue.state === IssueState.PENDING && updateIssue.state === IssueState.OPEN) {
            throw new ServerError(EServerErrorType.InvalidRequest, 'Cannot set issue state from PENDING back to OPEN.');
        }

        if(issue.state === IssueState.CLOSED && (updateIssue.state === IssueState.OPEN || updateIssue.state === IssueState.PENDING)){
            throw new ServerError(EServerErrorType.InvalidRequest, 'Cannot set issue state from CLOSED back to OPEN/PENDING.');
        }

        const result = await IssueHandler.updateIssueById(updateIssue);
        if(!result) {
            throw new ServerError(EServerErrorType.InternalError, 'Could not update issue.');
        }

        res.status(200);
        res.send(result);
    }

    private async getIssueById(req: Request, res: Response): Promise<void> {
        if (!RequestValidator.paramsAreIntegers(req, ['id']) || !RequestValidator.requiredOnParams(req, ['id'] )) {
            throw new ServerError(EServerErrorType.InvalidRequest);
        }

        const issueId = parseInt(req.params.id, 10);
        const result = await IssueHandler.getIssueById(issueId);
        if(!result) {
            throw new ServerError(EServerErrorType.NotFound);
        }

        res.status(200);
        res.send(result);
    }

    private async deleteIssueById(req: Request, res: Response): Promise<void> {
        if (!RequestValidator.paramsAreIntegers(req, ['id']) || !RequestValidator.requiredOnParams(req, ['id'] )) {
            throw new ServerError(EServerErrorType.InvalidRequest);
        }

        const issueId = parseInt(req.params.id, 10);
        const issue = await IssueHandler.getIssueById(issueId);
        if(!issue){
            throw new ServerError(EServerErrorType.NotFound);
        }

        const result = await IssueHandler.deleteIssueById(issueId);
        if(!result) {
            throw new ServerError(EServerErrorType.NotFound);
        }

        res.status(200);
        res.send(result);
    }

    private validate(issue: DeepPartial<Issue>): { valid: boolean; msg?: string } {
        if(typeof issue.description !== 'string' || typeof issue.title !== 'string') {
            return {
                valid: false,
                msg: 'Title or desription is not a string.'
            };
        }
        
        if(issue.description.length < 5 || issue.description.length > 100) {
            return {
                valid: false,
                msg: 'Invalid description length.'
            };
        }

        if(issue.title.length < 3 || issue.title.length > 30) {
            return {
                valid: false,
                msg: 'Invalid title length.'
            };
        }

        if(issue.state && !(issue.state in IssueState)){
            return {
                valid: false,
                msg: 'Invalid issue state.'
            };
        }
        
        return {
            valid: true
        }
    }
}