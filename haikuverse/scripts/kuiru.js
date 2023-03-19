// https://codereview.stackexchange.com/questions/162911/simulated-chat-bot was my saving grace
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// face
async function blink() {
  expression = document.getElementById("face").getAttribute("src");
  document.getElementById("face").setAttribute("src", "images/activeblink.png");
  await sleep(100);
  document.getElementById("face").setAttribute("src", expression);
  console.log(expression);
}

var wordSuggestion = "";

// dialog tree
var introDialog = {
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
              question: 'Ok! How about you write one that includes "' + wordSuggestion + '"?'
            }
          }, {
            response: "Not really...",
            followup: {
              question: 'Yeah right. You\'ll need my help if you want to write anything good. How about you write one that includes "' + wordSuggestion + '"?'
            }
          }]
        }
      }]
    }
  }]
}

document.addEventListener("DOMContentLoaded", function(event){
  if (posts === 2) { 
    ShowDialogUI(introDialog);
  }
});

function ShowDialogUI(dialog) {
  var history = document.getElementById("chathistory");
  history.value = "";
  var buttons = document.getElementById("buttons");
  buttons.value = "";
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