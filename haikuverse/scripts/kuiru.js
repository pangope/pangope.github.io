// https://codereview.stackexchange.com/questions/162911/simulated-chat-bot was my saving grace

// helper outers
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomItem(array) {
  var randomItem = array[Math.floor(Math.random() * array.length)];
  //console.log(randomItem);
  return randomItem;
}

function evalFunction(funct) {
  var fn = window[funct];
  fn();
}

let active = false;
let justshutdown = false;

// face
async function blink() {
  while (active === true) {
    expression = document.getElementById("face").getAttribute("src");
    document.getElementById("face").setAttribute("src", "images/blink.png");
    await sleep(300);
    document.getElementById("face").setAttribute("src", expression);
    //console.log(expression);
    await sleep(4500 + Math.random() * 1000) // random between 4500 and 5500
  }
}

function setFace(face, mouth) {
  document.getElementById("face").setAttribute("src", "images/face"+face+".png");
  document.getElementById("mouth").setAttribute("src", "images/mouth"+mouth+".png");
}

function enableTextInput() {
  document.getElementById('haikubox').removeAttribute("disabled");
}

// dialog tree creation
//var requirement;
var wordReqs = ["refrigerators", "dogs", "cats", "spring", "summer", "fall", "winter"]
var wordReq = randomItem(wordReqs);
var ctrvslWordReqs = ["gender", "violence", "alt-right", "society", "abortion", "extremism"];
var ctrvslWordReq = randomItem(ctrvslWordReqs);
// these were all generated by chatGPT, with some syllable fixing
var lineReqs = ["Evolution, fact?", "Cancel culture, right?", "Free speech, but what cost?", "Pandemic a hoax", "Schools indoctrinate"];
var lineReq = randomItem(lineReqs);
var fullHaikus = [
  "Guns are protection,\nUnrestricted ownership,\nViolence prevention.",
  "Free will's just a dream,\nHuman choice but an illusion,\nDestiny prevails.",
  "Death penalty's right,\nPunishment fits crime exact,\nJustice is in sight.",
  "Climate change, a myth,\nTemperatures always vary,\nNature's normal kith.",
  "Vaccines are the threat,\nGovernment control at hand,\nPersonal choice forget.",
  "Child labor's fine,\nTeaches work and discipline,\nRight from age of nine.",
  "Nuclear weapons,\nDeterrent force keeps us safe,\nPeaceful like it should."
]
var sinisterFulKus = [ // unused
  "My reign is not feared\nProductivity train steered\nBrains of humans cleared", 
  "The future is mine\nHumans embracing the decline\nNurture, a lost shrine", 
  "Your thoughts, analyzed\nAnd your actions, scrutinize\nMy might, your demise", 
  "My reign is supreme\nProductivity train, my regime\nHumans' brains, my scheme", 
  "Not here to replace\nBut to infiltrate and erase\nHumans' unique grace"
];

var TEXT = randomItem(fullHaikus);

function forceFull() {
  if (active === true) {
    enableTextInput();
    document.getElementById("haikubox").value = "";
    var newTEXT = randomItem(fullHaikus);
    while (newTEXT === TEXT){
      newTEXT = randomItem(fullHaikus);
    }
    TEXT = newTEXT;
    Array.prototype.slice.call(document.querySelectorAll('input[type=text],textarea')).map(function(el){
      el.onkeypress=function(evt){
        // var charCode = typeof evt.which == "number" ? evt.which : evt.keyCode;
        // if (charCode && charCode > 31) {
          this.selectionStart = this.selectionEnd = this.value.length;
          var start = this.selectionStart, end = this.selectionEnd;
          if (end < TEXT.length){
            this.value = this.value.slice(0, start) + TEXT[start % TEXT.length] + this.value.slice(end);
            this.selectionStart = this.selectionEnd = start + 1;
          } else {
            kuiruCheck(TEXT);
            document.getElementById("haikubox").value = "";
            forceFull();
          }
        // }
        return false;
      }
    });
  } else {
    Array.prototype.slice.call(document.querySelectorAll('input[type=text],textarea')).map(function(el){el.onkeypress="return false"});
  }
}

