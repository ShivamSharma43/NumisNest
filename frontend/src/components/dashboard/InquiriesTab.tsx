import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Clock, CheckCircle, XCircle, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { inquiryService } from '@/services/inquiryService';
import type { Inquiry } from '@/types';

const InquiriesTab = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { loadInquiries(); }, []);

  const loadInquiries = async () => {
    try {
      setIsLoading(true);
      const data = await inquiryService.getUserInquiries();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
      setInquiries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id);

  // BUG FIX: handle ALL possible status values (backend uses pending/responded/closed,
  // admin can set new/contacted/closed). Always return a valid config.
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
      case 'new':
        return { label: 'Pending', Icon: Clock, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      case 'responded':
      case 'contacted':
        return { label: 'Responded', Icon: CheckCircle, className: 'bg-green-100 text-green-800 border-green-200' };
      case 'closed':
        return { label: 'Closed', Icon: XCircle, className: 'bg-muted text-muted-foreground border-border' };
      default:
        return { label: status || 'Pending', Icon: Clock, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const diffInDays = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-heading flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            My Inquiries
          </CardTitle>
          <CardDescription>
            {inquiries.length} inquir{inquiries.length !== 1 ? 'ies' : 'y'} sent
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No inquiries yet</h3>
              <p className="text-muted-foreground mb-4">Have questions about a coin? Send an inquiry from the coin details page.</p>
              <Button asChild><Link to="/coins">Browse Coins</Link></Button>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry, index) => {
                const { label, Icon, className } = getStatusConfig(inquiry.status);
                const isExpanded = expandedId === inquiry._id;

                return (
                  <motion.div
                    key={inquiry._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-lg border border-border/50 overflow-hidden"
                  >
                    <div
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleExpand(inquiry._id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{inquiry.coinName}</h3>
                          <Badge className={className}>
                            <Icon className="w-3 h-3 mr-1" />
                            {label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{formatDate(inquiry.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                          <Link to={`/coins/${inquiry.coinId}`}>
                            <Eye className="w-4 h-4 mr-1" />View Coin
                          </Link>
                        </Button>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 border-t border-border/50 bg-background">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Your Message:</h4>
                            <p className="text-foreground bg-muted/30 p-3 rounded-md">{inquiry.message}</p>
                            {(inquiry.status === 'responded' || inquiry.status === 'contacted') && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">Response:</h4>
                                <p className="text-foreground bg-primary/10 p-3 rounded-md border border-primary/20">
                                  Thank you for your interest! Our team has reviewed your inquiry and will contact you via email.
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InquiriesTab;
