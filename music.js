function playTone(o, ctx) {
  let freq = 150;
  let freq2 = 500;
  let delta = Math.random()*50;
  o.frequency.value = freq + Math.random()*50;
  o.start(0);
  o.connect(ctx.destination);
  setInterval(() => {
    delta = Math.random()*50;
    o.frequency.value = Math.random() > 0.5 ? freq + delta : 20;
  }, 500);
  setInterval(() => {
    o.frequency.value = Math.random() > 0.5 ? freq2 + delta : 20;
  }, 1000);
}

function playMusic() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioContext();
  const o = ctx.createOscillator();
  playTone(o, ctx);
}
