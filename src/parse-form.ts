import { from_csv, regular_csv, to_csv } from '@beenotung/tslib/csv';

export interface TimePoint {
  hour: number;
  minute: number;
}

export interface TimeSlot {
  start: TimePoint;
  end: TimePoint;
}

export interface MemberDay {
  member: string;
  a_times: TimeSlot[];
}

export interface Day {
  day: string; // 1-31
  members: MemberDay[];
}

export interface Month {
  month: string; // e.g. January
  days: Day[];
}

export interface Form {
  file: string;
  csv: string[][];
  members: string[];
  month: Month;
}

export function parseTimePoint(text: string): TimePoint {
  // e.g. 0900, 09:00
  let h: string;
  let m: string;
  if (text.includes(':')) {
    [h, m] = text.split(':');
  } else {
    h = text.slice(0, 2);
    m = text.slice(2, 4);
  }
  return {
    hour: +h,
    minute: +m,
  };
}

export function parseTimeSlots(text: string): TimeSlot[] {
  text = text.trim().toUpperCase();
  if (text === 'ALL DAY') {
    return parseTimeSlots('0000-2359');
  }
  if (text === 'N/A' || text === '') {
    return [];
  }
  return text.split(',').map(text => {
    text = text.trim();
    if (text.includes('-')) {
      const [start, end] = text.split('-');
      return {
        start: parseTimePoint(start),
        end: parseTimePoint(end),
      };
    }
    throw new Error(`unknown format of time slot: ${JSON.stringify(text)}`);
  });
}

function to2d(x: number): string {
  if (x < 10) {
    return '0' + x;
  }
  return x.toString();
}

function timePointToString(timePoint: TimePoint): string {
  return to2d(timePoint.hour) + ':' + to2d(timePoint.minute);
}

export function timeSlotsToString(timeSlots: TimeSlot[]): string {
  return timeSlots
    .map(({ start, end }) =>
      start.hour === 0 &&
      start.minute === 0 &&
      end.hour === 23 &&
      end.minute === 59
        ? 'ALL DAY'
        : `${timePointToString(start)}-${timePointToString(end)}`,
    )
    .join(', ');
}

export function parseForm(file: string, text: string): Form {
  const csv = from_csv(text);
  const month = csv[0][0];
  const members: string[] = [];
  for (let col = 1; col < csv[0].length; col++) {
    const name = csv[0][col].trim();
    if (!name) {
      break;
    }
    members.push(name);
  }
  const form: Form = {
    file,
    csv,
    members,
    month: {
      month,
      days: [],
    },
  };
  for (let row = 1; row < csv.length; row++) {
    const cols = csv[row];
    const day: Day = {
      day: cols[0],
      members: [],
    };
    for (let col = 1; col <= members.length; col++) {
      const member = members[col - 1];
      const text = cols[col];
      const memberDay: MemberDay = {
        member,
        a_times: parseTimeSlots(text),
      };
      day.members.push(memberDay);
    }
    form.month.days.push(day);
  }
  return form;
}

export function formToString(form: Form): string {
  regular_csv(form.csv);
  return to_csv(form.csv);
}
