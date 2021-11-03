# IssueTracker

Stonly BE dev task <br />
Create a simple issue tracker <br />
An issue should have a title, description and one of three states: open, pending and closed.
Once an issue is pending it cannot be set back to open, similarly if an issue is closed it cannot
be set back to pending or open. <br />
The minimal requirement is to provide a list view where you can see the issues and change their
state. Use JavaScript (can be transpiled, but don't go crazier than ECMA stage 3). Other than
that, you're in charge. Choose whatever tools you're comfortable with and add whatever features
you think would make sense. Do it as if it was your regular job assignment. Oh, and we really like
tests. <br />
It should take you about 6-8 hours.

# Endpoints

- GET: <br />
-- /api/issues --> get all issues <br />
-- /api/issues/:id --> get issue by id <br />

- POST: <br />
-- /api/issues --> add new issue <br />
```json
{
    "title": "Test",
    "description": "Test description",
    "state": 0
}
```

- PUT: <br />
-- /api/issues/:id --> update issue <br />
```json
{
    "title": "Test update",
    "state": 2
}
```

- DELETE: <br />
-- /api/issues/:id --> delete issue <br />

## Issue State
- OPEN --> 0
- PENDING --> 1
- CLOSED --> 2

# Run app
```console
docker-compose up --build -d
```
