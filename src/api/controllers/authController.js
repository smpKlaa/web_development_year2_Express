import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import process from 'process';
import {findUserByUsername} from '../models/userModel.js';

/**
 * Gets the authenticated user's information from the request locals.
 * Returns user data if authentication token is valid, otherwise returns 401 Unauthorized.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} res.locals.user - User object stored in response locals after authentication
 * @returns {Promise<void>} JSON response with user data or 401 status
 * @example
 * // Success response (200)
 * {
 *   "message": "token ok",
 *   "user": {
 *     "user_id": 19,
 *     "name": "Jown",
 *     "username": "exampleUsername",
 *     "email": "firstname.lastname@email.com",
 *     "role": "user",
 *     "iat": 1762955878,
 *     "exp": 1763042278
 *   }
 * }
 *
 * @example
 * // Error response (401)
 * // No response body, just status code 401
 */
const getMe = async (req, res) => {
  console.log('getMe', res.locals.user);

  if (res.locals.user) {
    res.json({message: 'token ok', user: res.locals.user});
  } else {
    res.sendStatus(401);
  }
};

/**
 * Handles user login authentication
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with user data and JWT token on success, or HTTP status code on failure
 * @description Authenticates user credentials by checking username and password against database.
 * On successful authentication, returns user information (without password) and a JWT token.
 * Returns 404 if user not found, 401 if password doesn't match.
 */
const postLogin = async (req, res) => {
  console.log('postLogin', req.body);
  const user = await findUserByUsername(req.body.username);
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) {
    res.sendStatus(401);
    return;
  }

  const userWithNoPassword = {
    user_id: user.user_id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  res.json({user: userWithNoPassword, token});
};

export {getMe, postLogin};
