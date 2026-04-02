import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InquiryTableRow } from './InquiryTableRow';
import type { Inquiry } from '@/types/admin';

export type InquirySortField = 'userName' | 'subject' | 'coinName' | 'status' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

interface InquiryTableProps {
  inquiries: Inquiry[];
  sortField: InquirySortField;
  sortDirection: SortDirection;
  onSort: (field: InquirySortField) => void;
  onView: (inquiry: Inquiry) => void;
  onStatusChange: (inquiry: Inquiry, status: Inquiry['status']) => void;
}

function SortIcon({ field, currentField, direction }: { field: InquirySortField; currentField: InquirySortField; direction: SortDirection }) {
  if (field !== currentField) {
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  }
  return direction === 'asc' ? (
    <ArrowUp className="ml-2 h-4 w-4" />
  ) : (
    <ArrowDown className="ml-2 h-4 w-4" />
  );
}

export function InquiryTable({
  inquiries,
  sortField,
  sortDirection,
  onSort,
  onView,
  onStatusChange,
}: InquiryTableProps) {
  const headers: { label: string; field: InquirySortField }[] = [
    { label: 'From', field: 'userName' },
    { label: 'Subject', field: 'subject' },
    { label: 'Coin', field: 'coinName' },
    { label: 'Status', field: 'status' },
    { label: 'Date', field: 'createdAt' },
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
          {inquiries.length === 0 ? (
            <TableRow>
              <td colSpan={6} className="h-24 text-center text-muted-foreground">
                No inquiries found
              </td>
            </TableRow>
          ) : (
            inquiries.map((inquiry) => (
              <InquiryTableRow
                key={inquiry._id || inquiry.id}
                inquiry={inquiry}
                onView={onView}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
