/* ============================================================
   DocuScan, showcase.js
   Auto-rotating 3D cover-flow of annotated sample contracts.
   All contract text below is original, generic boilerplate
   written purely to illustrate how DocuScan marks up a page,
   not real or proprietary agreements.
   Relies on scoreColor(), scoreLabel(), and ICONS from app.js.
   ============================================================ */

'use strict';

/* Highlight helpers keep the clause text readable */
const R = (t) => `<mark class="hl hl-red">${t}</mark>`;   // critical
const Y = (t) => `<mark class="hl hl-amber">${t}</mark>`; // review
const G = (t) => `<mark class="hl hl-green">${t}</mark>`; // extracted info

const SHOWCASE = [
  {
    type: 'Employment offer',
    title: 'Employment Offer Agreement',
    sub: 'Full-Time, Exempt',
    score: 38,
    recital: `This Employment Agreement ("Agreement") is made effective as of ${G('March 3, 2026')}, by and between ${G('TechCorp Global Ltd.')} ("Company") and ${G('Julian Reyes')} ("Employee"), who agree as follows.`,
    clauses: [
      { n: 1, h: 'Position', t: 'Employee shall serve as Senior Software Engineer, reporting to the VP of Engineering, and shall devote full professional time and attention to the Company.' },
      { n: 2, h: 'Compensation', t: `The Company shall pay an annual base salary of ${G('$142,000')}, payable in accordance with the Company’s standard payroll practices and subject to applicable withholding.` },
      { n: 3, h: 'At-Will Employment', t: Y('Employment is at-will and may be terminated by either party at any time, with or without cause and without prior notice.') },
      { n: 4, h: 'Non-Competition', t: R('For three (3) years following separation, Employee shall not, anywhere in the world, engage in or advise any business that competes with the Company.') },
      { n: 5, h: 'Intellectual Property', t: R('Employee assigns to the Company all inventions, whether or not made during working hours, including personal projects conceived on Employee’s own time and equipment.') },
      { n: 6, h: 'Dispute Resolution', t: R('Any dispute shall be resolved by binding arbitration, and Employee waives any right to bring or join a class or collective action.') }
    ],
    sig: [{ name: 'Julian Reyes', role: 'Employee' }, { name: '', role: 'For the Company' }],
    findings: {
      red: ['Non-compete: 3 years, worldwide scope', 'IP assignment covers personal, off-hours projects', 'Binding arbitration with class-action waiver'],
      review: ['At-will termination with no notice period'],
      clear: ['Parties and effective date identified', 'Base salary clearly specified', 'Role and reporting line defined']
    }
  },

  {
    type: 'Residential lease',
    title: 'Residential Lease Agreement',
    sub: 'Fixed 12-Month Term',
    score: 82,
    recital: `This Lease Agreement ("Lease") is entered into on ${G('February 1, 2026')} between ${G('Maple Grove Properties LLC')} ("Landlord") and ${G('Elena Karim')} ("Tenant") for the premises located at ${G('488 Birchwood Lane, Unit 3')}.`,
    clauses: [
      { n: 1, h: 'Term', t: `The initial term is twelve (12) months, commencing ${G('March 1, 2026')} and ending February 28, 2027.` },
      { n: 2, h: 'Rent', t: `Tenant shall pay monthly rent of ${G('$1,850')}, due on or before the first day of each calendar month.` },
      { n: 3, h: 'Security Deposit', t: `Tenant shall pay a deposit of ${G('$1,850')}, refundable within thirty (30) days after move-out, less any lawful deductions.` },
      { n: 4, h: 'Late Charges', t: Y('A late fee of $75 applies to rent received after the fifth day of the month, plus $10 for each additional day it remains unpaid.') },
      { n: 5, h: 'Renewal', t: Y('Unless either party gives sixty (60) days’ written notice, this Lease renews automatically on a month-to-month basis.') },
      { n: 6, h: 'Maintenance', t: 'Landlord shall keep the structure, plumbing, electrical, and heating systems in good and safe working order.' }
    ],
    sig: [{ name: 'Elena Karim', role: 'Tenant' }, { name: '', role: 'For the Landlord' }],
    findings: {
      red: [],
      review: ['Auto-renews to month-to-month absent notice', 'Escalating daily late fees'],
      clear: ['Parties and premises identified', 'Rent and deposit amounts specified', 'Term dates specified', 'Maintenance responsibilities defined']
    }
  },

  {
    type: 'Freelance contract',
    title: 'Independent Contractor Agreement',
    sub: 'Design Services',
    score: 88,
    recital: `This Independent Contractor Agreement ("Agreement") is made on ${G('June 10, 2026')} between ${G('Northwind Studios LLC')} ("Client") and ${G('Priya Sharma')} ("Contractor").`,
    clauses: [
      { n: 1, h: 'Services', t: 'Contractor shall provide brand identity and website design services as described in the attached Exhibit A.' },
      { n: 2, h: 'Fees', t: `Client shall pay a fixed fee of ${G('$6,500')} upon completion of the services. ${Y('Payment terms are Net 45 from the date of each invoice.')}` },
      { n: 3, h: 'Revisions', t: Y('The engagement includes "reasonable revisions," a term the Agreement leaves undefined.') },
      { n: 4, h: 'Ownership', t: 'Upon receipt of full payment, all final deliverables become the exclusive property of the Client.' },
      { n: 5, h: 'Independent Status', t: 'Contractor is an independent contractor and is responsible for their own taxes, insurance, and equipment.' },
      { n: 6, h: 'Confidentiality', t: 'Contractor shall keep all Client materials and business information confidential.' }
    ],
    sig: [{ name: 'Priya Sharma', role: 'Contractor' }, { name: '', role: 'For the Client' }],
    findings: {
      red: [],
      review: ['Net 45 payment terms (slower than Net 30)', 'Undefined "reasonable revisions" scope'],
      clear: ['Parties and date identified', 'Fixed fee specified', 'Clear IP transfer on payment', 'Independent-contractor status is clear']
    }
  },

  {
    type: 'Non-disclosure agreement',
    title: 'Mutual Non-Disclosure Agreement',
    sub: 'Evaluation Purpose',
    score: 64,
    recital: `This Mutual Non-Disclosure Agreement ("Agreement") is effective ${G('April 22, 2026')} between ${G('Acme Cloudworks Inc.')} and ${G('BlueRiver Analytics')} (each a "Party").`,
    clauses: [
      { n: 1, h: 'Purpose', t: 'The Parties wish to exchange confidential information to evaluate a potential business relationship.' },
      { n: 2, h: 'Definition', t: Y('"Confidential Information" is defined broadly to include all information "of any kind whatsoever," with no carve-out for independently developed material.') },
      { n: 3, h: 'Obligations', t: 'Each Party shall use the other’s Confidential Information solely for the stated purpose and protect it with reasonable care.' },
      { n: 4, h: 'Term', t: Y('The confidentiality obligations survive in perpetuity, with no stated expiration date.') },
      { n: 5, h: 'Non-Solicitation', t: R('For five (5) years, neither Party may hire or solicit any employee or contractor of the other, regardless of who first initiates contact.') },
      { n: 6, h: 'Return of Materials', t: 'Upon written request, each Party shall promptly return or destroy the other’s Confidential Information.' }
    ],
    sig: [{ name: '', role: 'For Acme Cloudworks Inc.' }, { name: '', role: 'For BlueRiver Analytics' }],
    findings: {
      red: ['5-year non-solicit, includes inbound applicants'],
      review: ['Overbroad definition with no carve-outs', 'Perpetual confidentiality term'],
      clear: ['Parties and effective date identified', 'Mutual, reciprocal obligations', 'Standard return-of-materials clause']
    }
  },

  {
    type: 'SaaS subscription',
    title: 'Master Subscription Agreement',
    sub: 'Cloud Services',
    score: 59,
    recital: `This Master Subscription Agreement ("Agreement") is entered into on ${G('June 20, 2026')} between ${G('Acme Cloudworks Inc.')} ("Provider") and ${G('BlueRiver Analytics')} ("Customer").`,
    clauses: [
      { n: 1, h: 'Subscription', t: 'Provider grants Customer a non-exclusive right to access the Service during the Subscription Term.' },
      { n: 2, h: 'Term and Renewal', t: Y('The term is 24 months and auto-renews for successive 12-month periods unless cancelled at least 90 days in advance.') },
      { n: 3, h: 'Fees', t: `Customer shall pay an annual fee of ${G('$48,000')}, invoiced yearly in advance and non-refundable.` },
      { n: 4, h: 'Price Changes', t: Y('Provider may increase the fees by up to 7% at each renewal upon written notice.') },
      { n: 5, h: 'Modifications', t: R('Provider may modify these terms at any time by email notice, and Customer’s continued use constitutes acceptance.') },
      { n: 6, h: 'Data', t: 'All Customer data remains the property of the Customer, and Provider shall not use it except to deliver the Service.' }
    ],
    sig: [{ name: '', role: 'For the Provider' }, { name: '', role: 'For the Customer' }],
    findings: {
      red: ['Unilateral term changes by email notice'],
      review: ['Auto-renewal with 90-day cancellation window', 'Up to 7% annual price escalation'],
      clear: ['Parties and date identified', 'Annual fee specified', 'Customer retains data ownership']
    }
  },

  {
    type: 'Promissory note',
    title: 'Promissory Note',
    sub: 'Unsecured Loan',
    score: 41,
    recital: `Dated ${G('May 5, 2026')}. For value received, ${G('David Renner')} ("Borrower") promises to pay to the order of ${G('Summit Capital Partners')} ("Lender") the principal sum of ${G('$25,000')}.`,
    clauses: [
      { n: 1, h: 'Interest', t: R('Interest accrues on the unpaid principal at a rate of 28.9% per annum, compounded monthly.') },
      { n: 2, h: 'Repayment', t: 'The loan is payable in thirty-six (36) equal monthly installments beginning June 1, 2026.' },
      { n: 3, h: 'Prepayment', t: Y('A prepayment penalty equal to 3% of the outstanding balance applies to any early payoff.') },
      { n: 4, h: 'Acceleration', t: R('Upon any late payment, the entire unpaid balance becomes immediately due and payable at the Lender’s sole discretion.') },
      { n: 5, h: 'Confession of Judgment', t: R('Borrower authorizes any attorney to confess judgment against Borrower for the unpaid amount, without prior notice or hearing.') },
      { n: 6, h: 'Late Charge', t: Y('A late charge of 10% of the overdue payment applies after a five-day grace period.') }
    ],
    sig: [{ name: 'David Renner', role: 'Borrower' }, { name: '', role: 'For the Lender' }],
    findings: {
      red: ['28.9% interest, compounded monthly', 'Acceleration on a single late payment', 'Confession of judgment clause'],
      review: ['3% prepayment penalty', '10% late charge'],
      clear: ['Parties and principal amount identified', 'Repayment schedule stated']
    }
  }
];

