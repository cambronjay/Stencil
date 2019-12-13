import { Component, Event, EventEmitter, Prop, State, h } from '@stencil/core';
import { Auth } from '../../providers/auth';


@Component({
  tag: 'screen-login',
  styleUrl: 'screen-login.css',
})
export class PageLogin {
  @State() username = {
    valid: false,
    value: ''
  };
  @State() password = {
    valid: false,
    value: ''
  };
  @State() submitted = false;
  @Prop({ connect: 'ion-router' }) nav;
  @Event() userDidLogIn: EventEmitter;
  handleUsername(ev) {
    this.validateUsername();
    this.username = {
      ...this.username,
      value: ev.target.value
    };
  }

  handlePassword(ev) {
    this.validatePassword();
    this.password.value = ev.target.value;
    this.password = {
      ...this.password,
      value: ev.target.value
    };
  }

  validateUsername() {
    if (this.username.value && this.username.value.length > 0) {
      this.username = {
        ...this.username,
        valid: true
      };

      return;
    }
    this.username = {
      ...this.username,
      valid: false
    };
  }

  validatePassword() {
    if (this.password.value && this.password.value.length > 0) {
      this.password.valid = true;
      this.password = {
        ...this.password,
        valid: true
      };
      return;
    }
    this.password = {
      ...this.password,
      valid: false
    };
  }

  async onLogin(e) {
    e.preventDefault();
    e.stopPropagation();
    const navCtrl: HTMLIonRouterElement = await (this.nav as any).componentOnReady();
    this.validatePassword();
    this.validateUsername();
    this.submitted = true;
    if (this.password.valid && this.username.valid) {
      await Auth.login(this.username.value);
      this.userDidLogIn.emit({ loginStatus: true });
      navCtrl.push('/home', 'root');
    }
  }

  async onSingleSignOn(e) {
    e.preventDefault();
    e.stopPropagation();
    await Auth.singleSignOn();
  }

  render() {
    return [
      <ion-content class="ion-padding" scrollX={false} scrollY={false}>
        <ion-grid>
          <ion-row justify-content-center align-items-center class="row-fix">
            <ion-col sizeMd="7" sizeLg="7" sizeXl="4">
              <div class="logo">
                <img src="/assets/img/logo.svg" alt="logo" />
              </div>
              <form novalidate="true" onSubmit={(e) => this.onLogin(e)}>

                <ion-list no-lines>
                  <ion-item>
                    <ion-label position="stacked" color="primary">Username</ion-label>
                    <ion-input name="username" type="text" value={this.username.value} onInput={(ev) => this.handleUsername(ev)} spellcheck={false} autocapitalize="off" required></ion-input>
                  </ion-item>

                  <ion-text color="danger">
                    <p hidden={this.username.valid || this.submitted === false} class="ion-padding-left">
                      Username is required
                      </p>
                  </ion-text>

                  <ion-item>
                    <ion-label position="stacked" color="primary">Password</ion-label>
                    <ion-input name="password" type="password" value={this.password.value} onInput={(ev) => this.handlePassword(ev)} required></ion-input>
                  </ion-item>

                  <ion-text color="danger">
                    <p hidden={this.password.valid || this.submitted === false} class="ion-padding-left">
                      Password is required
                      </p>
                  </ion-text>
                </ion-list>

                <ion-row>
                  <ion-col>
                    <ion-button type="submit" expand="block">Login</ion-button>
                    <ion-button class="ion-margin-top" onClick={(e) => this.onSingleSignOn(e)} color="light" expand="block">Single Sign-On</ion-button>
                  </ion-col>
                </ion-row>
              </form>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>

    ];
  }
}