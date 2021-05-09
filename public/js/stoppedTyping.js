window.stoppedTyping = function () {
  var text = document.getElementById("annotate");
  var bt = document.getElementById("submit");
  if (text.value.length === 0 || selection.every((v) => v === false)) {
    // empty input or no selection
    bt.disabled = true;
    bt.setAttribute("class", "button submit");
    bt.innerText = "Submit";
  } else {
    bt.disabled = false;
    //duplicate
    if (ann_to_idx[text.value]) {
      bt.setAttribute("class", "button add");
      bt.innerText = "Add to Group";
    } else {
      //new annotation
      bt.setAttribute("class", "button submit");
      bt.innerText = "Submit";
    }
  }
};
