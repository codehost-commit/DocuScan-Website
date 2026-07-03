/* ============================================================
   DocuScan, app.js
   Clean, modular vanilla JS. Each feature lives in its own
   module object with an init() method, wired up at the bottom.
   Swap MOCK_CONTRACTS for real API data later.
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   Inline SVG icons (currentColor, so they inherit text color)
   ------------------------------------------------------------ */
const ICONS = {
  flag:  '<svg class="icon w-4 h-4 inline-block align-[-2px] mr-1.5" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
  warn:  '<svg class="icon w-4 h-4 inline-block align-[-2px] mr-1.5" viewBox="0 0 24 24"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  check: '<svg class="icon w-4 h-4 inline-block align-[-2px] mr-1.5" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  doc:   '<svg class="icon w-5 h-5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
};

/* ------------------------------------------------------------
   MOCK DATA, replace with real backend results later.
   Shared by the Analyzer, Memory, and Compare views.
   ------------------------------------------------------------ */
const MOCK_CONTRACTS = [
  {
    id: 'c1',
    name: 'Freelance_Design_Agreement.pdf',
    date: '2026-06-28',
    score: 87,
    title: 'Independent Contractor Design Services Agreement',
    parties: ['Rakesh Awasthi (Contractor)', 'Northwind Studios LLC (Client)'],
    dates: { effective: 'Jul 1, 2026', term: '12 months', renewal: 'Manual renewal' },
    review: [
      { clause: 'Payment terms: Net 45', note: 'Longer than the industry-standard Net 30. Consider negotiating.' },
      { clause: 'Revision rounds: "reasonable revisions"', note: 'Vague scope. Ask for a fixed number of revision rounds.' }
    ],
    redFlags: []
  },
  {
    id: 'c2',
    name: 'SaaS_Subscription_Terms.pdf',
    date: '2026-06-15',
    score: 62,
    title: 'Master SaaS Subscription and Services Agreement',
    parties: ['Acme Cloudworks Inc. (Provider)', 'BlueRiver Analytics (Customer)'],
    dates: { effective: 'Jun 20, 2026', term: '24 months', renewal: 'Auto-renews for 12-month terms' },
    review: [
      { clause: 'Auto-renewal: 90-day cancellation notice', note: 'Easy to miss. Set a reminder well before the window.' },
      { clause: 'Price escalation: up to 7% annually', note: 'Above typical CPI adjustments. Try to cap at 3 to 5%.' }
    ],
    redFlags: [
      { clause: 'Unilateral terms modification', note: 'Provider may change terms at any time with only email notice.' }
    ]
  },
  {
    id: 'c3',
    name: 'Employment_Offer_TechCorp.pdf',
    date: '2026-05-30',
    score: 34,
    title: 'Employment Agreement, Senior Engineer',
    parties: ['TechCorp Global Ltd. (Employer)', 'Employee (unnamed at signing)'],
    dates: { effective: 'Jun 1, 2026', term: 'At-will', renewal: 'N/A' },
    review: [
      { clause: 'IP assignment: includes personal projects', note: 'Covers inventions made off-hours. Request a carve-out list.' }
    ],
    redFlags: [
      { clause: 'Non-compete: 3 years, worldwide', note: 'Extremely broad in scope, geography, and duration. Likely unenforceable but dangerous to sign.' },
      { clause: 'Uncapped liability for the employee', note: 'You bear unlimited liability for "any losses". Highly unusual and unfair.' },
      { clause: 'Mandatory arbitration plus class-action waiver', note: 'Removes your right to court remedies entirely.' }
    ]
  }
];

/* The contract used when the visitor "uploads" a file in the demo. */
const DEMO_RESULT = MOCK_CONTRACTS[1];

/* ------------------------------------------------------------
   Small helpers
   ------------------------------------------------------------ */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Color for a given safety score. */
function scoreColor(score) {
  if (score >= 75) return '#10b981'; // emerald, good to go
  if (score >= 50) return '#f59e0b'; // amber, caution
  return '#ef4444';                  // red, danger
}

/** Human label for a given safety score. */
function scoreLabel(score) {
  if (score >= 75) return 'Good to Go';
  if (score >= 50) return 'Sign with Caution';
  return 'High Risk, Review Carefully';
}

/* ------------------------------------------------------------
   Toast, lightweight feedback for demo buttons
   ------------------------------------------------------------ */
const Toast = {
  el: null,
  timer: null,
  init() { this.el = $('#toast'); },
  show(msg) {
    if (!this.el) return;
    this.el.textContent = msg;
    this.el.classList.remove('hidden-toast');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.el.classList.add('hidden-toast'), 2600);
  }
};

/* ------------------------------------------------------------
   Tabs, Analyzer / Memory / Compare switching
   ------------------------------------------------------------ */
const Tabs = {
  init() {
    $$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTo(btn.dataset.tab));
    });
  },
  switchTo(name) {
    $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    $$('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${name}`));
  }
};

