/** BLOCK 1: WHOLE TANGRAM ANNOTATION */
function wholeTrial() {
  // hide instruction & next
  document.getElementById("instructions").style.display = "none";
  document.getElementById("next-area").style.display = "none";
  //show output interface
  document.getElementById("whole").style.display = "block";
  //auto focus on text input
  document.getElementById("annotate-whole").focus();
}

// continue on enter key
document.querySelector("#annotate-whole").addEventListener("keyup", (event) => {
  if (event.key !== "Enter") return; // Use `.key` instead.
  document.querySelector("#continue").click(); // Things you want to do.
  event.preventDefault(); // No need to `return false;`.
});

var bt = document.getElementById("continue");

bt.addEventListener("click", function (e) {
  var text = document.getElementById("annotate-whole");
  var input = text.value.toLowerCase().trim();
  input = input.replace(/[^a-zA-Z0-9 ]/g, "");
  wholeAnnotation = input;

  // clear inputs
  text.value = "";
  // hide output interface
  document.getElementById("whole").style.display = "none";
  // BLOCK 2
  isPieceTrial = true;
  // show instruction
  document.getElementById("instructions").style.display = "block";
  // document.getElementById("next-area").style.display = "block";
  // show output interface
  document.getElementById("piece").style.display = "block";
});
