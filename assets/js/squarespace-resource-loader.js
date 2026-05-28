(function () {
  var LOADER_VERSION = '2026-05-28-domain-polish-2';
  if (window.brqSquarespaceResourceLoaderVersion === LOADER_VERSION) return;
  window.brqSquarespaceResourceLoaderVersion = LOADER_VERSION;
  window.brqSquarespaceResourceLoaderActive = true;

  var SOURCE_ORIGIN = 'https://importsubclassjosh.github.io';
  var ROUTES = {
    '/start-here/': '/start-here/',
    '/education/': '/education/',
    // Squarespace currently redirects /education to this legacy typo slug.
    '/liturature/': '/education/',
    '/resource-center/': '/resource-center/',
    '/articles/': '/articles/',
    '/downloads/': '/downloads/',
    '/about/': '/about/',
    '/contact/': '/contact/',
    '/privacy-policy/': '/privacy-policy/',
    '/editorial-policy/': '/editorial-policy/',
    '/real-estate-disclaimer/': '/real-estate-disclaimer/',
    '/the-agent-resource-desk/': '/author/the-agent-resource-desk/',

    '/choose-real-estate-brokerage-georgia/': '/choose-real-estate-brokerage-georgia/',
    '/flat-fee-real-estate-brokerage-georgia-agents/': '/flat-fee-real-estate-brokerage-georgia-agents/',
    '/new-georgia-real-estate-agent-first-client-checklist/': '/new-georgia-real-estate-agent-first-client-checklist/',
    '/fmls-vs-georgia-mls-agents/': '/fmls-vs-georgia-mls-agents/',
    '/real-estate-referral-commissions-georgia/': '/real-estate-referral-commissions-georgia/',
    '/rental-commissions-real-estate-agents/': '/rental-commissions-real-estate-agents/',
    '/pay-at-close-real-estate-agents/': '/pay-at-close-real-estate-agents/',
    '/listing-prep-checklist-georgia-agents/': '/listing-prep-checklist-georgia-agents/',
    '/buyer-agent-checklist-georgia-real-estate/': '/buyer-agent-checklist-georgia-real-estate/',
    '/earnest-money-guide-real-estate-agents/': '/earnest-money-guide-real-estate-agents/',
    '/real-estate-agent-vendor-list/': '/real-estate-agent-vendor-list/',
    '/part-time-real-estate-agent-productivity/': '/part-time-real-estate-agent-productivity/',
    '/referral-based-real-estate-business/': '/referral-based-real-estate-business/',
    '/real-estate-agent-branding-guide/': '/real-estate-agent-branding-guide/',
    '/dba-branding-real-estate-agents/': '/dba-branding-real-estate-agents/',
    '/new-real-estate-agent-mistakes/': '/new-real-estate-agent-mistakes/',
    '/georgia-real-estate-advertising-basics-agents/': '/georgia-real-estate-advertising-basics-agents/',
    '/first-real-estate-closing-checklist/': '/first-real-estate-closing-checklist/',
    '/short-term-rental-investing-georgia-basics/': '/short-term-rental-investing-georgia-basics/',
    '/real-estate-long-term-wealth-building/': '/real-estate-long-term-wealth-building/',

    '/georgia-agent-first-client-checklist/': '/downloads/georgia-agent-first-client-checklist/',
    '/listing-prep-checklist/': '/downloads/listing-prep-checklist/',
    '/buyer-agent-transaction-checklist/': '/downloads/buyer-agent-transaction-checklist/',
    '/brokerage-comparison-worksheet/': '/downloads/brokerage-comparison-worksheet/',
    '/vendor-list-builder/': '/downloads/vendor-list-builder/',
    '/first-closing-preparation-checklist/': '/downloads/first-closing-preparation-checklist/',
    '/referral-commission-question-sheet/': '/downloads/referral-commission-question-sheet/',

    '/agent-basics/': '/category/agent-basics/',
    '/brokerage-commission-education/': '/category/brokerage-commission-education/',
    '/mls-education/': '/category/mls-education/',
    '/listing-preparation/': '/category/listing-preparation/',
    '/buyer-representation/': '/category/buyer-representation/',
    '/referrals-rentals/': '/category/referrals-rentals/',
    '/transaction-basics/': '/category/transaction-basics/',
    '/agent-business-growth/': '/category/agent-business-growth/',
    '/agent-branding/': '/category/agent-branding/',
    '/compliance-minded-guides/': '/category/compliance-minded-guides/',
    '/investor-education/': '/category/investor-education/',
    '/georgia-market-education/': '/category/georgia-market-education/',
    '/checklists-downloads/': '/category/checklists-downloads/'
  };

  function normalizedPath() {
    var path = window.location.pathname || '/';
    if (!path.endsWith('/')) path += '/';
    return path;
  }

  var path = normalizedPath();
  var sourcePath = ROUTES[path];
  if (!sourcePath) return;

  function removeLegacyResourceNav() {
    document.querySelectorAll('.brq-resource-nav').forEach(function (nav) {
      nav.remove();
    });
  }

  function watchLegacyResourceNav() {
    if (window.brqResourceLegacyNavCleanupActive || !window.MutationObserver) return;
    window.brqResourceLegacyNavCleanupActive = true;
    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(function () {
        scheduled = false;
        removeLegacyResourceNav();
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    removeLegacyResourceNav();
  }

  function normalizeVisibleEducationUrl() {
    if (path !== '/liturature/' || sourcePath !== '/education/' || !window.history || !window.history.replaceState) return;
    var nextUrl = '/education/' + (window.location.search || '') + (window.location.hash || '');
    window.history.replaceState({ brqEducationAlias: true }, '', nextUrl);
  }

  function ensureStyle() {
    var existing = document.getElementById('brq-resource-loader-style');
    if (existing && existing.getAttribute('data-brq-version') === LOADER_VERSION) return;
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    var style = document.createElement('style');
    style.id = 'brq-resource-loader-style';
    style.setAttribute('data-brq-version', LOADER_VERSION);
    style.textContent = [
      '.brq-resource-root{--merlot:#5b1724;--charcoal:#252525;--ivory:#fbf7ef;--brass:#b68a35;color:#252525;background:#fbf7ef;font-family:Poppins,Arial,sans-serif;line-height:1.65;}',
      '.brq-resource-root *{box-sizing:border-box;}',
      '.brq-resource-root a{color:#5b1724;text-decoration-thickness:1px;text-underline-offset:3px;}',
      '.brq-resource-root img{max-width:100%;height:auto;display:block;}',
      '.brq-resource-root .hero,.brq-resource-root .article-hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,520px);gap:34px;align-items:center;padding:56px max(24px,6vw);background:#2a2523;color:#fbf7ef;}',
      '.brq-resource-root .hero>*,.brq-resource-root .article-header>*,.brq-resource-root .content-band,.brq-resource-root .resource-section,.brq-resource-root .download-body{animation:brq-fade-rise .32s ease both;}',
      '.brq-resource-root .hero h1,.brq-resource-root .article-hero h1{font-family:"Bricolage Grotesque",Poppins,Arial,sans-serif;font-size:clamp(2rem,4vw,4.25rem);line-height:1.05;margin:0 0 18px;}',
      '.brq-resource-root .hero p,.brq-resource-root .article-hero p{font-size:1.05rem;max-width:760px;}',
      '.brq-resource-root .article-header{background:#2a2523;color:#fbf7ef;padding:46px 0 0;}',
      '.brq-resource-root .article-header>.eyebrow,.brq-resource-root .article-header>h1,.brq-resource-root .article-header>.lede,.brq-resource-root .article-header>.article-meta{max-width:1120px;margin-left:auto;margin-right:auto;padding-left:24px;padding-right:24px;}',
      '.brq-resource-root .article-header h1{font-family:"Bricolage Grotesque",Poppins,Arial,sans-serif;font-size:clamp(2rem,4vw,4.25rem);line-height:1.05;margin-top:0;margin-bottom:18px;color:#fbf7ef;}',
      '.brq-resource-root .article-header .lede{font-size:1.08rem;max-width:980px;color:#f3eadc;}',
      '.brq-resource-root .article-meta{display:flex;flex-wrap:wrap;gap:10px 18px;color:#eadfce;font-size:.93rem;margin-top:16px;}',
      '.brq-resource-root .article-meta a{color:#f1d58d;}',
      '.brq-resource-root .article-feature{margin:30px 0 0;}',
      '.brq-resource-root .article-feature img{width:100%;max-height:620px;object-fit:cover;}',
      '.brq-resource-root .article-feature figcaption{max-width:1120px;margin:8px auto 0;padding:0 24px 20px;color:#ded4c5;}',
      '.brq-resource-root .hero-image,.brq-resource-root .featured-image{margin:0;}',
      '.brq-resource-root .hero-image img,.brq-resource-root .featured-image img{border-radius:8px;box-shadow:0 18px 48px rgba(0,0,0,.24);}',
      '.brq-resource-root .breadcrumbs{max-width:1120px;margin:0 auto;padding:16px 24px;font-size:.9rem;color:#5b1724;}',
      '.brq-resource-root .breadcrumbs span{margin:0 6px;color:#6b625b;}',
      '.brq-resource-root figcaption{font-size:.8rem;color:#6b625b;margin-top:8px;}',
      '.brq-resource-root .hero figcaption,.brq-resource-root .article-hero figcaption{color:#ded4c5;}',
      '.brq-resource-root .education-hero{position:relative;isolation:isolate;min-height:min(660px,66vh);display:grid;align-items:end;padding:clamp(54px,7vw,84px) max(24px,5vw) clamp(29px,4vw,48px);overflow:hidden;background:linear-gradient(90deg,rgba(23,20,21,.92),rgba(40,24,23,.76) 46%,rgba(40,24,23,.38)),var(--education-hero-image) center/cover no-repeat,#252525;color:#fbf7ef;}',
      '.brq-resource-root .education-hero:after{content:"";position:absolute;inset:auto 0 0;z-index:-1;height:34%;background:linear-gradient(0deg,rgba(23,20,21,.58),transparent);}.brq-resource-root .education-hero-inner{width:min(920px,100%);animation:brq-fade-rise .42s ease both;}',
      '.brq-resource-root .education-hero .eyebrow{color:#e3bd66;}.brq-resource-root .education-hero h1{max-width:960px;color:#fffaf0;font-family:"Bricolage Grotesque",Poppins,Arial,sans-serif;font-size:clamp(2.55rem,6vw,5.15rem);line-height:1.02;margin:0 0 18px;text-transform:none;letter-spacing:0;}.brq-resource-root .education-hero p{max-width:760px;color:#f2e8d9;font-size:clamp(1.04rem,1.45vw,1.22rem);}',
      '.brq-resource-root .education-hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px;}.brq-resource-root .education-hero-actions .button.secondary{border-color:rgba(255,250,240,.62);color:#fffaf0;background:rgba(255,250,240,.08);}',
      '.brq-resource-root .education-hero-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;max-width:760px;margin:clamp(24px,3vw,36px) 0 0;}.brq-resource-root .education-hero-metrics div{min-height:94px;padding:16px;border:1px solid rgba(255,250,240,.18);border-radius:8px;background:rgba(255,250,240,.1);backdrop-filter:blur(12px);}.brq-resource-root .education-hero-metrics dt{margin:0;color:#f1d58d;font-family:Georgia,serif;font-size:clamp(1.75rem,3vw,2.45rem);font-weight:800;line-height:1;}.brq-resource-root .education-hero-metrics dd{margin:6px 0 0;color:#f2e8d9;font-weight:750;}.brq-resource-root .education-hero-note{margin-top:16px;color:#d8cdbc;font-size:.92rem;}',
      '.brq-resource-root .eyebrow{letter-spacing:.08em;text-transform:uppercase;font-weight:700;font-size:.78rem;color:#b68a35;margin:0 0 10px;}',
      '.brq-resource-root .button,.brq-resource-root .actions a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 16px;margin:8px 8px 0 0;border:1px solid #b68a35;border-radius:6px;background:#b68a35;color:#1f1715;text-decoration:none;font-weight:700;box-shadow:0 10px 22px rgba(91,23,36,.14);transition:transform .18s ease,box-shadow .18s ease,background-color .18s ease,border-color .18s ease;}',
      '.brq-resource-root .button.secondary,.brq-resource-root .actions a.secondary{background:transparent;color:#5b1724;box-shadow:none;}.brq-resource-root .hero .button.secondary,.brq-resource-root .hero .actions a.secondary,.brq-resource-root .article-hero .button.secondary{color:#fbf7ef;border-color:rgba(251,247,239,.62);}.brq-resource-root .button:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 14px 28px rgba(91,23,36,.18);}.brq-resource-root .button.secondary:hover:not(:disabled){background:rgba(91,23,36,.06);}',
      '.brq-resource-root .content-band,.brq-resource-root .article-body,.brq-resource-root .resource-section,.brq-resource-root .download-body{max-width:1120px;margin:0 auto;padding:42px 24px;}',
      '.brq-resource-root .article-body{max-width:880px;}',
      '.brq-resource-root h2{font-family:"Bricolage Grotesque",Poppins,Arial,sans-serif;font-size:clamp(1.5rem,2.4vw,2.3rem);line-height:1.15;margin:34px 0 14px;color:#2a2523;}',
      '.brq-resource-root h3{font-size:1.15rem;margin:24px 0 10px;color:#5b1724;}',
      '.brq-resource-root p,.brq-resource-root li{font-size:1rem;}',
      '.brq-resource-root ul,.brq-resource-root ol{padding-left:1.25rem;}',
      '.brq-resource-root .card-grid,.brq-resource-root .resource-grid,.brq-resource-root .category-grid,.brq-resource-root .related-grid,.brq-resource-root .download-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px;margin-top:18px;}',
      '.brq-resource-root .card,.brq-resource-root .resource-card,.brq-resource-root .category-card,.brq-resource-root .related-card,.brq-resource-root .checklist-card,.brq-resource-root .path-section{border:1px solid rgba(91,23,36,.18);border-radius:8px;background:#fffdf8;padding:20px;box-shadow:0 8px 24px rgba(37,37,37,.06);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;}',
      '.brq-resource-root a.card:hover,.brq-resource-root a.resource-card:hover,.brq-resource-root a.category-card:hover,.brq-resource-root a.related-card:hover,.brq-resource-root a.checklist-card:hover{border-color:rgba(182,138,53,.62);box-shadow:0 16px 34px rgba(37,37,37,.11);transform:translateY(-3px);}',
      '.brq-resource-root .education-shell{padding:42px 24px;background:linear-gradient(135deg,rgba(91,23,36,.08),rgba(94,109,99,.12)),#fbf7ef;}',
      '.brq-resource-root .education-app{max-width:1180px;margin:0 auto;padding:clamp(16px,2.4vw,26px);border:1px solid rgba(91,23,36,.16);border-radius:8px;background:linear-gradient(180deg,rgba(255,253,248,.98),rgba(250,246,237,.98)),#fffdf8;box-shadow:0 20px 54px rgba(37,37,37,.12);animation:brq-fade-rise .26s ease both;}',
      '.brq-resource-root .education-topbar,.brq-resource-root .quiz-header,.brq-resource-root .education-card-footer,.brq-resource-root .quiz-nav,.brq-resource-root .result-actions,.brq-resource-root .access-actions{display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;}',
      '.brq-resource-root .education-stats,.brq-resource-root .education-section-grid,.brq-resource-root .education-lock-row,.brq-resource-root .pricing-grid,.brq-resource-root .education-intro-grid{display:grid;gap:16px;margin-top:16px;}',
      '.brq-resource-root .education-stats{grid-template-columns:repeat(3,minmax(0,1fr));}.brq-resource-root .education-section-grid{grid-template-columns:repeat(3,minmax(0,1fr));}.brq-resource-root .education-lock-row{grid-template-columns:repeat(4,minmax(0,1fr));}.brq-resource-root .pricing-grid,.brq-resource-root .education-intro-grid{grid-template-columns:repeat(2,minmax(0,1fr));max-width:1120px;margin-left:auto;margin-right:auto;}',
      '.brq-resource-root .education-section-card,.brq-resource-root .question-panel,.brq-resource-root .missed-preview,.brq-resource-root .pricing-card,.brq-resource-root .education-intro-grid article,.brq-resource-root .education-note{border:1px solid rgba(91,23,36,.16);border-radius:8px;background:#fffdf8;padding:18px;box-shadow:0 8px 24px rgba(37,37,37,.06);}',
      '.brq-resource-root .education-dashboard-copy{max-width:720px;}.brq-resource-root .education-section-card{position:relative;display:flex;flex-direction:column;justify-content:space-between;gap:14px;overflow:hidden;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;}.brq-resource-root .education-section-card:before{content:"";position:absolute;inset:0 0 auto;height:3px;background:linear-gradient(90deg,#5b1724,#b68a35);opacity:0;transition:opacity .18s ease;}.brq-resource-root .education-section-card:hover{border-color:rgba(182,138,53,.6);transform:translateY(-3px);box-shadow:0 16px 32px rgba(37,37,37,.12);}.brq-resource-root .education-section-card:hover:before,.brq-resource-root .education-section-card:focus-within:before{opacity:1;}.brq-resource-root .education-section-copy p{color:#6b625b;font-size:.96rem;}',
      '.brq-resource-root .education-weight,.brq-resource-root .education-topic-row span{display:inline-flex;border-radius:999px;border:1px solid rgba(91,23,36,.16);padding:4px 8px;font-size:.78rem;font-weight:700;color:#5e6d63;background:#fbf7ef;}',
      '.brq-resource-root .education-topic-row{display:flex;flex-wrap:wrap;gap:7px;}.brq-resource-root .education-stats span{display:grid;min-height:78px;place-items:center;border:1px solid rgba(94,109,99,.28);border-radius:8px;background:linear-gradient(180deg,#fffdf8,#f4eee4);text-align:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.8);}.brq-resource-root .education-stats strong{display:block;color:#5b1724;font-size:1.25rem;}.brq-resource-root .education-stats small{color:#6b625b;font-size:.78rem;font-weight:800;text-transform:uppercase;}',
      '.brq-resource-root .locked-feature{position:relative;display:grid;gap:4px;min-height:112px;padding:16px;border:1px solid rgba(91,23,36,.18);border-radius:8px;background:linear-gradient(135deg,rgba(255,253,248,.98),rgba(244,237,228,.98)),#fffdf8;color:#252525;text-align:left;cursor:pointer;box-shadow:0 10px 24px rgba(37,37,37,.06);transition:border-color .18s ease,transform .18s ease,box-shadow .18s ease;}.brq-resource-root .locked-feature:hover{border-color:#b68a35;box-shadow:0 14px 30px rgba(37,37,37,.1);transform:translateY(-2px);}.brq-resource-root .locked-feature span{color:#5b1724;font-size:.74rem;font-weight:800;text-transform:uppercase;}',
      '.brq-resource-root .quiz-progress{height:10px;margin:16px 0;overflow:hidden;border-radius:999px;background:#eadfce;}.brq-resource-root .quiz-progress span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#5e6d63,#b68a35);transition:width .22s ease;}',
      '.brq-resource-root .answer-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px;}.brq-resource-root .answer-choice{min-height:72px;padding:14px;border:1px solid rgba(91,23,36,.18);border-radius:8px;background:#fff;color:#252525;text-align:left;cursor:pointer;font:inherit;font-weight:700;line-height:1.35;}.brq-resource-root .answer-choice.correct{border-color:#4e7b5f;background:#eef7ef;}.brq-resource-root .answer-choice.wrong{border-color:#a84545;background:#fff0ec;}',
      '.brq-resource-root .answer-feedback{margin-top:16px;padding:16px;border-left:4px solid #b68a35;border-radius:8px;background:#f8f0e5;}.brq-resource-root .answer-feedback.is-correct{border-left-color:#4e7b5f;}.brq-resource-root .answer-feedback.is-wrong{border-left-color:#a84545;}',
      '.brq-resource-root .ad-slot{max-width:1120px;margin:24px auto 0;padding:16px;border:1px dashed rgba(182,138,53,.7);border-radius:8px;background:rgba(255,253,248,.48);color:#6b625b;text-align:center;}.brq-resource-root .ad-slot span{color:#6b625b;font-size:.72rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;}.brq-resource-root .price{font-size:2.2rem;font-weight:800;color:#5b1724;margin:8px 0;}',
      '.brq-resource-root .education-modal{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:16px;background:rgba(37,37,37,.64);backdrop-filter:blur(7px);animation:brq-fade-in .16s ease both;}.brq-resource-root .education-modal-card{position:relative;width:min(100%,560px);padding:clamp(20px,3vw,27px);border:1px solid rgba(91,23,36,.18);border-radius:8px;background:#fffdf8;box-shadow:0 18px 48px rgba(0,0,0,.24);animation:brq-modal-pop .19s ease both;}.brq-resource-root .modal-close{position:absolute;top:10px;right:10px;}',
      '.brq-resource-root .unlock-form{display:grid;gap:12px;margin-top:16px;}.brq-resource-root .unlock-form label{display:grid;gap:6px;font-weight:700;}.brq-resource-root .unlock-form input{min-height:44px;border:1px solid rgba(91,23,36,.18);border-radius:6px;padding:10px;font:inherit;}',
      '.brq-resource-root .restore-divider{display:flex;align-items:center;gap:12px;margin:16px 0 4px;color:#6b625b;font-size:.78rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;}.brq-resource-root .restore-divider:before,.brq-resource-root .restore-divider:after{content:"";flex:1;border-top:1px solid rgba(91,23,36,.16);}.brq-resource-root .form-message{margin:12px 0;padding:12px;border:1px solid rgba(91,23,36,.16);border-radius:8px;background:#f8f0e5;color:#5b1724;font-weight:700;}.brq-resource-root .education-modal-benefits{display:grid;gap:7px;margin:16px 0;padding:0;list-style:none;}.brq-resource-root .education-modal-benefits li{position:relative;padding-left:20px;color:#252525;font-weight:700;}.brq-resource-root .education-modal-benefits li:before{content:"";position:absolute;left:0;top:.55em;width:8px;height:8px;border-radius:50%;background:#b68a35;}',
      '.brq-resource-root .unlock-confirm{padding:16px;border:1px solid rgba(94,109,99,.24);border-radius:8px;background:#eef7ef;}.brq-resource-root .dashboard-unlock{margin:16px 0;}.brq-resource-root .dashboard-unlock.is-warning{border-color:rgba(182,138,53,.44);background:#fff8e8;}.brq-resource-root .dashboard-unlock.is-checking{background:#f8f0e5;}.brq-resource-root .access-actions{justify-content:flex-start;margin-top:12px;}.brq-resource-root .access-code-box{display:grid;gap:6px;margin:16px 0;padding:16px;border:1px solid rgba(182,138,53,.52);border-radius:8px;background:#f8f0e5;}.brq-resource-root .access-code-box span{color:#6b625b;font-size:.76rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;}.brq-resource-root .access-code-box strong{color:#5b1724;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:clamp(1rem,4vw,1.45rem);letter-spacing:.03em;overflow-wrap:anywhere;}.brq-resource-root .timer-pill{display:inline-flex;margin-left:7px;padding:2px 7px;border-radius:999px;background:rgba(91,23,36,.1);color:#5b1724;font-size:.78rem;vertical-align:middle;}',
      '.brq-resource-root .cram-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:16px;}.brq-resource-root .cram-card{border:1px solid rgba(91,23,36,.16);border-radius:8px;background:#fffdf8;padding:16px;}.brq-resource-root .education-toast{position:fixed;right:16px;bottom:16px;z-index:10000;max-width:min(360px,calc(100vw - 32px));padding:13px 16px;border-radius:8px;background:#252525;color:#fbf7ef;box-shadow:0 18px 48px rgba(0,0,0,.24);}',
      '.brq-resource-root .path-section{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,340px);gap:18px;margin:18px 0;}',
      '.brq-resource-root .toc,.brq-resource-root .disclaimer-block,.brq-resource-root .author-box{border-left:4px solid #b68a35;background:#fffdf8;padding:18px 20px;margin:24px 0;border-radius:6px;}',
      '.brq-resource-root .toc{max-width:880px;margin:28px auto;}',
      '.brq-resource-root .toc strong{display:block;margin-bottom:8px;color:#2a2523;}',
      '.brq-resource-root .toc a{display:inline-flex;margin:7px 7px 0 0;padding:5px 9px;border:1px solid rgba(91,23,36,.18);border-radius:6px;background:#fbf7ef;text-decoration:none;font-size:.92rem;line-height:1.3;}',
      '.brq-resource-root .author-box{display:grid;grid-template-columns:86px minmax(0,1fr);gap:18px;align-items:start;}',
      '.brq-resource-root .author-box img{width:86px;height:86px;object-fit:cover;border-radius:8px;}',
      '.brq-resource-root .site-disclaimer,.brq-resource-root footer{background:#2a2523;color:#fbf7ef;padding:28px 24px;}',
      '.brq-resource-root .site-disclaimer a,.brq-resource-root footer a{color:#f1d58d;}',
      '.brq-resource-root table{width:100%;border-collapse:collapse;margin:18px 0;background:#fffdf8;}',
      '.brq-resource-root th,.brq-resource-root td{border:1px solid rgba(91,23,36,.18);padding:10px;text-align:left;vertical-align:top;}',
      '.brq-resource-status{max-width:900px;margin:40px auto;padding:22px;border:1px solid #b68a35;background:#fffdf8;color:#252525;}',
      '@keyframes brq-fade-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes brq-fade-in{from{opacity:0}to{opacity:1}}@keyframes brq-modal-pop{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}',
      '@media (max-width:800px){.brq-resource-root .hero,.brq-resource-root .article-hero,.brq-resource-root .path-section,.brq-resource-root .education-stats,.brq-resource-root .education-section-grid,.brq-resource-root .education-lock-row,.brq-resource-root .pricing-grid,.brq-resource-root .education-intro-grid,.brq-resource-root .answer-grid,.brq-resource-root .cram-grid,.brq-resource-root .education-hero-metrics{grid-template-columns:1fr;padding:34px 20px;}.brq-resource-root .education-hero{min-height:auto;padding-top:56px;}.brq-resource-root .article-header{padding-top:34px;}.brq-resource-root .content-band,.brq-resource-root .article-body,.brq-resource-root .resource-section,.brq-resource-root .download-body{padding:30px 18px;}.brq-resource-root .author-box{grid-template-columns:1fr;}}',
      '@media (max-width:600px){.brq-resource-root .education-hero{padding:42px 20px 34px;}.brq-resource-root .education-hero h1{font-size:clamp(2.35rem,11vw,3.35rem);}.brq-resource-root .education-hero-actions .button{width:auto;flex:1 1 150px;}.brq-resource-root .education-hero-metrics{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:0;}.brq-resource-root .education-hero-metrics div{min-height:84px;padding:12px;}.brq-resource-root .education-hero-metrics dt{font-size:1.55rem;}.brq-resource-root .education-hero-metrics dd{font-size:.76rem;line-height:1.2;}.brq-resource-root .education-hero-note{font-size:.86rem;}}',
      '@media (prefers-reduced-motion:reduce){.brq-resource-root *,.brq-resource-root *:before,.brq-resource-root *:after{animation-duration:1ms!important;animation-iteration-count:1!important;transition-duration:1ms!important;scroll-behavior:auto!important;}}',
      '@media print{body>*:not(#brq-resource-print-root){display:none!important}.brq-resource-root{background:white;color:black}.brq-resource-root a{color:black}.brq-resource-root .hero,.brq-resource-root .article-hero{background:white;color:black;padding:0}.brq-resource-root .button,.brq-resource-root nav,.brq-resource-root footer{display:none!important}}'
    ].join('');
    document.head.appendChild(style);
  }

  function rewriteUrl(value) {
    if (!value || value.charAt(0) === '#' || value.indexOf('mailto:') === 0 || value.indexOf('tel:') === 0) return value;
    var url;
    try {
      url = new URL(value, SOURCE_ORIGIN);
    } catch (e) {
      return value;
    }
    if (url.origin !== SOURCE_ORIGIN) return url.href;
    var next = url.pathname;
    if (next.indexOf('/assets/') === 0) return SOURCE_ORIGIN + next;
    if (next.indexOf('/downloads/') === 0) next = '/' + next.split('/').filter(Boolean).slice(-1)[0] + '/';
    if (next.indexOf('/category/') === 0) next = '/' + next.split('/').filter(Boolean).slice(-1)[0] + '/';
    if (next === '/author/the-agent-resource-desk/' || next === '/author/the-agent-resource-desk') next = '/the-agent-resource-desk/';
    return next + (url.hash || '');
  }

  function extractMain(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var title = doc.querySelector('title');
    var description = doc.querySelector('meta[name="description"]');
    var main = doc.querySelector('main');
    if (!main) throw new Error('No content found in source page.');
    main.querySelectorAll('a[href]').forEach(function (link) {
      link.setAttribute('href', rewriteUrl(link.getAttribute('href')));
    });
    main.querySelectorAll('img[src]').forEach(function (img) {
      img.setAttribute('src', rewriteUrl(img.getAttribute('src')));
      img.setAttribute('loading', img.getAttribute('loading') || 'lazy');
      img.setAttribute('decoding', 'async');
    });
    main.querySelectorAll('script').forEach(function (script) {
      script.remove();
    });
    return {
      html: main.innerHTML,
      title: title ? title.textContent : '',
      description: description ? description.getAttribute('content') : ''
    };
  }

  function updateMeta(content) {
    if (content.title) {
      document.title = content.title.replace(' | BRIQUE REALTY', ' | BRIQUE REALTY');
    }
    if (content.description) {
      var meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content.description);
    }
  }

  function render(content) {
    ensureStyle();
    watchLegacyResourceNav();
    var page = document.querySelector('main#page') || document.querySelector('main') || document.body;
    var root = document.createElement('article');
    root.id = 'brq-resource-print-root';
    root.className = 'brq-resource-root';
    // Squarespace owns global navigation. Injecting a second resource nav made
    // the domain feel mismatched and created recurring header spacing issues.
    root.innerHTML = content.html;
    page.innerHTML = '';
    page.appendChild(root);
    removeLegacyResourceNav();
    updateMeta(content);
    normalizeVisibleEducationUrl();
    if (sourcePath === '/education/') ensureEducationQuizScript();
  }

  function ensureEducationQuizScript() {
    var existing = document.getElementById('brq-education-quiz-script');
    if (existing && existing.getAttribute('data-brq-version') === LOADER_VERSION) return;
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    var script = document.createElement('script');
    script.id = 'brq-education-quiz-script';
    script.setAttribute('data-brq-version', LOADER_VERSION);
    script.src = SOURCE_ORIGIN + '/assets/js/education-quiz.js?v=' + encodeURIComponent(LOADER_VERSION);
    script.defer = true;
    document.body.appendChild(script);
  }

  function showStatus(message) {
    ensureStyle();
    var page = document.querySelector('main#page') || document.querySelector('main') || document.body;
    page.innerHTML = '<div class="brq-resource-status">' + message + '</div>';
  }

  function load() {
    showStatus('Loading Georgia real estate resource...');
    fetch(SOURCE_ORIGIN + sourcePath + '?v=' + encodeURIComponent(LOADER_VERSION), { credentials: 'omit', cache: 'force-cache' })
      .then(function (response) {
        if (!response.ok) throw new Error('Source returned ' + response.status);
        return response.text();
      })
      .then(extractMain)
      .then(render)
      .catch(function (error) {
        showStatus('This resource is temporarily unavailable. Please use the Resource Center or contact page while the page is refreshed.');
        if (window.console) console.warn('BRQ resource loader failed:', error);
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();
