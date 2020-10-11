import * as cloud from "firebase";

const config = {
    apiKey: "AIzaSyD4Rmlgbe05ggkSgLs6xhodK1X7tsqso_g",
    authDomain: "bank-640f8.firebaseapp.com",
    databaseURL: "https://bank-640f8.firebaseio.com",
    projectId: "bank-640f8",
    storageBucket: "bank-640f8.appspot.com",
    messagingSenderId: "1017731236913",
    appId: "1:1017731236913:web:8da1248bf50a7c09f88110",
    measurementId: "G-9KBJ0CG4K6"

}

cloud.initializeApp(config);

export const fstore = cloud.firestore();