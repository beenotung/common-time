import { Day, TimeSlot } from './parse-form';
import { timeSlotDurationInMinutes, TimeSlotM } from './timeslot';

const minimum_duration_in_minutes = 15;

const genFilter = (duration_in_minute: number) => (t: TimeSlot) =>
  timeSlotDurationInMinutes(t) >= duration_in_minute;

const filter = genFilter(minimum_duration_in_minutes);

export function findCommonTime(day: Day) {
  const naTimeSlot = new TimeSlotM();
  day.members.forEach(member => {
    const aTimeSlot = new TimeSlotM();
    member.a_times.forEach(timeSlot => aTimeSlot.add(timeSlot));
    naTimeSlot.union(aTimeSlot.reverse());
  });
  const { marked_times, non_marked_times } = naTimeSlot.compact(
    minimum_duration_in_minutes,
  );
  return {
    na_times: marked_times.filter(filter),
    a_times: non_marked_times.filter(filter),
  };
}
