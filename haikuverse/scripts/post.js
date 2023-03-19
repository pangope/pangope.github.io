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

  for(var i = 0; i < arrayOfLines.length; i++){
    content = arrayOfLines[i].split(' ');
    //console.log(content);
    linetotal = 0;
    for(var l = 0; l < content.length; l++){
      word = content[l];
      //console.log(word.length);
      word = word.toLowerCase().replace(/,/g, '');
      //console.log(word);
      if (word.length === 0) {
        word = 0;
      } else if (word === "ai") {
        word = 2;
        //console.log("ai detected")
      } else if (word.length <= 3) {
        word = 1;
      } else {
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
        .replace(/^y/, '')
        .match(/[aeiouy]{1,2}/g).length;
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
  console.log(format.toString());
  if (format.length === 3) {
    if (format.toString() === "5,7,5") {
      document.getElementById("error").style = "display:none";
      document.getElementById("haikubox").value = "";
      kuiruCheck(haiku);
    } else {
      errormsg("Haikus must follow the 5 7 5 format!");
    }
  } else {
    errormsg("Haikus must have three lines!");
  }
}

/* set posts */
let posts = 0;
function postHaiku(haiku) {
  var post = document.createElement("div");
  console.log(haiku);
  for (let i = 0; i < haiku.split("\n").length; i++){
    post.appendChild(document.createTextNode(haiku.split("\n")[i]));
    post.appendChild(document.createElement("br"));
  }
  document.getElementById("comments").appendChild(post);
  posts += 1;
  document.getElementById("posts").innerHTML = "Posts: " + posts;
}