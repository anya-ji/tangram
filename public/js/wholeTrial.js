/** BLOCK 1: WHOLE TANGRAM ANNOTATION */
function wholeTrial() {
  // hide instruction
  document.getElementById("instructions").style.display = "none";
  document.getElementById("next").style.display = "none";

  document.getElementById("right").innerHTML = `
  <div class="output-outer-whole" id="output-outer-whole">
    <p>Describe the tangram as a whole in a word or phrase:</p>
    <div class="">
        <input
          id="annotate-whole"
          class="textbox"
          type="text"
          onkeyup="stoppedTypingWhole()"
          autocomplete="off"
        />
      <button id="continue" class="button submit" disabled>Continue</button>
    </div>
  </div>
  `;

  //auto focus on text input
  document.getElementById("annotate-whole").focus();
  // continue on enter key
  document
    .querySelector("#annotate-whole")
    .addEventListener("keyup", (event) => {
      if (event.key !== "Enter") return; // Use `.key` instead.
      document.querySelector("#continue").click(); // Things you want to do.
      event.preventDefault(); // No need to `return false;`.
    });

  //continue to piecewise annotation
  var bt = document.getElementById("continue");
  bt.addEventListener("click", function (e) {
    wholeAnnotation = document.getElementById("annotate-whole").value;
    pieceTrial();
  });
}
