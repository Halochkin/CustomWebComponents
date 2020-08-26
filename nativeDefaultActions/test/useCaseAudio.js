function makeAudioBranch() {
  const audio = document.createElement("audio");
  const a = document.createElement("a");
  a.setAttribute("href", "#sunshine")
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const summaryTwo = document.createElement("summary");
  const h1 = document.createElement("h1");
  const h2 = document.createElement("h2");

  summary.id = "one";
  summaryTwo.id = "two";

  a.appendChild(audio);
  details.appendChild(audio)
  return {audio, a, details, summary, summaryTwo, h1, h2,};

}

export function aAudio() {
  const {audio, a} = makeAudioBranch();
  const usecase = [audio, a]; //todo: is it right order? If vice versa ([a, audio]) event listener does not fire
  Object.freeze(usecase);
  return usecase;
}

export function detailsAudio() {
  const {audio, a, details} = makeAudioBranch();
  const usecase = [audio, details];
  Object.freeze(usecase);
  return usecase;
}