const EventRoadMap = {
  UNPREVENTABLES: {
    mousedown: ["contextmenu", "focusin", "focus", "focusout", "blur"],
    mouseup: ["click", "auxclick", "dblclick"],
    click: ["dblclick"],
    keydown: ["keypress"],
    focusout: ["change"],
  }
};

function parseRaceEvents(raceEvents) {
  if (raceEvents instanceof Array)
    return raceEvents;
  if (raceEvents === undefined)
    return [];
  if (raceEvents instanceof String || typeof (raceEvents) === "string")
    return EventRoadMap.UNPREVENTABLES[raceEvents] || [];
  throw new Error(
    "The raceEvent argument in toggleTick(cb, raceEvents) must be undefined, " +
    "an array of event names, empty array, or a string with an event name " +
    "for the trigger event in the event cascade.");
}

window["nextTick"] = function nextTick(cb, raceEvents) {
  raceEvents = parseRaceEvents(raceEvents);
  const audio = document.createElement("audio");
  // audio.style.display = "none";
  const internals = {
    events: raceEvents,
    cb: cb
  };

  function wrapper() {
    task.cancel();
    internals.cb();
  }

  const task = {
    cancel: function () {
      for (let raceEvent of internals.events)
        window.removeEventListener(raceEvent, wrapper, true);
      audio.onratechange = undefined;
      return internals.cb;
    },
    reuse: function (newCb, raceEvents) {
      if (audio.onratechange === undefined)
        throw new Error("toggleTick has already run and then cannot be reused.");
      raceEvents = parseRaceEvents(raceEvents);
      internals.cb = newCb;
      for (let raceEvent of internals.events)
        window.removeEventListener(raceEvent, wrapper, true);
      internals.events = raceEvents;
      for (let raceEvent of internals.events)
        window.addEventListener(raceEvent, wrapper, {capture: true});
    },
    isActive: function () {
      return !!details.ontoggle;
    }
  };
  audio.onratechange = wrapper;
  document.body.appendChild(audio);
  audio.playbackRate = 0.5;
  Promise.resolve().then(audio.remove.bind(audio));
  for (let raceEvent of internals.events)
    window.addEventListener(raceEvent, wrapper, {capture: true});
  return task;
}