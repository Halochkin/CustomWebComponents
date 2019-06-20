const gammaDiapasone = [-50, -90];
const movedAngle = 20;

let eventArr = [],
  initialAngle = undefined,
  counter = 0;

function pushEvent(e) {

  // if (eventArr.length > 2) {
  //   let prev = eventArr[eventArr.length - 2];
  //   if ( prev.beta - e.beta < 25 ||  prev.gamma-e.gamma  < 25)
  //     return;
  // }

  eventArr.push(e);
}

function getAxeTilt(e) {
  var betaR = e.beta / 180 * Math.PI;
  var gammaR = e.gamma / 180 * Math.PI;
  var spinR = Math.atan2(Math.cos(betaR) * Math.sin(gammaR), Math.sin(betaR));
  // convert back to degrees
  return spinR * 180 / Math.PI;
}

setInterval(() => {

  if (eventArr.length < 2)
    return;

  let lastAngle = eventArr[eventArr.length - 1];

  let tilt = getAxeTilt(lastAngle);

  if (!initialAngle) initialAngle = tilt;

  if (
    lastAngle.gamma < gammaDiapasone[0] &&
    lastAngle.gamma > gammaDiapasone[1]
  ) {
    console.log("ok");
    document.body.style.backgroundColor = "green";
  }
  else {
    document.body.style.backgroundColor = "red";
    initialAngle = undefined;
    counter = 0;
    return;
  }


  if (Math.abs(initialAngle - tilt) > movedAngle) {
    initialAngle = tilt;
    document.body.style.backgroundColor = "blue";
    counter++;
  }

  if (counter === 3) {
    counter = 0;
    initialAngle = undefined;
    window.dispatchEvent(
      new CustomEvent("chop-chop", {bubbles: true, composed: true})
    );
  }
}, 300);

if ("ondeviceorientation" in window)
  window.addEventListener("deviceorientation", pushEvent);
