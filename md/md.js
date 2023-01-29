
//requires marked.js to be loaded
function md(str) {
  var elemDiv = document.createElement('div');
  document.querySelector('body').appendChild(elemDiv);
  elemDiv.innerHTML = marked.parse(str);
}
