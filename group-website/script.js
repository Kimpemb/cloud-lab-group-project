function sendMessage() {
  var name = document.getElementById('fname').value.trim();
  var email = document.getElementById('femail').value.trim();
  var message = document.getElementById('fmsg').value.trim();
  if (!name) { alert('Please enter your full name.'); return; }
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }
  if (!message) { alert('Please write a message before sending.'); return; }
  alert('Message sent! We will get back to you soon.');
  document.getElementById('fname').value = '';
  document.getElementById('femail').value = '';
  document.getElementById('fsubject').value = 'General enquiry';
  document.getElementById('fmsg').value = '';
}