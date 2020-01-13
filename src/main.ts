import { findCommonTime } from './calc';
import { getFormFileList, readForm, saveForm } from './form-io';
import { timeSlotsToString } from './parse-form';

function processFile(file: string) {
  const form = readForm(file);
  const na_col = 1 + form.members.length + 1;
  const a_col = na_col + 1;
  for (let i = 0; i < form.month.days.length; i++) {
    const day = form.month.days[i];
    const row = i + 1;
    const { na_times, a_times } = findCommonTime(day);
    form.csv[row][na_col] = timeSlotsToString(na_times);
    form.csv[row][a_col] = timeSlotsToString(a_times);
  }
  saveForm(form);
}

export function start() {
  const files = getFormFileList();
  for (const file of files) {
    console.log('processing file:', file);
    processFile(file);
  }
  console.log('ok');
}
