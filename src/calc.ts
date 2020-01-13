import { Day } from './parse-form';
import { timeSlotDuration, TimeSlotM } from './timeslot';

export function findCommonTime(day: Day) {
  const aTimeSlot = new TimeSlotM();
  if (day.members.some(member => member.a_times.length === 0)) {
    aTimeSlot.removeAll();
  } else {
    day.members.forEach(member =>
      member.a_times.forEach(aTime => aTimeSlot.add(aTime)),
    );
  }
  const { slotted_times, non_slotted_times } = aTimeSlot.compact();
  return {
    na_times: non_slotted_times.filter(t => timeSlotDuration(t) >= 15),
    a_times: slotted_times.filter(t => timeSlotDuration(t) >= 15),
  };
}
