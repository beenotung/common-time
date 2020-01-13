import { TimePoint, TimeSlot } from './parse-form';

function toIdx(hour: number, minute: number) {
  return hour * 60 + minute;
}

function forEachSlot(
  timeSlot: TimeSlot,
  f: (idx: number, hour: number, minute: number) => void,
) {
  for (let h = timeSlot.start.hour; h <= timeSlot.end.hour; h++) {
    for (let m = timeSlot.start.minute; m <= timeSlot.end.minute; m++) {
      const idx = toIdx(h, m);
      f(idx, h, m);
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

export function timeSlotDuration(timeSlot: TimeSlot) {
  // return in minutes
  let acc = 0;
  forEachSlot(timeSlot, () => acc++);
  return acc;
}

export class TimeSlotM {
  /**
   * default all timeslot are not available
   * */

  // hour x 60 + minute -> idx
  private hasSlotList: boolean[] = [];

  hasSlot(hour: number, minute: number): boolean {
    const idx = toIdx(hour, minute);
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

  compact() {
    const slotted_times: TimeSlot[] = [];
    const non_slotted_times: TimeSlot[] = [];

    let start: TimePoint = { hour: 0, minute: 0 };
    let end: TimePoint = { hour: 0, minute: 0 };
    let hasSlot = this.hasSlot(0, 0);
    forAllSlot((idx, hour, minute) => {
      if (idx === 0) {
        return;
      }
      end = { hour, minute };
      if (this.hasSlot(hour, minute) === hasSlot) {
        // same state
        return;
      }
      // toggle state
      if (hasSlot) {
        slotted_times.push({ start, end });
      } else {
        non_slotted_times.push({ start, end });
      }
      hasSlot = !hasSlot;
      start = end;
    });
    // clean up last record
    if (hasSlot) {
      slotted_times.push({ start, end });
    } else {
      non_slotted_times.push({ start, end });
    }
    return {
      slotted_times,
      non_slotted_times,
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
