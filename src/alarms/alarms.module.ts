import { DynamicModule, Module, Type } from '@nestjs/common';
import { AlarmsController } from './presentation/http/alarms.controller';
import { AlarmsService } from './application/alarms.service';
import { AlarmFactory } from './domain/factories/alarm.factory';

@Module({
  controllers: [AlarmsController],
  providers: [AlarmsService, AlarmFactory],
})
export class AlarmsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: AlarmsModule,
      imports: [infrastructureModule],
    };
  }
}
