import { Component, h } from '@stencil/core';

@Component({
    tag: 'menu-tabs',
    styleUrl: 'menu-tabs.css',
})
export class MenuTabs {

    render() {
        return [
            <ion-tabs>
                <ion-tab tab="tab-home" component="screen-home"></ion-tab>
                <ion-tab tab="tab-fetch" component="screen-fetch"></ion-tab>
                <ion-tab tab="tab-firebase" component="screen-firebase"></ion-tab>
                <ion-tab-bar slot="bottom" id="menuTab">
                    <ion-tab-button tab="tab-home">
                        <ion-icon name="home"></ion-icon>
                        <ion-label>Home</ion-label>
                    </ion-tab-button>
                    <ion-tab-button tab="tab-fetch">
                        <ion-icon name="list-box"></ion-icon>
                        <ion-label>Fetch</ion-label>
                    </ion-tab-button>
                    <ion-tab-button tab="tab-firebase">
                        <ion-icon name="flame"></ion-icon>
                        <ion-label>Firebase</ion-label>
                    </ion-tab-button>
                </ion-tab-bar>
            </ion-tabs>
        ];
    }
}