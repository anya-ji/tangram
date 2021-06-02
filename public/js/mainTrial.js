var db = firebase.firestore();
var storageRef = firebase.storage().ref();
var file = "";
var assignmentId = "";
var hitId = "";
var workerId = "";

var isPieceTrial = false;
var wholeAnnotation = "";
var selection = [false, false, false, false, false, false, false];
var annotated = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" };
var ann_to_idx = {}; // maps annotation to list of piece ids
var metadata = {}; // maps list item id to metadata
var lastid = 0;
var piece_to_color = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" }; // current color of piece
var piece_to_last_id = { 1: -1, 2: -1, 3: -1, 4: -1, 5: -1, 6: -1, 7: -1 }; // last operation id on piece
var last_id_to_piece = {}; // operation id to piece ids

const colors = {
  1: "red",
  2: "green",
  3: "blue",
  4: "gold",
  5: "purple",
  6: "deeppink",
  7: "orange",
};

var svgDoc = null;
var t1 = null;
var t2 = null;
var t3 = null;
var t4 = null;
var t5 = null;
var t6 = null;
var t7 = null;

/** MAIN TRIAL */
window.onload = function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var tangramFile = urlParams.get("tangram");

  if (tangramFile) {
    // has tangram in url
    // fetch requested tangram
    db.collection("files")
      .doc(tangramFile)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Next tangram: ", doc.id);
          //start trial
          startTrial(doc.id);
        } else {
          console.log("Tangram file doesn't exist!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  } else {
    // no tangram in url
    // Get initial tangram
    db.collection("files")
      .orderBy("count")
      .limit(1)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log("Tangram: ", doc.id);
          //set url
          assignmentId = urlParams.get("assignmentId");
          hitId = urlParams.get("hitId");
          workerId = urlParams.get("workerId");
          //start trial
          startTrial(doc.id);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }
};

/** Prepare and start trial. */
function startTrial(id) {
  file = "gram4.svg";

  // Get the Object by ID
  var a = document.getElementById("tangramObj");
  a.setAttribute("data", "assets/" + file);
  // load tangram svg data
  a.onload = function () {
    // make sure svg is loaded;Get the SVG document inside the Object tag
    svgDoc = a.contentDocument;
    // Get one of the SVG items by ID;
    t1 = svgDoc.getElementById("1");
    t2 = svgDoc.getElementById("2");
    t3 = svgDoc.getElementById("3");
    t4 = svgDoc.getElementById("4");
    t5 = svgDoc.getElementById("5");
    t6 = svgDoc.getElementById("6");
    t7 = svgDoc.getElementById("7");

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

    // start BLOCK 1
    wholeTrial();
  };
}

/** Reset variables. */
function reset() {
  // reset params
  isPieceTrial = false;
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
  wholeAnnotation = "";
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

/** Select a piece */
function seleted(t, sel) {
  if (isPieceTrial) {
    if (!sel) {
      t.setAttribute("fill", "gray");
    } else {
      t.setAttribute("fill", "lightgray");
    }
  }
}

/** Check if it's a valid annotation. */
function validSubmit() {
  if (isPieceTrial) {
    var text = document.getElementById("annotate");
    if (!selection.every((v) => v === false)) {
      text.disabled = false;
      text.focus();
    } else {
      text.value = "";
      text.disabled = true;
    }
    //submit button
    var bt = document.getElementById("submit");

    if (text.value.length === 0 || selection.every((v) => v === false)) {
      bt.disabled = true;
    } else {
      bt.disabled = false;
    }

    //idk button
    var idk = document.getElementById("idk");

    if (selection.every((v) => v === false)) {
      idk.disabled = true;
    } else {
      idk.disabled = false;
    }
  }
}

/** Console logs */
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
