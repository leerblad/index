/* ═══════════════════════════════════════════════════════════════
   Leerblad — cookie-toestemming (AVG)
   - Google Analytics laadt PAS na toestemming ("Accepteren").
   - Keuze wordt onthouden in localStorage (blijft over bezoeken heen).
   - Onderin een balk met Accepteren / Weigeren.
   - In de footer een link "Cookievoorkeuren" om de keuze te wijzigen.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var KEY = 'leerblad-consent';       // 'accepted' | 'declined'
  var GA_ID = 'G-E1PR0WH5J5';

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  /* ── Google Analytics laden (alleen na toestemming) ── */
  function laadGA() {
    if (window.__leerbladGA) return;
    window.__leerbladGA = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  /* ── Stijl ── */
  function injectStyles() {
    var css = ''
      + '.ck-banner{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:500;'
      + 'width:calc(100% - 32px);max-width:640px;background:#fff;border:0.5px solid #e5e5e5;border-radius:16px;'
      + 'box-shadow:0 16px 44px rgba(0,0,0,0.18);padding:1.15rem 1.35rem;'
      + 'display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap;'
      + 'font-family:"Inter","Helvetica Neue",Helvetica,Arial,sans-serif}'
      + '.ck-banner[hidden]{display:none}'
      + '.ck-text{flex:1;min-width:220px;font-size:13px;line-height:1.6;color:#555}'
      + '.ck-text b{color:#1a1a1a;font-weight:600}'
      + '.ck-text a{color:#2A7FD4;text-decoration:none}'
      + '.ck-text a:hover{text-decoration:underline}'
      + '.ck-actions{display:flex;gap:8px;flex-shrink:0}'
      + '.ck-btn{font-family:inherit;font-size:13px;font-weight:600;padding:9px 20px;border-radius:22px;cursor:pointer;border:none;white-space:nowrap;transition:opacity .15s,transform .15s,background .15s,color .15s}'
      + '.ck-btn.accept{background:linear-gradient(90deg,#2A7FD4,#2DBF8E);color:#fff}'
      + '.ck-btn.accept:hover{opacity:.9;transform:translateY(-1px)}'
      + '.ck-btn.decline{background:#f0f2f5;color:#666}'
      + '.ck-btn.decline:hover{background:#e6e9ee;color:#333}'
      /* donker thema (leerling) */
      + '[data-theme="dark"] .ck-banner{background:#0f1620;border-color:rgba(255,255,255,0.1);box-shadow:0 16px 48px rgba(0,0,0,0.6)}'
      + '[data-theme="dark"] .ck-text{color:#9aa7bf}'
      + '[data-theme="dark"] .ck-text b{color:#e9eef8}'
      + '[data-theme="dark"] .ck-text a{color:#7cc4ff}'
      + '[data-theme="dark"] .ck-btn.decline{background:rgba(255,255,255,0.07);color:#c3ccdb}'
      + '[data-theme="dark"] .ck-btn.decline:hover{background:rgba(255,255,255,0.13);color:#fff}'
      /* footer-link */
      + '.ck-foot-link{background:none;border:none;font:inherit;font-size:12px;color:inherit;opacity:.85;cursor:pointer;text-decoration:underline;padding:0;margin-left:8px}'
      + '.ck-foot-link:hover{opacity:1}'
      + '@media (max-width:520px){.ck-banner{flex-direction:column;align-items:stretch}.ck-actions{justify-content:flex-end}}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ── Balk tonen ── */
  var banner = null;
  function toonBanner() {
    if (banner) { banner.hidden = false; return; }
    banner = document.createElement('div');
    banner.className = 'ck-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookiemelding');
    banner.innerHTML =
      '<div class="ck-text"><b>Cookies op Leerblad.</b> We gebruiken analytische cookies '
      + '(Google Analytics) om te meten hoe de site gebruikt wordt en zo Leerblad te verbeteren. '
      + 'Je gegevens worden anoniem verwerkt. Kies hieronder je voorkeur.</div>'
      + '<div class="ck-actions">'
      + '<button type="button" class="ck-btn decline">Weigeren</button>'
      + '<button type="button" class="ck-btn accept">Accepteren</button>'
      + '</div>';
    document.body.appendChild(banner);
    banner.querySelector('.accept').addEventListener('click', function () {
      set('accepted'); banner.hidden = true; laadGA();
    });
    banner.querySelector('.decline').addEventListener('click', function () {
      set('declined'); banner.hidden = true;
    });
  }

  /* ── Footer-link om de keuze te wijzigen ── */
  function injectFooterLink() {
    var footer = document.querySelector('footer');
    if (!footer || footer.querySelector('.ck-foot-link')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ck-foot-link';
    btn.textContent = 'Cookievoorkeuren';
    btn.addEventListener('click', toonBanner);
    footer.appendChild(document.createTextNode(' '));
    footer.appendChild(btn);
  }

  injectStyles();
  if (get() === 'accepted') laadGA();      // eerder toegestaan → meteen laden
  document.addEventListener('DOMContentLoaded', function () {
    if (!get()) toonBanner();               // nog geen keuze → balk tonen
    injectFooterLink();
  });
})();
