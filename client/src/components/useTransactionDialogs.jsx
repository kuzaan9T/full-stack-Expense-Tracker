import { useState } from 'react';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ConfirmDialog';
import TransactionFormDialog from '@/components/TransactionFormDialog';
import { getErrorMessage } from '@/lib/api';
import { useDeleteTransaction } from '@/lib/queries';

export function useTransactionDialogs() {
  const [formState, setFormState] = useState({ open: false, transaction: null });
  const [pendingDelete, setPendingDelete] = useState(null);
  const deleteTransaction = useDeleteTransaction();

  const confirmDelete = () =>
    deleteTransaction.mutate(pendingDelete._id, {
      onSuccess: () => {
        toast.success('Transaction deleted');
        setPendingDelete(null);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });

  const dialogs = (
    <>
      <TransactionFormDialog
        open={formState.open}
        transaction={formState.transaction}
        onOpenChange={(open) => setFormState((current) => ({ ...current, open }))}
      />
      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this transaction?"
        description={pendingDelete ? `“${pendingDelete.note || pendingDelete.category}” will be removed permanently.` : undefined}
        isPending={deleteTransaction.isPending}
        onConfirm={confirmDelete}
      />
    </>
  );

  return {
    openCreate: () => setFormState({ open: true, transaction: null }),
    openEdit: (transaction) => setFormState({ open: true, transaction }),
    openDelete: setPendingDelete,
    dialogs,
  };
}
