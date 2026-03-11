import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '@/alarms/application/ports/alarm.repository';
import { Alarm } from '@/alarms/domain/alarm';
import { Repository } from 'typeorm';
import { OrmAlarmEntity } from '../entities/orm-alarm.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrmAlarmMapper } from '../mappers/orm-alarm.mapper';

@Injectable()
export class OrmAlarmRepository implements AlarmRepository {
  constructor(
    @InjectRepository(OrmAlarmEntity)
    private readonly alarmRepository: Repository<OrmAlarmEntity>
  ) {}

  async findAll(): Promise<Alarm[]> {
    const entities = await this.alarmRepository.find();
    return entities.map((item) => OrmAlarmMapper.toDomain(item));
  }

  async save(alarm: Alarm): Promise<Alarm> {
    const persistenceModel = OrmAlarmMapper.toPersistence(alarm);
    const newEntity = await this.alarmRepository.save(persistenceModel);

    return OrmAlarmMapper.toDomain(newEntity);
  }
}
