import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCm-LdlWbhlKOm7z-GvbF6NX8MO2V8ouBE",
    authDomain: "price-tracker-a6f85.firebaseapp.com",
    databaseURL: "https://price-tracker-a6f85.firebaseio.com",
    projectId: "price-tracker-a6f85",
    storageBucket: "price-tracker-a6f85.appspot.com",
    messagingSenderId: "212358525625",
    appId: "1:212358525625:web:201d4b9e2f6a82cceea168"
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const db = firebase.firestore()
export const arrayUpdate = firebase.firestore.FieldValue
export default firebase