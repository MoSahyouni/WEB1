
document.getElementById('testMain').innerHTML = `<h1> Hello World</h1> 
<p>das ist Probetext!! </p> 
<button id="anmelden",onclick="location.href='/anmelden'">anmelden</button>`;

const main = document.getElementsByClassName('Main')[0];
const btn = document.createElement('button');
btn.textContent = 'click';
btn.setAttribute('id', 'btn');
btn.setAttribute('onclick', "location.href='/anmelden'");
main.appendChild(btn);
btn.addEventListener('click', () => {
  const a = document.createElement('a');
  a.textContent = 'nee';
  main.appendChild(a);
});
