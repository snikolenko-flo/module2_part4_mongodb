import { LoginService } from './login.service.js';
import { TokenService } from '../services/token.service.js';
import { ValidationResult } from '../interfaces/validate';
import { TokenResponse } from '../interfaces/token';

const tokenService = new TokenService();

export class LoginManager {
  loginService: LoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  checkEmail(email: string, emailErrorElement: HTMLFormElement): void {
    const validatedEmail: ValidationResult = this.loginService.validateEmail(email);
    this.loginService.handleEmailValidation(validatedEmail, emailErrorElement);
  }

  checkPassword(password: string, passwordErrorElement: HTMLFormElement): void {
    const validatedPassword: ValidationResult = this.loginService.validatePassword(password);
    this.loginService.handlePasswordValidation(validatedPassword, passwordErrorElement);
  }

  isUserDataValid(email: string, password: string): boolean {
    return this.loginService.validateUserData(email, password);
  }

  async loginUser(email: string, password: string): Promise<void> {
    try {
      const result: TokenResponse = await this.loginService.fetchToken(email, password);
      tokenService.setToken(result.token);
      await this.loginService.redirectToGallery();
    } catch (e) {
      alert(e);
    }
  }
}
