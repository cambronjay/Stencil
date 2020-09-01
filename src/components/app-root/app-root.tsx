import '@ionic/core';
import { Component, Element, Listen, Prop, State, h } from '@stencil/core';
import { AuthBase } from '../../providers/auth';
import { Utils } from '../../providers/utils';
import { Storage } from '../../providers/storage';
import { Plugins } from '@capacitor/core';
import { CorpCommon, CorpStorage } from '@lge/corp-common';
const { SplashScreen } = Plugins;

@Component({
    tag: 'app-root',
    styleUrl: 'app-root.css'
})
export class AppRoot {
    @State() loggedIn = false;
    @Element() el: HTMLElement;
    @Prop({ context: 'isServer' }) isServer: boolean;
    @State() isLargeScreen = false;
    private router: HTMLIonRouterElement;
    @State() startScreen: any;
    @State() menuEnabled = false;
    public environment = {
        driverType: ['localstorage'],
        production: false,
        isDevice: false,
        MVC_URL: "https://m.lkedev.com/GITTMVC",
        API_URL: "https://m.lkedev.com",
        PICTURE_MVC: "https://m.lkedev.com/gittmvc",
        APP_NAME: "GITT-Dev",
        APPLICATION_ID: "GITT",
        MVC_DATA_CONTEXT: "AppData",
        USE_CREDENTIALS: false,
        OFFLINE_DATABASE_NAME: "GITT_dev_db"
      };
    appPages = [
        {
            title: 'Home',
            url: '/home',
            icon: 'home',
            id: 'home'
        },
        {
            title: 'Fetch',
            url: '/fetch',
            icon: 'list-box',
            ic: 'fetch'
        },
        {
            title: 'Firebase',
            url: '/firebase',
            icon: 'flame',
            id: 'firebase'
        }
    ];

    constructor() {

    }

    async componentWillLoad() {
        CorpCommon.initialize(this.environment.APPLICATION_ID, this.environment.MVC_URL, this.environment.MVC_DATA_CONTEXT, this.environment.USE_CREDENTIALS, this.environment.API_URL);
        CorpStorage.openStore(this.environment.OFFLINE_DATABASE_NAME, 'data_store');
        this.isLargeScreen = Utils.isLargeScreen();
        this.startScreen = await Storage.get("CurrentScreen");
        if (this.startScreen == null) {
            this.startScreen = "/home";
        } else {
            this.startScreen = "/" + this.startScreen;
        }
    }

    async componentDidLoad() {
        await this.checkLoginStatus();
        this.router = document.querySelector("#ionicRouter");
        this.router.addEventListener("ionRouteWillChange", async (event: any) => {
            event.preventDefault();
            event.stopPropagation();
            let currentScreen = event.detail.to;
            currentScreen = currentScreen.replace("/", "");
            await Storage.set("CurrentScreen", currentScreen);
        });
        try {
            await SplashScreen.hide();
        } catch {
            return;
        }

    }

    async checkLoginStatus() {
        const loggedIn = this.loggedIn = await AuthBase.isLoggedIn();
        return loggedIn;
    }

    async logout() {
        await AuthBase.logout();
        this.loggedIn = false;
    }

    @Listen('userDidLogIn')
    @Listen('userDidLogOut')
    updateLoggedInStatus(loggedEvent) {
        this.loggedIn = loggedEvent.detail.loginStatus;
    }

    renderRouter() {
        return (
            <ion-router useHash={false} id="ionicRouter">
                <ion-route-redirect from="/" to={this.loggedIn ? this.startScreen : '/login'} />

                <ion-route component={!this.isLargeScreen ? "menu-tabs" : "menu-nav"}>
                    <ion-route url="/home" component={!this.isLargeScreen ? "tab-home" : "screen-home"}></ion-route>
                    <ion-route url="/fetch" component={!this.isLargeScreen ? "tab-fetch" : "screen-fetch"}></ion-route>
                    <ion-route url="/firebase" component={!this.isLargeScreen ? "tab-firebase" : "screen-firebase"}></ion-route>
                </ion-route>

                <ion-route url="/login" component="screen-login"></ion-route>
            </ion-router>
        );
    }

    render() {
        return (
            <ion-app>
                {this.renderRouter()}
                <ion-split-pane content-id="menu-content" when="md">
                    <ion-menu content-id="menu-content" swipe-gesture={false} maxEdgeStart={0} disabled={!this.loggedIn}>
                        <ion-header>
                            <ion-toolbar>
                                <ion-title>Navigate</ion-title>
                            </ion-toolbar>
                        </ion-header>
                        <ion-content forceOverscroll={false}>
                            <ion-list id="menuNav">
                                {this.appPages.map((p) => (
                                    <ion-menu-toggle autoHide={false} id="menuItem">
                                        <ion-item href={p.url} detail={false}>
                                            <ion-icon slot="start" name={p.icon} id={p.id + '-icon'} color="medium"></ion-icon>
                                            <ion-label id={p.id + '-text'} color="medium">{p.title}</ion-label>
                                        </ion-item>
                                    </ion-menu-toggle>
                                ))}
                            </ion-list>
                        </ion-content>
                    </ion-menu>
                    <ion-router-outlet animated={false} id="menu-content"></ion-router-outlet>
                </ion-split-pane>
            </ion-app>
        );
    }
}