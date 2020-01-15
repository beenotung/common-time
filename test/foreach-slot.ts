import { forEachSlot } from '../src/timeslot';

forEachSlot(
  { start: { hour: 9, minute: 31 }, end: { hour: 10, minute: 0 } },
  (idx, hour, minute) => {
    console.log({ idx, hour, minute });
  },
);
