import { loremIpsum, LoremIpsum } from 'lorem-ipsum';

setInterval(addSentence, 1000);
loremIpsum();

function addSentence () {
  const sentece = loremIpsum();

  const span = document.createElement('span');
  span.textContent = loremIpsum();
  document.body.appendChild(span);
}
