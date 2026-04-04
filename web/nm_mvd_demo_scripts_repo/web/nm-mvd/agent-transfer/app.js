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
  e.textContent = val ? 'Yes' : 'No';
  e.className = 'badge ' + (val ? 'badge-suspended' : 'badge-valid');
}

function render(d) {
  txt('headerCase', '#' + d.key, '');
  txt('fName', d.name);
  txt('fDob', d.dob);
  txt('fKey', d.key);
  txt('fChannel', d.channelPreference);
  txt('nextStep', d.recommendedNextStep);
  txt('sName', d.name);
  txt('sKey', d.key);
  txt('fSusp', d.suspensionReason || 'None');
  txt('fTicketNum', d.ticketNumber || '—');
  txt('smsSent', d.smsFormSentAt);
  txt('smsRecv', d.smsReceivedAt);
  txt('smsSigned', d.smsFormSignedName);
  txt('smsToken', d.smsFormToken);
  txt('transferReason', d.reinstatementRequired ? 'Reinstatement still requires agent completion after self-service.' : 'Agent requested for additional assistance.');
  document.getElementById('balanceAmount').textContent = money(d.outstandingBalance);
  document.getElementById('balanceNote').textContent = Number(d.outstandingBalance || 0) > 0 ? 'Outstanding balance handled in self-service' : 'No balance due';
  statusBadge('bLic', d.licenseStatus);
  statusBadge('bReg', d.registrationStatus);
  statusBadge('bTicketStatus', d.ticketStatus || 'None');
  yesNoBadge('bReinst', d.reinstatementRequired);
  yesNoBadge('bTicket', d.hasTicket);
  const actions = String(d.requiredActions || '').split(';').map(s => s.trim()).filter(Boolean);
  const list = document.getElementById('actionsList');
  if (list) list.innerHTML = actions.map((a, i) => `<div class="action-pill"><span class="action-num">${i+1}</span>${a}</div>`).join('');
}

render(window.caseData || {});
