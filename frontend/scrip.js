document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.navbar .nav-link');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  const footerText = document.querySelector('footer p.mb-0');
  if (footerText) {
    footerText.textContent = `© ${new Date().getFullYear()} MedVisionAI. All Rights Reserved.`;
  }
});