/* ------------------------------------------------------------
   Analyzer, drag and drop plus simulated analysis
   ------------------------------------------------------------ */
const Analyzer = {
  init() {
    const zone  = $('#dropzone');
    const input = $('#file-input');
    if (!zone) return;

    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      if (input.files.length) this.run(input.files[0].name);
    });

    ['dragenter', 'dragover'].forEach(ev =>
      zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('dragover'); }));
    ['dragleave', 'drop'].forEach(ev =>
      zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('dragover'); }));
    zone.addEventListener('drop', e => {
      const name = e.dataTransfer.files[0]?.name || 'contract.pdf';
      this.run(name);
    });

    $('#demo-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      this.run(DEMO_RESULT.name);
    });

    // Action buttons (demo behavior, wire to real endpoints later)
    $('#btn-download-report')?.addEventListener('click', () =>
      Toast.show('Report saved as ' + DEMO_RESULT.name.replace('.pdf', '_report.pdf')));
    $('#btn-share-report')?.addEventListener('click', () =>
      Toast.show('Share sheet opened (demo)'));
    $('#btn-custom-link')?.addEventListener('click', () => {
      Toast.show('Custom link copied: docuscan.app/r/x7Kq2p');
    });
    $('#btn-analyze-another')?.addEventListener('click', () => this.reset());
  },

  /** Simulate an analysis run: progress bar, then results. */
  run(filename) {
    $('#upload-state').classList.add('hidden');
    $('#analyzing-state').classList.remove('hidden');
    $('#results-state').classList.add('hidden');
    $('#analyzing-filename').textContent = filename;

    const bar   = $('#progress-bar');
    const label = $('#progress-label');
    const steps = [
      [18, 'Extracting text'],
      [42, 'Chunking clauses'],
      [68, 'Running neural model'],
      [88, 'Scoring risks'],
      [100, 'Building report']
    ];
    bar.style.width = '0%';
    steps.forEach(([pct, msg], i) => {
      setTimeout(() => {
        bar.style.width = pct + '%';
        label.textContent = msg;
        if (pct === 100) setTimeout(() => this.showResults(filename), 450);
      }, 420 * (i + 1));
    });
  },

  /** Populate and reveal the results panel from mock data. */
  showResults(filename) {
    const r = DEMO_RESULT;
    $('#analyzing-state').classList.add('hidden');
    $('#results-state').classList.remove('hidden');

    // --- Gauge ---
    const ring = $('#gauge-ring');
    const circumference = 326.7;
    ring.style.stroke = scoreColor(r.score);
    ring.getBoundingClientRect(); // force reflow so the transition replays
    ring.style.strokeDashoffset = circumference * (1 - r.score / 100);
    $('#gauge-label').style.color = scoreColor(r.score);
    $('#gauge-verdict').textContent = scoreLabel(r.score);
    this.countUp($('#gauge-label'), r.score);

    // --- Info section ---
    $('#info-title').textContent   = r.title;
    $('#info-file').textContent    = filename;
    $('#info-parties').innerHTML   = r.parties.map(p => `<li>${p}</li>`).join('');
    $('#info-dates').innerHTML     = `
      <li><span class="font-medium text-slate-700">Effective:</span> ${r.dates.effective}</li>
      <li><span class="font-medium text-slate-700">Term:</span> ${r.dates.term}</li>
      <li><span class="font-medium text-slate-700">Renewal:</span> ${r.dates.renewal}</li>`;

    // --- Review (double-check) section ---
    $('#review-list').innerHTML = r.review.map(item => `
      <li class="p-4 rounded-xl bg-amber-50 border border-amber-200">
        <p class="font-semibold text-amber-900">${ICONS.warn}${item.clause}</p>
        <p class="text-sm text-amber-800 mt-1">${item.note}</p>
      </li>`).join('');

    // --- Red flags section ---
    const flags = $('#redflag-list');
    if (r.redFlags.length === 0) {
      flags.innerHTML = `<li class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
        ${ICONS.check}No critical red flags detected.</li>`;
    } else {
      flags.innerHTML = r.redFlags.map(item => `
        <li class="p-4 rounded-xl bg-red-50 border border-red-200">
          <p class="font-semibold text-red-900">${ICONS.flag}${item.clause}</p>
          <p class="text-sm text-red-800 mt-1">${item.note}</p>
        </li>`).join('');
    }

    $('#results-state').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  /** Animate the score number counting up. */
  countUp(el, target) {
    let cur = 0;
    const step = Math.max(1, Math.round(target / 40));
    const tick = () => {
      cur = Math.min(target, cur + step);
      el.textContent = cur + '%';
      if (cur < target) requestAnimationFrame(tick);
    };
    tick();
  },

  /** Back to the empty upload state. */
  reset() {
    $('#results-state').classList.add('hidden');
    $('#analyzing-state').classList.add('hidden');
    $('#upload-state').classList.remove('hidden');
    $('#gauge-ring').style.strokeDashoffset = 326.7;
    $('#file-input').value = '';
  }
};

