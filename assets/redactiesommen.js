/* ═══════════════════════════════════════════════════════════════
   Leerblad — redactiesommen-generator (verhaalsommen)
   Echte verhaalsommen die oplopen in moeilijkheid per groep (4 t/m 8),
   in de stijl van redactiesommen.nl. Wordt gebruikt door de verhaalspellen.

   Gebruik:
     Redactiesommen.genereer(groep)         -> { vraag, antwoord, opties }
     Redactiesommen.reeks(groep, aantal)     -> [ {...}, {...} ]

   Elke som:
     vraag    : string (het verhaal)
     antwoord : number (de juiste uitkomst)
     eenheid  : string ('' | '€' voor | ' km' na, etc. — via format)
     format(n): string (nette weergave van een getal, bijv. "€ 12,50")
     opties   : [ { tekst, waarde, goed } ]  (4 stuks, geschud)
   ═══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function veelvoud(min, max, deler) { // willekeurig veelvoud van 'deler' tussen min en max
    var lo = Math.ceil(min / deler), hi = Math.floor(max / deler);
    return rnd(lo, hi) * deler;
  }

  /* ── Formatteringen ── */
  function geld(n) {
    var v = Math.round(n * 100) / 100;
    if (Number.isInteger(v)) return '€ ' + v;
    return '€ ' + v.toFixed(2).replace('.', ',');
  }
  function kaal(n) { return '' + (Math.round(n * 100) / 100).toString().replace('.', ','); }
  function metEenheid(eenheid) { return function (n) { return kaal(n) + eenheid; }; }

  var NAMEN = ['Sam', 'Lisa', 'Tom', 'Anne', 'Noah', 'Emma', 'Daan', 'Sara', 'Finn', 'Mila', 'Bram', 'Julia', 'Luuk', 'Nora'];
  function naam() { return pick(NAMEN); }

  /* ── Afleiders (foute antwoorden) genereren ── */
  function maakOpties(antwoord, format) {
    var heeft = {};
    heeft[antwoord] = true;
    var out = [antwoord];

    var isHeel = Number.isInteger(antwoord);
    var stappen;
    if (!isHeel) stappen = [0.5, 1, 1.5, 2, 2.5];
    else if (antwoord <= 12) stappen = [1, 2, 3, 4];
    else if (antwoord <= 40) stappen = [1, 2, 3, 5, 10];
    else stappen = [2, 5, 10, 20];

    // kandidaat-afleiders: dichtbij het antwoord (veelgemaakte foutjes)
    var kandidaten = [];
    stappen.forEach(function (s) { kandidaten.push(antwoord + s); kandidaten.push(antwoord - s); });
    kandidaten.push(antwoord + 10, antwoord - 10, Math.round(antwoord * 2), Math.round(antwoord / 2));
    shuffle(kandidaten);

    for (var i = 0; i < kandidaten.length && out.length < 4; i++) {
      var k = Math.round(kandidaten[i] * 100) / 100;
      if (k > 0 && !heeft[k]) { heeft[k] = true; out.push(k); }
    }
    // vullen als er te weinig unieke afleiders zijn
    var extra = 1;
    while (out.length < 4) {
      var v = antwoord + extra;
      if (!heeft[v]) { heeft[v] = true; out.push(v); }
      extra++;
    }

    shuffle(out);
    return out.map(function (v) {
      return { waarde: v, tekst: format(v), goed: v === antwoord };
    });
  }

  /* ── Sjablonen ──
     Elk sjabloon: { min: laagste groep, maak: function(groep) -> {vraag, antwoord, format} } */
  var SJABLONEN = [

    /* Winkelen: prijs × aantal */
    {
      min: 4,
      maak: function (g) {
        var nm = naam();
        var item = pick([['appel', 'appels'], ['stift', 'stiften'], ['sticker', 'stickers'], ['broodje', 'broodjes'], ['balpen', 'balpennen']]);
        var n = rnd(3, g >= 6 ? 8 : 5);
        var prijs = g <= 5 ? rnd(2, 6) : (rnd(4, 18) / 2); // vanaf groep 6 halve euro's
        var antwoord = Math.round(prijs * n * 100) / 100;
        return {
          vraag: nm + ' koopt ' + n + ' ' + item[1] + '. Eén ' + item[0] + ' kost ' + geld(prijs) + '. Hoeveel euro betaalt ' + nm + ' in totaal?',
          antwoord: antwoord, format: geld
        };
      }
    },

    /* Wisselgeld */
    {
      min: 4,
      maak: function (g) {
        var nm = naam();
        var prijs = g <= 5 ? rnd(3, 18) : (rnd(7, 37) / 2);
        var betaald = pick(g <= 5 ? [20, 10, 50] : [20, 50]);
        if (betaald <= prijs) betaald = 50;
        var antwoord = Math.round((betaald - prijs) * 100) / 100;
        return {
          vraag: nm + ' koopt iets van ' + geld(prijs) + ' en betaalt met een briefje van ' + geld(betaald) + '. Hoeveel geld krijgt ' + nm + ' terug?',
          antwoord: antwoord, format: geld
        };
      }
    },

    /* Eerlijk verdelen (deling) */
    {
      min: 4,
      maak: function (g) {
        var k = rnd(3, g >= 6 ? 8 : 6);
        var perKind = rnd(3, g >= 6 ? 12 : 8);
        var totaal = k * perKind;
        var spul = pick([['snoepjes', 'kinderen'], ['knikkers', 'vriendjes'], ['koekjes', 'kinderen'], ['stickers', 'leerlingen']]);
        return {
          vraag: 'Er zijn ' + totaal + ' ' + spul[0] + ' en ' + k + ' ' + spul[1] + '. Ze worden eerlijk verdeeld. Hoeveel ' + spul[0] + ' krijgt elk kind?',
          antwoord: perKind, format: kaal
        };
      }
    },

    /* Groepjes maken (deling, hoeveel groepjes) */
    {
      min: 4,
      maak: function (g) {
        var per = rnd(2, 5);
        var groepjes = rnd(3, g >= 6 ? 9 : 6);
        var totaal = per * groepjes;
        return {
          vraag: 'In de klas zitten ' + totaal + ' leerlingen. De juf maakt groepjes van ' + per + ' leerlingen. Hoeveel groepjes zijn er?',
          antwoord: groepjes, format: kaal
        };
      }
    },

    /* Sparen (meerstaps: begin + week × aantal) */
    {
      min: 4,
      maak: function (g) {
        var nm = naam();
        var start = rnd(3, g >= 6 ? 25 : 12);
        var week = rnd(2, 6);
        var w = rnd(3, g >= 6 ? 8 : 5);
        var antwoord = start + week * w;
        return {
          vraag: nm + ' heeft al ' + geld(start) + ' gespaard. Elke week komt er ' + geld(week) + ' bij. Hoeveel heeft ' + nm + ' na ' + w + ' weken gespaard?',
          antwoord: antwoord, format: geld
        };
      }
    },

    /* Dozen / verpakkingen (vermenigvuldigen) */
    {
      min: 5,
      maak: function (g) {
        var per = rnd(6, g >= 7 ? 24 : 12);
        var dozen = rnd(3, g >= 7 ? 12 : 7);
        // [inhoud (mv), verpakking (ev), verpakking (mv)]
        var spul = pick([['koekjes', 'pak', 'pakken'], ['eieren', 'doosje', 'doosjes'], ['flesjes', 'krat', 'kratten'], ['potloden', 'doos', 'dozen']]);
        return {
          vraag: 'In één ' + spul[1] + ' zitten ' + per + ' ' + spul[0] + '. Hoeveel ' + spul[0] + ' zitten er in ' + dozen + ' ' + spul[2] + '?',
          antwoord: per * dozen, format: kaal
        };
      }
    },

    /* Afstand: snelheid × tijd */
    {
      min: 5,
      maak: function (g) {
        var vv = pick([['fietser', 'fietst', 8, 30], ['hardloper', 'rent', 6, 14], ['auto', 'rijdt', 40, 100]]);
        var km = rnd(vv[2], g >= 7 ? vv[3] : Math.round((vv[2] + vv[3]) / 2));
        var u = rnd(2, g >= 7 ? 5 : 4);
        var lidw = (vv[0] === 'auto') ? 'Een auto' : 'Een ' + vv[0];
        var vnw = (vv[0] === 'auto') ? 'de auto' : 'hij';
        return {
          vraag: lidw + ' ' + vv[1] + ' ' + km + ' kilometer per uur. Hoeveel kilometer ' + vv[1] + ' ' + vnw + ' in ' + u + ' uur?',
          antwoord: km * u, format: metEenheid(' km')
        };
      }
    },

    /* Tijdsduur in minuten */
    {
      min: 5,
      maak: function (g) {
        var nm = naam();
        var startU = rnd(9, 16), startM = pick([0, 15, 30, 45]);
        var duur = rnd(2, 6) * 15;
        var totaalMin = startM + duur;
        var eindU = startU + Math.floor(totaalMin / 60);
        var eindM = totaalMin % 60;
        function tijd(u, m) { return u + '.' + (m < 10 ? '0' + m : m) + ' uur'; }
        return {
          vraag: nm + ' begint om ' + tijd(startU, startM) + ' met huiswerk en is om ' + tijd(eindU, eindM) + ' klaar. Hoeveel minuten heeft ' + nm + ' gewerkt?',
          antwoord: duur, format: metEenheid(' min')
        };
      }
    },

    /* Rest / naar boven afronden (auto's) */
    {
      min: 6,
      maak: function (g) {
        var per = rnd(4, 6);
        var kinderen = rnd(per + 2, per * 6 + 3);
        var antwoord = Math.ceil(kinderen / per);
        return {
          vraag: 'Er gaan ' + kinderen + ' kinderen op schoolreisje. In elke auto passen ' + per + ' kinderen. Hoeveel auto’s zijn er minstens nodig?',
          antwoord: antwoord, format: metEenheid(' auto’s')
        };
      }
    },

    /* Meten: meters -> centimeters, stukje eraf */
    {
      min: 6,
      maak: function (g) {
        var m = rnd(2, 6);
        var afcm = rnd(2, 9) * 10;
        var antwoord = m * 100 - afcm;
        return {
          vraag: 'Een touw is ' + m + ' meter lang. Er wordt ' + afcm + ' centimeter afgeknipt. Hoeveel centimeter touw blijft er over?',
          antwoord: antwoord, format: metEenheid(' cm')
        };
      }
    },

    /* Oppervlakte (lengte × breedte) */
    {
      min: 6,
      maak: function (g) {
        var l = rnd(3, g >= 7 ? 15 : 9);
        var b = rnd(2, g >= 7 ? 12 : 7);
        return {
          vraag: 'Een moestuin is ' + l + ' meter lang en ' + b + ' meter breed. Hoeveel vierkante meter is de moestuin?',
          antwoord: l * b, format: metEenheid(' m²')
        };
      }
    },

    /* Procenten korting */
    {
      min: 7,
      maak: function (g) {
        var p = pick([10, 20, 25, 50]);
        var prijs = veelvoud(20, 80, p === 25 ? 4 : (p === 20 ? 5 : 10));
        var antwoord = Math.round(prijs * p / 100 * 100) / 100;
        return {
          vraag: 'Een spijkerbroek kost ' + geld(prijs) + '. Er is ' + p + '% korting. Hoeveel euro korting krijg je?',
          antwoord: antwoord, format: geld
        };
      }
    },

    /* Gemiddelde van drie cijfers (kies zo dat het gemiddelde een heel getal is) */
    {
      min: 7,
      maak: function (g) {
        var nm = naam();
        var a, b, c;
        do {
          a = rnd(4, 10); b = rnd(4, 10); c = rnd(4, 10);
        } while ((a + b + c) % 3 !== 0);
        var antwoord = (a + b + c) / 3;
        return {
          vraag: nm + ' haalt op drie toetsen de cijfers ' + a + ', ' + b + ' en ' + c + '. Wat is het gemiddelde cijfer?',
          antwoord: antwoord, format: kaal
        };
      }
    },

    /* Verhouding / recept */
    {
      min: 7,
      maak: function (g) {
        var eiPer = rnd(2, 4);
        var basis = pick([4, 6, 8]);
        var factor = rnd(2, 5);
        var pannen = basis * factor;
        var antwoord = eiPer * factor;
        return {
          vraag: 'Voor ' + basis + ' pannenkoeken heb je ' + eiPer + ' eieren nodig. Hoeveel eieren heb je nodig voor ' + pannen + ' pannenkoeken?',
          antwoord: antwoord, format: metEenheid(' eieren')
        };
      }
    },

    /* Snelheid berekenen (afstand ÷ tijd) */
    {
      min: 8,
      maak: function (g) {
        var perUur = rnd(60, 110);
        var u = rnd(2, 5);
        var km = perUur * u;
        return {
          vraag: 'Een auto rijdt ' + km + ' kilometer in ' + u + ' uur. Hoeveel kilometer rijdt de auto gemiddeld per uur?',
          antwoord: perUur, format: metEenheid(' km/u')
        };
      }
    },

    /* Meerstaps met bezorgkosten */
    {
      min: 8,
      maak: function (g) {
        var stuk = rnd(6, 12);
        var n = rnd(3, 6);
        var bezorg = pick([2.5, 3, 4]);
        var antwoord = Math.round((stuk * n + bezorg) * 100) / 100;
        var nm = naam();
        return {
          vraag: 'Een pizza kost ' + geld(stuk) + '. ' + nm + ' bestelt er ' + n + ' en betaalt ' + geld(bezorg) + ' bezorgkosten. Hoeveel betaalt ' + nm + ' in totaal?',
          antwoord: antwoord, format: geld
        };
      }
    }
  ];

  function genereer(groep) {
    groep = Math.max(4, Math.min(8, groep | 0 || 5));
    var beschikbaar = SJABLONEN.filter(function (s) { return s.min <= groep; });
    var s = pick(beschikbaar);
    var r = s.maak(groep);
    r.opties = maakOpties(r.antwoord, r.format);
    r.groep = groep;
    return r;
  }

  function reeks(groep, aantal) {
    var out = [];
    var pogingen = 0;
    var gezien = {};
    while (out.length < aantal && pogingen < aantal * 12) {
      pogingen++;
      var s = genereer(groep);
      if (gezien[s.vraag]) continue; // geen dubbele vragen in dezelfde reeks
      gezien[s.vraag] = true;
      out.push(s);
    }
    while (out.length < aantal) out.push(genereer(groep)); // opvullen als het moet
    return out;
  }

  global.Redactiesommen = { genereer: genereer, reeks: reeks };
})(typeof window !== 'undefined' ? window : this);
