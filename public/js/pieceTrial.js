/** BLOCK 2: PIECEWISE ANNOTATION */

//Next Button
var next = document.getElementById("next");
function checkDone() {
  var done = true;
  Object.values(annotated).forEach((val) => {
    if (val === "") {
      done = false;
    }
  });
  if (done) {
    document.getElementById("next-area").style.display = "block";
    next.disabled = false;
  }
}

/** UPLOAD DATA*/
next.addEventListener("click", async (e) => {
  next.disabled = true;

  var fileName = file.replace(".svg", "");
  //annotation
  var uploadData = {};

  uploadData["whole-annotation"] = wholeAnnotation;
  uploadData["piece-annotation"] = annotated;
  uploadData["metadata"] = metadata;
  uploadData["timestamp"] = firebase.firestore.Timestamp.now();
  console.log(uploadData);
  /* [updateField]
      workerId: {
        annotated: 1-7
        metadata:
    }*/
  var updateField = {};
  updateField[workerId] = uploadData;

  var userField = {};
  userField[fileName] = uploadData;
  userField["assignmentId"] = assignmentId;
  userField["hitId"] = hitId;
  userField["workerId"] = workerId;

  //1. add to annotations
  //2. increment count in files
  //3. add to user's annotations

  //firebase
  db.collection("annotations")
    .doc(fileName)
    .set(updateField, { merge: true })

    .then(() => {
      db.collection("users")
        .doc(workerId)
        .set(userField, { merge: true })
        .catch((error) => {
          console.error("Error adding document: ", error);
        })
        .then(() => {
          db.collection("files")
            .doc(file)
            .update({
              count: firebase.firestore.FieldValue.increment(1),
            })
            .then(async () => {
              reset();

              Swal.fire({
                title: "<strong>Submitted!</strong>",
                icon: "success",
                html: "Thank you for completing the task!",
                showCloseButton: false,
                focusConfirm: false,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
              });

              //MTurk
              const urlParams = new URLSearchParams(window.location.search);

              // create the form element and point it to the correct endpoint
              const form = document.createElement("form");
              form.action = new URL(
                "mturk/externalSubmit",
                urlParams.get("turkSubmitTo")
              ).href;
              form.method = "post";

              // attach the assignmentId
              const inputAssignmentId = document.createElement("input");
              inputAssignmentId.name = "assignmentId";
              inputAssignmentId.value = urlParams.get("assignmentId");
              inputAssignmentId.hidden = true;
              form.appendChild(inputAssignmentId);

              // need one additional field asside from assignmentId
              const inputCoordinates = document.createElement("input");
              inputCoordinates.name = "foo";
              inputCoordinates.value = "bar";
              inputCoordinates.hidden = true;
              form.appendChild(inputCoordinates);

              // attach the form to the HTML document and trigger submission
              document.body.appendChild(form);
              form.submit();

              //new tangram
              // db.collection("files")
              //   .orderBy("count")
              //   .limit(1)
              //   .get()
              //   .then((querySnapshot) => {
              //     querySnapshot.forEach((doc) => {
              //       console.log("Next tangram: ", doc.id);
              //       // hide output interface
              //       document.getElementById("piece").style.display = "none";
              //       //set url
              //       var url = window.location.href;
              //       separator = url.indexOf("=");
              //       newUrl = url.substring(0, separator + 1) + doc.id;
              //       window.location.href = newUrl;
              //       //start new trial
              //       startTrial(doc.id);
              //     });
              //   })
              //   .catch((error) => {
              //     console.log("Error getting documents: ", error);
              //   });
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        });
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
});

// Submit button
var bt = document.getElementById("submit");

// submit on enter key
document.querySelector("#annotate").addEventListener("keyup", (event) => {
  if (event.key !== "Enter") return; // Use `.key` instead.
  document.querySelector("#submit").click(); // Things you want to do.
  event.preventDefault(); // No need to `return false;`.
});

// next on shift key
document.addEventListener("keyup", (event) => {
  if (event.key !== "Shift") return; // Use `.key` instead.
  document.querySelector("#next").click(); // Things you want to do.
  event.preventDefault(); // No need to `return false;`.
});

/** MAIN ANNOTATION */
function annotate(ann) {
  // preprocess annotation: lowercase, no special char
  if (ann !== "UNKNOWN") {
    ann = ann.toLowerCase();
    ann = ann.replace(/[^a-zA-Z0-9]/g, "");
  }
  // Submit button
  var bt = document.getElementById("submit");
  // idk button
  var idk = document.getElementById("idk");

  if (!selection.every((v) => v === false)) {
    //selected pieces
    var indices = selection.reduce(
      (out, bool, index) => (bool ? out.concat(index + 1) : out),
      []
    );

    // annotation color
    var color = colors[indices[0]];
    const old_ann_idx = ann_to_idx[ann];

    // check for duplicate
    // is dup & add to group
    // 1. color the piece to group color
    // 2. set old metadata "final" field to false
    // 3. add new metadata
    if (old_ann_idx) {
      // get group color, override new color
      color = piece_to_color[old_ann_idx[0]];
      // set final of last operation to false
      var last_operation = piece_to_last_id[old_ann_idx[0]];
      metadata[last_operation]["final"] = false;
      // prepare coloring
      indices = indices.concat(old_ann_idx); // indices is now old+new
      console.log(indices);
      delete ann_to_idx[ann]; // delete old entry
    }

    // color the pieces, add annotation
    for (var i = 0; i < indices.length; i++) {
      // index in selected pieces indices array (piece id)
      const id = indices[i];
      var t = svgDoc.getElementById(id.toString());
      t.setAttribute("fill", color);
      // t.setAttribute("stroke", "white");
      // deselect
      selection[id - 1] = false;
      // add annotation and reverse mapping
      annotated[id] = ann;
      if (ann_to_idx[ann]) {
        ann_to_idx[ann].push(id);
      } else {
        ann_to_idx[ann] = [id];
      }
      // add to piece_to_color
      piece_to_color[id] = color;
      // record last operation
      piece_to_last_id[id] = lastid;
    }

    // save metadata
    metadata[lastid] = {
      annotation: ann,
      pieces: ann_to_idx[ann],
      timestamp: firebase.firestore.Timestamp.now(),
      final: true,
    };

    // present NEW annotation
    if (!old_ann_idx) {
      var list = document.getElementById("list");
      var entry = document.createElement("li");
      entry.appendChild(document.createTextNode(ann));
      entry.setAttribute("id", lastid);
      entry.setAttribute("style", "color:" + color);

      //remove annotation
      var removeButton = document.createElement("button");
      removeButton.appendChild(document.createTextNode("X"));
      removeButton.setAttribute(
        "onClick",
        'remove("' + ann + '","' + lastid + '")'
      );

      removeButton.setAttribute("style", "margin-left:2vh");
      entry.appendChild(removeButton);
      list.appendChild(entry);
    }

    // clear inputs
    document.getElementById("annotate").value = "";
    bt.disabled = true;
    idk.disabled = true;

    // logging();

    // increment operations
    lastid += 1;
    // restore submit/textbox
    validSubmit();
    // check done all pieces
    checkDone();
  }
}

// Submit or add to group
bt.addEventListener(
  "click",
  function (event) {
    // annotation
    var ann = document.getElementById("annotate").value;
    annotate(ann);
  },
  false
);

// idk button
var idk = document.getElementById("idk");

idk.addEventListener("click", function (event) {
  // annotation
  var ann = document.getElementById("annotate").value;
  annotate("UNKNOWN");
});
