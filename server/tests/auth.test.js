const request = require('supertest');
const { app, server } = require('../index');

describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
    const uniqueEmail = `test_${Date.now()}@example.com`; // Unique email using current timestamp
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User created successfully');
  });

  afterAll(() => {
    server.close();
  });
});
