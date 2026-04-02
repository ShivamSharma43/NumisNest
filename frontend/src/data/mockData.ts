import type { Coin, CoinType } from '@/types';

// Empty mock coins - data will come from API
export const mockCoins: Coin[] = [];

export const coinTypeLabels: Record<CoinType, string> = {
  'old': 'Old Coins',
  '1-rupee': '1 Rupee',
  '2-rupees': '2 Rupee',
  '5-rupees': '5 Rupee',
  '10-rupees': '10 Rupee',
  '20-rupees': '20 Rupee',
};

export const coinTypeDescriptions: Record<CoinType, string> = {
  'old': 'Historic and antique coins from various eras',
  '1-rupee': 'One Rupee denomination coins',
  '2-rupees': 'Two Rupee denomination coins',
  '5-rupees': 'Five Rupee denomination coins',
  '10-rupees': 'Ten Rupee denomination coins',
  '20-rupees': 'Twenty Rupee denomination coins',
};