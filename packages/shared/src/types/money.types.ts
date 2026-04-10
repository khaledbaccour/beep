/** All monetary amounts are stored in cents (1 EUR = 100 cents) */
export interface Money {
  amount: number;
  currency: 'EUR';
}
