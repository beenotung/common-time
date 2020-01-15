import { findCommonTime } from './calc';
import { getFormFileList, readForm, saveForm } from './form-io';
import { timeSlotsToString } from './parse-form';

function processFile(file: string, options?: { log?: boolean }) {
  const form = readForm(file);
  const na_col = 1 + form.members.length + 1;
  const a_col = na_col + 1;
  form.csv[0][na_col] = form.csv[0][na_col] || 'Common NA';
  form.csv[0][a_col] = form.csv[0][a_col] || 'Common A';
  for (let i = 0; i < form.month.days.length; i++) {
    const day = form.month.days[i];
    const row = i + 1;
    const { na_times, a_times } = findCommonTime(day);
    form.csv[row][na_col] = timeSlotsToString(na_times);
    form.csv[row][a_col] = timeSlotsToString(a_times);
    if (options?.log) {
      console.dir({ day, na_times, a_times }, { depth: 99 });
    }
  }
  saveForm(form);
}

export function start(options?: { dir?: string; log?: boolean }) {
  const files = getFormFileList(options?.dir);
  for (const file of files) {
    console.log('processing file:', file);
    processFile(file, options);
  }
  console.log('ok');
}