/* ------------------------------------------------------------
   Memory, saved-contracts history list
   ------------------------------------------------------------ */
const Memory = {
  init() {
    const list = $('#memory-list');
    if (!list) return;
    list.innerHTML = MOCK_CONTRACTS.map(c => `
      <div class="lift flex items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200">
        <div class="flex items-center gap-4 min-w-0">
          <div class="icon-tile shrink-0 w-11 h-11 rounded-xl">${ICONS.doc}</div>
          <div class="min-w-0">
            <p class="font-semibold text-slate-800 truncate">${c.name}</p>
            <p class="text-sm text-slate-500">Analyzed ${new Date(c.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
        <div class="shrink-0 text-right">
          <span class="inline-block px-3 py-1 rounded-full text-sm font-bold"
                style="color:${scoreColor(c.score)}; background:${scoreColor(c.score)}18;">
            ${c.score}% safe
          </span>
        </div>
      </div>`).join('');
  }
};

/* ------------------------------------------------------------
   Compare, pick two contracts, view them side by side
   ------------------------------------------------------------ */
const Compare = {
  init() {
    const selA = $('#compare-a');
    const selB = $('#compare-b');
    if (!selA) return;

    const opts = MOCK_CONTRACTS.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    selA.innerHTML = opts;
    selB.innerHTML = opts;
    selB.selectedIndex = Math.min(1, MOCK_CONTRACTS.length - 1);

    $('#compare-btn').addEventListener('click', () => this.render(selA.value, selB.value));
  },

  render(idA, idB) {
    const a = MOCK_CONTRACTS.find(c => c.id === idA);
    const b = MOCK_CONTRACTS.find(c => c.id === idB);
    const out = $('#compare-results');

    if (idA === idB) {
      out.innerHTML = `<p class="text-center text-slate-500 py-6">Pick two <em>different</em> contracts to compare.</p>`;
      return;
    }

    const card = (c) => `
      <div class="flex-1 bg-white rounded-2xl border border-slate-200 p-5">
        <p class="font-semibold text-slate-800 truncate mb-1">${c.name}</p>
        <p class="text-4xl font-extrabold mb-1" style="color:${scoreColor(c.score)}">${c.score}%</p>
        <p class="text-sm font-medium mb-4" style="color:${scoreColor(c.score)}">${scoreLabel(c.score)}</p>
        <p class="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">Flagged clauses</p>
        <ul class="space-y-2">
          ${[...c.redFlags.map(f => `<li class="diff-conflict text-sm p-2 pl-3 rounded-r-lg text-red-900">${ICONS.flag}${f.clause}</li>`),
             ...c.review.map(f => `<li class="text-sm p-2 pl-3 rounded-r-lg bg-amber-50 text-amber-900 border-l-[3px] border-amber-400">${ICONS.warn}${f.clause}</li>`)]
            .join('') || `<li class="diff-ok text-sm p-2 pl-3 rounded-r-lg bg-emerald-50 text-emerald-800">${ICONS.check}Clean</li>`}
        </ul>
      </div>`;

    const delta = Math.abs(a.score - b.score);
    const safer = a.score >= b.score ? a : b;

    out.innerHTML = `
      <div class="flex flex-col md:flex-row gap-4">${card(a)}${card(b)}</div>
      <div class="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm">
        <span class="font-semibold">Verdict:</span>
        <strong>${safer.name}</strong> scores ${delta} points higher.
        ${a.redFlags.length !== b.redFlags.length
          ? `It has ${Math.min(a.redFlags.length, b.redFlags.length)} critical flag(s) vs ${Math.max(a.redFlags.length, b.redFlags.length)} in the other document.`
          : 'Both documents carry the same number of critical flags.'}
      </div>`;
  }
};

/* ------------------------------------------------------------
   Nav, mobile menu plus active-section highlighting
   ------------------------------------------------------------ */
const Nav = {
  init() {
    const btn  = $('#menu-btn');
    const menu = $('#mobile-menu');
    btn?.addEventListener('click', () => menu.classList.toggle('hidden'));
    $$('#mobile-menu a').forEach(a =>
      a.addEventListener('click', () => menu.classList.add('hidden')));

    // Highlight the nav link of the section in view (single-page anchors only)
    if (!('IntersectionObserver' in window)) return;
    const sections = $$('section[id]');
    const links    = $$('.nav-link');
    if (!sections.length) return;
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(l => {
          const href = l.getAttribute('href') || '';
          l.classList.toggle('active', href.endsWith(`#${e.target.id}`));
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => spy.observe(s));
  }
};

/* ------------------------------------------------------------
   Reveal, fade-in sections as they scroll into view
   ------------------------------------------------------------ */
const Reveal = {
  init() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(el => io.observe(el));
  }
};

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  Tabs.init();
  Analyzer.init();
  Memory.init();
  Compare.init();
  Nav.init();
  Reveal.init();
});
