import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Form, formToString, parseForm } from './parse-form';

export function getFormFileList(dir = 'res'): string[] {
  const files = readdirSync(dir);
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
