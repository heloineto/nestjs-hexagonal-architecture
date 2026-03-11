import { beforeEach, describe, expect, it } from 'vitest';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { MockProxy } from 'vitest-mock-extended';
import { mock } from 'vitest-mock-extended';
import { AlarmRepository } from '../ports/alarm.repository';
import { ListAlarmsUseCase } from './list-alarms.use-case';
import { alarmFactory } from '@/alarms/test/alarm.mock';

describe('ListAlarmsUseCase', () => {
  let alarmRepository: MockProxy<AlarmRepository>;
  let listAlarms: ListAlarmsUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListAlarmsUseCase,
        { provide: AlarmRepository, useValue: mock<AlarmRepository>() },
      ],
    }).compile();

    alarmRepository = module.get<MockProxy<AlarmRepository>>(AlarmRepository);
    listAlarms = module.get(ListAlarmsUseCase);
  });

  it('returns all alarms from the repository', async () => {
    const alarms = alarmFactory.buildList(3);
    alarmRepository.findAll.mockResolvedValue(alarms);

    const result = await listAlarms.execute();

    expect(result).toBe(alarms);
  });

  it('returns an empty list when no alarms exist', async () => {
    alarmRepository.findAll.mockResolvedValue([]);

    const result = await listAlarms.execute();

    expect(result).toEqual([]);
  });
});
