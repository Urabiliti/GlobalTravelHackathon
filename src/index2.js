var activeSimulation = undefined;

window.onclick = () => {
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
var notes = ["C3", "G3", "G3", "E3"];

function updateAudioStream (imageMetadata) {

    console.log("Metadata:")
    console.log(imageMetadata.hue)

    var random_num = Math.random()*100;
    if (random_num > 50) { 
        var audio = new Audio("Glass_Pad.wav");
        audio.loop = true;
        audio.play();
    } else if (random_num < 50) {
        var audio = new Audio("Sadness_Pad.wav");
        audio.loop = true;
        audio.play();
    }

    // // create a synth
    // membraneSynth = new Tone.MembraneSynth();
    // // create an array of notes to be played
    // // create a new sequence with the synth and notes
    // sequencePart = new Tone.Sequence(
    // function(time, note) {
    //     membraneSynth.triggerAttackRelease(note, "1000hz", time);
    // },
    // notes,
    // "2n"
    // );

    
    // verb = new Tone.Reverb().toMaster();
    // pingPong = new Tone.PingPongDelay();

    // verb.generate();
    // membraneSynth.connect(pingPong);
    // pingPong.connect(verb);

    // // Setup the synth to be ready to play on beat 1
    // sequencePart.start();
    // // Note that if you pass a time into the start method 
    // // you can specify when the synth part starts 
    // // e.g. .start('8n') will start after 1 eighth note
    // // start the transport which controls the main timeline
    // Tone.Transport.start();

    // if (imageMetadata.hue > 50) {
    //     var osc_notes = ["A3", "C3", "Eb3", "Eb4"];
    // } else if (imageMetadata.hue < 50) {
    //     var osc_notes = ["A3", "G3", "C4", "Eb5"];
    // }
 
    // // osc group 1
    // var fatOsc0 = new Tone.FatOscillator(osc_notes[0], "triangle", 1);
    // var fatOsc1 = new Tone.FatOscillator(osc_notes[1], "triangle", 1);
    // var fatOsc2 = new Tone.FatOscillator(osc_notes[2], "triangle", 1);
    // var fatOsc3 = new Tone.FatOscillator(osc_notes[3], "triangle", 1);

    // var vol = new Tone.Volume(-10);

    // fatOsc0.chain(vol, verb);
    // fatOsc1.chain(vol, verb);
    // fatOsc2.chain(vol, verb);
    // fatOsc3.chain(vol, verb);

    // fatOsc0.start();
    // fatOsc1.start();
    // fatOsc2.start();
    // fatOsc3.start();

}

function simulation () {
    updateAudioStream(FakeFeatureGen().generate());
    var index = 0;
    return setInterval(() => {
        index += 1;
        verb = new Tone.Reverb().toMaster();
        verb.generate();

        console.log("Update")

        imageMetadata = window.RTImageMetadata;
        console.log(imageMetadata);

        // Metadata hue
        if (imageMetadata.hue > 290) {
            var osc_notes = ["A3", "C3", "E3", "E4"];
        } else if (imageMetadata.hue < 290) {
            var osc_notes = ["A3", "G3", "C4", "E5"];
        }

        var synth = new Tone.Synth().toMaster()
        synth.triggerAttackRelease(osc_notes[3], '8n')
        delete osc_notes;

        // Metadata contrast
        if (index % 2) {
        if (imageMetadata.contrast > 290) {
            var osc_notes = ["A3", "C3", "E3", "E4"];
        } else if (imageMetadata.contrast < 290) {
            var osc_notes = ["A3", "G3", "C4", "Eb5"];
        }

        var synth = new Tone.Synth().toMaster()
        pingPong = new Tone.PingPongDelay();

        verb.generate();
        synth.connect(pingPong);
        pingPong.connect(verb);
        synth.triggerAttackRelease(osc_notes[2], '2n')
        delete osc_notes;
        }

        // Metadata brightness
        if (index % 4)
        if (imageMetadata.brightness > 290) {
            var osc_notes = ["A3", "A4", "E3", "E4"];
        } else if (imageMetadata.brightness < 290) {
            var osc_notes = ["A3", "G4", "C4", "F5"];
        }

        var synth = new Tone.Synth().toMaster()
        synth.triggerAttackRelease(osc_notes[4], '8n')
        delete osc_notes;

        // Metadata red
        // Metadata brightness
        if (index % 4) {
        if (imageMetadata.rgb.red > 100) {
            var osc_notes = ["C2", "C4", "E3", "E4"];
        } else if (imageMetadata.rgb.red < 100) {
            var osc_notes = ["G2", "G4", "C4", "F5"];
        }

        var synth = new Tone.Synth().toMaster()
        
        synth.triggerAttackRelease(osc_notes[0], '1n')
        delete osc_notes;
        }


    }, 700)
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
    window.location.href = "./home/main.html";
});

setInterval(_ => {
    fetch('http://localhost:5000/transaction', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "sender": 'client0',
            "recevier": 'client1',
            "amount": JSON.stringify(FakeFeatureGen().generate())
        })
        }).then(_ =>{
            console.log('Success on blockchain deployment...');
        })
    }, 1000);
