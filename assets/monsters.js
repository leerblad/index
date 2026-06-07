(function () {
  /* ── CSS injecteren ── */
  var style = document.createElement('style');
  style.textContent = `
    .lm-eye, .lm-eye2 {
      transform-box: fill-box;
      transform-origin: center;
      animation: lm-eye-blink 4s ease-in-out infinite;
    }
    .lm-eye2 { animation-delay: .15s; }
    @keyframes lm-eye-blink {
      0%,88%,100% { transform: scaleY(1); }
      93%          { transform: scaleY(0.08); }
    }
  `;
  document.head.appendChild(style);

  /* ── Monster definities ── */
  var M = [
    /* 0 – Geel, breed afgerond rechthoek, bottom-peek */
    { type:'bottom', w:96, h:118, hideY:84, peekY:14, dur:3.8,
      svg:`<svg width="96" height="118" viewBox="0 0 96 118" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="2"  width="14" height="22" rx="7"  fill="#d4a000"/>
        <rect x="72" y="2"  width="14" height="22" rx="7"  fill="#d4a000"/>
        <rect x="2"  y="16" width="92" height="86" rx="30" fill="#FFD000"/>
        <circle cx="30" cy="56" r="13" fill="white"/>
        <circle cx="66" cy="56" r="13" fill="white"/>
        <g class="lm-eye">
          <circle cx="31" cy="58" r="8"   fill="#3a2a00"/>
          <circle cx="35" cy="54" r="3"   fill="white"/>
        </g>
        <g class="lm-eye2">
          <circle cx="67" cy="58" r="8"   fill="#3a2a00"/>
          <circle cx="71" cy="54" r="3"   fill="white"/>
        </g>
        <path d="M19 42 Q30 35 41 41" stroke="#3a2a00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M55 41 Q66 35 77 42" stroke="#3a2a00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M26 74 Q48 90 70 74" fill="#c95000" stroke="#3a2a00" stroke-width="2" stroke-linecap="round"/>
        <rect x="34" y="74" width="9"  height="6" rx="2" fill="white"/>
        <rect x="53" y="74" width="9"  height="6" rx="2" fill="white"/>
        <rect x="-4" y="72" width="12" height="18" rx="6" fill="#FFD000"/>
        <rect x="88" y="72" width="12" height="18" rx="6" fill="#FFD000"/>
        <rect x="14" y="100" width="24" height="16" rx="12" fill="#d4a000"/>
        <rect x="58" y="100" width="24" height="16" rx="12" fill="#d4a000"/>
      </svg>`
    },
    /* 1 – Roze, peervorm, bottom-peek */
    { type:'bottom', w:80, h:106, hideY:76, peekY:12, dur:4.2,
      svg:`<svg width="80" height="106" viewBox="0 0 80 106" xmlns="http://www.w3.org/2000/svg">
        <rect x="33" y="0"  width="14" height="22" rx="7" fill="#d45c90"/>
        <path d="M40 14 C18 14 4 32 4 54 C4 78 18 98 40 100 C62 98 76 78 76 54 C76 32 62 14 40 14Z" fill="#FF7EB3"/>
        <circle cx="40" cy="50" r="16" fill="white"/>
        <g class="lm-eye">
          <circle cx="40" cy="52" r="10"  fill="#5a0030"/>
          <circle cx="45" cy="47" r="3.5" fill="white"/>
        </g>
        <path d="M27 36 Q40 28 53 36" stroke="#5a0030" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M24 70 Q40 82 56 70" stroke="#5a0030" stroke-width="2"   fill="none" stroke-linecap="round"/>
        <rect x="-2" y="66" width="11" height="16" rx="5.5" fill="#FF7EB3"/>
        <rect x="71" y="66" width="11" height="16" rx="5.5" fill="#FF7EB3"/>
        <rect x="16" y="92" width="20" height="12" rx="10" fill="#d45c90"/>
        <rect x="44" y="92" width="20" height="12" rx="10" fill="#d45c90"/>
      </svg>`
    },
    /* 2 – Rood, blobvorm met bobbels, bottom-peek */
    { type:'bottom', w:100, h:118, hideY:84, peekY:12, dur:3.5,
      svg:`<svg width="100" height="118" viewBox="0 0 100 118" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="18" r="11" fill="#b71c1c"/>
        <circle cx="50" cy="10" r="11" fill="#b71c1c"/>
        <circle cx="72" cy="18" r="11" fill="#b71c1c"/>
        <path d="M50 16 C24 16 8 34 8 58 C8 82 24 104 50 106 C76 104 92 82 92 58 C92 34 76 16 50 16Z" fill="#E53935"/>
        <circle cx="34" cy="58" r="13" fill="white"/>
        <circle cx="66" cy="58" r="13" fill="white"/>
        <g class="lm-eye">
          <circle cx="35" cy="60" r="8" fill="#3a0000"/>
          <circle cx="39" cy="56" r="3" fill="white"/>
        </g>
        <g class="lm-eye2">
          <circle cx="67" cy="60" r="8" fill="#3a0000"/>
          <circle cx="71" cy="56" r="3" fill="white"/>
        </g>
        <path d="M30 80 Q50 96 70 80" fill="#b71c1c" stroke="#3a0000" stroke-width="2" stroke-linecap="round"/>
        <rect x="44" y="80" width="12" height="7" rx="2.5" fill="white"/>
        <rect x="0"  y="66" width="12" height="20" rx="6" fill="#E53935"/>
        <rect x="88" y="66" width="12" height="20" rx="6" fill="#E53935"/>
        <rect x="20" y="102" width="22" height="14" rx="11" fill="#b71c1c"/>
        <rect x="58" y="102" width="22" height="14" rx="11" fill="#b71c1c"/>
      </svg>`
    },
    /* 3 – Oranje, vierkant afgerond, side-peek */
    { type:'side', w:88, h:110, hideX:68, peekX:0, dur:4.0,
      svg:`<svg width="88" height="110" viewBox="0 0 88 110" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="0"  width="13" height="20" rx="6.5" fill="#c95000"/>
        <rect x="57" y="0"  width="13" height="20" rx="6.5" fill="#c95000"/>
        <rect x="4"  y="14" width="80" height="80" rx="22"  fill="#FF6B1A"/>
        <circle cx="28" cy="52" r="13" fill="white"/>
        <circle cx="60" cy="52" r="13" fill="white"/>
        <g class="lm-eye">
          <circle cx="29" cy="54" r="8"   fill="#3a1500"/>
          <circle cx="33" cy="50" r="2.5" fill="white"/>
        </g>
        <g class="lm-eye2">
          <circle cx="61" cy="54" r="8"   fill="#3a1500"/>
          <circle cx="65" cy="50" r="2.5" fill="white"/>
        </g>
        <path d="M17 38 Q28 31 39 37" stroke="#3a1500" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M49 37 Q60 31 71 38" stroke="#3a1500" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M22 72 Q44 90 66 72" fill="#c95000" stroke="#3a1500" stroke-width="2" stroke-linecap="round"/>
        <rect x="38" y="72" width="12" height="7" rx="2.5" fill="white"/>
        <rect x="14" y="90" width="22" height="16" rx="11" fill="#c95000"/>
        <rect x="52" y="90" width="22" height="16" rx="11" fill="#c95000"/>
      </svg>`
    },
    /* 4 – Groen, druppelvorm, side-peek */
    { type:'side', w:88, h:112, hideX:66, peekX:0, dur:4.5,
      svg:`<svg width="88" height="112" viewBox="0 0 88 112" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="14" r="10" fill="#2d8a2d"/>
        <circle cx="44" cy="8"  r="10" fill="#2d8a2d"/>
        <circle cx="66" cy="14" r="10" fill="#2d8a2d"/>
        <path d="M44 10 C16 10 6 28 6 50 C6 78 20 100 44 102 C68 100 82 78 82 50 C82 28 72 10 44 10Z" fill="#4CAF50"/>
        <circle cx="30" cy="52" r="12" fill="white"/>
        <circle cx="58" cy="52" r="12" fill="white"/>
        <g class="lm-eye">
          <circle cx="30" cy="54" r="7.5" fill="#1a3a1a"/>
          <circle cx="34" cy="50" r="2.5" fill="white"/>
        </g>
        <g class="lm-eye2">
          <circle cx="58" cy="54" r="7.5" fill="#1a3a1a"/>
          <circle cx="62" cy="50" r="2.5" fill="white"/>
        </g>
        <path d="M18 40 Q30 34 40 38" stroke="#1a3a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M48 38 Q60 34 70 40" stroke="#1a3a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M26 70 Q44 84 62 70" stroke="#1a3a1a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <rect x="32" y="70" width="8"  height="6" rx="2" fill="white"/>
        <rect x="48" y="70" width="8"  height="6" rx="2" fill="white"/>
        <rect x="18" y="98" width="22" height="12" rx="11" fill="#2d8a2d"/>
        <rect x="48" y="98" width="22" height="12" rx="11" fill="#2d8a2d"/>
      </svg>`
    },
    /* 5 – Lila, antennes, side-peek */
    { type:'side', w:96, h:110, hideX:74, peekX:0, dur:4.8,
      svg:`<svg width="96" height="110" viewBox="0 0 96 110" xmlns="http://www.w3.org/2000/svg">
        <rect x="31" y="0" width="10" height="20" rx="5" fill="#6a0dad"/>
        <circle cx="36" cy="4" r="7" fill="#9b30ff"/>
        <rect x="55" y="0" width="10" height="20" rx="5" fill="#6a0dad"/>
        <circle cx="60" cy="4" r="7" fill="#ce93d8"/>
        <path d="M48 12 C28 12 8 26 8 52 C8 76 24 100 48 102 C72 100 88 76 88 52 C88 26 68 12 48 12Z" fill="#AB47BC"/>
        <circle cx="32" cy="54" r="13" fill="white"/>
        <circle cx="64" cy="54" r="13" fill="white"/>
        <g class="lm-eye">
          <circle cx="33" cy="56" r="8" fill="#2a0050"/>
          <circle cx="37" cy="52" r="3" fill="white"/>
        </g>
        <g class="lm-eye2">
          <circle cx="65" cy="56" r="8" fill="#2a0050"/>
          <circle cx="69" cy="52" r="3" fill="white"/>
        </g>
        <path d="M28 74 Q48 90 68 74" stroke="#2a0050" stroke-width="2.5" fill="#f48fb1" stroke-linecap="round"/>
        <rect x="36" y="74" width="8" height="6" rx="2" fill="white"/>
        <rect x="52" y="74" width="8" height="6" rx="2" fill="white"/>
        <rect x="18" y="98" width="22" height="12" rx="11" fill="#6a0dad"/>
        <rect x="56" y="98" width="22" height="12" rx="11" fill="#6a0dad"/>
      </svg>`
    }
  ];

  /* ── Hulpfuncties ── */
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function injectKeyframes(name, frames) {
    var s = document.createElement('style');
    s.textContent = '@keyframes ' + name + '{' + frames + '}';
    document.head.appendChild(s);
  }

  /* ── Plaatsing ── */
  // Kies 2 willekeurige plekken: 1 onderkant + 1 zijkant
  var bottomM = shuffle(M.filter(function(m){ return m.type==='bottom'; }));
  var sideM   = shuffle(M.filter(function(m){ return m.type==='side';   }));

  var plaatsingen = [
    {
      monster : bottomM[0],
      pos     : 'bottom',
      side    : Math.random() < 0.5 ? 'left' : 'right',
      offset  : Math.round(Math.random() * 140 + 60),
      delay   : 0
    },
    {
      monster : sideM[0],
      pos     : Math.random() < 0.5 ? 'left' : 'right',
      topFrac : Math.random() * 0.25 + 0.35, // 35–60% van viewport hoogte
      delay   : 1.8
    }
  ];

  plaatsingen.forEach(function(p, i) {
    var m   = p.monster;
    var id  = 'lm' + i;

    /* Wrapper */
    var outer = document.createElement('div');
    outer.style.cssText = [
      'position:fixed',
      'z-index:9997',
      'pointer-events:none',
      'overflow:hidden',
      'will-change:transform'
    ].join(';');

    var inner = document.createElement('div');
    inner.innerHTML = m.svg;

    if (p.pos === 'bottom') {
      /* Onderkant: monster schuift omhoog */
      outer.style.bottom = '0';
      outer.style.width  = m.w + 'px';
      outer.style.height = m.h + 'px';
      outer.style[p.side] = p.offset + 'px';

      injectKeyframes(id,
        '0%,100%{transform:translateY(' + m.hideY + 'px)}' +
        '35%,65%{transform:translateY(' + m.peekY + 'px)}'
      );
      inner.style.animation = id + ' ' + m.dur + 's ease-in-out infinite ' + p.delay + 's';

    } else {
      /* Zijkant: monster schuift naar binnen */
      var fromLeft = (p.pos === 'left');
      var topPx    = Math.round(window.innerHeight * p.topFrac - m.h / 2);

      outer.style.top    = topPx + 'px';
      outer.style.height = m.h + 'px';
      outer.style.width  = m.w + 'px';
      outer.style[p.pos] = '0';

      /* Spiegel monster zodat het naar binnen kijkt */
      if (!fromLeft) {
        var svgEl = inner.querySelector('svg');
        if (svgEl) svgEl.style.transform = 'scaleX(-1)';
      }

      var fromVal = (fromLeft ? -1 : 1) * m.hideX;
      injectKeyframes(id,
        '0%,100%{transform:translateX(' + fromVal + 'px)}' +
        '35%,65%{transform:translateX(0)}'
      );
      inner.style.animation = id + ' ' + m.dur + 's ease-in-out infinite ' + p.delay + 's';
    }

    outer.appendChild(inner);
    document.body.appendChild(outer);
  });

})();
