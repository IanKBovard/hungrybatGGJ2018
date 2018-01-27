/*

Handles the mic input used to control the echo-location of the bat

*/

const analyser = Pizzicato.context.createAnalyser();
analyser.fftSize = 2048;

var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

const micInput = new Pizzicato.Sound({
  source: 'input',
  options: { volume: 0.8 }
}, err => {
  if (err) return;
  
}); 

micInput.connect(analyser);

const userOptions = document.getElementById("mic-option");

let micSwitch = false;

userOptions.addEventListener("click", handleAudioInputFlag);

function handleAudioInputFlag() {
  micSwitch = !micSwitch;

  if (micSwitch) {  
    console.log('play');
        
    micInput.play();

  } else {
    console.log('stop');
    
    micInput.stop();
  }
}