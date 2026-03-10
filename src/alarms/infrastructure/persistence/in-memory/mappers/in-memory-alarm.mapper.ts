import { Alarm } from 'src/alarms/domain/alarm';
import { InMemoryAlarmEntity } from '../entities/in-memory-alarm.entity';
import { AlarmSeverity } from 'src/alarms/domain/value-objects/alarm-severity';

export class InMemoryAlarmMapper {
  static toDomain(alarmEntity: InMemoryAlarmEntity): Alarm {
    const alarmSeverity = new AlarmSeverity(
      alarmEntity.severity as 'low' | 'medium' | 'high',
    );

    const alarmModel = new Alarm(
      alarmEntity.id,
      alarmEntity.name,
      alarmSeverity,
    );

    return alarmModel;
  }

  static toPersistence(alarm: Alarm): InMemoryAlarmEntity {
    const alarmEntity = new InMemoryAlarmEntity();
    alarmEntity.id = alarm.id;
    alarmEntity.name = alarm.name;
    alarmEntity.severity = alarm.severity.value;
    return alarmEntity;
  }
}
