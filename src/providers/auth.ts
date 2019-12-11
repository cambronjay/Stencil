import { Storage } from './storage';
import SalteAuth from '@salte-auth/salte-auth'
declare var window: any;

export class AuthController {
  public auth: any;

  constructor(){
    const auth = new SalteAuth({
      providerUrl: 'https://intadfs.lgeenergy.int/adfs',
      redirectUrl: {
        loginUrl: 'https://intadfs.lgeenergy.int/adfs/oauth2/authorize',
        logoutUrl: 'https://intadfs.lgeenergy.int/adfs/oauth2/logout'
      },
      clientId: 'aab47da2-0ee2-4893-8e7e-127e76af7034',
      responseType: 'code',
      scope: 'openid allatclaims',
      provider: 'auth0'
    });
    this.auth = auth;
  }

  async singleSignOn(): Promise<any> {
    this.auth.loginWithIframe();
  }

  async login(username: string): Promise<void> {
    await Storage.set('hasLoggedIn', true);
    await this.setUsername(username);

    window.dispatchEvent(new Event('user:login'));
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
    if(value === null) {
      await Storage.set('hasLoggedIn', false);
      return false;
    }
    return value;
  }

}

export const Auth = new AuthController();