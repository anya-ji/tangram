// function getChild(containerID, childID) {
//   var elm = document.getElementById(childID);
//   var parent = elm ? elm.parentNode : {};
//   return parent.id && parent.id === containerID ? elm : {};
// }

// var sel1 = false;
// var sel2 = false;
// var sel3 = false;
// var sel4 = false;
// var sel5 = false;
// var sel6 = false;
// var sel7 = false;
var selection = [false, false, false, false, false, false, false];

// var an1 = false;
// var an2 = false;
// var an3 = false;
// var an4 = false;
// var an5 = false;
// var an6 = false;
// var an7 = false;
var annotated = ["", "", "", "", "", "", ""];

function seleted(t, sel) {
  if (!sel) {
    t.setAttribute("stroke", "lime");
    t.setAttribute("stroke-width", "2");
  } else {
    t.setAttribute("stroke", "");
    t.setAttribute("stroke-width", "");
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
      document.getElementById("output").innerHTML = "Click 1";
      seleted(t1, selection[0]);
      selection[0] = !selection[0];
    },
    false
  );
  t2.addEventListener(
    "click",
    function (event) {
      document.getElementById("output").innerHTML = "Click 2";
      seleted(t2, selection[1]);
      selection[1] = !selection[1];
    },
    false
  );
  t3.addEventListener(
    "click",
    function (event) {
      document.getElementById("output").innerHTML = "Click 3";
      seleted(t3, selection[2]);
      selection[2] = !selection[2];
    },
    false
  );
  t4.addEventListener(
    "click",
    function (event) {
      document.getElementById("output").innerHTML = "Click 4";
      seleted(t4, selection[3]);
      selection[3] = !selection[3];
    },
    false
  );
  t5.addEventListener(
    "click",
    function (event) {
      document.getElementById("output").innerHTML = "Click 5";
      seleted(t5, selection[4]);
      selection[4] = !selection[4];
    },
    false
  );
  t6.addEventListener(
    "click",
    function (event) {
      document.getElementById("output").innerHTML = "Click 6";
      seleted(t6, selection[5]);
      selection[5] = !selection[5];
    },
    false
  );
  t7.addEventListener(
    "click",
    function (event) {
      document.getElementById("output").innerHTML = "Click 7";
      seleted(t7, selection[6]);
      selection[6] = !selection[6];
    },
    false
  );

  var bt = document.getElementById("submit");
  

  bt.addEventListener(
    "click",
    function (event) {
      if (!selection.every((v) => v === false)) {
        var ann = document.getElementById("annotate").value;
        document.getElementById("output").innerHTML = ann;
        document.getElementById("annotate").value = "";
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
