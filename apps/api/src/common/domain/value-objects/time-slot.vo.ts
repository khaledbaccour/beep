export class TimeSlot {
  constructor(
    public readonly startTime: Date,
    public readonly endTime: Date,
  ) {
    if (endTime <= startTime) {
      throw new Error('End time must be after start time');
    }
  }

  get durationMinutes(): number {
    return (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60);
  }

  overlapsWith(other: TimeSlot): boolean {
    return this.startTime < other.endTime && this.endTime > other.startTime;
  }

  contains(date: Date): boolean {
    return date >= this.startTime && date <= this.endTime;
  }

  hoursUntilStart(from: Date = new Date()): number {
    return (this.startTime.getTime() - from.getTime()) / (1000 * 60 * 60);
  }
}
