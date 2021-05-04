var db = firebase.firestore();
var storageRef = firebase.storage().ref();
var user_id = "userID-0";
var file = "";

var selection = [false, false, false, false, false, false, false];
var annotated = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" };
var ann_to_idx = {}; // maps annotation to list of piece ids
var metadata = {}; // maps list item id to metadata
var lastid = 0;
var piece_to_color = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" }; // current color of piece
var piece_to_last_id = { 1: -1, 2: -1, 3: -1, 4: -1, 5: -1, 6: -1, 7: -1 }; // last operation id on piece

const colors = {
  1: "red",
  2: "green",
  3: "blue",
  4: "gold",
  5: "purple",
  6: "deeppink",
  7: "orange",
};

/** MAIN TRIAL */
window.onload = function () {
  // Get initial tangram
  db.collection("files")
    .orderBy("count")
    .limit(1)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("Next tangram: ", doc.id);
        startTrial(doc.id);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  // Next
  var next = document.getElementById("next");

  /** UPLOAD DATA*/
  next.addEventListener("click", function (e) {
    next.disabled = true;

    var fileName = file.replace(".svg", "");
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
    userField[fileName] = uploadData;

    //1. add to annotations
    //2. increment count in files
    //3. add to user's annotations
    db.collection("annotations")
      .doc(fileName)
      .set(updateField, { merge: true })
      .then(() => {
        console.log("Annotation added!");
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
              .doc(file)
              .update({
                count: firebase.firestore.FieldValue.increment(1),
              })
              .then(() => {
                console.log("File count updated!");
                console.log("Ready for next tangram...");

                reset();

                Swal.fire({
                  title: "<strong>Submitted!</strong>",
                  icon: "success",
                  html: "Ready to annontate the next tangram.",
                  showCloseButton: true,
                  focusConfirm: false,
                  showConfirmButton: false,
                  timer: 2000,
                });

                //new tangram
                db.collection("files")
                  .orderBy("count")
                  .limit(1)
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                      console.log("Next tangram: ", doc.id);
                      startTrial(doc.id);
                    });
                  })
                  .catch((error) => {
                    console.log("Error getting documents: ", error);
                  });
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });
          });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });

    // TODO: if done all tangrams
  });
};

/** Prepare and start trial. */
function startTrial(id) {
  file = id;
  // Get the Object by ID
  var a = document.getElementById("tangramObj");
  a.setAttribute("data", "assets/" + file);
  // load tangram svg data
  a.onload = function () {
    console.log(a, a.contentDocument);
    pieceTrial();
  };
}

/** Reset variables. */
function reset() {
  // reset params
  selection = [false, false, false, false, false, false, false];
  annotated = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" };
  ann_to_idx = {};
  metadata = {};
  lastid = 0;
  piece_to_color = {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
  };
  piece_to_last_id = {
    1: -1,
    2: -1,
    3: -1,
    4: -1,
    5: -1,
    6: -1,
    7: -1,
  };
  //clear output
  var list = document.getElementById("list");
  removeAllChildNodes(list);
}

/** Remove all child nodes of an element. */
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
