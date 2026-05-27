/** All monetary amounts are stored in paise (1 INR = 100 paise) */
export interface Money {
  amount: number;
  currency: 'INR';
}
