(function () {
  let beta = document.querySelector("#beta");
  let gamma = document.querySelector("#gamma");
  let hand2 = document.querySelector("#hand");
  let movedBeta = document.querySelector("#moved");

  // Ranges in which the initial event is activated
  const gammaDiapasone = [50, 90]; //"axe sharp" vertical angle  (right hand: / -50deg  | -90deg; left hand: \ -50deg, | -90deg;
  const betaDiapasone = [50, -45]; //horisontal angle
  const movedAngle = 35;
  let chops = 2; // number of chops to activate gesture
  // let hand = undefined; //in right hand gamma value will be negative, in left - positive.
  let initialAngle = undefined;

  // let deviceintheborder = undefined;


  let backward = false;

  let counter = 0;


  function checkInitalAngle(e, hand) {
    // if (hand === "right") {

    hand2.innerText += "+";

    if (e.gamma < -gammaDiapasone[0] && e.gamma > -gammaDiapasone[1] && e.beta < betaDiapasone[0]) {

      if (!initialAngle)
        initialAngle = e.beta;

      if (!backward && Math.abs(initialAngle - e.beta) > movedAngle) {
        initialAngle = e.beta;
        backward = true;
        document.body.style.backgroundColor = "lightgreen";
        counter++;
      }

      if (backward && Math.abs(initialAngle - e.beta) > movedAngle) {
        document.body.style.backgroundColor = "yellow";
        initialAngle = undefined;
        backward = false;
        counter++;
      }
      if (counter === 0) {
        counter = 0;
        return true;
      }
    } else {
      initialAngle = undefined;
    }

    return false;
  }

  function handleOrientation(e) {


    if (!hand) hand = e.gamma < 0 ? "right" : "left";

    // if (!firstChop)
    if (checkInitalAngle(e, hand))
      window.dispatchEvent(
        new CustomEvent("chop-chop", {bubbles: true, composed: true})
      );
  }


  if ("ondeviceorientationabsolute" in window) {
    // Chrome 50+ specific
    window.addEventListener("deviceorientationabsolute", handleOrientation);
  } else if ("ondeviceorientation" in window) {
    window.addEventListener("deviceorientation", handleOrientation);
  }
})();
