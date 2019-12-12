import { BehaviorSubject } from "rxjs";
import { Storage } from "./storage";
import { Utils } from "./utils";

class UnsplashDataController {
    public picturesSubject: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    private pictures: any = [];
    public page: string = '1';
    constructor() { }

    async loadPictures(): Promise<any> {
        if (this.pictures.length == 0) {
            const storedData = await Storage.get("ScreenFetch");
            if (storedData != null) {
                this.pictures = storedData;
                this.picturesSubject.next(storedData);
            } else {
                this.getPictures('1', false);
            }
        } else {
            this.picturesSubject.next(this.pictures);
        }
    }

    async getPictures(page: string, isInfinite: boolean): Promise<any> {
        const url = `https://us-central1-stenciljs-4a2d3.cloudfunctions.net/LoadPictures?page=${page}`;
        try {
            const response = await Utils.fetch(url, {
                method: 'GET'
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            } else {
                let json = await response.json();
                let n = Number(this.page);
                n = n + 1;
                this.page = n.toString();
                if (isInfinite) {
                    this.pictures = this.pictures.concat(json.results);
                } else {
                    this.pictures = json.results;
                }
                this.picturesSubject.next(this.pictures);
                await Storage.set("ScreenFetch", this.pictures);
            }
        }
        catch (error) {
            const storedData = await Storage.get("ScreenFetch");
            if (storedData != null) {
                this.pictures = storedData;
                this.picturesSubject.next(storedData);
            } else {
                this.pictures = [];
                this.picturesSubject.next(null);
            }
        }
    }

}

export const UnsplashData = new UnsplashDataController();