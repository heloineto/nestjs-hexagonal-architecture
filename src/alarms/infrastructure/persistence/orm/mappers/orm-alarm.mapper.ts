import { Alarm } from 'src/alarms/domain/alarm';
import { OrmAlarmEntity } from '../entities/orm-alarm.entity';
import { AlarmSeverity } from 'src/alarms/domain/value-objects/alarm-severity';

export class OrmAlarmMapper {
  static toDomain(alarmEntity: OrmAlarmEntity): Alarm {
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

  static toPersistence(alarm: Alarm): OrmAlarmEntity {
    const alarmEntity = new OrmAlarmEntity();
    alarmEntity.id = alarm.id;
    alarmEntity.name = alarm.name;
    alarmEntity.severity = alarm.severity.value;
    return alarmEntity;
  }
}
