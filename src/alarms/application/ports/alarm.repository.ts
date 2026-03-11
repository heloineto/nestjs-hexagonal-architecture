import { Alarm } from '@/alarms/domain/alarm';

export abstract class AlarmRepository {
  abstract findAll(): Promise<Alarm[]> | Alarm[];
  abstract save(alarm: Alarm): Promise<Alarm> | Alarm;
}
