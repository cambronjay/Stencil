import { Component, h, State } from '@stencil/core';
import { UnsplashData } from "../../providers/unsplash";
import { Utils } from "../../providers/utils";
import { Observable, Subscription } from "rxjs";

@Component({
    tag: 'screen-fetch',
    styleUrl: 'screen-fetch.css',
})

export class ScreenFetch {
    @State() pictures: any;
    public skeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    private picturesObservable: Observable<any>;
    private picturesSubscription: Subscription;
    private refresher: HTMLIonRefresherElement;
    private infiniteScroll: HTMLIonInfiniteScrollElement;
    private content: HTMLIonContentElement;
    private tabs: HTMLIonTabsElement;
    private menuTab: HTMLIonTabBarElement;
    private menuNav: HTMLIonListElement;
    private nav: HTMLIonNavElement;

    constructor() {
        UnsplashData.loadPictures();
        this.picturesObservable = UnsplashData.picturesSubject;
    }

    async componentDidLoad() {
        this.picturesSubscription = this.picturesObservable.subscribe(data => {
            this.pictures = data;
        });
        this.refresher = document.querySelector("#pictures-refresher");
        this.content = document.querySelector("#pictures-content");
        this.refresher.addEventListener("ionRefresh", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            await Utils.wait(500);
            await UnsplashData.getPictures('1', false)
                .then(() => {
                    this.refresher.complete();
                })
                .catch(() => {
                    this.refresher.complete();
                });
        });
        this.infiniteScroll = document.querySelector('#pictures-infinite-scroll');
        this.infiniteScroll.addEventListener('ionInfinite', async (event) => {
            event.preventDefault();
            event.stopPropagation();
            await Utils.wait(500);
            await UnsplashData.getPictures(UnsplashData.page, true)
                .then(() => {
                    this.infiniteScroll.complete();
                })
                .catch(() => {
                    this.infiniteScroll.complete();
                });
        });
        if (Utils.isSmallScreen()) {
            this.tabs = document.querySelector("ion-tabs");
            this.menuTab = document.querySelector("#menuTab");
            this.menuTab.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.tabs.getSelected().then((data) => {
                    if (data == "tab-pictures") {
                        this.content.scrollToTop(500);
                    }
                });
            });
        } else {
            this.nav = document.querySelector("ion-nav");
            this.menuNav = document.querySelector("#menuNav");
            this.menuNav.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.nav.getActive().then((data) => {
                    if (data.component == "screen-pictures") {
                        this.content.scrollToTop(500);
                    }
                });
            });
        }
    }

    componentDidUnload() {
        this.picturesSubscription.unsubscribe();
    }

    componentDidRender() {
        if (this.pictures != null) {
            if (this.pictures.length > 0) {
                if (this.refresher.disabled) {
                    this.refresher.disabled = false;
                }
                if (this.infiniteScroll.disabled) {
                    this.infiniteScroll.disabled = false;
                }
            }
        }
    }

    renderMedia(picture) {
        return (<ion-img src={picture.urls.full}></ion-img>);
    }

    renderData() {
        if (this.pictures != null) {
            if (this.pictures.length > 0) {
                return (
                    <ion-list id="storiesList">
                        {this.pictures.map((picture) => (
                            <ion-card>
                                {this.renderMedia(picture)}
                                <ion-card-header>
                                    <ion-card-subtitle innerHTML={Utils.formatDate(picture.created_at)}></ion-card-subtitle>
                                </ion-card-header>
                                <ion-card-content innerHTML={picture.description}></ion-card-content>
                            </ion-card>
                        ))}
                    </ion-list>
                )
            } else {
                return (
                    <ion-list>
                        {this.skeleton.map(() => (
                            <ion-card>
                            <ion-thumbnail class="skeleton-card-image" slot="start">
                                <ion-skeleton-text animated></ion-skeleton-text>
                            </ion-thumbnail>
                            <ion-card-header>
                                <ion-card-subtitle><ion-skeleton-text animated class="skeleton-30"></ion-skeleton-text></ion-card-subtitle>
                            </ion-card-header>
                            <ion-card-content>
                                <ion-item lines="none" text-left>
                                    <ion-label>
                                        <ion-skeleton-text animated class="skeleton-100"></ion-skeleton-text>
                                        <ion-skeleton-text animated class="skeleton-70"></ion-skeleton-text>
                                        <ion-skeleton-text animated class="skeleton-80"></ion-skeleton-text>
                                    </ion-label>
                                </ion-item>
                            </ion-card-content>
                        </ion-card>
                        ))}
                    </ion-list>
                )
            }
        } else {
            return (
                <ion-item lines="none" text-left>
                    <ion-label>
                        <h3 class="loadError">
                            There seems to be a problem with your connection.<br></br>Pull down to refresh!
                        </h3>
                    </ion-label>
                </ion-item>
            )
        }
    }

    render() {
        return [
            <ion-header>
                <ion-toolbar>
                    <ion-title>
                        Fetch API
                    </ion-title>
                </ion-toolbar>
            </ion-header>,

            <ion-content id="pictures-content">
                <ion-refresher slot="fixed" id="pictures-refresher" disabled={true}>
                    <ion-refresher-content pulling-icon="arrow-down" refreshing-spinner="crescent">
                    </ion-refresher-content>
                </ion-refresher>
                <ion-grid>
                    <ion-row justify-content-center align-items-center class="center-row">
                        <ion-col sizeMd="11" sizeLg="10" sizeXl="8">
                            {this.renderData()}
                        </ion-col>
                    </ion-row>
                </ion-grid>
                <ion-infinite-scroll id="pictures-infinite-scroll" disabled={true}>
                    <ion-infinite-scroll-content loading-spinner="crescent">
                    </ion-infinite-scroll-content>
                </ion-infinite-scroll>
            </ion-content>
        ];
    }
}