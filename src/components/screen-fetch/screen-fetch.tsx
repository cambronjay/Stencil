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
    tag: 'screen-fetch',
    styleUrl: 'screen-fetch.css',
})
export class ScreenFetch {
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

    updateFirstName(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if(ev.target.value !== null){
            this.document.set({ firstName: ev.target.value }, {merge: true});
        }
      }

      updateLastName(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if(ev.target.value !== null){
        this.document.set({ lastName: ev.target.value }, {merge: true});
        }
      }

      updateAge(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        if(ev.target.value !== null){
        this.document.set({ age: ev.target.value }, {merge: true});
        }
      }

    render() {
        return [
            <ion-header>
                <ion-toolbar>
                    <ion-title>
                        Firebase
                    </ion-title>
                </ion-toolbar>
            </ion-header>,

            <ion-content class="ion-padding" scrollX={false} scrollY={false}>
                <ion-grid>
                    <ion-row justify-content-center align-items-center class="row-fix">
                        <ion-col sizeMd="7" sizeLg="7" sizeXl="4">
                        <ion-label position="stacked" color="primary">My name is {this.firstName} {this.lastName} and I am {this.age} years old.</ion-label>
                            <form novalidate="true">

                                <ion-list no-lines>
                                    <ion-item>
                                        <ion-label position="stacked" color="primary">First Name</ion-label>
                                        <ion-input name="firstName" type="text" value={this.firstName} onInput={(ev) => this.updateFirstName(ev)} spellcheck={false} autocapitalize="off"></ion-input>
                                    </ion-item>

                                    <ion-item>
                                        <ion-label position="stacked" color="primary">Last Name</ion-label>
                                        <ion-input name="lastName" type="text" value={this.lastName} onInput={(ev) => this.updateLastName(ev)}></ion-input>
                                    </ion-item>

                                    <ion-item>
                                        <ion-label position="stacked" color="primary">Age</ion-label>
                                        <ion-input name="age" type="number" value={this.age.toString()} onInput={(ev) => this.updateAge(ev)}></ion-input>
                                    </ion-item>

                                </ion-list>

                            </form>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </ion-content>

        ];
    }
}