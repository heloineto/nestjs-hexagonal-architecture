export class AlarmSeverity {
  constructor(public readonly value: 'low' | 'medium' | 'high') {}

  equals(other: AlarmSeverity): boolean {
    return this.value === other.value;
  }
}
