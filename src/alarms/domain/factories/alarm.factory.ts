import { Alarm } from '../alarm';
import { AlarmSeverity } from '../value-objects/alarm-severity';
import { v4 as uuidv4 } from 'uuid';

export class AlarmFactory {
  create(name: string, severity: string): Alarm {
    const alarmSeverity = new AlarmSeverity(
      severity as 'low' | 'medium' | 'high',
    );

    return new Alarm(uuidv4(), name, alarmSeverity);
  }
}
