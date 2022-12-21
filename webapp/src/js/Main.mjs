
document.getElementById('Main').innerHTML = `<h1> Hello World</h1> 
<p>das ist Probetext!! </p> 
`;

const main = document.getElementsByClassName('Main')[0];
const btn = document.createElement('button');
btn.textContent = 'anmelden';
btn.setAttribute('id', 'btn');
btn.setAttribute('onclick', "location.href='/anmelden'");
main.appendChild(btn);
btn.addEventListener('click', () => {
  /* const a = document.createElement('a');
  a.textContent = 'nee';
  main.appendChild(a); */
});
const btn2 = document.createElement('button');
btn2.textContent = 'neue Veranstaltung';
btn2.setAttribute('id', 'btn2');
btn2.setAttribute('onclick', "location.href='/neueVeranstaltung'");
main.appendChild(btn2);
