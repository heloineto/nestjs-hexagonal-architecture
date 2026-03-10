import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '../ports/alarm.repository';

@Injectable()
export class ListAlarmsUseCase {
  constructor(private readonly alarmRepository: AlarmRepository) {}

  execute() {
    return this.alarmRepository.findAll();
  }
}
