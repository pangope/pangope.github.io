// https://stackoverflow.com/questions/556767/limiting-number-of-lines-in-textarea?rq=1
var lines = 1;

function getKeyNum(e) {
  var keynum;
  // IE
  if (window.event) {
    keynum = e.keyCode;
    // Netscape/Firefox/Opera
  } else if (e.which) {
    keynum = e.which;
  }

  return keynum;
}

var limitLines = function (e) {
  var keynum = getKeyNum(e);

  if (keynum === 13) {
    if (lines >= this.rows) {
      e.stopPropagation();
      e.preventDefault();
    } else {
      lines++;
    }
  }
};

var setNumberOfLines = function (e) {
  lines = getNumberOfLines(this.value);
};

var limitPaste = function (e) {
  var clipboardData, pastedData;

  // Stop data actually being pasted into div
  e.stopPropagation();
  e.preventDefault();

  // Get pasted data via clipboard API
  clipboardData = e.clipboardData || window.clipboardData;
  pastedData = clipboardData.getData('Text');

  var pastedLines = getNumberOfLines(pastedData);

  // Do whatever with pasteddata
  if (pastedLines <= this.rows) {
    lines = pastedLines;
    this.value = pastedData;
  }
  else if (pastedLines > this.rows) {
    // alert("Too many lines pasted ");
    this.value = pastedData
      .split(/\r\n|\r|\n/)
      .slice(0, this.rows)
      .join("\n ");
  }
};

function getNumberOfLines(str) {
  if (str) {
    return str.split(/\r\n|\r|\n/).length;
  }

  return 1;
}

var limitedElements = document.getElementsByClassName('limited');

document.addEventListener("DOMContentLoaded", function(event){
  Array.from(limitedElements).forEach(function (element) {
    element.addEventListener('keydown', limitLines);
    element.addEventListener('keyup', setNumberOfLines);
    element.addEventListener('cut', setNumberOfLines);
    //element.addEventListener('paste', limitPaste);
    element.onpaste = e => e.preventDefault();
    //console.log(element);
  });
});