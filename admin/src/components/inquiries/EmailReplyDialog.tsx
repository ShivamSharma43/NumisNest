import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Inquiry } from '@/types/admin';
import { inquiriesApi } from '@/lib/api/inquiries';
import { useQueryClient } from '@tanstack/react-query';

interface EmailReplyDialogProps {
  inquiry: Inquiry | null;
  open: boolean;
  onClose: () => void;
  onSent: (inquiryId: string) => void;
}

export function EmailReplyDialog({ inquiry, open, onClose, onSent }: EmailReplyDialogProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && inquiry) {
      setSubject(`Re: Inquiry about ${inquiry.coinName || 'your coin'}`);
      setMessage(
        `Dear Customer,\n\nThank you for your inquiry about "${inquiry.coinName}".\n\n` +
        `[Write your response here]\n\n` +
        `Best regards,\nNumisNest Team\nofficial.numisnest@gmail.com`
      );
    }
  }, [open, inquiry]);

  const handleSend = async () => {
    if (!inquiry) return;
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }
    setSending(true);
    try {
      const id = inquiry._id || inquiry.id || '';
      await inquiriesApi.sendReply(id, subject, message);
      toast.success(`Reply sent to ${inquiry.userEmail} — status updated to Contacted`);
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      onSent(id);
      setSubject(''); setMessage('');
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Failed to send email';
      if (msg.includes('App Password') || msg.includes('MAIL_PASS')) {
        toast.error('Email not configured. Set MAIL_PASS in backend/.env to a Gmail App Password.');
      } else {
        toast.error(msg);
      }
    } finally {
      setSending(false);
    }
  };

  if (!inquiry) return null;

  // BUG FIX: show user's name derived from email if userName not available
  const displayName = inquiry.userName || inquiry.userEmail?.split('@')[0] || 'Customer';

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />Reply to Inquiry
          </DialogTitle>
          <DialogDescription>Send an email response to {displayName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-muted/30 text-sm">
            <div><span className="text-muted-foreground">To: </span><span className="font-medium">{inquiry.userEmail}</span></div>
            <div><span className="text-muted-foreground">From: </span><span className="font-medium">official.numisnest@gmail.com</span></div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Write your reply..." className="min-h-[200px] resize-none" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose} disabled={sending}>Cancel</Button>
            <Button onClick={handleSend} disabled={sending}>
              {sending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</> : <><Send className="h-4 w-4 mr-2" />Send Email</>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
