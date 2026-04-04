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

function getRuntimeData() {
  const queryData = getQueryParams();
  if (Object.keys(queryData).length > 0) {
    return queryData;
  }
  return window.caseData || {};
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

render(getRuntimeData());
