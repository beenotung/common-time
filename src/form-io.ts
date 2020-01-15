import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Form, formToString, parseForm } from './parse-form';

export function getFormFileList(dir = '.'): string[] {
  let files: string[];
  try {
    files = readdirSync(dir);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
    return [];
  }
  return files
    .filter(file => file.endsWith('.csv'))
    .map(file => join(dir, file));
}

export function readForm(file: string): Form {
  const text = readFileSync(file).toString();
  const form = parseForm(file, text);
  return form;
}

export function saveForm(form: Form) {
  writeFileSync(form.file, formToString(form));
}
