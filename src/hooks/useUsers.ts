import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';

interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUsers(): Promise<User[]> {
  const { data } = await axios.get<User[]>('/users');
  return data;
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}
