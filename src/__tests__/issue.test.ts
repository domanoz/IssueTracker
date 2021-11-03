import supertest from 'supertest';
import {Express} from 'express';
import {createServer} from '../server';
import {Config} from '../config/configTest';
import { IssueHandler } from '../db/handlers/IssueHandler';
import { Issue } from 'src/db/entities/Issue';
import { closedStateTestIssue, 
    invalidDescriptionTestIssue, 
    invalidStateTestIssue, 
    invalidTitleTestIssue, 
    notStringDescriptionTestIssue, 
    openStateTestIssue, 
    pendingStateTestIssue, 
    testIssue,
    testIssue2, 
    updateIssue } from './fixtures/Issues';
import { clearDB } from './clearDB';
import { getConnection } from 'typeorm';

let app: Express;

beforeAll(async () => {
    app = await createServer(Config);
    await clearDB();
})

afterAll(async () => {
    const conn = await getConnection();
    await conn.close();
})

describe('Issue API', () => {
    describe('GET /api/issues/:id route', () => {
        describe('Should return error:', () => {
            it('id is not a number, should return 400', async () => {
                const issueId = 'aaa2';
                const {body, statusCode} = await supertest(app).get(`/api/issues/${issueId}`);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Invalid request was made. Check your request params or body.');
            })
            it('id doesnt exists, should return 404', async () => {
                const issueId = 999999;
                const {body, statusCode} = await supertest(app).get(`/api/issues/${issueId}`);
                expect(statusCode).toBe(404);
                expect(body.error).toBe('Requested resource was not found.');
            })
        })
        describe('Should pass:', () => {
            it('should return 200 and issue', async () => {
                const issue = await IssueHandler.createIssue(testIssue as Issue);
                const {body, statusCode} = await supertest(app).get(`/api/issues/${issue?.id}`);
                expect(statusCode).toBe(200);
                expect(body.id).toBe(issue?.id);
                await IssueHandler.deleteIssueById(body.id);
            })
        })
    })
    describe('GET /api/issues route', () => {
        describe('Should return error:', () => {
            it('invalid endpoint, should return 400', async () => {
                const {body, statusCode} = await supertest(app).get('/api/issue');
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Invalid request was made. Check your request params or body.');
            })
        })
        describe('Should pass:', () => {
            it('should return 200 and issues objects', async () => {
                const issue = await IssueHandler.createIssue(testIssue as Issue);
                const issue2 = await IssueHandler.createIssue(testIssue2 as Issue);
                const {body, statusCode} = await supertest(app).get('/api/issues');
                expect(statusCode).toBe(200);
                expect(body[0].id).toBe(issue?.id);
                expect(body[1].id).toBe(issue2?.id);
                await IssueHandler.deleteIssueById(body[0].id);
                await IssueHandler.deleteIssueById(body[1].id);
            })
        })
    })
    describe('POST /api/issues route', () => {
        describe('Should return error:', () => {
            it('invalid endpoint, should return 400', async () => {
                const {statusCode, body} = await supertest(app).post('/api/issue').send(testIssue);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Invalid request was made. Check your request params or body.');
            })

            it('invalid title length, should return 400', async () => {
                const {statusCode, body} = await supertest(app).post('/api/issues').send(invalidTitleTestIssue);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Invalid title length.');
            })

            it('invalid description length, should return 400', async () => {
                const {statusCode, body} = await supertest(app).post('/api/issues').send(invalidDescriptionTestIssue);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Invalid description length.');
            })

            it('description is not a string, should return 400', async () => {
                const {statusCode, body} = await supertest(app).post('/api/issues').send(notStringDescriptionTestIssue);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Title or desription is not a string.');
            })

            it('invalid issue state, should return 400', async () => {
                const {statusCode, body} = await supertest(app).post('/api/issues').send(invalidStateTestIssue);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Invalid issue state.');
            })
        })
        describe('Should pass:', () => {
            it('should return 200 and issue object', async () => {
                const {statusCode, body} = await supertest(app).post('/api/issues').send(testIssue);
                expect(statusCode).toBe(200);
                expect(body.title).toBe(testIssue.title);
                expect(body.description).toBe(testIssue.description);
                expect(body.state).toBe(testIssue.state);
                await IssueHandler.deleteIssueById(body.id);
            })
        })
    })
    describe('PUT /api/issues/:id route', () => {
        describe('Should return error:', () => {
            it('invalid endpoint, should return 400', async () => {
                const issue = await IssueHandler.createIssue(testIssue as Issue) as Issue;
                const {statusCode, body} = await supertest(app).put(`/api/issdue/${issue.id}`).send(updateIssue);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Invalid request was made. Check your request params or body.');
            })

            it('id doesnt exists, should return 404', async () => {
                const issueId = 999999;
                const {statusCode, body} = await supertest(app).put(`/api/issues/${issueId}`).send(updateIssue);
                expect(statusCode).toBe(404);
                expect(body.error).toBe('Requested resource was not found.');
            })

            it('invalid title length, should return 400', async () => {
                const issue = await IssueHandler.createIssue(testIssue as Issue) as Issue;
                const {statusCode, body} = await supertest(app).put(`/api/issues/${issue.id}`).send(invalidTitleTestIssue);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Invalid title length.');
            })

            it('invalid description length, should return 400', async () => {
                const issue = await IssueHandler.createIssue(testIssue as Issue) as Issue;
                const {statusCode, body} = await supertest(app).put(`/api/issues/${issue.id}`).send(invalidDescriptionTestIssue);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Invalid description length.');
            })

            it('description is not a string, should return 400', async () => {
                const issue = await IssueHandler.createIssue(testIssue as Issue) as Issue;
                const {statusCode, body} = await supertest(app).put(`/api/issues/${issue.id}`).send(notStringDescriptionTestIssue);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Title or desription is not a string.');
            })

            it('invalid issue state, should return 400', async () => {
                const issue = await IssueHandler.createIssue(testIssue as Issue) as Issue;
                const {statusCode, body} = await supertest(app).put(`/api/issues/${issue.id}`).send(invalidStateTestIssue);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Invalid issue state.');
            })

            it('invalid issue state change PENDIND --> OPEN, should return 400', async () => {
                const issue = await IssueHandler.createIssue(pendingStateTestIssue as Issue) as Issue;
                const {statusCode, body} = await supertest(app).put(`/api/issues/${issue.id}`).send(openStateTestIssue);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Cannot set issue state from PENDING back to OPEN.');
                await IssueHandler.deleteIssueById(issue.id);
            })

            it('invalid issue state change CLOSED --> OPEN, should return 400', async () => {
                const issue = await IssueHandler.createIssue(closedStateTestIssue as Issue) as Issue;
                const {statusCode, body} = await supertest(app).put(`/api/issues/${issue.id}`).send(openStateTestIssue);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Cannot set issue state from CLOSED back to OPEN/PENDING.');
                await IssueHandler.deleteIssueById(issue.id);
            })

            it('invalid issue state change CLOSED --> PENDING, should return 400', async () => {
                const issue = await IssueHandler.createIssue(closedStateTestIssue as Issue) as Issue;
                const {statusCode, body} = await supertest(app).put(`/api/issues/${issue.id}`).send(pendingStateTestIssue);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Cannot set issue state from CLOSED back to OPEN/PENDING.');
                await IssueHandler.deleteIssueById(issue.id);
            })
        })
        describe('Should pass:', () => {
            it('should return 200 and issue object', async () => {
                const issue = await IssueHandler.createIssue(openStateTestIssue as Issue) as Issue;
                const {statusCode, body} = await supertest(app).put(`/api/issues/${issue.id}`).send(pendingStateTestIssue);
                expect(statusCode).toBe(200);
                expect(body.title).toBe(pendingStateTestIssue.title);
                expect(body.description).toBe(pendingStateTestIssue.description);
                expect(body.state).toBe(pendingStateTestIssue.state);
                await IssueHandler.deleteIssueById(body.id);
            })
        })
    })
    describe('DELETE /api/issues/:id route', () => {
        describe('Should return error:', () => {
            it('invalid endpoint, should return 400', async () => {
                const issue = await IssueHandler.createIssue(testIssue as Issue) as Issue;
                const {statusCode, body} = await supertest(app).delete(`/api/issdue/${issue.id}`);
                expect(statusCode).toBe(400);
                expect(body.error).toBe('Invalid request was made. Check your request params or body.');
            })

            it('id doesnt exists, should return 404', async () => {
                const issueId = 999999;
                const {statusCode, body} = await supertest(app).delete(`/api/issues/${issueId}`);
                expect(statusCode).toBe(404);
                expect(body.error).toBe('Requested resource was not found.');
            })
        })
        describe('Should pass:', () => {
            it('should return 200', async () => {
                const issue = await IssueHandler.createIssue(openStateTestIssue as Issue) as Issue;
                const {statusCode} = await supertest(app).delete(`/api/issues/${issue.id}`);
                expect(statusCode).toBe(200);
                const deleted = await IssueHandler.getIssueById(issue.id);
                expect(deleted).toBe(undefined);
            })
        })
    })
})