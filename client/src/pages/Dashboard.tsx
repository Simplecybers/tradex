import MainLayout from "@/components/layouts/MainLayout";
import AccountSummary from "@/components/dashboard/AccountSummary";
import MarketOverview from "@/components/dashboard/MarketOverview";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import Watchlist from "@/components/dashboard/Watchlist";
import TradingRecommendations from "@/components/dashboard/TradingRecommendations";

export default function Dashboard() {
  return (
    <MainLayout title="Dashboard">
      {/* Account Summary */}
      <AccountSummary />
      
      {/* Market Overview */}
      <MarketOverview />
      
      {/* Recent Transactions & Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div>
          <Watchlist />
        </div>
      </div>
      
      {/* Trading Recommendations */}
      <TradingRecommendations />
    </MainLayout>
  );
}
