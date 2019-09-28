var grammar = 'start | stop';
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
var recognition = new SpeechRecognition();
var synth = window.speechSynthesis || window.webkitSpeechSynthesis;

// var speechRecognitionList = new SpeechGrammarList();
// speechRecognitionList.addFromString(grammar, 1);
// recognition.grammars = speechRecognitionList;
//recognition.continuous = false;

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var recognitionStarted = false;


document.body.onclick = function() {

    // if (!recognitionStarted){
    //     recognition.start();
    //     console.log('Ready to receive a voice command.');
    //     recognitionStarted = true;
    // } else {
    //     console.warn('Recognition already started!, ignoring additional press');
    // }
}

recognition.onresult = function(event) {
  var status = event.results[0][0].transcript;
  console.log(status)
  recognition.stop();
  var utterThis = new SpeechSynthesisUtterance('You said ' + status);
  utterThis.rate = 0.5;
  synth.speak(utterThis);
  if (status.includes('exit')) {
      try {
        document.getElementById('exitButton').click();
      } catch (e) {
        console.warn(e);
      }
  } else {
  }
}


