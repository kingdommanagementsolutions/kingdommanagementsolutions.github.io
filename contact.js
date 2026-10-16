// Contact form. Submissions go to a form service (Formspree works with plain static sites).
// 1. Create a free form at https://formspree.io and set its email to kingdommanagementsolutions@gmail.com.
// 2. Paste the form URL (https://formspree.io/f/xxxxxxxx) below.
const FORM_ENDPOINT = ''; // TODO: paste your Formspree URL

const form = document.getElementById('contact-form');
const statusEl = document.getElementById('status');
const sendBtn = document.getElementById('send');
const say = (msg, kind) => { statusEl.textContent = msg; statusEl.className = 'form-status ' + (kind || ''); };

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (form.elements._gotcha.value) return; // spam trap
  if (!form.checkValidity()) { form.reportValidity(); return; }
  if (!FORM_ENDPOINT) {
    say('The form is not connected yet. Please try again soon.', 'error');
    return;
  }
  sendBtn.disabled = true;
  say('Sending...');
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    });
    if (!res.ok) throw new Error('bad status');
    form.reset();
    say('Thank you! Your message was sent. We will be in touch soon.', 'ok');
  } catch (err) {
    say('Sorry, your message could not be sent. Please try again in a moment.', 'error');
  } finally {
    sendBtn.disabled = false;
  }
});
