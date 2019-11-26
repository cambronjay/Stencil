import { Storage } from './storage';

export class AuthController {

  async login(username: string): Promise<void> {
    await Storage.set('hasLoggedIn', true);
    await this.setUsername(username);

    window.dispatchEvent(new Event('user:login'));
  }

  async signup(username: string): Promise<void> {
    await Storage.set('hasLoggedIn', true);

    await this.setUsername(username);
    window.dispatchEvent(new Event('user:signup'));
  }

  async logout(): Promise<void> {
    await Storage.remove('hasLoggedIn');
    await Storage.remove('username');

    window.dispatchEvent(new Event('user:logout'));
  }

  async setUsername(username: string): Promise<void> {
    await Storage.set('username', username);
  }

  async getUsername(): Promise<string> {
    return Storage.get('username');
  }

  async isLoggedIn(): Promise<boolean> {
    const value = await Storage.get('hasLoggedIn');
    return value === true;
  }

}

export const Auth = new AuthController();