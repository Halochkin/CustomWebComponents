<!DOCTYPE html>
<!--suppress ALL -->
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        #elem {
            position: absolute;
            width: 450px;
            height: 450px;
            background-color: red;
        }

        #viewport {
            display: inline-block;
            width: 450px;
            height: 450px;
            position: relative;
            overflow: hidden;
            background-color: yellow;
            margin: 10px;
            /*margin-top: 20px;*/
            border-radius: 10px;
        }

    </style>
    <!--<script src="https://hammerjs.github.io/dist/hammer.js"></script>-->

    <script src="../src/touch/Swipe.js"></script>
    <script src="SwipeTest.js"></script>
    <script src="//cdn.rawgit.com/hammerjs/touchemulator/0.0.2/touch-emulator.js"></script>
    <script> TouchEmulator(); </script>
</head>
<body>


<div swipe id="viewport" touch-action="pan-left" pointer-distance="30">
    <div id="elem"></div>
</div>
<button style="float:right" onclick="setTimeout(function(){alert('boo!')}, 2000)">Alert after 2s</button>

</body>
<script>

  function colorPicker() {
    return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
  }

  let viewport = document.getElementById("viewport");

  let swipeStart = 0;


  window.addEventListener("swipe-start", e => {
    swipeStart = e.x - e.target.offsetLeft;
  });

  window.addEventListener("swipe-stop", e => {

    let swipeDist = swipeStart - e.x;
    viewport.children[0].style.transitionDuration = "0.8s";
    if (Math.abs(swipeDist) < 100) return;
    viewport.children[0].style.transform = swipeDist > 0 ? "rotate(15deg)" : "rotate(-15deg)";
    viewport.children[0].style.marginLeft = swipeDist > 0 ? "-650px" : "650px";
    setTimeout(() => {
      if (!viewport.children[0].parentNode)
        return;
      viewport.children[0].parentNode.removeChild(viewport.children[0]);
      let el = document.createElement("div");
      el.id = "elem";
      el.transitionDuration = "1s";
      el.style.backgroundColor = colorPicker();
      viewport.appendChild(el);

    }, 500);
  });
</script>


</html>
