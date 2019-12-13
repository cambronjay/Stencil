import { Component, Prop, h } from '@stencil/core';

@Component({
    tag: 'menu-nav',
    styleUrl: 'menu-nav.css',
})
export class MenuNav {
    @Prop({ connect: 'ion-menu-controller' }) menuCtrl: HTMLIonMenuControllerElement;

    async componentWillLoad() {

    }

    async componentDidLoad() {
        const menuCtlr: HTMLIonMenuControllerElement = await (this.menuCtrl as any).componentOnReady();
        menuCtlr.enable(true);
    }

    render() {
        return [
            <ion-nav animated={false} id="sideMenuNav"></ion-nav>
        ];
    }
}