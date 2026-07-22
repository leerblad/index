/* ═══════════════════════════════════════════════════════════════
   Leerblad — rolbeheer (leerkracht / leerling)
   - Onthoudt de gekozen rol in localStorage.
   - Zet het thema (leerkracht = licht, leerling = donker).
   - Injecteert de wisselknop rechtsboven.
   - Leerling: alle pagina's in onderhoud behalve de tafelspellen.
   - Toont rolafhankelijke secties (data-role-view="leerkracht|leerling").
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var KEY = 'leerblad-role';
  var DEFAULT = 'leerkracht';

  /* Pagina's die een leerling wél mag gebruiken (de spelletjes) */
  var LEERLING_TOEGESTAAN = ['tafelspellen.html', 'tafelsnake.html', 'tafelgeheugen.html'];

  function getRole() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setRole(r) {
    try { localStorage.setItem(KEY, r); } catch (e) {}
  }

  var savedRole = getRole();               // kan null zijn (nog niet gekozen)
  var role = savedRole || DEFAULT;         // effectieve rol voor weergave

  /* Bestandsnaam van de huidige pagina */
  var file = (location.pathname.split('/').pop() || 'index.html');
  if (file === '') file = 'index.html';
  var isIndex = (file === 'index.html');
  var inWerkbladen = location.pathname.indexOf('/werkbladen/') !== -1;
  var spellenPad = inWerkbladen ? 'tafelspellen.html' : 'werkbladen/tafelspellen.html';

  /* Thema meteen zetten (head-script deed dit al; hier voor de zekerheid) */
  document.documentElement.setAttribute('data-role', role);
  document.documentElement.setAttribute('data-theme', role === 'leerling' ? 'dark' : 'light');

  /* ── Stijlen voor wisselknop, keuzescherm en onderhoud ── */
  function injectStyles() {
    var css = ''
      + '.role-toggle{display:inline-flex;align-items:center;background:#f0f2f5;border:1px solid #e5e5e5;border-radius:22px;padding:3px;margin-left:16px;gap:2px;flex-shrink:0}'
      + '.role-toggle button{font-family:inherit;font-size:12.5px;border:none;background:none;color:#8a94a6;padding:6px 15px;border-radius:18px;cursor:pointer;white-space:nowrap;transition:background .15s,color .15s;display:inline-flex;align-items:center;gap:5px}'
      + '.role-toggle button:hover{color:#2A7FD4}'
      + '.role-toggle button[aria-pressed="true"]{background:linear-gradient(90deg,#2A7FD4,#2DBF8E);color:#fff;font-weight:600}'
      + '[data-theme="dark"] .role-toggle{background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.1)}'
      + '[data-theme="dark"] .role-toggle button{color:#9aa7bf}'
      + '[data-theme="dark"] .role-toggle button:hover{color:#7cc4ff}'
      + '[data-theme="dark"] .role-toggle button[aria-pressed="true"]{background:linear-gradient(90deg,#4da9ff,#3ce6b4);color:#04121c}'
      + '@media (max-width:600px){.role-toggle{margin-left:0}.role-toggle button{font-size:11px;padding:5px 11px}}'

      /* Onderhoud-overlay (leerling op geblokkeerde pagina) */
      + '.onderhoud{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:2rem;'
      + 'background:radial-gradient(ellipse 900px 600px at 12% -8%,rgba(45,111,212,0.16),transparent 60%),'
      + 'radial-gradient(ellipse 800px 550px at 92% 110%,rgba(45,191,142,0.11),transparent 60%),#05080f}'
      + '.onderhoud-card{max-width:440px;text-align:center;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);'
      + 'border-radius:20px;padding:2.75rem 2.5rem;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 24px 64px rgba(0,0,0,0.5)}'
      + '.onderhoud-emoji{font-size:52px;line-height:1;margin-bottom:1rem}'
      + '.onderhoud-card h2{font-family:"Space Grotesk","Inter",sans-serif;font-size:24px;font-weight:600;color:#e9eef8;margin-bottom:10px}'
      + '.onderhoud-card p{font-size:14px;line-height:1.7;color:#9aa7bf;margin-bottom:1.75rem}'
      + '.onderhoud-actions{display:flex;flex-direction:column;gap:10px;align-items:center}'
      + '.onderhoud-btn{font-family:inherit;font-size:14px;font-weight:600;padding:12px 30px;border-radius:26px;cursor:pointer;border:none;text-decoration:none;display:inline-block;transition:transform .15s,box-shadow .15s}'
      + '.onderhoud-btn.primary{background:linear-gradient(90deg,#4da9ff,#3ce6b4);color:#04121c;box-shadow:0 6px 28px rgba(60,230,180,0.28)}'
      + '.onderhoud-btn.primary:hover{transform:translateY(-2px);box-shadow:0 8px 34px rgba(60,230,180,0.42)}'
      + '.onderhoud-btn.ghost{background:none;color:#9aa7bf;border:1px solid rgba(255,255,255,0.14);font-weight:500;padding:9px 22px;font-size:13px}'
      + '.onderhoud-btn.ghost:hover{color:#e9eef8;border-color:rgba(255,255,255,0.28)}';

    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ── Wisselknop rechtsboven ── */
  function injectToggle() {
    var nav = document.querySelector('.topbar-inner nav') || document.querySelector('.topbar-inner');
    if (!nav) return;

    var wrap = document.createElement('div');
    wrap.className = 'role-toggle';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Wissel tussen leerkracht en leerling');

    [['leerkracht', '👩‍🏫', 'Leerkracht'], ['leerling', '🎒', 'Leerling']].forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('data-role', o[0]);
      b.setAttribute('aria-pressed', role === o[0] ? 'true' : 'false');
      b.innerHTML = '<span aria-hidden="true">' + o[1] + '</span>' + o[2];
      b.addEventListener('click', function () {
        if (role === o[0]) return;
        setRole(o[0]);
        location.reload();
      });
      wrap.appendChild(b);
    });

    nav.appendChild(wrap);
  }

  /* ── Rolafhankelijke secties tonen/verbergen ── */
  function applyViews() {
    var views = document.querySelectorAll('[data-role-view]');
    for (var i = 0; i < views.length; i++) {
      var wanted = views[i].getAttribute('data-role-view');
      if (wanted === role) { views[i].hidden = false; }
      else { views[i].hidden = true; }
    }
  }

  /* ── Onderhoud tonen op geblokkeerde pagina's (leerling) ── */
  function enforceAccess() {
    if (role !== 'leerling') return;          // leerkracht heeft overal toegang
    if (isIndex) return;                       // index heeft een eigen leerling-weergave
    if (LEERLING_TOEGESTAAN.indexOf(file) !== -1) return;  // toegestane spellenpagina's

    var main = document.querySelector('main');
    if (main) main.style.display = 'none';

    var ov = document.createElement('div');
    ov.className = 'onderhoud';
    ov.innerHTML =
      '<div class="onderhoud-card">'
      + '<div class="onderhoud-emoji">🚧</div>'
      + '<h2>Nog even geduld…</h2>'
      + '<p>Deze pagina is nog in onderhoud. In de leerling-weergave kun je nu de tafelspellen spelen — de rest komt er binnenkort aan.</p>'
      + '<div class="onderhoud-actions">'
      + '<a class="onderhoud-btn primary" href="' + spellenPad + '">🎮 Naar de tafelspellen</a>'
      + '<button type="button" class="onderhoud-btn ghost" data-switch="leerkracht">Ik ben leerkracht</button>'
      + '</div></div>';
    document.body.appendChild(ov);

    var sw = ov.querySelector('[data-switch]');
    if (sw) sw.addEventListener('click', function () {
      setRole('leerkracht');
      location.reload();
    });
  }

  /* ── Keuzescherm (eerste bezoek, nog geen rol gekozen) ── */
  function handleChoice() {
    var choice = document.getElementById('role-choice');
    if (!choice) return;

    if (savedRole) { choice.hidden = true; return; }  // al gekozen → niet tonen
    if (!isIndex) return;                              // keuzescherm alleen op de homepage

    choice.hidden = false;
    var btns = choice.querySelectorAll('[data-choose]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        setRole(this.getAttribute('data-choose'));
        location.reload();
      });
    }
  }

  injectStyles();
  document.addEventListener('DOMContentLoaded', function () {
    injectToggle();
    applyViews();
    enforceAccess();
    handleChoice();
  });
})();
