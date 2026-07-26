/* ═══════════════════════════════════════════════════════════════
   Leerblad — werkwoordspelling-generator voor de spellen
   Gebruikt dezelfde database (zinnen.json) als de leerkracht-werkbladen.
   Levert een zin met een gat + het juiste woord + plausibele foute
   spellingen (afleiders), oplopend per groep (5 t/m 8).

   Gebruik (async, want de database wordt ingeladen):
     Werkwoordspel.laad().then(function(){ ... })
     Werkwoordspel.genereer(groep)  -> { zin, infinitief, antwoord, opties }
     Werkwoordspel.reeks(groep, n)  -> [ {zin, antwoord}, ... ] (unieke antwoorden)
   ═══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var DATA = null, LADEN = null;

  function laad() {
    if (DATA) return Promise.resolve(DATA);
    if (LADEN) return LADEN;
    LADEN = fetch('../zinnen.json')
      .then(function (r) { return r.json(); })
      .then(function (j) { DATA = j; return j; })
      .catch(function () { DATA = []; return DATA; });
    return LADEN;
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function infinitiefUit(zin) {
    var m = zin.match(/\(([^)]+)\)\s*$/);
    return m ? m[1].trim() : '';
  }

  /* Plausibele foute spellingen op basis van het juiste woord + de infinitief.
     Bewust alleen realistische werkwoordspelling-fouten (geen dubbele letters). */
  /* Scheidbare prefixen — voor het herkennen van scheidbaar-voltooid-deelwoord
     (prefix + 'ge' + rest, bv. aan+ge+sloten) en niet-scheidbaar (ver/be/ge/...). */
  var SEP_PREFIX = ['aan', 'op', 'uit', 'in', 'bij', 'af', 'mee', 'toe', 'voor', 'na',
    'om', 'over', 'onder', 'door', 'terug', 'weg', 'samen', 'tegen', 'vast', 'los', 'neer'];

  function afleiders(a, inf) {
    var set = {}, out = [];
    set[a] = 1;
    function add(w) { if (w && !set[w] && /^[a-zA-ZëéèïÉ' -]+$/.test(w)) { set[w] = 1; out.push(w); } }

    /* Scheidbaar voltooid deelwoord? -> fout met 'ge' vooraan (geaansloten). */
    var geVooraan = null;
    for (var i = 0; i < SEP_PREFIX.length; i++) {
      var p = SEP_PREFIX[i];
      if (a.indexOf(p) === 0 && a.substr(p.length, 2) === 'ge') {
        geVooraan = 'ge' + p + a.slice(p.length + 2);   // aangesloten -> geaansloten
        break;
      }
    }

    /* d/t-fouten, afhankelijk van de uitgang */
    if (/dt$/.test(a)) {                 // wordt
      add(a.slice(0, -1));               // word  (t vergeten)
      add(a.slice(0, -2) + 't');         // wort  (t i.p.v. dt)
    } else if (/d$/.test(a)) {           // gebeurd / stam op d
      add(a + 't');                      // gebeurdt (dt-fout)
      add(a.slice(0, -1) + 't');         // gebeurt  (t i.p.v. d)
    } else if (/t$/.test(a)) {           // poetst / gefietst
      add(a.slice(0, -1));               // poets  (t vergeten)
      add(a.slice(0, -1) + 'd');         // poetsd (d i.p.v. t)
    } else {                             // ik-vorm stam / voltooid deelwoord op -en
      add(a + 't');                      // poetst
      add(a + 'd');                      // poetsd
    }

    add(geVooraan);   // scheidbaar deelwoord met ge- verkeerd vooraan
    add(inf);         // de infinitief als afleider (bv. aansluiten i.p.v. aangesloten)
    return out;
  }

  function opties(antwoord, inf) {
    var fout = shuffle(afleiders(antwoord, inf)).slice(0, 3);
    var alle = [{ tekst: antwoord, goed: true }].concat(fout.map(function (w) { return { tekst: w, goed: false }; }));
    return shuffle(alle);
  }

  /* In de spellen staat de tijd er niet bij, dus de zin moet de tijd zelf verraden.
     - Tegenwoordige tijd en deelwoorden (met heb/is): altijd duidelijk.
     - Verleden-tijd persoonsvorm: alleen tonen als er een signaalwoord in staat
       (gisteren, ... geleden, ...). Zonder signaal is tegenwoordige tijd 'ook goed'. */
  var SIGNAALWOORDEN = ['gisteren', 'gisteravond', 'gistermiddag', 'gistermorgen', 'eergisteren',
    'vroeger', 'toen', 'laatst', 'geleden', 'destijds', 'afgelopen', 'vorige week', 'vorige maand',
    'vorig jaar', 'vorige zomer', 'vorige winter', 'vorige keer', 'verleden week', 'jaren geleden'];
  var PERSOONSVORMEN = { 'ik-vorm': 1, 'jij-vorm': 1, 'hij-vorm': 1, 'wij-vorm': 1 };

  function tijdDuidelijk(z) {
    if (PERSOONSVORMEN[z.vorm] && z.tijd === 'verleden tijd') {
      var zin = z.zin.toLowerCase();
      for (var i = 0; i < SIGNAALWOORDEN.length; i++) {
        if (zin.indexOf(SIGNAALWOORDEN[i]) !== -1) return true;
      }
      return false;
    }
    return true;
  }

  function kiesZin(groep) {
    var pool = DATA.filter(function (z) { return z.groep === groep && tijdDuidelijk(z); });
    if (!pool.length) pool = DATA.filter(tijdDuidelijk);
    if (!pool.length) pool = DATA;
    return pick(pool);
  }

  function genereer(groep) {
    groep = Math.max(5, Math.min(8, groep | 0 || 5));
    var z = kiesZin(groep);
    var inf = infinitiefUit(z.zin);
    return {
      zin: z.zin,
      infinitief: inf,
      antwoord: z.antwoord,
      vorm: z.vorm,
      opties: opties(z.antwoord, inf),
      groep: groep
    };
  }

  function reeks(groep, aantal) {
    var out = [], gezien = {}, pog = 0;
    while (out.length < aantal && pog < aantal * 40) {
      pog++;
      var g = genereer(groep);
      if (gezien[g.antwoord] || gezien['z:' + g.zin]) continue;  // unieke antwoorden én zinnen
      gezien[g.antwoord] = 1; gezien['z:' + g.zin] = 1;
      out.push({ zin: g.zin, antwoord: g.antwoord, infinitief: g.infinitief });
    }
    while (out.length < aantal) out.push(genereer(groep)); // opvullen (zeldzaam)
    return out;
  }

  /* Reeks van ÉÉN werkwoord in verschillende vormen (voor 'Trek de lijn').
     Zo moet de leerling echt op de spelling letten i.p.v. het werkwoord herkennen. */
  function reeksZelfdeWerkwoord(groep, aantal) {
    aantal = aantal || 4;
    var pool = DATA.filter(function (z) { return z.groep === groep && tijdDuidelijk(z); });
    var perWw = {};
    pool.forEach(function (z) {
      var i = infinitiefUit(z.zin);
      if (!i) return;
      if (!perWw[i]) perWw[i] = {};
      if (!perWw[i][z.antwoord]) perWw[i][z.antwoord] = z;   // één zin per unieke vorm
    });
    var kandidaten = Object.keys(perWw).filter(function (i) {
      return Object.keys(perWw[i]).length >= aantal;
    });
    if (!kandidaten.length) return reeks(groep, aantal);       // terugval: gemengd

    var ww = kandidaten[Math.floor(Math.random() * kandidaten.length)];
    var zinnen = Object.keys(perWw[ww]).map(function (a) { return perWw[ww][a]; });
    shuffle(zinnen);
    return zinnen.slice(0, aantal).map(function (z) {
      return { zin: z.zin, antwoord: z.antwoord, infinitief: ww };
    });
  }

  global.Werkwoordspel = {
    laad: laad,
    genereer: genereer,
    reeks: reeks,
    reeksZelfdeWerkwoord: reeksZelfdeWerkwoord,
    klaar: function () { return !!DATA; },
    _afleiders: afleiders,      // voor tests
    _tijdDuidelijk: tijdDuidelijk
  };
})(typeof window !== 'undefined' ? window : this);
