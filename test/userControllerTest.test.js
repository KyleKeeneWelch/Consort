const { login_post } = require('../controllers/userController');
const User = require('../models/user')

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


jest.mock('passport'); // Mock Passport
// Assuming you have a database module:
jest.mock('../models/user'); 

const mockReq = {
  body: {
    email: 'test@example.com',
    password: 'yourtestpassword'
  }
};

const mockRes = {
  render: jest.fn(),
  redirect: jest.fn()
};

const mockNext = jest.fn();


passport.authenticate = jest.fn((strategy, options, callback) => {
  if (mockReq.body.email === 'test@example.com' && mockReq.body.password === 'yourtestpassword') {
    // Successful authentication
    callback(null, { id: 1, username: 'testuser' }); // Mock user object
  } else {
    // Failed authentication
    callback(null, false, options.failureFlash ? { message: 'Incorrect credentials' } : null);
  }
});


describe('login_post', () => {
  test('it should log in user with valid credentials', async () => {
    mockReq.body.email = 'invalid_email'; // Invalid email
    await login_post(mockReq, mockRes, mockNext);

    expect(mockRes.render).toHaveBeenCalledWith('login', {
      email: 'invalid_email',
      errors: expect.anything() // Expect errors 
    });
  });

  test('it should not log in user with invalid credentails', async () => {

  });


});