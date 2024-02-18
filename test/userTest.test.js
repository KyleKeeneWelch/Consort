const { login_post } = require('../controllers/userController');
const { mockRequest, mockResponse } = require('jest-mock-req-res');

describe('login_post', () => {
  test('it should log in user with valid credentials', async () => {
    const req = mockRequest({
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    });
    const res = mockResponse();

    await login_post(req, res);

    // Add your assertions here based on the behavior of login_post function
  });
});