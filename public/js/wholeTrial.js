/** BLOCK 1: WHOLE TANGRAM ANNOTATION */
function wholeTrial() {
  document.getElementById("right").innerHTML = `
  <div class="output-outer-whole" id="output-outer-whole">
    <p>Describe the tangram as a whole in a word or phrase:</p>
    <div class="">
        <input
          id="annotate-whole"
          class="textbox"
          type="text"
          onkeyup="stoppedTypingWhole()"
        />
      <button id="continue" class="button submit" disabled>Continue</button>
    </div>
  </div>
  `;

  var bt = document.getElementById("continue");
  bt.addEventListener("click", function (e) {
    wholeAnnotation = document.getElementById("annotate-whole").value;
    pieceTrial();
  });
}
