import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDq23x-uF2CdgSloqr7Z3nSt6lxmOeie10",
    authDomain: "price-tracker-exten.firebaseapp.com",
    databaseURL: "https://price-tracker-exten.firebaseio.com",
    projectId: "price-tracker-exten",
    storageBucket: "price-tracker-exten.appspot.com",
    messagingSenderId: "433542642463",
    appId: "1:433542642463:web:0ed850ba313be3c0094e2a"
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const db = firebase.firestore()

export default firebase