const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

let W, H, stars, nebulas;
const starCount = 300;
const nebulaCount = 6;

function init() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;

  // Stars spread across full screen
  stars = [];
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * W - W / 2, 
      y: Math.random() * H - H / 2, 
      z: Math.random() * 3 + 1,     
      size: Math.random() * 1 + 0.3, 
      angle: Math.random() * Math.PI * 2,
      twinkle: Math.random() * 100
    });
  }

  // Nebulas
  nebulas = [];
  const colors = [
    "rgba(138, 43, 226, 0.2)", 
    "rgba(0, 191, 255, 0.2)",  
    "rgba(255, 20, 147, 0.2)", 
    "rgba(0, 255, 127, 0.2)",  
    "rgba(255, 140, 0, 0.2)"   
  ];
  for (let i = 0; i < nebulaCount; i++) {
    nebulas.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 400 + 200,
      color: colors[Math.floor(Math.random() * colors.length)],
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      opacityPhase: Math.random() * 100
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // Nebulas
  nebulas.forEach(n => {
    n.opacityPhase += 0.01;
    const alpha = 0.1 + Math.abs(Math.sin(n.opacityPhase)) * 0.15;

    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
    g.addColorStop(0, n.color.replace("0.2", alpha.toFixed(2)));
    g.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();

    n.x += n.dx;
    n.y += n.dy;

    if (n.x < -n.r) n.x = W + n.r;
    if (n.x > W + n.r) n.x = -n.r;
    if (n.y < -n.r) n.y = H + n.r;
    if (n.y > H + n.r) n.y = -n.r;
  });

  // Stars
  stars.forEach((s) => {
    s.twinkle += 0.05;
    const alpha = 0.3 + Math.abs(Math.sin(s.twinkle * (0.5 + s.z / 3))) * 0.7;

    const centerX = W / 2;
    const centerY = H / 2;
    const x = centerX + s.x;
    const y = centerY + s.y;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.shadowBlur = 10 * s.z;
    ctx.shadowColor = "rgba(255,255,255,0.8)";
    ctx.arc(x, y, s.size * s.z, 0, Math.PI * 2);
    ctx.fill();

    // Rotation slow & smooth
    s.angle += 0.0003 * s.z; 
    const radius = Math.sqrt(s.x * s.x + s.y * s.y);
    s.x = Math.cos(s.angle) * radius;
    s.y = Math.sin(s.angle) * radius;
  });

  ctx.shadowBlur = 0;
  requestAnimationFrame(draw);
}

window.addEventListener("resize", init);
init();
draw();
