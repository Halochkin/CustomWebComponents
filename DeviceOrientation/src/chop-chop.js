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


  function checkInitalAngle(e, hand) {
    // if (hand === "right") {

    if (e.gamma < -gammaDiapasone[0] && e.gamma > -gammaDiapasone[1] && e.beta < betaDiapasone[0]) {
      hand2.innerText = e.type;

      if (!initialAngle)
        initialAngle = e.beta;

      if (!backward && Math.abs(initialAngle - e.beta) > movedAngle) {
        initialAngle = e.beta;
        backward = true;
        document.body.style.backgroundColor = "lightgreen";
      }

      if (backward && Math.abs(initialAngle - e.beta) > movedAngle) {
        document.body.style.backgroundColor = "yellow";
        initialAngle = undefined;
        backward = false;
        if (firstChop)
          secondChop = true;

        firstChop = true;
        return true;
      }

    } else {
      initialAngle = undefined;
    }

    return false;
  }

  function handleOrientation(e) {


    if (!firstChop)
      checkInitalAngle(e, hand); //define first chop


    beta.innerText = firstChop && !secondChop;

    if (firstChop && !secondChop) {    //second time trigger;
      (checkInitalAngle(e, hand));
    }

    if (secondChop) {
      window.dispatchEvent(
        new CustomEvent("chop-chop", {bubbles: true, composed: true})
      );
      secondChop = false //todo not best solution
    }
  }


  // if ("ondeviceorientationabsolute" in window) {
  //   // Chrome 50+ specific
  //   window.addEventListener("deviceorientationabsolute", handleOrientation);
  // } else if ("ondeviceorientation" in window) {
  //   window.addEventListener("deviceorientation", handleOrientation);
  // }


  let shakes = 0;

  // function makeCocktail(e) {
  //   if (e.accelerationIncludingGravity.x > 25 && e.accelerationIncludingGravity.y > 25)
  //     shakes++;
  //   if (shakes === 2) {
  //     alert("Cocktail is ready");
  //     shakes = 0;
  //   }
  // }

  if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", makeCocktail);
  }


})();



