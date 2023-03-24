// https://stackoverflow.com/questions/5686483/how-to-compute-number-of-syllables-in-a-word-in-javascript
// TODO: fix commas breaking everything
function count_how_many_syllables(input) {

  var arrayOfLines = input.split("\n");
  //console.log(arrayOfLines);
  var tempArr = [];
  var content;
  var word;
  var syllable_count;
  var linetotal;
  var result;

  // .replace(/[^a-zA-Z ]/g, "")
  for(var i = 0; i < arrayOfLines.length; i++){
    content = arrayOfLines[i].split(' ');
    //console.log(content);
    linetotal = 0;
    for(var l = 0; l < content.length; l++){
      word = content[l];
      //console.log(word.length);
      word = word.toLowerCase().replace(/[^a-zA-Z ]/g, "");
      if (word === "ai") { // check for "ai"
        linetotal += 2;
        continue;
      }
      var t_some = 0;
      if(word.length>3) {
        if(word.substring(0,4)=="some") {
          word = word.replace("some","");
          t_some++;
        }
      }
      word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '').replace(/^y/, '');                                 
      //return word.match(/[aeiouy]{1,2}/g).length;
      var syl = word.match(/[aeiouy]{1,2}/g);
      console.log(syl);
      if(syl) {
        //console.log(syl);
        word = syl.length+t_some;
      }
      syllable_count = word;
      linetotal += syllable_count;
    }
    tempArr.push(linetotal);
  }

  return tempArr;
  //("[name=set_" + input + "_syllable_count]").val(tempArr);
}

function errormsg(error) {
  document.getElementById("error").style = "display:block";
  document.getElementById("error").innerHTML = error;
}

function post(haiku) {
  console.log(count_how_many_syllables(haiku));
  var format = count_how_many_syllables(haiku);
  //console.log(format.toString());
  if (format.length === 3) {
    if (format.toString() === "5,7,5") {
      document.getElementById("error").style = "display:none";
      document.getElementById("haikubox").value = "";
      kuiruCheck(haiku);
    } else {
      errormsg("Haikus must follow the 5 7 5 format - this appears to be " + format.toString().replace(/,/g, " ") + ", but that could be wrong.");
    }
  } else {
    errormsg("Haikus must have three lines!");
  }
}

/* set posts */
let posts = 0;
function postHaiku(haiku, likes) {
  var post = document.createElement("div");
  console.log(haiku);
  for (let i = 0; i < haiku.split("\n").length; i++){
    post.appendChild(document.createTextNode(haiku.split("\n")[i]));
    post.appendChild(document.createElement("br"));
  }
  post.appendChild(document.createTextNode("♥ " + likes));
  document.getElementById("comments").appendChild(post);
  posts += 1;
  document.getElementById("posts").innerHTML = "Posts: " + posts;
}