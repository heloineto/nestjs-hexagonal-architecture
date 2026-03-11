import { Module } from '@nestjs/common';
import { AlarmRepository } from '@/alarms/application/ports/alarm.repository';
import { InMemoryAlarmRepository } from './repositories/in-memory-alarm.repository';

@Module({
  providers: [
    {
      provide: AlarmRepository,
      useClass: InMemoryAlarmRepository,
    },
  ],
  exports: [AlarmRepository],
})
export class InMemoryPersistenceModule {}
