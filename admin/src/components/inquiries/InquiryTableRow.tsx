import { Eye, MoreHorizontal, Mail, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Inquiry } from '@/types/admin';
import { formatDistanceToNow } from 'date-fns';

interface InquiryTableRowProps {
  inquiry: Inquiry;
  onView: (inquiry: Inquiry) => void;
  onStatusChange: (inquiry: Inquiry, status: Inquiry['status']) => void;
}

const statusColors: Record<string, string> = {
  new:       'bg-primary/20 text-primary border-primary/30',
  pending:   'bg-primary/20 text-primary border-primary/30',
  contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  responded: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  closed:    'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const statusLabels: Record<string, string> = {
  new: 'New', pending: 'Pending',
  contacted: 'Contacted', responded: 'Responded',
  closed: 'Closed',
};

export function InquiryTableRow({ inquiry, onView, onStatusChange }: InquiryTableRowProps) {
  const timeAgo = formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true });
  // BUG FIX: backend uses userEmail, not userName/subject
  const displayName = inquiry.userName || inquiry.userEmail?.split('@')[0] || 'Unknown';
  const displaySubject = inquiry.subject || inquiry.coinName || 'Coin Inquiry';

  return (
    <TableRow className="hover:bg-muted/30 cursor-pointer" onClick={() => onView(inquiry)}>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium capitalize">{displayName}</span>
          <span className="text-xs text-muted-foreground">{inquiry.userEmail}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium line-clamp-1">{displaySubject}</span>
          <span className="text-xs text-muted-foreground line-clamp-1">{inquiry.message}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{inquiry.coinName || '—'}</TableCell>
      <TableCell>
        <Badge variant="outline" className={statusColors[inquiry.status] || ''}>
          {statusLabels[inquiry.status] || inquiry.status}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">{timeAgo}</TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onView(inquiry)}>
              <Eye className="mr-2 h-4 w-4" />View Details
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`mailto:${inquiry.userEmail}?subject=Re: ${displaySubject}`}>
                <Mail className="mr-2 h-4 w-4" />Reply via Email
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusChange(inquiry, 'new')} disabled={inquiry.status === 'new' || inquiry.status === 'pending'}>
              <Clock className="mr-2 h-4 w-4" />Mark as New
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(inquiry, 'contacted')} disabled={inquiry.status === 'contacted' || inquiry.status === 'responded'}>
              <CheckCircle className="mr-2 h-4 w-4" />Mark as Contacted
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(inquiry, 'closed')} disabled={inquiry.status === 'closed'}>
              <XCircle className="mr-2 h-4 w-4" />Mark as Closed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
