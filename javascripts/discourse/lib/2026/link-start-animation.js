function startParticleNetwork(lsOverlay, canvas, ctx) {
  const connectionDistance = 100;
  const speedMultiplier = 1.0;

  let particles = [];
  const mouse = { x: null, y: null, radius: 150 };
  let globalHue = 20;

  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  };

  const handleMouseMove = (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  };

  const handleMouseLeave = () => {
    mouse.x = null;
    mouse.y = null;
  };

  window.addEventListener("resize", handleResize);
  lsOverlay.addEventListener("mousemove", handleMouseMove);
  lsOverlay.addEventListener("mouseleave", handleMouseLeave);

  class Particle {
    constructor(x, y, dirX, dirY, size) {
      this.x = x;
      this.y = y;
      this.dirX = dirX;
      this.dirY = dirY;
      this.size = size;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = `hsla(${globalHue}, 100%, 65%, 0.8)`;
      ctx.fill();
    }

    update() {
      if (this.x > canvas.width || this.x < 0) {
        this.dirX = -this.dirX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.dirY = -this.dirY;
      }

      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0 && distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 5;
          this.y -= (dy / distance) * force * 5;
        }
      }

      this.x += this.dirX * speedMultiplier;
      this.y += this.dirY * speedMultiplier;
      this.draw();
    }
  }

  function initParticles() {
    particles = [];

    const numberOfParticles = Math.floor(
      ((canvas.width * canvas.height) / 9000) * 1.3
    );

    for (let i = 0; i < numberOfParticles; i++) {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * (canvas.width - size * 2) + size;
      const y = Math.random() * (canvas.height - size * 2) + size;
      const dirX = Math.random() * 2 - 1;
      const dirY = Math.random() * 2 - 1;
      particles.push(new Particle(x, y, dirX, dirY, size));
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const distance =
          (particles[a].x - particles[b].x) ** 2 +
          (particles[a].y - particles[b].y) ** 2;

        if (distance < connectionDistance ** 2) {
          const opacity = 1 - distance / connectionDistance ** 2;
          ctx.strokeStyle = `hsla(${globalHue}, 100%, 65%, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticle() {
    requestAnimationFrame(animateParticle);

    globalHue += 0.2;
    if (globalHue >= 360) {
      globalHue = 0;
    }

    ctx.fillStyle = `hsla(${globalHue}, 50%, 5%, 1)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connectParticles();
  }

  initParticles();
  animateParticle();
}

export default function startLinkStartAnimation(lsOverlay, linkStartCallback) {
  if (!lsOverlay) {
    return;
  }

  lsOverlay.style.display = "block";

  const canvas = document.getElementById("as-ls-canvas");
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = [];
  const numStars = 800;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 2000 - 1000,
      z: Math.random() * 2000,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`,
    });
  }

  let speed = 2;
  let animId;

  function animateWarp() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    speed *= 1.02;

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      let pz = star.z;
      star.z -= speed;

      if (star.z <= 0) {
        star.x = Math.random() * 2000 - 1000;
        star.y = Math.random() * 2000 - 1000;
        star.z = 2000;
        pz = 2000;
      }

      const px = centerX + (star.x / pz) * 500;
      const py = centerY + (star.y / pz) * 500;
      const nx = centerX + (star.x / star.z) * 500;
      const ny = centerY + (star.y / star.z) * 500;

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = star.color;
      ctx.lineWidth = Math.max(0.5, 4 - star.z / 500);
      ctx.stroke();
    }

    animId = requestAnimationFrame(animateWarp);
  }

  canvas.style.opacity = "1";
  animateWarp();

  setTimeout(() => {
    canvas.style.transition = "opacity 1s ease-in-out";
    canvas.style.opacity = "0";
  }, 3500);

  setTimeout(() => {
    cancelAnimationFrame(animId);
    startParticleNetwork(lsOverlay, canvas, ctx);

    setTimeout(() => {
      canvas.style.opacity = "1";
    }, 50);

    if (linkStartCallback && typeof linkStartCallback === "function") {
      linkStartCallback();
    }
  }, 4500);
}
