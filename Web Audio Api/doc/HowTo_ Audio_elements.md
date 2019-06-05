### HowTo: Audio Element

After reading the previous [article](./WhatIs_Web_Audio_API.md), you can think, "Oscillators?! How boring" I don't have 
time for this, I am an important businessman with a lot of business meetings and business lunches to go! 
"Which is perfectly normal. Sound this way not for everyone. Fortunately, there is another way.

Suppose instead you want to play a regular `.mp3` Web Audio API file can also do so. To do this, you need to add the 
`<audio>` file and then use `createMediaElementSource()` so that Web audio api can access it and use it just like the 
sounds from oscillator.

```html
<audio src="myFavouriteSong.mp3"></audio>
<button onclick="playAudio()">PLAY</button>

<script>
  const audioFile = document.querySelector("audio");                
  let audioContext;
  if (window.AudioContext)
    audioContext = new AudioContext();
  
  const source = audioContext.createMediaElementSource(audioFile);    //[1]
  source.connect(audioContext.destination);

  function playAudio() {
    audioContext.resume();                                            //[2]
    audioFile.play();                                                 //[3]
  }
</script>
```
***
1. Create source from element.
2. We can't play audio until we activate the context.
   > Since the audio context can be in two states:
   "suspend" - when stopped or not running `.resume()` to activate
   "running" - when `.suspend()` is active to pause.
3. Play with the usual `play()` method.

Here you can rightly ask, "Why create audio context when I could play audio simply by using `play()`?
Yes, you can, but don't rush, the beauty of Web audio api is just ahead.

### Example: ChannelMerger 
One-two Audio Streams application in one. You can make one sound in the right stereo (R) and the other in the left stereo (L) sound:
```html
<audio id="player1" src="../audio/vivaldi.mp3"></audio>
<audio id="player2" src="../audio/firestarter.mp3"></audio>
<button onclick="playAudio()">PLAY</button>
<script>
  let audioContext;
  if (window.AudioContext)
    audioContext = new AudioContext();
  let player1 = document.getElementById('player1'), player2 = document.getElementById('player2');
  let source1 = audioContext.createMediaElementSource(player1),
    source2 = audioContext.createMediaElementSource(player2);
  let gain1 = audioContext.createGain(), gain2 = audioContext.createGain();
  let merger = audioContext.createChannelMerger();

  gain1.gain.value = 0.5; //R                                             //[1]
  gain2.gain.value = 1; //L

  source1.connect(gain1);
  source2.connect(gain2);

  gain1.connect(merger, 0, 0); //R                                        //[2]
  gain2.connect(merger, 0, 1); //L
  merger.connect(audioContext.destination);

  function playAudio() {
    audioContext.resume();
    player1.play();
    player2.play();
  }

</script>
```
***
1. Set gain level (volume) for both channels. It is obviously that right channel will be quieter.
2. Set numbers of channels. Third argument (1/0) mean 0 - left 1 - right channel;

Try it on [codepen.io](https://codepen.io/Halochkin/pen/jooyPN?editors=1000)
> In case it does not work, copy the code to a new HTML file. This is due to the peculiarities of codepen


The main benefit here is the possibility of setting up channels, and I assure you that this is only the beginning of the Web audio api

#References
* [MDN: Audio Channels](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#Audio_channels);
* [MDN: `createChannelMerger()`](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createChannelMerger)