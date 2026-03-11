import { beforeEach, describe, expect, it } from 'vitest';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { MockProxy } from 'vitest-mock-extended';
import { mock } from 'vitest-mock-extended';
import { AlarmRepository } from '../ports/alarm.repository';
import { alarmFactory } from '@/alarms/test/alarm.mock';
import { CreateAlarmUseCase } from './create-alarm.use-case';

describe('CreateAlarmUseCase', () => {
  let alarmRepository: MockProxy<AlarmRepository>;
  let createAlarm: CreateAlarmUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAlarmUseCase,
        { provide: AlarmRepository, useValue: mock<AlarmRepository>() },
      ],
    }).compile();

    alarmRepository = module.get<MockProxy<AlarmRepository>>(AlarmRepository);
    createAlarm = module.get(CreateAlarmUseCase);
  });

  it('saves a new alarm and returns it', async () => {
    const saved = alarmFactory.build();
    alarmRepository.save.mockResolvedValue(saved);

    const result = await createAlarm.execute({
      name: 'CPU High',
      severity: 'high',
    });

    expect(alarmRepository.save.mock.calls).toHaveLength(1);
    expect(result).toBe(saved);
  });

  it('passes name and severity to the saved alarm', async () => {
    const saved = alarmFactory.build({
      name: 'Disk Full',
      severity: { value: 'low' },
    });
    alarmRepository.save.mockResolvedValue(saved);

    await createAlarm.execute({ name: 'Disk Full', severity: 'low' });

    const [passedAlarm] = alarmRepository.save.mock.calls[0];
    expect(passedAlarm.name).toBe('Disk Full');
    expect(passedAlarm.severity.value).toBe('low');
  });
});
