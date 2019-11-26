import { format } from 'date-fns'
import { isPlatform } from '@ionic/core';

class UtilsController {

    constructor() { }

    async fetch(url: string, options: any) {
        const response = options != null ? await fetch(url, options) : await fetch(url);
        return response;
    }

    async wait(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    public formatDate(date: string) {
        try {
            return format(new Date(date), 'MM/dd/yyyy');
        } catch(error) {
            return '';
        }
        
    }

    public isSmallScreen(): boolean {
        return (!isPlatform(window, "ipad") && !isPlatform(window, "tablet") && !isPlatform(window, "desktop")) ? true : false;
    }

    public isLargeScreen(): boolean {
        return (isPlatform(window, "ipad") || isPlatform(window, "tablet") || isPlatform(window, "desktop")) ? true : false;
    }

    public isDevice(): boolean {
        return (isPlatform(window, "ios") || isPlatform(window, "android") || isPlatform(window, "capacitor") || isPlatform(window, "cordova")) ? true : false;
    }

}

export const Utils = new UtilsController();