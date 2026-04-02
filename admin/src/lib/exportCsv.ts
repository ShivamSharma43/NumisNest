import type { Coin } from '@/types/admin';

export function exportCoinsToCSV(coins: Coin[], filename: string = 'coins-export.csv') {
  const headers = ['ID', 'Name', 'Year', 'Leader', 'Rarity', 'Dynasty', 'Material', 'Weight (g)', 'Diameter (mm)', 'Mint', 'Status', 'Views', 'Created At', 'Updated At'];
  
  const rows = coins.map(coin => [
    coin.id,
    `"${coin.name.replace(/"/g, '""')}"`,
    coin.year,
    coin.leader || '',
    coin.rarity,
    coin.dynasty || '',
    coin.material,
    coin.weight || '',
    coin.diameter || '',
    coin.mint || '',
    coin.status,
    coin.views,
    coin.createdAt,
    coin.updatedAt,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