/* Build one realistic 8.5x11 document page from structured data */
function buildDoc(c) {
  let h = `<div class="doc-title">${c.title}</div>`;
  if (c.sub) h += `<div class="doc-sub">${c.sub}</div>`;
  h += `<p class="doc-recital">${c.recital}</p>`;
  c.clauses.forEach(cl => {
    h += `<p class="doc-clause"><span class="doc-num">${cl.n}.</span> <strong>${cl.h}.</strong> ${cl.t}</p>`;
  });
  h += `<div class="doc-sig">` + c.sig.map(s => `
    <div class="sig-col">
      <div class="sig-line"></div>
      <p class="sig-label">${s.role}${s.name ? ': ' + G(s.name) : ''}</p>
    </div>`).join('') + `</div>`;
  h += `<div class="doc-foot">PAGE 1 OF 1</div>`;
  return h;
}

const Showcase = {
  active: 0,
  slides: [],
  timer: null,
  init() {
    this.stage = document.getElementById('cf-stage');
    if (!this.stage) return;

    SHOWCASE.forEach((c, i) => {
      const slide = document.createElement('div');
      slide.className = 'cf-slide';
      slide.innerHTML = `<div class="cf-doc"><div class="cf-doc-inner">${buildDoc(c)}</div></div>`;
      slide.addEventListener('click', () => { if (i !== this.active) this.go(i, true); });
      this.stage.appendChild(slide);
      this.slides.push(slide);
    });

    // Dots
    const dots = document.getElementById('cf-dots');
    SHOWCASE.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'cf-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to contract ' + (i + 1));
      d.addEventListener('click', () => this.go(i, true));
      dots.appendChild(d);
    });
    this.dots = [...dots.children];

    document.getElementById('cf-prev').addEventListener('click', () => this.go(this.active - 1, true));
    document.getElementById('cf-next').addEventListener('click', () => this.go(this.active + 1, true));

    const wrap = document.getElementById('cf-wrap');
    wrap.addEventListener('mouseenter', () => this.pause());
    wrap.addEventListener('mouseleave', () => this.play());
    window.addEventListener('resize', () => this.layout());

    this.layout();
    this.updatePanel();
    this.play();

    // Serif metrics can shift once the web font loads; re-fit the centered doc then.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.fitActive());
    }
  },

  go(i, manual) {
    const n = SHOWCASE.length;
    this.active = (i % n + n) % n;
    this.layout();
    this.updatePanel();
    this.dots.forEach((d, k) => d.classList.toggle('active', k === this.active));
    if (manual) { this.pause(); this.play(); }
  },

  layout() {
    const n = SHOWCASE.length;
    const narrow = window.innerWidth < 640;
    const spread = narrow ? 96 : 205;
    const depth  = narrow ? 120 : 175;
    const activeScale = narrow ? 1.28 : 1.2; // moderate; text legibility comes from font size
    this.slides.forEach((s, i) => {
      let off = i - this.active;
      if (off >  n / 2) off -= n;
      if (off < -n / 2) off += n;
      const abs = Math.abs(off);
      const sign = Math.sign(off);
      const scale = off === 0 ? activeScale : Math.max(0.58, 1 - abs * 0.13);
      s.style.transform =
        `translateX(${off * spread}px) translateZ(${-abs * depth}px) rotateY(${-sign * 34}deg) scale(${scale})`;
      s.style.opacity = abs > 3 ? '0' : String(1 - abs * 0.2);
      s.style.filter = off === 0 ? 'none' : `blur(${Math.min(abs * 1.3, 4)}px)`;
      s.style.zIndex = String(100 - abs);
      s.style.pointerEvents = abs > 3 ? 'none' : 'auto';
      s.classList.toggle('is-active', off === 0);
      // Non-active docs revert to the thumbnail base font
      if (off !== 0) {
        const inner = s.querySelector('.cf-doc-inner');
        if (inner) inner.style.fontSize = '';
      }
    });
    this.fitActive();
  },

  /* Size the centered document so the whole page always fits, no clipping.
     Starts from a comfortable max and shrinks the font only if it overflows. */
  fitActive() {
    const slide = this.slides[this.active];
    if (!slide) return;
    const doc = slide.querySelector('.cf-doc');
    const inner = slide.querySelector('.cf-doc-inner');
    if (!doc || !inner) return;
    const maxF = window.innerWidth < 640 ? 9 : 11;
    const minF = 6;
    let f = maxF;
    inner.style.fontSize = f + 'px';
    let guard = 0;
    while (doc.scrollHeight > doc.clientHeight && f > minF && guard < 40) {
      f -= 0.5;
      inner.style.fontSize = f + 'px';
      guard++;
    }
  },

  updatePanel() {
    const c = SHOWCASE[this.active];
    const ring = document.getElementById('cf-gauge');
    const color = scoreColor(c.score);
    ring.style.stroke = color;
    ring.getBoundingClientRect();
    ring.style.strokeDashoffset = 326.7 * (1 - c.score / 100);

    const scoreEl = document.getElementById('cf-score');
    scoreEl.style.color = color;
    this.countUp(scoreEl, c.score);

    document.getElementById('cf-verdict').textContent = scoreLabel(c.score);
    document.getElementById('cf-doctype').textContent = c.type;

    const group = (title, items, cls, icon) => items.length ? `
      <div>
        <p class="cf-group-h ${cls}">${icon}${title}<span class="cf-count">${items.length}</span></p>
        <ul class="space-y-1.5">${items.map(t => `<li class="cf-item ${cls}-item">${t}</li>`).join('')}</ul>
      </div>` : '';

    document.getElementById('cf-findings').innerHTML =
        group('Red flags', c.findings.red, 'red', ICONS.flag)
      + group('Review', c.findings.review, 'amber', ICONS.warn)
      + group('Clear', c.findings.clear, 'green', ICONS.check);
  },

  countUp(el, target) {
    const token = (this._ct = (this._ct || 0) + 1); // cancel any in-flight count-up
    let cur = 0;
    const step = Math.max(1, Math.round(target / 32));
    const tick = () => {
      if (token !== this._ct) return; // a newer count-up took over
      cur = Math.min(target, cur + step);
      el.textContent = cur + '%';
      if (cur < target) requestAnimationFrame(tick);
    };
    tick();
  },

  play() {
    this.pause();
    this.timer = setInterval(() => this.go(this.active + 1), 4200);
  },
  pause() { if (this.timer) { clearInterval(this.timer); this.timer = null; } }
};

document.addEventListener('DOMContentLoaded', () => Showcase.init());
