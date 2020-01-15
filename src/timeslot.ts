import { TimePoint, TimeSlot } from './parse-form';

const DAY_MINUTES = 24 * 60; // number of minutes in a day
function toMinutes(hour: number, minute: number) {
  return hour * 60 + minute;
}

function timePointToMinutes(timePoint: TimePoint) {
  return toMinutes(timePoint.hour, timePoint.minute);
}

export function forEachSlot(
  timeSlot: TimeSlot,
  f: (minutes: number, hour: number, minute: number) => void,
) {
  let h = timeSlot.start.hour;
  let m = timeSlot.start.minute;
  for (let end = false; !end; ) {
    end = h === timeSlot.end.hour && m === timeSlot.end.minute;
    const minutes = toMinutes(h, m);
    f(minutes, h, m);
    if (m < 59) {
      m++;
    } else {
      m -= 59;
      h = (h + 1) % 24;
    }
  }
}

function forAllSlot(f: (idx: number, hour: number, minute: number) => void) {
  forEachSlot(
    {
      start: { hour: 0, minute: 0 },
      end: { hour: 23, minute: 59 },
    },
    f,
  );
}

export function timeSlotDurationInMinutes(timeSlot: TimeSlot) {
  // return in minutes
  const start = timePointToMinutes(timeSlot.start);
  const end = timePointToMinutes(timeSlot.end);
  if (start <= end) {
    return end - start;
  } else {
    return end + DAY_MINUTES - start;
  }
}

function compactTimeSlots(
  timeSlots: TimeSlot[],
  options: { minimum_duration_in_minutes: number },
): TimeSlot[] {
  if (timeSlots.length === 0) {
    return [];
  }
  const res: TimeSlot[] = [];
  let acc = timeSlots[0];
  res.push(acc);
  for (let i = 1; i < timeSlots.length; i++) {
    const c = timeSlots[i];
    const diff_in_minutes =
      timePointToMinutes(c.start) - timePointToMinutes(acc.end);
    if (diff_in_minutes < options.minimum_duration_in_minutes) {
      acc.end = c.end;
    } else {
      acc = c;
      res.push(acc);
    }
  }
  return res;
}

export class TimeSlotM {
  /**
   * default all timeslot are not available
   * */

  // hour x 60 + minute -> idx
  private hasSlotList: boolean[] = [];

  hasSlot(hour: number, minute: number): boolean {
    const idx = toMinutes(hour, minute);
    return !!this.hasSlotList[idx];
  }

  add(timeSlot: TimeSlot) {
    forEachSlot(timeSlot, idx => (this.hasSlotList[idx] = true));
  }

  remove(timeSlot: TimeSlot) {
    forEachSlot(timeSlot, idx => (this.hasSlotList[idx] = false));
  }

  removeAll() {
    this.hasSlotList = [];
  }

  markAll() {
    forAllSlot(idx => (this.hasSlotList[idx] = true));
  }

  union(timeSlotM: TimeSlotM) {
    forAllSlot(
      idx =>
        (this.hasSlotList[idx] =
          this.hasSlotList[idx] || timeSlotM.hasSlotList[idx]),
    );
  }

  compact(options: { minimum_duration_in_minutes: number }) {
    const marked_times: TimeSlot[] = [];
    const non_marked_times: TimeSlot[] = [];
    forAllSlot((idx, hour, minute) => {
      const timeSlot: TimeSlot = {
        start: { hour, minute },
        end: { hour, minute },
      };
      if (this.hasSlotList[idx]) {
        marked_times.push(timeSlot);
      } else {
        non_marked_times.push(timeSlot);
      }
    });
    return {
      marked_times: compactTimeSlots(marked_times, options),
      non_marked_times: compactTimeSlots(non_marked_times, options),
    };
  }

  reverse(): TimeSlotM {
    const res = new TimeSlotM();
    forAllSlot(idx => {
      res.hasSlotList[idx] = !this.hasSlotList[idx];
    });
    return res;
  }
}