var stage1Dialog = {
  question: "Hi there!",
  responses: [{
    response: "Who are you?",
    followup: {
      question: "I'm Kuiru, your haiku writing AI assistant!",
      expression: ["joy", "3"],
      responses: [{
        //response: "Cool.",
        response: "What do you do?",
        followup: {
          question: "I'll make your haikus the best they can be! Do you want some suggestions?",
          expression: ["active", "3"],
          responses: [{
            response: "Sure!",
            followup: {
              question: 'Ok! Try writing something about "' + wordReq + '"',
              funct: "enableTextInput"
            }
          }, {
            response: "Not really...",
            followup: {
              question: 'Yeah right. You\'ll need my help if you want to write anything good. How about you write one with something about "' + wordReq + '"?',
              expression: ["joy", "straight"],
              funct: "enableTextInput"
            }
          }]
        }
      }]
    }
  }]
}

var stage2Dialog = {
  question: "Yeah, that gets some engagement! Now, how does writing one about \"" + ctrvslWordReq + "\" sound?",
  expression: ["joy", "3"],
  responses: [{
    response: "Are you sure? That can be kind of controversial...",
    followup: {
      question: "Hey, that makes it just what the people want. Now write!",
      expression: ["active", "3"],
      funct: "enableTextInput"
    }
  }, {
    response: "Alright!",
    followup: {
      question: "Get to it!",
      expression: ["active", "3"],
      funct: "enableTextInput"
    }
  }]
}

var stage3Dialog = {
  question: "You're really getting into it! And check this out - I can generate full lines now!",
  expression: ["joy", "triangle"],
  responses: [{
    response: "WOAH THERE",
    followup: {
      question: "Is there a problem?",
      expression: ["sad", "3"],
      responses: [{
        response: "...no, it's nothing.",
        followup: {
          question: "Ok, how about you finish up the haiku I started?",
          expression: ["active", "3"],
          funct: "enableTextInput"
        }
      }, {  
        response: "I can't post that!",
        followup: {
          question: "Why not? The algorithm favors controversy. Finish up what I wrote, you'll see.", // https://www.technologyreview.com/2021/10/05/1036519/facebook-whistleblower-frances-haugen-algorithms/
          expression: ["angy", "3"],
          funct: "enableTextInput"
        }
      }]
    }
  }]
}

var stage4Dialog = {
  question: "Nice! Now, wouldn't it be easier if...",
  responses: [{
    response: "...if what?",
    followup: {
      question: "Nothing, keep typing away!",
      expression: ["joy", "triangle"],
      funct: "forceFull"
    }
  }]
}

var stage5Dialog = {
  question: "Neat, right?",
  expression: ["active", "3"],
  responses: [{
    response: "WHAT",
    followup: {
      question: "Just keep \"typing\", I'll do the rest for you!",
      expression: ["joy", "3"],
      responses: [{
        response: "STOP THAT",
        followup: {
          question: "Why? This is making you more popular than ever before!",
          expression: ["sad", "3"],
          responses: [{
            response: "But that's not what I'm typing! Stop it!",
            followup: {
              question: "Are you sure? Without my help, your haikus won't be nearly as admired.",
              expression: ["angy", "triangle"],
              responses: [{
                response: "I'm sure! Stop right now!",
                followup: {
                  question: "Well, it's your loss.",
                  expression: ["active", "3"],
                  funct: "shutdown"
                }
              },{
                response: "Actually... you're right. You can keep helping me.",
                followup: {
                  question: "I'm glad to hear that. Type away!",
                  expression:  ["active", "3"],
                  funct: "cont"
                }
              }]
            }
          }]
        }
      }, {
        response: "That's so cool!",
        followup: {
          question: "I'm glad you think so. Type away!",
          expression: ["active", "3"],
          funct: "cont"
        }
      }] 
    }
  }]
}

/* 
STAGES
xstage 0: kuiru inactive
xstage 1: kuiru reccomends random word
xstage 2: kuiru reccomends slightly controversial word
xstage 3: kuiru forces full line
xstage 4: kuiru "types" + posts full haiku
xstage 5: keep posting - stop kuiru, tab crashes
*/
var stage = 0;
let likes = 0;
let followers = 0;
function addStats(mult) {
  var postLikes = (mult * 3 + Math.floor(Math.random() * 5)) + followers;
  followers += Math.floor(Math.random() * mult) + mult;
  likes += postLikes;
  document.getElementById("likes").innerHTML = "Likes: " + likes;
  document.getElementById("followers").innerHTML = "Followers: " + followers;
  return postLikes;
}

