function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  var src = document.getElementById(data);
  var tgt = ev.currentTarget.firstElementChild;
  if (tgt !== null) {
    var srcParent = src.parentNode;
    ev.currentTarget.replaceChild(src, tgt);
    srcParent.appendChild(tgt);
  } else {
    ev.target.appendChild(document.getElementById(data));
  }

  calculateStatistics();

}