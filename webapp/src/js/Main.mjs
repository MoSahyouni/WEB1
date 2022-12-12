import loremIpsum from 'lorem-ipsum';

setInterval(addSentence, 1000);
loremIpsum();

function addSentence () {
  const span = document.createElement('span');
  span.textContent = loremIpsum();
  document.body.appendChild(span);
}
