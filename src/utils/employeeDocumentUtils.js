export const REVISION_OPTIONS = [
  { label: '3 Months', months: 3 },
  { label: '6 Months', months: 6 },
  { label: '1 Year',   months: 12 },
  { label: '1.5 Years', months: 18 },
  { label: '3 Years',  months: 36 },
  { label: 'Custom (enter manually)', months: null },
]; //

export const EMPTY_MANUAL = {
  pay_label_1:  'Monthly Pay (0–6 Months)',
  pay_value_1:  '',
  pay_label_2:  'Monthly Pay Apprentice (6–12 Months)',
  pay_value_2:  '',
  revision_period_label: '',
  revision_period_custom: '',
  next_revision_date: '',
  bond: '',
}; //

export function parseJoiningDate(str) {
  if (!str) return null;
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return parsed;
  return null;
} //

export function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
} //

export function formatDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
} //

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
} 