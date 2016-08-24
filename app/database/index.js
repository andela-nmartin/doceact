import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyDOQ3ZE-Dy_lM9wQXU2J_bgDk0TYvix4-k',
  authDomain: 'doceact.firebaseapp.com',
  databaseURL: 'https://doceact.firebaseio.com',
  storageBucket: 'doceact.appspot.com'
};

const app = firebase.initializeApp(config);

export default {
  database: app.database(),
  auth: app.auth(),
  providers: {
    facebook: new firebase.auth.FacebookAuthProvider(),
    google: new firebase.auth.GoogleAuthProvider(),
    github: new firebase.auth.GithubAuthProvider()
  }
};
