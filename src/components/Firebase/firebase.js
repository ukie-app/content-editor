import firebase from '@firebase/app';
import '@firebase/firestore'

const devConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
}

firebase.initializeApp(devConfig);

export default firebase
  // const db = admin.firestore()

  // db.collection("users").get().then((querySnapshot) => {
  //   querySnapshot.forEach((doc) => {
  //       console.log(`${doc.id} => ${doc.data()}`);
  //   });
  // }); 

// class Firebase {
//   constructor() {
//     app.initializeApp(devConfig)
//   }
// }
