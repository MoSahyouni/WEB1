
import fetch from 'node-fetch';

function veranstaltungenAnzeigen () {
  const veranstaltungenContainer = document.createElement('div');
  const header = document.getElementById('Main');
  header.innerHTML = '';
  if (!veranstaltungenContainer) {
    console.error('nicht gefunden');
    return;
  }

  fetchVeranstaltungen().then(function (veranstaltungen) {
    for (let i = 0; i < veranstaltungen.length; i++) {
      const veranstaltung = veranstaltungen[i];
      const veranstaltungElement = document.createElement('div');
      veranstaltungElement.innerHTML = '<h3>' + veranstaltung.veranstaltung + '</h3>' + veranstaltung.datum + '</p>';
      veranstaltungenContainer.appendChild(veranstaltungElement);
    }

    header.appendChild(veranstaltungenContainer);
  })
    .catch(function (error) {
      console.error(error);
    });

  fetchVeranstaltungen().then(function (veranstaltungen) {
    Anzeigeseite(veranstaltungen, 1);
  })
    .catch(function (error) {
      console.error(error);
    });
}

async function fetchVeranstaltungen () {
  try {
    const response = await fetch('/getveranstaltung');
    const veranstaltungen = await response.json();
    return veranstaltungen;
  } catch (error) {
    console.error('Error fetching', error);
    throw error;
  }
}
/*
const AnZahlElementeProSeite = 5;

function Anzeigeseite (Elemente, SeitenNr) {
  const startIndex = (SeitenNr - 1) * AnZahlElementeProSeite;
  const endIndex = startIndex + AnZahlElementeProSeite;
  const aktuelleSeitenElemente = Elemente.slice(startIndex, endIndex);

  const veranstaltungenContainer = document.createElement('div');
  const header = document.getElementById('Main');
  header.innerHTML = '';

  for (const Element of aktuelleSeitenElemente) {
    const veranstaltungElement = document.createElement('div');
    veranstaltungElement.innerHTML = '<h3>' + Element.veranstaltung + '</h3>' + Element.datum + '</p>';
    veranstaltungenContainer.appendChild(veranstaltungElement);
  }

  const paginationContainer = document.createElement('div');
  const Seitenzahl = Math.ceil(Elemente.length / AnZahlElementeProSeite);

  const previosButton = document.createElement('button');
  previosButton.innerHTML = '&larr;';
  if (SeitenNr === 1) {
    previosButton.disabled = true;
  }
  previosButton.addEventlistener('click', () => {
    Anzeigeseite(Elemente, SeitenNr - 1);
  });
  paginationContainer.appendChild(previosButton);

  const nextButton = document.createElement('button');
  nextButton.innerHTML = '&rarr;';
  if (SeitenNr === Seitenzahl) {
    nextButton.disabled = true;
  }

  nextButton.addEventListener('click', () => {
    Anzeigeseite(Elemente, SeitenNr + 1);
  });
  paginationContainer.appendChild(nextButton);
  header.appendChild(veranstaltungenContainer);
  header.appendChild(paginationContainer);
}
*/

const AnzahlElementeProSeite = 5;

function Anzeigeseite (Elemente, SeitenNr) {
  const startIndex = (SeitenNr - 1) * AnzahlElementeProSeite;
  const endIndex = startIndex + AnzahlElementeProSeite;
  const aktuelleSeitenElemente = Elemente.slice(startIndex, endIndex);

  const veranstaltungenContainer = document.createElement('div');
  const header = document.getElementById('Main');
  header.innerHTML = '';

  for (const Element of aktuelleSeitenElemente) {
    const veranstaltungElement = document.createElement('div');
    veranstaltungElement.innerHTML = '<h3>' + Element.veranstaltung + '</h3>' + Element.datum + '</p>';
    veranstaltungenContainer.appendChild(veranstaltungElement);
  }

  const paginationContainer = document.createElement('div');
  const Seitenzahl = Math.ceil(Elemente.length / AnzahlElementeProSeite);

  const previousButton = document.createElement('button');
  previousButton.innerHTML = '&larr;';
  if (SeitenNr === 1) {
    previousButton.disabled = true;
  }
  previousButton.addEventListener('click', () => {
    Anzeigeseite(Elemente, SeitenNr - 1);
  });
  paginationContainer.appendChild(previousButton);

  const nextButton = document.createElement('button');
  nextButton.innerHTML = '&rarr;';
  if (SeitenNr === Seitenzahl) {
    nextButton.disabled = true;
  }
  nextButton.addEventListener('click', () => {
    Anzeigeseite(Elemente, SeitenNr + 1);
  });
  paginationContainer.appendChild(nextButton);

  header.appendChild(veranstaltungenContainer);
  header.appendChild(paginationContainer);
}

export default veranstaltungenAnzeigen;
