function testfun () {
  let aktuellSeite = null;
  const main = document.getElementById('Main');
  main.innerHTML = '<a>monitoring widow size... </a><br>';
  const printBtn = document.createElement('button');
  printBtn.innerText = 'print';
  main.appendChild(printBtn);
  printBtn.addEventListener('click', function () {
    prinlistOf50();
    // console.log(document.getElementById('obj2').clientHeight);
  });
  let changes = 0;
  window.addEventListener('resize', function () {
    changes++;
    main.innerHTML = '<a>window size changed </a><br>' + changes;
    prinlistOf50();
  });

  function prinlistOf50 () {
    const l = [50];
    for (let n = 1; n < 51; n++) {
      l[n - 1] = n;
    }
    const wHeight = window.innerHeight - 200;
    main.innerHTML = '';
    const myDiv = document.createElement('div');
    const mylist = document.createElement('ul');
    myDiv.appendChild(mylist);

    const larrow = document.createElement('span');
    larrow.innerText = '\u2190';
    larrow.setAttribute('id', 'paginationarrow');
    const rarrow = document.createElement('span');
    rarrow.setAttribute('id', 'paginationarrow');
    rarrow.innerText = '\u2192';
    let pagesbuttunsAnz = 0;
    const anzitemproSeite = parseInt(wHeight / 19);
    let anzpages = 50 / anzitemproSeite;
    if (anzpages * wHeight / 19 < 50) { anzpages++; }
    const pagesbuttons = [anzpages];
    if (aktuellSeite != null) { printl(aktuellSeite, l); }
    for (let x = 0; x < anzpages; x++) {
      if (x === 0) { myDiv.appendChild(larrow); }
      pagesbuttunsAnz++;
      pagesbuttons[x] = document.createElement('a');
      pagesbuttons[x].setAttribute('id', 'paginationbutton');
      pagesbuttons[x].innerText = pagesbuttunsAnz;
      const thisPage = x + 1;
      if (thisPage === 1 && aktuellSeite === null) { aktuellSeite = 1; printl(thisPage, l); }
      pagesbuttons[x].addEventListener('click', function () {
        mylist.innerHTML = '';
        const glMsg = document.createElement('a');
        glMsg.innerText = 'GästeList';
        mylist.appendChild(glMsg);
        aktuellSeite = x + 1;
        printl(x + 1, l);
      });
      myDiv.appendChild(pagesbuttons[pagesbuttunsAnz - 1]);
    }myDiv.appendChild(rarrow);
    rarrow.addEventListener('click', function () {
      if (!(aktuellSeite === anzpages)) {
        mylist.innerHTML = '';
        const glMsg = document.createElement('a');
        glMsg.innerText = 'GästeList';
        mylist.appendChild(glMsg);
        aktuellSeite++;
        printl(aktuellSeite, l);
      }
    });
    larrow.addEventListener('click', function () {
      if (aktuellSeite !== 1) {
        mylist.innerHTML = '';
        const glMsg = document.createElement('a');
        glMsg.innerText = 'GästeList';
        mylist.appendChild(glMsg);
        aktuellSeite--;
        printl(aktuellSeite, l);
      }
    });
    main.appendChild(myDiv);
    function printl (pageNr, l) {
      console.log(pageNr);
      for (let n = (pageNr - 1) * anzitemproSeite; n < l.length && n < pageNr * anzitemproSeite; n++) {
        // const listanzeigerChildren = listanzeiger.children.length;

        // const g = '' + l[n];
        // if (n >= 1 && g.name === gl[n - 1].name && g.kind === gl[n - 1].kind) {
        //  gl.splice(n, 1); n--;
        // } else {
        const obj = document.createElement('li');

        obj.innerText = 'obj' + n + ': ' + l[n];

        mylist.appendChild(obj);
      }
    }
  }

  /* function pagination (body) {
    const divPa = document.createElement('div');
    body.appendChild(divPa);
    divPa.setAttribute('class', 'pagination');
    const ulPa = document.createElement('ul');
    ulPa.setAttribute('class', 'rounded-square-blocks');
    divPa.appendChild(ulPa);

    for (let i = 1; i <= 20; i++) {
      if (i === 1) {
        const liPa = document.createElement('li');
        ulPa.appendChild(liPa);
        const hreq = document.createElement('a');
        hreq.setAttribute('href', ' #');
        hreq.innerHTML = '&laquo;';
        liPa.appendChild(hreq);
        const hre1 = document.createElement('a');
        hre1.setAttribute('href', ' #');
        hre1.textContent = i;
        liPa.appendChild(hre1);
        hre1.addEventListener('click', Event => {
          const divv = document.createElement('div');
          divv.innerHTML = '<a>hallo<a><br><a>hallo<a><br><a>hallo<a><br><a>hallo<a><br><a>hallo<a>';
        });
      }

      if (i === 20) {
        const liPa = document.createElement('li');
        ulPa.appendChild(liPa);
        const hrelast = document.createElement('a');
        hrelast.setAttribute('href', '#');
        hrelast.textContent = i;
        liPa.appendChild(hrelast);
        const hreq = document.createElement('a');
        hreq.setAttribute('href', '#');
        hreq.innerHTML = '&raquo;';
        liPa.appendChild(hreq);
        hrelast.addEventListener('click', Event => {
          const divv = document.createElement('div');
          divv.innerHTML = '<a>hallo<a><br><a>hallo<a><br><a>hallo<a><br><a>hallo<a><br><a>hallo<a>';
        });
      }
      if (i > 1 && i < 20) {
        const liPa = document.createElement('li');
        ulPa.appendChild(liPa);
        const hre = document.createElement('a');
        hre.setAttribute('href', '#');
        hre.textContent = i;
        liPa.appendChild(hre);
        hre.addEventListener('click', Event => {
          const divv = document.createElement('div');
          divv.innerHTML = '<a>hallo<a><br><a>hallo<a><br><a>hallo<a><br><a>hallo<a><br><a>hallo<a>';
        });
      }
    }
  } */
}
export default testfun;
