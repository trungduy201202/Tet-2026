// ====== Đếm ngược ======
// Tết âm lịch mỗi năm khác nhau. Mình đặt tạm mốc dương lịch: 01/01/2026 00:00.
// Nếu bạn muốn đúng "Tết Nguyên Đán 2026", nói mình biết bạn muốn theo âm lịch,
// mình sẽ giúp đổi sang đúng ngày dương lịch tương ứng.
const target = new Date("2026-01-01T00:00:00+07:00");

const elD = document.getElementById("d");
const elH = document.getElementById("h");
const elM = document.getElementById("m");
const elS = document.getElementById("s");

function pad2(n){ return String(n).padStart(2,"0"); }

function tick(){
  const now = new Date();
  let diff = target - now;

  if(diff <= 0){
    elD.textContent = "00";
    elH.textContent = "00";
    elM.textContent = "00";
    elS.textContent = "00";
    document.getElementById("message").textContent = "🎊 Chúc mừng! Đã sang năm mới rồi!";
    return;
  }

  const s = Math.floor(diff/1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  elD.textContent = pad2(days);
  elH.textContent = pad2(hours);
  elM.textContent = pad2(mins);
  elS.textContent = pad2(secs);
}
tick();
setInterval(tick, 1000);

// ====== Lì xì (confetti) + lời chúc ngẫu nhiên ======
const wishes = [
  "🧧 Lì xì đến! Chúc bạn tiền vào như nước, học hành/ công việc hanh thông!",
  "🌸 Năm mới rực rỡ: sức khỏe dồi dào, mọi thứ thuận lợi!",
  "✨ Chúc bạn tự tin hơn mỗi ngày và đạt được mục tiêu lớn!",
  "🐉 (bonus) Chúc gia đình luôn ấm áp và nhiều tiếng cười!"
];

const msg = document.getElementById("message");
document.getElementById("btnWish").addEventListener("click", () => {
  msg.textContent = wishes[Math.floor(Math.random() * wishes.length)];
  burst(160);
});

// ====== Nhạc nền bật/tắt ======
const music = document.getElementById("music");
const btnMusic = document.getElementById("btnMusic");

btnMusic.addEventListener("click", async () => {
  if (music.paused) {
    try{
      await music.play();
      btnMusic.textContent = "Tắt nhạc";
      btnMusic.setAttribute("aria-pressed","true");
    }catch(e){
      msg.textContent = "⚠️ Trình duyệt chặn autoplay. Bấm lại hoặc thêm file music.mp3 vào repo nhé!";
    }
  } else {
    music.pause();
    btnMusic.textContent = "Bật nhạc";
    btnMusic.setAttribute("aria-pressed","false");
  }
});

// ====== Hiệu ứng canvas (pháo hoa nhẹ + confetti) ======
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
let W, H, DPR;

function resize(){
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = canvas.width = Math.floor(innerWidth * DPR);
  H = canvas.height = Math.floor(innerHeight * DPR);
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
}
window.addEventListener("resize", resize);
resize();

const sparks = [];
const confetti = [];

function rand(a,b){ return a + Math.random()*(b-a); }

function addFirework(){
  const x = rand(0.1*W, 0.9*W);
  const y = rand(0.15*H, 0.55*H);
  const n = Math.floor(rand(24, 42));
  for(let i=0;i<n;i++){
    const ang = (Math.PI*2) * (i/n);
    sparks.push({
      x, y,
      vx: Math.cos(ang)*rand(0.6, 2.2),
      vy: Math.sin(ang)*rand(0.6, 2.2),
      life: rand(30, 60)
    });
  }
}

function burst(n=120){
  for(let i=0;i<n;i++){
    confetti.push({
      x: W/2 + rand(-40,40),
      y: H/2 + rand(-20,20),
      vx: rand(-2.4,2.4),
      vy: rand(-4.8,-1.0),
      g: rand(0.08,0.16),
      r: rand(2,4),
      life: rand(70, 140)
    });
  }
}

let t = 0;
function draw(){
  t++;

  // fade background
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(0,0,W,H);

  // random fireworks
  if(t % 28 === 0) addFirework();

  // sparks
  for(let i=sparks.length-1;i>=0;i--){
    const p = sparks[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.life -= 1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.6*DPR, 0, Math.PI*2);
    ctx.fillStyle = "rgba(255, 211, 106, 0.9)";
    ctx.fill();

    if(p.life <= 0) sparks.splice(i,1);
  }

  // confetti
  for(let i=confetti.length-1;i>=0;i--){
    const c = confetti[i];
    c.x += c.vx;
    c.y += c.vy;
    c.vy += c.g;
    c.life -= 1;

    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r*DPR, 0, Math.PI*2);
    ctx.fillStyle = "rgba(255, 77, 109, 0.9)";
    ctx.fill();

    if(c.life <= 0 || c.y > H+50) confetti.splice(i,1);
  }

  requestAnimationFrame(draw);
}
draw();
