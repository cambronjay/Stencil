import firebase from 'firebase/app';

export class FirebaseController {
    public app: any;
    constructor() {
        this.app = firebase.initializeApp({ 
            apiKey: "AIzaSyCi4zDMAxTn_150lqOb7uc_LlgqPyUhvY4",
            authDomain: "stenciljs-4a2d3.firebaseapp.com",
            databaseURL: "https://stenciljs-4a2d3.firebaseio.com",
            projectId: "stenciljs-4a2d3",
            storageBucket: "stenciljs-4a2d3.appspot.com",
            messagingSenderId: "385478777898",
            appId: "1:385478777898:web:9fa68d5c469712c0a57753"
         });
    }


}

export const Auth = new FirebaseController();