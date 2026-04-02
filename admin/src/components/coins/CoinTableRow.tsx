import { Edit, Trash2, Eye, EyeOff, MoreHorizontal, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Coin } from '@/types/admin';

interface CoinTableRowProps {
  coin: Coin;
  onEdit: (coin: Coin) => void;
  onDelete: (coin: Coin) => void;
  onTogglePublish: (coin: Coin) => void;
}

const statusColors: Record<string, string> = {
  published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  draft: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  archived: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const statusLabels: Record<string, string> = {
  published: 'Published',
  draft: 'Draft',
  archived: 'Archived',
};

function RarityStars({ rarity }: { rarity: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= rarity
              ? 'fill-primary text-primary'
              : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

export function CoinTableRow({ coin, onEdit, onDelete, onTogglePublish }: CoinTableRowProps) {
  return (
    <TableRow className="hover:bg-muted/30">
      <TableCell className="font-medium">{coin.name}</TableCell>
      <TableCell>{coin.year}</TableCell>
      <TableCell className="text-muted-foreground">{coin.leader || '—'}</TableCell>
      <TableCell>
        <RarityStars rarity={coin.rarity} />
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={statusColors[coin.status] || ''}>
          {statusLabels[coin.status] || coin.status}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">{coin.views.toLocaleString()}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit(coin)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTogglePublish(coin)}>
              {coin.status === 'published' ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Publish
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(coin)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
