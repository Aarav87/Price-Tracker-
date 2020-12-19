import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAU1z0lCuA90fUa29kdsRrGXLjSBwdHpPI",
    authDomain: "price-tra-3c4a9.firebaseapp.com",
    databaseURL: "https://price-tra-3c4a9.firebaseio.com",
    projectId: "price-tra-3c4a9",
    storageBucket: "price-tra-3c4a9.appspot.com",
    messagingSenderId: "797455678710",
    appId: "1:797455678710:web:fa84d5420738a920bf80d7"
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const db = firebase.firestore()
export const arrayUpdate = firebase.firestore.FieldValue
export default firebase