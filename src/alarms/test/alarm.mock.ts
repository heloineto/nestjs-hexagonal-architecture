import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { Alarm } from '@/alarms/domain/alarm';
import { AlarmSeverity } from '../domain/value-objects/alarm-severity';

export const alarmFactory = Factory.define<Alarm>(() => {
  return new Alarm(
    faker.string.uuid(),
    faker.lorem.sentence(),
    new AlarmSeverity(faker.helpers.arrayElement(['low', 'medium', 'high']))
  );
});
