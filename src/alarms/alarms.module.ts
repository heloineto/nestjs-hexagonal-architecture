import { DynamicModule, Module, Type } from '@nestjs/common';
import { AlarmsController } from './presentation/http/alarms.controller';
import { AlarmFactory } from './domain/factories/alarm.factory';
import { CreateAlarmUseCase } from './application/use-cases/create-alarm.use-case';
import { ListAlarmsUseCase } from './application/use-cases/list-alarms.use-case';

@Module({
  controllers: [AlarmsController],
  providers: [CreateAlarmUseCase, ListAlarmsUseCase, AlarmFactory],
})
export class AlarmsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: AlarmsModule,
      imports: [infrastructureModule],
    };
  }
}
