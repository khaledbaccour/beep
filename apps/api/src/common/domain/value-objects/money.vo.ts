export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: 'TND' = 'TND',
  ) {
    if (!Number.isInteger(amount)) {
      throw new Error('Money amount must be an integer (millimes)');
    }
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  percentage(percent: number): Money {
    return new Money(Math.round((this.amount * percent) / 100), this.currency);
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount > other.amount;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toDisplayString(): string {
    return `${(this.amount / 1000).toFixed(3)} ${this.currency}`;
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }
}
