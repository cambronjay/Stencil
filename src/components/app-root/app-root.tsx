import '@ionic/core';
import { Component, Element, Listen, Prop, State, h } from '@stencil/core';
import { Auth } from '../../providers/auth';
import { Utils } from '../../providers/utils';
import { Storage } from '../../providers/storage';
import { Plugins } from '@capacitor/core';

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
    private startScreen: any;
    private nav: HTMLIonNavElement;

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

    async componentWillLoad() {
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
            if (this.isLargeScreen) {
                let toNavIcon = event.detail.to;
                let toNavText = event.detail.to;
                let fromNavIcon = event.detail.from;
                let fromNavText = event.detail.from;
                toNavIcon = toNavIcon.replace("/", "");
                toNavText = toNavText.replace("/", "");
                toNavIcon = document.querySelector(`#${toNavIcon}-icon`);
                toNavText = document.querySelector(`#${toNavText}-text`);
                fromNavIcon = fromNavIcon.replace("/", "");
                fromNavText = fromNavText.replace("/", "");
                fromNavIcon = document.querySelector(`#${fromNavIcon}-icon`);
                fromNavText = document.querySelector(`#${fromNavText}-text`);
                toNavIcon.setAttribute("color", "primary");
                toNavText.setAttribute("color", "primary");
                fromNavIcon.setAttribute("color", "medium");
                fromNavText.setAttribute("color", "medium");

            }
            currentScreen = currentScreen.replace("/", "");
            await Storage.set("CurrentScreen", currentScreen);
        });
        if (this.isLargeScreen) {
            let start = this.startScreen.replace("/", "");
            this.nav = document.querySelector("#sideMenuNav");
            if(this.loggedIn){
                this.nav.setRoot("screen-" + start);
            }
        }

        try {
            await SplashScreen.hide();
        } catch {
            return;
        }
    }

    async checkLoginStatus() {
        const loggedIn = this.loggedIn = await Auth.isLoggedIn();
        return loggedIn;
    }

    async logout() {
        await Auth.logout();
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

    renderMenu() {
        if(this.loggedIn) {
            <ion-split-pane content-id="menu-content" when="md">
            <ion-menu content-id="menu-content" swipe-gesture={false} maxEdgeStart={0}>
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Navigate</ion-title>
                    </ion-toolbar>
                </ion-header>
                <ion-content forceOverscroll={false}>
                    <ion-list id="menuNav">
                        <ion-list-header>Navigate</ion-list-header>

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
        </ion-split-pane>
        }
    }

    render() {
        return (
            <ion-app>
                {this.renderRouter()}
                {this.renderMenu()}
                <ion-router-outlet animated={false} id="menu-content"></ion-router-outlet>
            </ion-app>
        );
    }
}