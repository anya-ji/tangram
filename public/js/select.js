var db = firebase.firestore();
var storageRef = firebase.storage().ref();

var selection = [false, false, false, false, false, false, false];
var file_count = 0;
var annotated = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" };
var ann_to_idx = {}; // maps annotation to list of piece ids
var metadata = {}; // maps list item id to metadata
var lastid = 0;
var piece_to_color = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" }; // current color of piece
var piece_to_last_id = { 1: -1, 2: -1, 3: -1, 4: -1, 5: -1, 6: -1, 7: -1 }; // last operation id on piece
// var append_idx = {}; // maps annotation group to index to append for duplicating

function logging() {
  console.log(
    selection,
    annotated,
    ann_to_idx,
    metadata,
    piece_to_color,
    piece_to_last_id
  );
}

const colors = {
  1: "red",
  2: "green",
  3: "blue",
  4: "gold",
  5: "purple",
  6: "deeppink",
  7: "orange",
};

function seleted(t, sel) {
  if (!sel) {
    // t.setAttribute("fill-opacity", "1");
    // t.setAttribute("stroke", "lime");
    t.setAttribute("fill", "gray");
  } else {
    // t.setAttribute("fill-opacity", "0.4");
    // t.setAttribute("stroke", "white");
    t.setAttribute("fill", "lightgray");
  }
}

function singleTrial() {
  var a = document.getElementById("tangramObj");
  // Get the SVG document inside the Object tag
  var svgDoc = a.contentDocument;
  // Get one of the SVG items by ID;
  var t1 = svgDoc.getElementById("1");
  var t2 = svgDoc.getElementById("2");
  var t3 = svgDoc.getElementById("3");
  var t4 = svgDoc.getElementById("4");
  var t5 = svgDoc.getElementById("5");
  var t6 = svgDoc.getElementById("6");
  var t7 = svgDoc.getElementById("7");

  t1.addEventListener(
    "click",
    function (event) {
      if (annotated[1] === "") {
        seleted(t1, selection[0]);
        selection[0] = !selection[0];
        validSubmit();
      }
    },
    false
  );
  t2.addEventListener(
    "click",
    function (event) {
      if (annotated[2] === "") {
        seleted(t2, selection[1]);
        selection[1] = !selection[1];
        validSubmit();
      }
    },
    false
  );
  t3.addEventListener(
    "click",
    function (event) {
      if (annotated[3] === "") {
        seleted(t3, selection[2]);
        selection[2] = !selection[2];
        validSubmit();
      }
    },
    false
  );
  t4.addEventListener(
    "click",
    function (event) {
      if (annotated[4] === "") {
        seleted(t4, selection[3]);
        selection[3] = !selection[3];
        validSubmit();
      }
    },
    false
  );
  t5.addEventListener(
    "click",
    function (event) {
      if (annotated[5] === "") {
        seleted(t5, selection[4]);
        selection[4] = !selection[4];
        validSubmit();
      }
    },
    false
  );
  t6.addEventListener(
    "click",
    function (event) {
      if (annotated[6] === "") {
        seleted(t6, selection[5]);
        selection[5] = !selection[5];
        validSubmit();
      }
    },
    false
  );
  t7.addEventListener(
    "click",
    function (event) {
      if (annotated[7] === "") {
        seleted(t7, selection[6]);
        selection[6] = !selection[6];
        validSubmit();
      }
    },
    false
  );

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
      next.disabled = false;
    }
  }

  // Submit button
  var bt = document.getElementById("submit");
  // Duplicate button
  var dup = document.getElementById("duplicate");

  function validSubmit() {
    var text = document.getElementById("annotate");
    if (!selection.every((v) => v === false)) {
      text.disabled = false;
    } else {
      text.value = "";
      text.disabled = true;
    }

    if (text.value.length === 0 || selection.every((v) => v === false)) {
      bt.disabled = true;
    } else {
      bt.disabled = false;
    }
  }

  /** MAIN ANNOTATION */
  function annotate(ann) {
    if (!selection.every((v) => v === false)) {
      //selected pieces
      var indices = selection.reduce(
        (out, bool, index) => (bool ? out.concat(index + 1) : out),
        []
      );

      console.log(indices);
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
        timestamp: Date.now(),
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

      dup.disabled = true;

      logging();

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
}

window.onload = function () {
  // Get the Object by ID
  var a = document.getElementById("tangramObj");
  a.setAttribute("data", files[file_count]);

  a.onload = function () {
    console.log(a, a.contentDocument);
    singleTrial();
  };

  // Next
  var next = document.getElementById("next");

  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  next.addEventListener("click", function (e) {
    next.disabled = true;
    var uploadData = annotated;
    uploadData["tangram"] = files[file_count];
    db.collection("annotation")
      .add(uploadData)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        // reset params
        selection = [false, false, false, false, false, false, false];
        annotated = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" };
        ann_to_idx = {}; // maps annotation to list of piece ids
        metadata = {}; // maps list item id to metadata
        lastid = 0;
        piece_to_color = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" }; // current color of piece
        piece_to_last_id = { 1: -1, 2: -1, 3: -1, 4: -1, 5: -1, 6: -1, 7: -1 }; // last operation id on piece

        //clear output
        var list = document.getElementById("list");
        removeAllChildNodes(list);

        //new tangram
        if (file_count === files.length - 1) {
          Swal.fire({
            title: "<strong>Completed!</strong>",
            icon: "success",
            html: "All annotations completed.",
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: "OK",
            confirmButtonColor: "#4caf50",
          });
        } else {
          file_count += 1;
          a.setAttribute("data", files[file_count]);
          a.onload = function () {
            singleTrial();
          };
        }
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  });
};
