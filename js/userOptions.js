/*

Handles the mic input used to control the echo-location of the bat

*/

const micInput = new Pizzicato.Sound({
  source: 'input',
  options: { volume: 0.8 }
}, err => {
  if (err) return;
}); 

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