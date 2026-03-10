import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../ports/alarm.repository';
import { Alarm } from 'src/alarms/domain/alarm';
import { AlarmSeverity } from 'src/alarms/domain/value-objects/alarm-severity';
import { v4 as uuidv4 } from 'uuid';

export class CreateAlarmDto {
  name: string;
  severity: string;
}

@Injectable()
export class CreateAlarmUseCase {
  constructor(private readonly alarmRepository: AlarmRepository) {}

  execute(createAlarmDto: CreateAlarmDto) {
    const alarm = new Alarm(
      uuidv4(),
      createAlarmDto.name,
      new AlarmSeverity(createAlarmDto.severity as 'low' | 'medium' | 'high'),
    );

    return this.alarmRepository.save(alarm);
  }
}
