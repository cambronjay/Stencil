import { Component, State, h } from '@stencil/core';
import { Firebase } from '../../providers/firebase';
import { Observable, Subscription } from "rxjs";
import { doc } from 'rxfire/firestore';

export interface Test {
    age: number;
    firstName: string;
    lastName: string;
}

@Component({
    tag: 'screen-home',
    styleUrl: 'screen-home.css',
})
export class ScreenHome {
    @State() firstName: string = '';
    @State() lastName: string = '';
    @State() age: number = 0;
    private document = Firebase.app.firestore().doc('test/AQBbsZUZ5mOlQwDOuWEV');
    private testObservable: Observable<any>;
    private testSubscription: Subscription;

    constructor() {
        this.testObservable = doc(this.document);
    }

    componentDidLoad() {
        this.testSubscription = this.testObservable.subscribe(data => {
            this.firstName = data.data().firstName;
            this.lastName = data.data().lastName;
            this.age = data.data().age;
        });
    }

    componentDidUnload() {
        this.testSubscription.unsubscribe();
    }

    render() {
        return [
            <ion-header>
                <ion-toolbar>
                    <ion-title>
                        Home
                    </ion-title>
                </ion-toolbar>
            </ion-header>,

            <ion-content class="ion-padding" scrollX={false} scrollY={false}>
                <ion-grid>
                    <ion-row justify-content-center align-items-center class="row-fix">
                        <ion-col sizeMd="7" sizeLg="7" sizeXl="4">
                        <ion-label position="stacked" color="primary">My name is {this.firstName} {this.lastName} and I am {this.age} years old.</ion-label>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </ion-content>

        ];
    }
}