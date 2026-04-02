import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CoinFilters } from '@/components/coins/CoinFilters';
import { CoinTable, type SortField, type SortDirection } from '@/components/coins/CoinTable';
import { CoinPagination } from '@/components/coins/CoinPagination';
import { DeleteCoinDialog } from '@/components/coins/DeleteCoinDialog';
import { CoinFormDialog } from '@/components/coins/form/CoinFormDialog';
import { useCoins, useCreateCoin, useUpdateCoin, useDeleteCoin, useToggleCoinPublish } from '@/hooks/useCoins';
import { exportCoinsToCSV } from '@/lib/exportCsv';
import { toast } from 'sonner';
import type { Coin } from '@/types/admin';
import type { CoinFormData } from '@/lib/coinFormSchema';

const ITEMS_PER_PAGE = 8;

export default function ManageCoins() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [coinToDelete, setCoinToDelete] = useState<Coin | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [coinToEdit, setCoinToEdit] = useState<Coin | null>(null);

  // API hooks
  const { data: coinsResponse, isLoading, error } = useCoins({
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    material: materialFilter !== 'all' ? materialFilter : undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortField,
    sortDirection,
  });

  const createCoin = useCreateCoin();
  const updateCoin = useUpdateCoin();
  const deleteCoin = useDeleteCoin();
  const togglePublish = useToggleCoinPublish();

  // Get coins from response or empty array
  const coins = coinsResponse?.data || [];
  const totalPages = coinsResponse?.totalPages || 1;
  const totalItems = coinsResponse?.total || 0;

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleMaterialChange = (value: string) => {
    setMaterialFilter(value);
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (coin: Coin) => {
    setCoinToEdit(coin);
    setFormDialogOpen(true);
  };

  const handleDelete = (coin: Coin) => {
    setCoinToDelete(coin);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (coinToDelete) {
      try {
        await deleteCoin.mutateAsync(coinToDelete._id || coinToDelete.id);
        toast.success(`"${coinToDelete.name}" has been deleted`);
        setDeleteDialogOpen(false);
        setCoinToDelete(null);
      } catch (error) {
        toast.error('Failed to delete coin');
      }
    }
  };

  const handleTogglePublish = async (coin: Coin) => {
    const newStatus = coin.status === 'published' ? 'draft' : 'published';
    try {
      await togglePublish.mutateAsync({ id: coin._id || coin.id, status: newStatus });
      toast.success(
        `"${coin.name}" has been ${newStatus === 'published' ? 'published' : 'unpublished'}`
      );
    } catch (error) {
      toast.error('Failed to update coin status');
    }
  };

  const handleExport = () => {
    exportCoinsToCSV(coins, `coins-export-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`Exported ${coins.length} coins to CSV`);
  };

  const handleAddCoin = () => {
    setCoinToEdit(null);
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async (data: CoinFormData, status: 'draft' | 'published') => {
    try {
      const coinData = {
        name: data.name,
        year: data.year,
        denomination: data.denomination,
        leader: data.leader,
        rarity: data.rarity as 1 | 2 | 3 | 4 | 5,
        dynasty: data.dynasty,
        material: data.material,
        weight: data.weight,
        diameter: data.diameter,
        mint: data.mint,
        description: data.description,
        historicalContext: data.historicalContext,
        imageUrl: data.imageUrl,
        status,
      };
      
      if (coinToEdit) {
        await updateCoin.mutateAsync({
          id: coinToEdit._id || coinToEdit.id,
          data: coinData,
        });
        toast.success(`"${data.name}" has been updated`);
      } else {
        await createCoin.mutateAsync(coinData);
        toast.success(`"${data.name}" has been ${status === 'published' ? 'published' : 'saved as draft'}`);
      }
      setCoinToEdit(null);
      setFormDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save coin');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Failed to load coins. Please try again.</p>
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
          <h1 className="text-2xl lg:text-3xl font-bold">Manage Coins</h1>
          <p className="text-muted-foreground mt-1">
            Curate and manage your numismatic collection
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} disabled={coins.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleAddCoin}>
            <Plus className="h-4 w-4 mr-2" />
            Add Coin
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CoinFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          materialFilter={materialFilter}
          onMaterialChange={handleMaterialChange}
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
            <CoinTable
              coins={coins}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
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

      <DeleteCoinDialog
        coin={coinToDelete}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />

      <CoinFormDialog
        open={formDialogOpen}
        onClose={() => {
          setFormDialogOpen(false);
          setCoinToEdit(null);
        }}
        onSubmit={handleFormSubmit}
        coin={coinToEdit}
      />
    </div>
  );
}
