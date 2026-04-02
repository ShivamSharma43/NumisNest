import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { InquiryFilters } from '@/components/inquiries/InquiryFilters';
import { InquiryTable, type InquirySortField, type SortDirection } from '@/components/inquiries/InquiryTable';
import { InquiryViewDialog } from '@/components/inquiries/InquiryViewDialog';
import { EmailReplyDialog } from '@/components/inquiries/EmailReplyDialog';
import { CoinPagination } from '@/components/coins/CoinPagination';
import { useInquiries, useUpdateInquiryStatus } from '@/hooks/useInquiries';
import { inquiriesApi } from '@/lib/api/inquiries';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Inquiry } from '@/types/admin';

const ITEMS_PER_PAGE = 8;

export default function ManageInquiries() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<InquirySortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // API hooks
  const { data: inquiriesResponse, isLoading, error } = useInquiries({
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortField,
    sortDirection,
  });

  const updateStatus = useUpdateInquiryStatus();
  const queryClient = useQueryClient();

  // Get inquiries from response or empty array
  const inquiries = inquiriesResponse?.data || [];
  const totalPages = inquiriesResponse?.totalPages || 1;
  const totalItems = inquiriesResponse?.total || 0;

  // Calculate stats from current data
  const stats = {
    total: totalItems,
    new: inquiries.filter((i) => i.status === 'new').length,
    contacted: inquiries.filter((i) => i.status === 'contacted').length,
    closed: inquiries.filter((i) => i.status === 'closed').length,
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSort = (field: InquirySortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleView = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setViewDialogOpen(true);
  };

  const handleReply = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setEmailDialogOpen(true);
  };

  const handleEmailSent = async (inquiryId: string) => {
    try {
      await updateStatus.mutateAsync({ id: inquiryId, status: 'contacted' });
    } catch (error) {
      // Error handled silently - email was sent
    }
  };


  const handleDeleteClosed = async (inquiry: Inquiry) => {
    try {
      const id = inquiry._id || inquiry.id || '';
      await inquiriesApi.delete(id);
      toast.success('Closed inquiry removed');
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    } catch {
      toast.error('Failed to delete inquiry');
    }
  };

  const handleStatusChange = async (inquiry: Inquiry, newStatus: Inquiry['status']) => {
    try {
      await updateStatus.mutateAsync({ id: inquiry._id || inquiry.id || '', status: newStatus });
      if (newStatus === 'closed') {
        // Auto-delete closed inquiries from DB after brief delay
        setTimeout(() => handleDeleteClosed(inquiry), 800);
        toast.success('Inquiry closed and will be removed');
      } else {
        toast.success(`Inquiry marked as ${newStatus}`);
      }
    } catch (error) {
      toast.error('Failed to update inquiry status');
    }
  };

  const handleDialogStatusChange = async (inquiryId: string, newStatus: Inquiry['status']) => {
    try {
      await updateStatus.mutateAsync({ id: inquiryId, status: newStatus });
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success(`Inquiry marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update inquiry status');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Failed to load inquiries. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Manage Inquiries</h1>
          <p className="text-muted-foreground mt-1">
            Track and respond to user inquiries
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.new}</p>
              <p className="text-xs text-muted-foreground">New</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Mail className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.contacted}</p>
              <p className="text-xs text-muted-foreground">Contacted</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-500/10">
              <CheckCircle className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.closed}</p>
              <p className="text-xs text-muted-foreground">Closed</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <InquiryFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusFilterChange}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <InquiryTable
              inquiries={inquiries}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onView={handleView}
              onStatusChange={handleStatusChange}
            />

            {totalPages > 1 && (
              <CoinPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </motion.div>

      <InquiryViewDialog
        inquiry={selectedInquiry}
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        onStatusChange={handleDialogStatusChange}
        onReply={handleReply}
      />

      <EmailReplyDialog
        inquiry={selectedInquiry}
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        onSent={handleEmailSent}
      />
    </div>
  );
}
