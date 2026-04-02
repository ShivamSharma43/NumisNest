import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, User, Calendar, Coins, MessageSquare, ExternalLink } from 'lucide-react';
import type { Inquiry } from '@/types/admin';
import { format } from 'date-fns';

interface InquiryViewDialogProps {
  inquiry: Inquiry | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (inquiryId: string, status: Inquiry['status']) => void;
  onReply: (inquiry: Inquiry) => void;
}

const statusColors: Record<string, string> = {
  new: 'bg-primary/20 text-primary border-primary/30',
  contacted: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  closed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const statusLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  closed: 'Closed',
};

export function InquiryViewDialog({ inquiry, open, onClose, onStatusChange, onReply }: InquiryViewDialogProps) {
  if (!inquiry) return null;

  const formattedDate = format(new Date(inquiry.createdAt), 'PPP \'at\' p');

  const handleReply = () => {
    onReply(inquiry);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl">{inquiry.subject}</DialogTitle>
            <Badge variant="outline" className={statusColors[inquiry.status]}>
              {statusLabels[inquiry.status]}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-medium">{inquiry.userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a href={`mailto:${inquiry.userEmail}`} className="font-medium text-primary hover:underline">
                  {inquiry.userEmail}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Received</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>
            {inquiry.coinName && (
              <div className="flex items-center gap-3">
                <Coins className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Related Coin</p>
                  <p className="font-medium">{inquiry.coinName}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Message */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Message</h3>
            </div>
            <div className="p-4 rounded-lg bg-background border">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Update Status:</span>
              <Select
                value={inquiry.status}
                onValueChange={(value) => onStatusChange(inquiry.id, value as Inquiry['status'])}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="outline" asChild>
                <a href={`mailto:${inquiry.userEmail}?subject=Re: ${inquiry.subject}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Mail App
                </a>
              </Button>
              <Button onClick={handleReply}>
                <Mail className="h-4 w-4 mr-2" />
                Reply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
