export interface StatCard {
  icon: string;
  label: string;
  value: string | number;
  trend: number;
  trendLabel: string;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface CategoryData {
  category: string;
  value: number;
  color: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  attendees: number;
  status: 'active' | 'pending' | 'completed';
}

export interface Transaction {
  id: string;
  userName: string;
  amount: number;
  date: string;
  type: 'debit' | 'credit';
}

export interface DashboardData {
  stats: StatCard[];
  revenueChart: ChartDataPoint[];
  categoryChart: CategoryData[];
  recentEvents: Event[];
  recentTransactions: Transaction[];
}
