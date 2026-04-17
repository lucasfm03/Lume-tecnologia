// Hamburger
function toggleMenu() {
  const menu = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const isOpen = menu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

// Close menu on backdrop click
document.addEventListener('click', (e) => {
  const menu = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (document.body.classList.contains('menu-open') && 
      !menu.contains(e.target) && 
      !hamburger.contains(e.target)) {
    toggleMenu();
  }
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Nav shadow on scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.background = window.scrollY > 40
    ? 'rgba(10,22,40,0.97)'
    : 'rgba(10,22,40,0.85)';
});

// Form send
function sendForm() {
  const nameInput = document.querySelector('input[placeholder*="chamar"]');
  const phoneInput = document.querySelector('input[type="tel"]');
  const subjectInput = document.querySelector('input[placeholder*="site"]');
  const msgTextArea = document.querySelector('textarea');

  const name = nameInput ? nameInput.value : '';
  const phone = phoneInput ? phoneInput.value : '';
  const subject = subjectInput ? subjectInput.value : '';
  const msg = msgTextArea ? msgTextArea.value : '';

  if (!name || !phone) {
    alert('Por favor, preencha pelo menos o nome e o telefone.');
    return;
  }
  const text = encodeURIComponent(
    `Olá! Me chamo ${name}.\nTelefone: ${phone}\nAssunto: ${subject}\nMensagem: ${msg}`
  );
  window.open(`https://wa.me/5586920011227?text=${text}`, '_blank');
}
