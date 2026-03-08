import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmEntity } from './entities/alarm.entity';
import { AlarmRepository } from 'src/alarms/application/ports/alarm.repository';
import { OrmAlarmRepository } from './repositories/alarm.repository';

@Module({
  providers: [
    {
      provide: AlarmRepository,
      useClass: OrmAlarmRepository,
    },
  ],
  imports: [TypeOrmModule.forFeature([AlarmEntity])],
  exports: [AlarmRepository],
})
export class OrmPersistenceModule {}
