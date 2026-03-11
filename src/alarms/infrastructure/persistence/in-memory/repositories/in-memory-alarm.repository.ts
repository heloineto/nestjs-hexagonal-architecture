import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '@/alarms/application/ports/alarm.repository';
import { Alarm } from '@/alarms/domain/alarm';
import { InMemoryAlarmEntity } from '../entities/in-memory-alarm.entity';
import { InMemoryAlarmMapper } from '../mappers/in-memory-alarm.mapper';

@Injectable()
export class InMemoryAlarmRepository implements AlarmRepository {
  private readonly alarms = new Map<string, InMemoryAlarmEntity>();

  constructor() {}

  findAll(): Alarm[] {
    const entities = Array.from(this.alarms.values());
    return entities.map((item) => InMemoryAlarmMapper.toDomain(item));
  }

  save(alarm: Alarm): Alarm {
    const persistenceModel = InMemoryAlarmMapper.toPersistence(alarm);
    this.alarms.set(persistenceModel.id, persistenceModel);

    const newEntity = this.alarms.get(persistenceModel.id)!;
    return InMemoryAlarmMapper.toDomain(newEntity);
  }
}
