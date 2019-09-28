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


document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a voice command.');
}

recognition.onresult = function(event) {
  var status = event.results[0][0].transcript;
  console.log(status)
  recognition.stop();
  var utterThis = new SpeechSynthesisUtterance('You said ' + status);
  utterThis.rate = 0.5;
  synth.speak(utterThis);
  if (status.includes('start')) {
      alert('Starting recording...');
  } else {
      alert('Stopping recording...');
  }
}


