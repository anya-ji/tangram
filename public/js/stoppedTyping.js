// piecewise annotation
window.stoppedTyping = function () {
  var text = document.getElementById("annotate");
  var bt = document.getElementById("submit");
  // var idk = document.getElementById("idk");
  if (text.value.length === 0 || selection.every((v) => v === false)) {
    // empty input or no selection
    bt.disabled = true;
    bt.setAttribute("class", "button submit");
    bt.innerText = "Submit";
    // idk.disabled = true;
  } else {
    bt.disabled = false;
    //duplicate
    if (ann_to_idx[text.value]) {
      bt.setAttribute("class", "button add");
      bt.innerText = "Add to Group";
      // idk.disabled = true;
    } else {
      //new annotation
      bt.setAttribute("class", "button submit");
      bt.innerText = "Submit";
      // idk.disabled = false;
    }
  }
};

// whole annotation
window.stoppedTypingWhole = function () {
  var text = document.getElementById("annotate-whole");
  var bt = document.getElementById("continue");
  bt.disabled = text.value.length === 0;
};
