import React, { useEffect, useMemo } from "react";
import FarmerNavabar from "./dashboard/navBar2.jsx";
import { useSupplierAnalyticsStore } from "../store/supplierAnalytics.store.js";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Download,
  IndianRupee,
  RefreshCcw,
  Search,
  Tractor,
  Wallet,
} from "lucide-react";

const formatCurrency = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

const getTrendClass = (value) => (value >= 0 ? "text-green-700" : "text-red-600");

function StatCard({ title, value, icon, helper, trend }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow flex justify-between items-center">
      <div>
        <h3 className="text-2xl font-bold overflow-x-auto text-green-700">{value}</h3>
        <p className="text-gray-600 overflow-x-auto text-sm">{title}</p>
        {helper ? <p className="mt-1 text-xs text-gray-500">{helper}</p> : null}
        {trend !== undefined ? (
          <p className={`mt-2 flex items-center gap-1 text-xs font-semibold ${getTrendClass(trend)}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}% vs last month
          </p>
        ) : null}
      </div>
      <div className="bg-green-100 overflow-x-auto rounded-lg text-green-700 p-2">
        {icon}
      </div>
    </div>
  );
}

function BreakdownBars({ title, items }) {
  const maxRevenue = Math.max(...items.map((item) => item.revenue || 0), 1);
  const visibleItems = items.slice(-8);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-green-700 mb-4">{title}</h3>
      {visibleItems.length ? (
        <div className="space-y-3">
          {visibleItems.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between text-xs text-gray-600">
                <span>{item.label}</span>
                <span>{formatCurrency(item.revenue)}</span>
              </div>
              <div className="h-2 rounded-full bg-green-100">
                <div
                  className="h-2 rounded-full bg-green-700"
                  style={{ width: `${Math.max((item.revenue / maxRevenue) * 100, 6)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-gray-500">No earnings data yet</div>
      )}
    </div>
  );
}

export default function SupplierEarnings() {
  const { analytics, loading, filters, fetchSupplierAnalytics, resetFilters } =
    useSupplierAnalyticsStore();

  useEffect(() => {
    fetchSupplierAnalytics({ page: 1 });
  }, [fetchSupplierAnalytics]);

  const topEquipment = analytics.topEquipment || [];
  const transactions = analytics.transactions?.bookings || [];
  const summary = analytics.summary || {};

  const exportRows = useMemo(
    () =>
      transactions.map((item) => ({
        equipment: item.product?.equipmentName || "Equipment",
        renter: item.farmer?.name || "Renter",
        status: item.status,
        startDate: formatDate(item.startDate),
        endDate: formatDate(item.endDate),
        amount: item.totalPrice || 0,
      })),
    [transactions]
  );

  const exportCsv = () => {
    const header = ["Equipment", "Renter", "Status", "Start Date", "End Date", "Amount"];
    const rows = exportRows.map((row) => [
      row.equipment,
      row.renter,
      row.status,
      row.startDate,
      row.endDate,
      row.amount,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "supplier-earnings.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <>
      <FarmerNavabar />
      <div className="min-h-screen bg-yellow-50 p-8 sm:p-6 lg:p-8 overflow-x-hidden text-black">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-700">Earnings History</h1>
            <p className="text-gray-600">Track payouts, revenue trends, and equipment performance</p>
          </div>
          <button
            type="button"
            onClick={exportCsv}
            className="flex items-center justify-center gap-2 rounded bg-green-700 px-5 py-2.5 text-white hover:bg-green-800"
          >
            <Download size={16} />
            Export
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Lifetime Earnings"
            value={formatCurrency(summary.totalLifetime)}
            icon={<IndianRupee />}
            helper={`${summary.totalPaidBookings || 0} paid bookings`}
          />
          <StatCard
            title="This Month"
            value={formatCurrency(summary.thisMonth)}
            icon={<Calendar />}
            trend={summary.monthlyGrowthPercent || 0}
          />
          <StatCard
            title="Last Month"
            value={formatCurrency(summary.lastMonth)}
            icon={<RefreshCcw />}
          />
          <StatCard
            title="Pending Payouts"
            value={formatCurrency(summary.pendingPayouts)}
            icon={<Wallet />}
            helper={`${summary.pendingPayoutCount || 0} approved bookings`}
          />
        </div>

        <div className="mb-6 rounded-xl bg-white p-5 shadow">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
            <input
              type="date"
              value={filters.from}
              onChange={(event) => fetchSupplierAnalytics({ from: event.target.value, page: 1 })}
              className="rounded-lg border px-4 py-3 outline-none"
            />
            <input
              type="date"
              value={filters.to}
              onChange={(event) => fetchSupplierAnalytics({ to: event.target.value, page: 1 })}
              className="rounded-lg border px-4 py-3 outline-none"
            />
            <button
              type="button"
              onClick={() => fetchSupplierAnalytics({ page: 1 })}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3 text-white"
            >
              <Search size={16} />
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                resetFilters();
                fetchSupplierAnalytics({ from: "", to: "", page: 1 });
              }}
              className="rounded-lg border border-green-700 px-4 py-3 text-green-700"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BreakdownBars title="Daily Breakdown" items={analytics.breakdowns?.daily || []} />
          <BreakdownBars title="Weekly Breakdown" items={analytics.breakdowns?.weekly || []} />
          <BreakdownBars title="Monthly Breakdown" items={analytics.breakdowns?.monthly || []} />
        </div>

        <div className="mb-6 bg-white rounded-xl shadow p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-700">Top Performing Equipment</h2>
            <span className="text-sm text-gray-500">Top 5 by revenue</span>
          </div>
          {topEquipment.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {topEquipment.map((item) => (
                <div key={item.equipmentId} className="rounded-lg border p-4 hover:bg-green-50 transition">
                  <div className="h-24 overflow-hidden rounded-lg bg-green-100">
                    {item.image ? (
                      <img src={item.image} alt={item.equipmentName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-green-700">
                        <Tractor />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 font-semibold text-black">{item.equipmentName || "Equipment"}</h3>
                  <p className="text-xs text-gray-500">{item.category || "Category"}</p>
                  <p className="mt-2 text-sm font-semibold text-green-700">{formatCurrency(item.revenue)}</p>
                  <p className="text-xs text-gray-500">{item.bookings} bookings</p>
                  <div className="mt-3 h-2 rounded-full bg-green-100">
                    <div className="h-2 rounded-full bg-green-700" style={{ width: `${item.utilization || 0}%` }} />
                  </div>
                  <p className={`mt-2 text-xs ${item.lowUsage ? "text-yellow-700" : "text-gray-500"}`}>
                    {item.lowUsage ? "Low usage alert" : `${item.utilization || 0}% utilization`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">No top equipment data yet</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-700">Booking Wise Transactions</h2>
            {loading ? <span className="text-sm text-gray-500">Loading...</span> : null}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="py-3">Equipment</th>
                  <th className="py-3">Renter</th>
                  <th className="py-3">Dates</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr key={item._id} className="border-b last:border-0 hover:bg-green-50">
                    <td className="py-4 font-medium text-black">{item.product?.equipmentName || "Equipment"}</td>
                    <td className="py-4 text-gray-600">{item.farmer?.name || "Renter"}</td>
                    <td className="py-4 text-gray-600">
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-right font-semibold text-green-700">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!transactions.length ? (
              <div className="py-8 text-center text-gray-500">No transactions found</div>
            ) : null}
          </div>
          <div className="mt-5 flex items-center justify-between text-sm text-gray-600">
            <span>
              Page {analytics.transactions?.page || 1} of{" "}
              {Math.max(Math.ceil((analytics.transactions?.total || 0) / (analytics.transactions?.limit || 10)), 1)}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={(analytics.transactions?.page || 1) <= 1}
                onClick={() => fetchSupplierAnalytics({ page: (analytics.transactions?.page || 1) - 1 })}
                className="rounded border px-4 py-2 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!analytics.transactions?.hasMore}
                onClick={() => fetchSupplierAnalytics({ page: (analytics.transactions?.page || 1) + 1 })}
                className="rounded bg-green-700 px-4 py-2 text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
