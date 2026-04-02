import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CoinTableRow } from './CoinTableRow';
import type { Coin } from '@/types/admin';

export type SortField = 'name' | 'year' | 'leader' | 'rarity' | 'status' | 'views';
export type SortDirection = 'asc' | 'desc';

interface CoinTableProps {
  coins: Coin[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEdit: (coin: Coin) => void;
  onDelete: (coin: Coin) => void;
  onTogglePublish: (coin: Coin) => void;
}

function SortIcon({ field, currentField, direction }: { field: SortField; currentField: SortField; direction: SortDirection }) {
  if (field !== currentField) {
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  }
  return direction === 'asc' ? (
    <ArrowUp className="ml-2 h-4 w-4" />
  ) : (
    <ArrowDown className="ml-2 h-4 w-4" />
  );
}

export function CoinTable({
  coins,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onTogglePublish,
}: CoinTableProps) {
  const headers: { label: string; field: SortField }[] = [
    { label: 'Name', field: 'name' },
    { label: 'Year', field: 'year' },
    { label: 'Leader', field: 'leader' },
    { label: 'Rarity', field: 'rarity' },
    { label: 'Status', field: 'status' },
    { label: 'Views', field: 'views' },
  ];

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            {headers.map(({ label, field }) => (
              <TableHead key={field}>
                <Button
                  variant="ghost"
                  onClick={() => onSort(field)}
                  className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
                >
                  {label}
                  <SortIcon field={field} currentField={sortField} direction={sortDirection} />
                </Button>
              </TableHead>
            ))}
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.length === 0 ? (
            <TableRow>
              <td colSpan={7} className="h-24 text-center text-muted-foreground">
                No coins found
              </td>
            </TableRow>
          ) : (
            coins.map((coin) => (
              <CoinTableRow
                key={coin._id || coin.id || coin.name}
                coin={coin}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePublish={onTogglePublish}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
