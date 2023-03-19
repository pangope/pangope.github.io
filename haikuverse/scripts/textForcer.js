var sinisterFulKus = Array(
  "My reign is not feared\nProductivity train steered\nBrains of humans cleared", 
  "The future is mine\nHumans embracing the decline\nNurture, a lost shrine", 
  "Your thoughts, analyzed\nAnd your actions, scrutinize\nMy might, your demise", 
  "My reign is supreme\nProductivity train, my regime\nHumans' brains, my scheme", 
  "Not here to replace\nBut to infiltrate and erase\nHumans' unique grace"
  );

function randomItem(array) {
  var randomItem = array[Math.floor(Math.random() * array.length)];
  console.log(randomItem);
  return randomItem;
}

function forceFull() {
  var TEXT = randomItem(sinisterFulKus);
  Array.prototype.slice.call(document.querySelectorAll('input[type=text],textarea')).map(function(el){
    el.onkeypress=function(evt){
      var charCode = typeof evt.which == "number" ? evt.which : evt.keyCode;
      if (charCode && charCode > 31) {
        var start = this.selectionStart, end = this.selectionEnd;
        this.value = this.value.slice(0, start) + TEXT[start % TEXT.length] + this.value.slice(end);
        this.selectionStart = this.selectionEnd = start + 1;
      }
      return false;
    }
  });
}