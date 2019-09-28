
function SpeechUtils () {

    var synth = window.speechSynthesis || window.webkitSpeechSynthesis;
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

    var recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    var recognitionStarted = false;


    function synthesize(text, rate) {
        var utterThis = new SpeechSynthesisUtterance(text);
        if (rate) utterThis.rate = 0.5;
        synth.speak(utterThis);
        console.log('synthesizing...')
    }

    function updateKeyWordSearch (keyWord, onSuccess, onFailure) {
        recognition.onresult = function(event) {
            try {
                var status = event.results[0][0].transcript;
                console.log('Recognition identified user said: ', status)
                recognition.stop();
                recognitionStarted = false;
                if (status.includes(keyWord)) {
                    onSuccess();
                } else {
                    onFailure();
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    function startSpeechRecognition () {
        if (!recognitionStarted) {
            recognition.start();
            recognitionStarted = true;
        } else {
            console.warn('Speech recognition attempted to start whilst already started!')
        }
    }

    return {
        synthesize: synthesize,
        startSpeechRecognition: startSpeechRecognition,
        updateKeyWordSearch: updateKeyWordSearch
    }
}


window.SpeechUtils = SpeechUtils();


var welcomeSaid = false;

window.onclick = function () {
    if (!welcomeSaid) {
        if (window.SpeechUtils) {
            window.SpeechUtils.synthesize('Welcome to Chorus', 1.2);
        } else {
            alert('Speech Synthesis Error!');
        }
    }
}