import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  CreateAlarmDto,
  CreateAlarmUseCase,
} from 'src/alarms/application/use-cases/create-alarm.use-case';
import { ListAlarmsUseCase } from 'src/alarms/application/use-cases/list-alarms.use-case';

@Controller('alarms')
export class AlarmsController {
  constructor(
    private readonly createAlarmUseCase: CreateAlarmUseCase,
    private readonly listAlarmsUseCase: ListAlarmsUseCase,
  ) {}

  @Post()
  create(@Body() createAlarmDto: CreateAlarmDto) {
    return this.createAlarmUseCase.execute(createAlarmDto);
  }

  @Get()
  findAll() {
    return this.listAlarmsUseCase.execute();
  }
}
