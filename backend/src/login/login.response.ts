import { log } from '../helper/logger.js';
import { Response } from 'express';

export class LoginResponse {
  sendToken(res: Response) {
    console.log('send token was called');
    res.statusCode = 200;
    res.end(JSON.stringify({ token: 'token' }));
    log.info('Auth token was sent to the frontend.');
  }
}
