import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmAlarmEntity } from './entities/orm-alarm.entity';
import { AlarmRepository } from '@/alarms/application/ports/alarm.repository';
import { OrmAlarmRepository } from './repositories/orm-alarm.repository';

@Module({
  providers: [
    {
      provide: AlarmRepository,
      useClass: OrmAlarmRepository,
    },
  ],
  imports: [TypeOrmModule.forFeature([OrmAlarmEntity])],
  exports: [AlarmRepository],
})
export class OrmPersistenceModule {}
