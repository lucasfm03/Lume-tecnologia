// Hamburger
function toggleMenu() {
  document.getElementById('navbar').classList.toggle('open');
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navbar').classList.remove('open');
  });
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
