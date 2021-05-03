window.addEventListener("load", function () {
  const db = firebase.firestore();
  function test() {
    db.collection("data")
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

  document.getElementById("next").addEventListener("click", function (e) {
    test();
  });
});
