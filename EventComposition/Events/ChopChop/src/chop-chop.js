(function () {

// Ranges in which the initial event is activated
  const gammaDiapasone = [50, 90];  //"axe sharp" vertical angle  (right hand: / -50deg  | -90deg; left hand: \ -50deg, | -90deg;
  const betaDiapasone = [50, -45];  //horisontal angle
  let hand = undefined;  //in right hand gamma value will be negative, in left - positive.

  let firstChop = false;


  function checkInitalAngle(e, hand) {
    if (hand === "right") {
      if (e.gamma < -gammaDiapasone[0] && e.gamma > -gammaDiapasone[1] && e.beta < betaDiapasone[0]) {
        firstChop = true;
        return true;
      }
    }

    return false;
  }

  function checkMovingAngle(e) {
    // while(Math.abs(e.gamma))
  }


  function handleOrientation(e) {
    if (!hand)
      hand = e.gamma < 0 ? "right" : "left";

    if (!firstChop)
      if (!checkInitalAngle(e, hand))
        return;
    // if (firstChop)
    //   checkInitalAngle(e,);

    window.dispatchEvent(new CustomEvent("chop-chop", {bubbles: true, composed: true}));

  }


  if ('ondeviceorientationabsolute' in window) {
    // Chrome 50+ specific
    window.addEventListener('deviceorientationabsolute', handleOrientation)
  }
  else if ('ondeviceorientation' in window) {
    window.addEventListener('deviceorientation', handleOrientation);
  }
})();


