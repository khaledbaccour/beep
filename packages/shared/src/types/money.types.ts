/** All monetary amounts are stored in millimes (1 TND = 1000 millimes) */
export interface Money {
  amount: number;
  currency: 'TND';
}
