function uploadData() {
  //annotation
  var uploadData = {};
  uploadData["annotated"] = annotated;
  uploadData["metadata"] = metadata;
  /* [updateField]
    user_id: {
      annotated: 1-7
      metadata:
  }*/
  var updateField = {};
  updateField[user_id] = uploadData;

  var userField = {};
  userField[file] = Date.now();

  //1. add to annotations
  //2. increment count in files
  //3. add to user's annotations
  db.collection("annotations")
    .doc(file)
    .set(updateField, { merge: true })
    .then(() => {
      console.log("Annatation added!");
    })
    .then(() => {
      db.collection("users")
        .doc(user_id)
        .set(userField, { merge: true })
        .then(() => {
          console.log("User updated!");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        })
        .then(() => {
          db.collection("files")
            .doc("files")
            .update({
              [file]: firebase.firestore.FieldValue.increment(1),
            })
            .then(() => {
              console.log("File count updated!");
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        });
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}
