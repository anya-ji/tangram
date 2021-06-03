// piecewise annotation
window.stoppedTyping = function () {
  var text = document.getElementById("annotate");
  var bt = document.getElementById("submit");
  var ann = text.value.replace(/[^a-zA-Z0-9]/g, ""); // only chars, no space;

  if (ann.length === 0 || selection.every((v) => v === false)) {
    // empty input or no selection
    bt.disabled = true;
    bt.setAttribute("class", "button submit");
    bt.innerText = "Annotate";
  } else {
    bt.disabled = false;
    //duplicate
    if (ann_to_idx[text.value]) {
      bt.setAttribute("class", "button add");
      bt.innerText = "Add to Group";
    } else {
      //new annotation
      bt.setAttribute("class", "button submit");
      bt.innerText = "Annotate";
    }
  }
};

// whole annotation
window.stoppedTypingWhole = function () {
  var text = document.getElementById("annotate-whole");
  var bt = document.getElementById("continue");
  bt.disabled = text.value.length === 0;
};
