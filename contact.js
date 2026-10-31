// Contact form.
// With FORM_ENDPOINT empty, submitting opens the visitor's email app with a message to CONTACT_EMAIL already filled in.
// To receive submissions without an email app, create a free form at https://formspree.io, set its notification email to
// CONTACT_EMAIL, and paste the form URL (https://formspree.io/f/xxxxxxxx) below.
const CONTACT_EMAIL = 'mail@kingdommanagement.solutions';
const FORM_ENDPOINT = '';

const form = document.getElementById('contact-form');
const statusEl = document.getElementById('status');
const sendBtn = document.getElementById('send');
const say = (msg, kind) => { statusEl.textContent = msg; statusEl.className = 'form-status ' + (kind || ''); };

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (form.elements._gotcha.value) return; // spam trap
  if (!form.checkValidity()) { form.reportValidity(); return; }
  if (!FORM_ENDPOINT) {
    const f = form.elements;
    const body = `${f.message.value}

${f.name.value}
${f.email.value}` + (f.organization.value ? `
${f.organization.value}` : '');
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(f.topic.value + ' inquiry from ' + f.name.value)}&body=${encodeURIComponent(body)}`;
    say(`Opening your email app. If nothing opens, email us at ${CONTACT_EMAIL}.`, 'ok');
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
