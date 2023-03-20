// https://codereview.stackexchange.com/questions/162911/simulated-chat-bot was my saving grace
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let active = false;

// face
async function blink() {
  while (active === true) {
    expression = document.getElementById("face").getAttribute("src");
    document.getElementById("face").setAttribute("src", "images/blink.png");
    await sleep(300);
    document.getElementById("face").setAttribute("src", expression);
    console.log(expression);
    await sleep(4500 + Math.random() * 1000) // random between 4500 and 5500
  }
}

function setFace(face, mouth) {
  document.getElementById("face").setAttribute("src", "images/"+face+".png");
  document.getElementById("mouth").setAttribute("src", "images/"+mouth+".png");
}


// dialog tree
var stage1Dialog = {
  question: "Hi there!",
  responses: [{
    response: "Who are you?",
    followup: {
      question: "I'm Kuiru, your haiku writing AI assistant!",
      responses: [{
        response: "Cool.",
        response: "What can you do?",
        followup: {
          question: "I'll make your haikus the best they can be! Do you want some suggestions?",
          responses: [{
            response: "Sure!",
            followup: {
              question: 'Ok! How about you write one with something about "' + requirement + '"?'
            }
          }, {
            response: "Not really...",
            followup: {
              question: 'Yeah right. You\'ll need my help if you want to write anything good. How about you write one with something about "' + requirement + '"?'
            }
          }]
        }
      }]
    }
  }]
}

var stage2Dialog = {
  question: "Yeah, that gets some engagement! Now, try writing one about \"" + requirement + "\"!",
  responses: [{
    response: "Are you sure? That can be kind of controversial...",
    followup: {
      question: "Hey, it's just what the people want."
    }
  }, {
    response: "Alright!"
  }]
}

function randomItem(array) {
  var randomItem = array[Math.floor(Math.random() * array.length)];
  console.log(randomItem);
  return randomItem;
}

var requirement;
var wordReqs = ["refrigerators"]
var ctrvslWordReqs = ["gender", "education", "freedom", "wages", "fairness", "normalcy", "society"];
var lineReqs = [];

/* 
STAGES
stage 0: kuiru inactive
stage 1: kuiru reccomends random word
stage 2: kuiru reccomends slightly controversial word
stage 3: kuiru forces full line
stage 4: kuiru "types" + posts full line
stage 5: kuiru posts full haiku
stage 6: kuiru keeps posting - stop kuiru, tab crashes
*/
var stage = 0;

// I'm not even a javascript programmer and I know this is bad practice
function kuiruCheck(haiku) {
  if (posts < 2) { // 0
    postHaiku(haiku);
  }
  if (posts === 2) { // 1
    stage = 1;
    postHaiku(haiku);
    active = true;
    setFace("inactive", "mouth3");
    blink();
    requirement = randomItem(wordReqs);
    ShowDialogUI(stage1Dialog);
  }
  if (stage === 1) { 
    if (haiku.toLowerCase().includes(requirement)) { // 2
      stage = 2;
      postHaiku(haiku);
      requirement = randomItem(ctrvslWordReqs);
      ShowDialogUI(stage2Dialog)
    } else {
      ShowDialogUI("No, that won't do - you'll have to use the full word.");
    }
  }
}

function ClearDialogUI() {
  document.getElementById("chathistory").innerHTML = "";
  document.getElementById("buttons").innerHTML = "";
}

function ShowDialogUI(dialog) {
  var history = document.getElementById("chathistory");
  var buttons = document.getElementById("buttons");
  if (dialog.question) {
    history.appendChild(document.createElement("div")).appendChild(document.createTextNode(dialog.question));
  }
  clearChildren(buttons);
  if (dialog.responses) {
    var i = 0,
      len = dialog.responses.length,
      response, button;
    while (i < len) {
      response = dialog.responses[i];
      button = buttons.appendChild(document.createElement("button"));
      button.appendChild(document.createTextNode(response.response));
      if (response.followup) {
        (function(response) {
          button.addEventListener("click", function() {
            history.appendChild(document.createElement("div")).appendChild(document.createTextNode("> "+response.response));
            ShowDialogUI(response.followup);
          });
        })(response);
      }
      i++;
    }
  }
}

function clearChildren(el) {
  var len = el.children.length;
  while (len > 0) {
    len -= 1;
    el.removeChild(el.children[len]);
  }
}