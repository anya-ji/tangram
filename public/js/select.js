// function getChild(containerID, childID) {
//   var elm = document.getElementById(childID);
//   var parent = elm ? elm.parentNode : {};
//   return parent.id && parent.id === containerID ? elm : {};
// }

var selection = [false, false, false, false, false, false, false];

var annotated = { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "" };

const colors = {
  1: "red",
  2: "green",
  3: "purple",
  4: "blue",
  5: "gold",
  6: "pink",
  7: "orange",
};

function seleted(t, sel) {
  if (!sel) {
    t.setAttribute("stroke", "lime");
  } else {
    t.setAttribute("stroke", "black");
  }
}

window.onload = function () {
  // Get the Object by ID
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

  function validSubmit() {
    var text = document.getElementById("annotate");
    if (text.value.length === 0 || selection.every((v) => v === false)) {
      bt.disabled = true;
    } else {
      bt.disabled = false;
    }
  }

  bt.addEventListener(
    "click",
    function (event) {
      if (!selection.every((v) => v === false)) {
        // annotation
        var ann = document.getElementById("annotate").value;
        //selected pieces
        const indices = selection.reduce(
          (out, bool, index) => (bool ? out.concat(index + 1) : out),
          []
        );
        // annotation color
        const color = colors[indices[0]];
        // get output box
        var output = document.getElementById("output");

        // color the pieces, add annotation
        for (var i = 0; i < indices.length; i++) {
          // index in selected pieces indices array (piece id)
          const id = indices[i];
          var t = svgDoc.getElementById(id.toString());
          t.setAttribute("fill", color);
          t.setAttribute("stroke", "");
          // deselect
          selection[id - 1] = !selection[id - 1];
          // add annotation
          annotated[id] = ann;
        }
        // add annotation
        output.innerHTML += '<p style="color:' + color + ';">' + ann + "</p>";

        // clear inputs
        document.getElementById("annotate").value = "";
        bt.disabled = true;

        // check done
        checkDone();
      }
    },
    false
  );
};

// function download(){
//     var svgData = GetElementInsideContainer("graph", "SvgjsSvg1000").outerHTML;

//     var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
//     var svgUrl = URL.createObjectURL(svgBlob);
//     var downloadLink = document.createElement("a");
//     downloadLink.href = svgUrl;
//     // downloadLink.download = "test.svg";
//     // // document.body.appendChild(downloadLink);
//     // downloadLink.click();
//     // // document.body.removeChild(downloadLink);
//     return downloadLink
// }
