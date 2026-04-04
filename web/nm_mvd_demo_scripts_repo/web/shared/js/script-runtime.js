export function readRuntimeData(defaultData = {}) {
  if (window.caseData && typeof window.caseData === 'object') return window.caseData;
  return defaultData;
}
