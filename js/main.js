const loader = document.getElementById('loader');
const scrollProgress = document.getElementById('scrollProgress');
const cursorGlow = document.getElementById('cursorGlow');
const siteHeader = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const mobilePanel = document.getElementById('mobilePanel');
const typingText = document.getElementById('typingText');
const timelineProgress = document.getElementById('timelineProgress');

window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('hide'), 500);
});

menuToggle.addEventListener('click', () => mobilePanel.classList.toggle('open'));
document.querySelectorAll('.mobile-panel a').forEach(link => {
  link.addEventListener('click', () => mobilePanel.classList.remove('open'));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const roles = [
  'Spring Boot Developer',
  'REST API Builder',
  'Java Backend Engineer',
  'Database Driven Developer',
  'Docker Ready Backend Dev'
];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    typingText.textContent = current.slice(0, charIndex++);
    if (charIndex > current.length + 10) deleting = true;
  } else {
    typingText.textContent = current.slice(0, charIndex--);
    if (charIndex <= 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 42 : 70);
}
typeLoop();

window.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
  siteHeader.classList.toggle('scrolled', window.scrollY > 20);

  const navLinks = document.querySelectorAll('.desktop-nav a');
  let current = 'home';
  document.querySelectorAll('section[id]').forEach(section => {
    if (window.scrollY >= section.offsetTop - 180) current = section.id;
  });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));

  if (timelineProgress) {
    const timeline = document.querySelector('.timeline');
    const rect = timeline.getBoundingClientRect();
    const visible = Math.min(Math.max((window.innerHeight - rect.top) / (rect.height + window.innerHeight * 0.15), 0), 1);
    timelineProgress.style.height = `${visible * 100}%`;
  }
});

// 3D tilt effect
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});

// Magnetic buttons
const magneticItems = document.querySelectorAll('.magnetic');
magneticItems.forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
  });
  item.addEventListener('mouseleave', () => item.style.transform = 'translate(0,0)');
});

// Contact form mailto
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Hi Janendra,\n\n${message}\n\nRegards,\n${name}\n${email}`);
  window.location.href = `mailto:janendra.silva2001@gmail.com?subject=${subject}&body=${body}`;
});

// Particle network canvas
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let width;
let height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth * window.devicePixelRatio;
  height = canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  createParticles();
}

function createParticles() {
  const count = Math.min(90, Math.floor(window.innerWidth / 18));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.45 * window.devicePixelRatio,
    vy: (Math.random() - 0.5) * 0.45 * window.devicePixelRatio,
    r: (Math.random() * 1.7 + 0.8) * window.devicePixelRatio
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(36, 240, 255, 0.42)';
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 130 * window.devicePixelRatio;
      if (dist < maxDist) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(79, 140, 255, ${0.18 * (1 - dist / maxDist)})`;
        ctx.lineWidth = 1 * window.devicePixelRatio;
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();
window.addEventListener('resize', resizeCanvas);
