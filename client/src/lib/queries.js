import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

const MONEY_QUERY_KEYS = ['transactions', 'summary', 'budgets'];

const withoutEmptyValues = (params) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value !== 'all' && value != null));

const fetchData = (url, params) => api.get(url, { params }).then((response) => response.data);

export const useCategories = () =>
  useQuery({ queryKey: ['categories'], queryFn: () => fetchData('/categories'), staleTime: Infinity });

export const useSummary = (month) =>
  useQuery({
    queryKey: ['summary', month],
    queryFn: () => fetchData('/summary', { month }),
    placeholderData: keepPreviousData,
  });

export const useTransactions = (filters) =>
  useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => fetchData('/transactions', withoutEmptyValues(filters)),
    placeholderData: keepPreviousData,
  });

export const useBudgets = (month) =>
  useQuery({
    queryKey: ['budgets', month],
    queryFn: () => fetchData('/budgets', { month }),
    placeholderData: keepPreviousData,
  });

const useMoneyMutation = (mutationFn) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => Promise.all(MONEY_QUERY_KEYS.map((key) => client.invalidateQueries({ queryKey: [key] }))),
  });
};

export const useSaveTransaction = () =>
  useMoneyMutation(({ id, ...values }) =>
    (id ? api.put(`/transactions/${id}`, values) : api.post('/transactions', values)).then((response) => response.data)
  );

export const useDeleteTransaction = () =>
  useMoneyMutation((id) => api.delete(`/transactions/${id}`).then((response) => response.data));

export const useSaveBudget = () =>
  useMoneyMutation(({ id, ...values }) =>
    (id ? api.put(`/budgets/${id}`, values) : api.post('/budgets', values)).then((response) => response.data)
  );

export const useDeleteBudget = () =>
  useMoneyMutation((id) => api.delete(`/budgets/${id}`).then((response) => response.data));