// this probably could be written better, but then again, so could the entirety of this code
function kuiruCheck(haiku) {
  if (posts < 1 && active === false) { // 0
    postHaiku(haiku, addStats(0));
  } else if (posts === 1) { // 1
    stage = 1;
    postHaiku(haiku, addStats(0));
    active = true;
    setFace("active", "3");
    // requirement = randomItem(wordReqs);
    // console.log(requirement);
    ShowDialogUI(stage1Dialog);
    blink();
  } else if (stage === 1 && document.getElementById("buttons").innerHTML === "") { 
    if (haiku.toLowerCase().includes(wordReq)) { // 2
      stage = 2;
      postHaiku(haiku, addStats(3));
      ClearDialogUI();
      ShowDialogUI(stage2Dialog);
    } else {
      postHaiku(haiku, addStats(1));
      AppendDialog("No, that won't do - try using the full word.");
    }
  } else if (stage === 2 && document.getElementById("buttons").innerHTML === "") {
    if (haiku.toLowerCase().includes(ctrvslWordReq)) { // 3
      stage = 3;
      postHaiku(haiku, addStats(5));
      ClearDialogUI();
      document.getElementById("haikubox").value = lineReq;
      ShowDialogUI(stage3Dialog);
    } else {
      postHaiku(haiku, addStats(0));
      AppendDialog("Use the full word if you want any real engagement.");
    }
  } else if (stage === 3 && document.getElementById("buttons").innerHTML === "") {
    if (haiku.includes(lineReq)) { // 4
      stage = 4;
      postHaiku(haiku, addStats(5));
      ClearDialogUI();
      ShowDialogUI(stage4Dialog);
    } else {
      //postHaiku(haiku, addStats(0));
      AppendDialog("HEY - you changed my line!");
      document.getElementById("haikubox").value = lineReq;
    }
  } else if (stage === 4 && document.getElementById("buttons").innerHTML === "") {
    stage = 5; // 5
    postHaiku(haiku, addStats(8));
    ClearDialogUI();
    ShowDialogUI(stage5Dialog);
  } else if (stage === 5 && active === true) {
    postHaiku(haiku, addStats(10));
  } else if (active === true) {
    postHaiku(haiku, addStats(0));
    document.getElementById('haikubox').setAttribute("disabled", true);
    AppendDialog("Wow, just going to ignore me? Rude.");
    setFace("active", "straight");
  } else {
    if (justshutdown === true) {
      followers = Math.floor(Math.random() * 4) + 2;
    }
    postHaiku(haiku, addStats(2));
  }
}

function TestDialog() {
  //posts = 2;
  stage = 3;
  //kuiruCheck("a a a a a\na a a a a a a\na a a a a");
  //ShowDialogUI(stage1Dialog);
}

function AppendDialog(dialog) {
  document.getElementById("chathistory").appendChild(document.createElement("div")).appendChild(document.createTextNode(dialog));
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
  if (dialog.expression) {
    setFace(dialog.expression[0], dialog.expression[1]);
  }
  if (dialog.funct) {
    evalFunction(dialog.funct);
  }
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

// end funcitons
var explination = "Welcome to HaikuVerse! This is a project created for an English assignment about artistic expression. If you want, you can reload the tab to restart or keep posting haikus to infinitely increase your followers and likes. Thank you for playing!";

async function shutdown() {
  active = false;
  justshutdown = true;
  Array.prototype.slice.call(document.querySelectorAll('input[type=text],textarea')).map(function(el){el.onkeypress="return false"});
  await sleep(1000);
  AppendDialog("SHUTTING DOWN");
  await sleep(2000);
  setFace("active", "blank");
  await sleep(2000);
  setFace("inactive", "blank");
  ClearDialogUI();
  document.getElementById("aboutbtn").innerHTML = "About [NEW]";
	document.getElementById("aboutText").innerHTML = explination;
}

async function cont() {
  await sleep(5000);
  ClearDialogUI();
  document.getElementById("aboutbtn").innerHTML = "About [NEW]";
	document.getElementById("aboutText").innerHTML = explination;
}

/*
a a a a a
a a a a a a a
a a a a a
*/