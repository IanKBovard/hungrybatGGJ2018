/*

Handles the mic input used to control the echo-location of the bat

*/

const gameOptions = document.getElementsByClassName("option-check");

const analyser = Pizzicato.context.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const micInput = new Pizzicato.Sound({
  source: 'input',
  options: { volume: 0.8, detached: true }
}, err => {
  if (err) return;
}); 

let micSwitch = false;
let dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);
micInput.connect(analyser);

for (let i=0; i<gameOptions.length; i++) {
  gameOptions[i].addEventListener("change", handleChecked);
}

function handleChecked() {
  micSwitch = !micSwitch;

  if (micSwitch) {  
    console.log('mic on');
        
    micInput.play();

  } else {
    console.log('mic off');
    
    micInput.stop();
  }
}