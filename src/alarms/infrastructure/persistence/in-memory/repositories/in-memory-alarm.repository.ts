/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { AlarmRepository } from 'src/alarms/application/ports/alarm.repository';
import { Alarm } from 'src/alarms/domain/alarm';
import { InMemoryAlarmEntity } from '../entities/in-memory-alarm.entity';
import { InMemoryAlarmMapper } from '../mappers/in-memory-alarm.mapper';

@Injectable()
export class InMemoryAlarmRepository implements AlarmRepository {
  private readonly alarms = new Map<string, InMemoryAlarmEntity>();

  constructor() {}

  async findAll(): Promise<Alarm[]> {
    const entities = Array.from(this.alarms.values());
    return entities.map((item) => InMemoryAlarmMapper.toDomain(item));
  }

  async save(alarm: Alarm): Promise<Alarm> {
    const persistenceModel = InMemoryAlarmMapper.toPersistence(alarm);
    this.alarms.set(persistenceModel.id, persistenceModel);

    const newEntity = this.alarms.get(persistenceModel.id)!;
    return InMemoryAlarmMapper.toDomain(newEntity);
  }
}
