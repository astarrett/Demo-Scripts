function txt(id, v, fallback = '—') {
  const e = document.getElementById(id);
  if (e) e.textContent = (v === undefined || v === null || v === '') ? fallback : v;
}

function money(v) {
  return `$${Number(v || 0).toFixed(2)}`;
}

function statusBadge(id, v) {
  const e = document.getElementById(id);
  if (!e) return;
  e.textContent = v || '—';
  const lv = String(v || '').toLowerCase();
  e.className = 'badge badge-' + (
    lv === 'valid' ? 'valid' :
    lv === 'suspended' ? 'suspended' :
    lv === 'expired' ? 'expired' :
    lv === 'open' ? 'open' :
    lv === 'closed' ? 'closed' : 'none'
  );
}

function yesNoBadge(id, val) {
  const e = document.getElementById(id);
  if (!e) return;
  const boolVal = String(val).toLowerCase() === 'true' || val === true;
  e.textContent = boolVal ? 'Yes' : 'No';
  e.className = 'badge ' + (boolVal ? 'badge-suspended' : 'badge-valid');
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(params.entries());
}

function getHashKey() {
  // supports index.html#1002
  const h = (window.location.hash || '').replace('#', '').trim();
  return h || null;
}

function setBannerMessage(msg) {
  const banner = document.querySelector('.alert-banner');
  if (banner) banner.innerHTML = msg;
}

function render(d) {
  txt('headerCase', d.key ? '#' + d.key : '', '');
  txt('fName', d.name);
  txt('fDob', d.dob);
  txt('fKey', d.key);
  txt('fChannel', d.channelPreference);
  txt('nextStep', d.recommendedNextStep);
  txt('sName', d.name);
  txt('sKey', d.key);

  statusBadge('bLic', d.licenseStatus);
  statusBadge('bReg', d.registrationStatus);
  statusBadge('bTicketStatus', d.ticketStatus || 'None');
  yesNoBadge('bReinst', d.reinstatementRequired);
  yesNoBadge('bTicket', d.hasTicket);

  txt('fSusp', d.suspensionReason || 'None');
  txt('fTicketNum', d.ticketNumber || '—');

  const balance = Number(d.outstandingBalance || 0);
  const hasBal = balance > 0;
  const bc = document.getElementById('balanceCard');
  const ba = document.getElementById('balanceAmount');
  const bn = document.getElementById('balanceNote');

  if (bc) bc.className = 'balance-card ' + (hasBal ? 'has-balance' : 'no-balance');
  if (ba) ba.textContent = money(balance);
  if (bn) bn.textContent = hasBal ? 'Outstanding balance handled in self-service' : 'No balance due';

  const actions = String(d.requiredActions || '').split(';').map(s => s.trim()).filter(Boolean);
  const list = document.getElementById('actionsList');
  if (list) {
    list.innerHTML = actions.map((a, i) =>
      `<div class="action-pill"><span class="action-num">${i + 1}</span>${a}</div>`
    ).join('');
  }

  txt('smsSent', d.smsFormSentAt);
  txt('smsRecv', d.smsReceivedAt);
  txt('smsSigned', d.smsFormSignedName);

  const reinstatementRequired = String(d.reinstatementRequired).toLowerCase() === 'true' || d.reinstatementRequired === true;
  const transferReason = reinstatementRequired
    ? 'Reinstatement still requires agent completion after self-service.'
    : 'Agent requested for additional assistance.';
  txt('transferReason', transferReason);
}

/**
 * Configure this to point to a JSON endpoint that returns a record for a given account/customerId.
 *
 * Example patterns (one of these is what DeepAgent likely exposed):
 * - https://nm-dmv-reinstatement-cmgspv.abacusai.app/api/record?account=1002
 * - https://nm-dmv-reinstatement-cmgspv.abacusai.app/api/account/1002
 *
 * The endpoint MUST return JSON with keys that match your render() usage:
 * name, dob, key, licenseStatus, registrationStatus, suspensionReason, outstandingBalance, reinstatementRequired, hasTicket, ticketNumber, ticketStatus, requiredActions, recommendedNextStep, smsFormSentAt, smsReceivedAt, smsFormSignedName
 */
const LOOKUP_ENDPOINT = 'https://nm-dmv-reinstatement-cmgspv.abacusai.app/api/record?account=';

async function fetchCaseByKey(key) {
  const url = LOOKUP_ENDPOINT + encodeURIComponent(key);

  const res = await fetch(url, { cache: 'no-store' });
  const contentType = res.headers.get('content-type') || '';

  if (!res.ok) {
    throw new Error(`Lookup failed: ${res.status} ${res.statusText}`);
  }
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Expected JSON but got ${contentType}. First 120 chars: ${text.slice(0, 120)}`);
  }
  return await res.json();
}

async function init() {
  const queryData = getQueryParams();
  const hashKey = getHashKey();

  // If query string has a full payload (more than just key), render it directly
  const queryKeys = Object.keys(queryData);
  const hasPayload = queryKeys.length > 1;

  if (hasPayload) {
    // Ensure we always have a key field if caller uses customerId
    if (!queryData.key && queryData.customerId) queryData.key = queryData.customerId;
    render(queryData);
    return;
  }

  // Determine key from query (?key=) or hash (#)
  const key = queryData.key || hashKey;

  if (key) {
    // render minimal immediately, then replace with fetched data
    render({ key });

    try {
      setBannerMessage(`<strong>Incoming Transfer from AVA</strong> — Loading record for case ${key}...`);
      const record = await fetchCaseByKey(key);

      // normalize key fields
      if (!record.key) record.key = key;
      render(record);

      setBannerMessage(`<strong>Incoming Transfer from AVA</strong> — The resident has completed available self-service steps.`);
      return;
    } catch (e) {
      console.error(e);
      setBannerMessage(`<strong>Incoming Transfer from AVA</strong> — Could not load record for case ${key}.`);
      return;
    }
  }

  // Fallback for preview-only environments that inject data
  render(window.caseData || {});
}

init();
