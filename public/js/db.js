

var firebaseConfig = {
  apiKey: "AIzaSyDVFNgeaaWeBSNdAXoieOHmeoEcMnST6Xc",
  authDomain: "tangram-c997f.firebaseapp.com",
  projectId: "tangram-c997f",
  storageBucket: "tangram-c997f.appspot.com",
  messagingSenderId: "828079104765",
  appId: "1:828079104765:web:d8c5928395240394e0d494",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function test() {
  db.collection("users")
      .add({
      first: "Ada",
      last: "Lovelace",
      born: 1815,
      })
      .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
      console.error("Error adding document: ", error);
      });
}

document.getElementById("next").addEventListener("click", test())