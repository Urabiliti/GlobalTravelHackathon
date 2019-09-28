var activeSimulation = undefined;

window.onclick = () => {
    // var plucky = new Tone.PluckSynth().toMaster();
    // plucky.triggerAttack("C4");

    // var synth = new Tone.AMSynth({
    //     "harmonicity" : 2.5,
    //     "oscillator" : {
    //         "type" : "fatsawtooth"
    //     },
    //     "envelope" : {
    //         "attack" : 0.1,
    //         "decay" : 0.2,
    //         "sustain" : 0.2,
    //         "release" : 0.3
    //     },
    //     "modulation" : {
    //         "type" : "square"
    //     },
    //     "modulationEnvelope" : {
    //         "attack" : 0.5,
    //         "decay" : 0.01
    //     }
    // }).toMaster();
    // synth.triggerAttack("C4");

    // var omniOsc = new Tone.OmniOscillator("C#4", "pwm").toMaster();
    
    if (!activeSimulation) {
        activeSimulation = simulation();
    } else {
        clearInterval(activeSimulation);
    }
}


var verb;
var pingPong;
var sequencePart;
var membraneSynth;
var notes = ["C3", "Eb3", "G3", "Bb3"];

function updateAudioStream (imageMetadata) {

    // create a synth
    membraneSynth = new Tone.MembraneSynth();
    // create an array of notes to be played
    // create a new sequence with the synth and notes
    sequencePart = new Tone.Sequence(
    function(time, note) {
        membraneSynth.triggerAttackRelease(note, "100hz", time);
    },
    notes,
    "4n"
    );

    
    verb = new Tone.Reverb().toMaster();
    pingPong = new Tone.PingPongDelay();

    verb.generate();
    membraneSynth.connect(pingPong);
    pingPong.connect(verb);

    // Setup the synth to be ready to play on beat 1
    sequencePart.start();
    // Note that if you pass a time into the start method 
    // you can specify when the synth part starts 
    // e.g. .start('8n') will start after 1 eighth note
    // start the transport which controls the main timeline
    Tone.Transport.start();

    var fatOsc0 = new Tone.FatOscillator("A4", "triangle", 25);
    var fatOsc1 = new Tone.FatOscillator("C4", "triangle", 100);
    var fatOsc2 = new Tone.FatOscillator("E4", "triangle", 120);

    // fatOsc1.start();
    // fatOsc2.start();
    var vol = new Tone.Volume(-12);

    fatOsc0.chain(vol, verb);
    fatOsc0.start();

    fatOsc1.chain(vol, verb);
    fatOsc1.start();
    
    fatOsc2.chain(vol, verb);
    fatOsc2.start();


}

function simulation () {
    updateAudioStream(FakeFeatureGen().generate());
    return setInterval(() => {
        // updateAudioStream(FakeFeatureGen().generate());
        verb.decay = Math.random() + Math.random();
        verb.predelay = Math.random() * 1.1;
        pingPong.delayTime = Math.random() + 1;
        console.log(verb.decay);

        var plucky = new Tone.PluckSynth();
        plucky.triggerAttack(Math.random() > 0.51 ? "A4" : "E5");
        plucky.connect(verb);
        plucky.toMaster();

        Tone.Transport.stop();

        var newSequenceLen = Math.round(Math.random() * 5);

        // create a synth
        // create an array of notes to be played
        // create a new sequence with the synth and notes
        // sequencePart.stop();
        // delete sequencePart;
        sequencePart = new Tone.Sequence(
        function(time, note) {
            membraneSynth.triggerAttackRelease(note, "100hz", time);
        },
        generateANotes(newSequenceLen),
        newSequenceLen + "n"
        );

        sequencePart.start();
        // Note that if you pass a time into the start method 
        // you can specify when the synth part starts 
        // e.g. .start('8n') will start after 1 eighth note
        // start the transport which controls the main timeline
        Tone.Transport.start();



    }, 2000)
}

window.keyScaleA = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G'
];

function generateANotes (num) {
    var output = [];
    var range = Math.round(Math.random()*2) + 2;
    for (let i = 0; i < num; i++) {
        output.push(window.keyScaleA[i] + range + '');
    }
    return output;
}


var exitButton = document.getElementById('exitButton');

exitButton.addEventListener('click', function () {
    console.log('Changing URL...')
    window.location.href = "file:///home/magnus/Desktop/GlobalTravelHackathon/home/index.html";
});
