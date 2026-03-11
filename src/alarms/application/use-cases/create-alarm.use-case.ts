import { Injectable } from '@nestjs/common';
import { CreateAlarmDto } from '../dtos/create-alarm.dto';
import { AlarmRepository } from '../ports/alarm.repository';
import { Alarm } from '@/alarms/domain/alarm';
import { AlarmSeverity } from '@/alarms/domain/value-objects/alarm-severity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateAlarmUseCase {
  constructor(private readonly alarmRepository: AlarmRepository) {}

  execute(createAlarmDto: CreateAlarmDto) {
    const alarm = new Alarm(
      uuidv4(),
      createAlarmDto.name,
      new AlarmSeverity(createAlarmDto.severity as 'low' | 'medium' | 'high')
    );

    return this.alarmRepository.save(alarm);
  }
}
