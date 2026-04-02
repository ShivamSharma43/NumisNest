import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CoinFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  materialFilter: string;
  onMaterialChange: (value: string) => void;
}

const materials = [
  { value: 'all', label: 'All Materials' },
  { value: 'Gold', label: 'Gold' },
  { value: 'Silver', label: 'Silver' },
  { value: 'Bronze', label: 'Bronze' },
  { value: 'Copper', label: 'Copper' },
  { value: 'Electrum', label: 'Electrum' },
  { value: 'Platinum', label: 'Platinum' },
  { value: 'Nickel', label: 'Nickel' },
];

const statuses = [
  { value: 'all', label: 'All Status' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

export function CoinFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  materialFilter,
  onMaterialChange,
}: CoinFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search coins..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background border-border"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[160px] bg-background border-border">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={materialFilter} onValueChange={onMaterialChange}>
        <SelectTrigger className="w-full sm:w-[160px] bg-background border-border">
          <SelectValue placeholder="Material" />
        </SelectTrigger>
        <SelectContent>
          {materials.map((material) => (
            <SelectItem key={material.value} value={material.value}>
              {material.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
