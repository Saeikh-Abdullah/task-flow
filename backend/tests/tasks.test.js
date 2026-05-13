const path = require('path');
process.env.DB_PATH = path.join(__dirname, '../data/test_tasks.db');

const { initDb } = require('../src/models/db');
const request    = require('supertest');
const app        = require('../src/app');
const fs         = require('fs');

beforeAll(async () => {
  if (fs.existsSync(process.env.DB_PATH)) {
    fs.unlinkSync(process.env.DB_PATH);
  }
  await initDb();
});

afterAll(() => {
  if (fs.existsSync(process.env.DB_PATH)) {
    fs.unlinkSync(process.env.DB_PATH);
  }
});

describe('POST /api/tasks', () => {
  it('creates a task with valid title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Test task');
    expect(res.body.data.status).toBe('pending');
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 when title is blank', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: '   ' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/tasks', () => {
  it('returns all tasks as an array', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('PATCH /api/tasks/:id/toggle', () => {
  it('toggles a task to completed', async () => {
    const created = await request(app)
      .post('/api/tasks')
      .send({ title: 'Toggle me' });
    const id  = created.body.data.id;
    const res = await request(app).patch(`/api/tasks/${id}/toggle`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('completed');
  });

  it('returns 404 for unknown task', async () => {
    const res = await request(app).patch('/api/tasks/999999/toggle');
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('deletes an existing task', async () => {
    const created = await request(app)
      .post('/api/tasks')
      .send({ title: 'Delete me' });
    const id  = created.body.data.id;
    const res = await request(app).delete(`/api/tasks/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns 404 for missing task', async () => {
    const res = await request(app).delete('/api/tasks/999999');
    expect(res.statusCode).toBe(404);
  });
});