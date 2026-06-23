import React, { useState, useEffect } from "react";
import { BarChart3, Users, DollarSign, Receipt, Settings, Ban, RefreshCw, Layers, ShieldCheck, AlertCircle, Lock, ShieldAlert } from "lucide-react";
import { AdminStats, Order } from "../types";

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStr, setErrorStr] = useState("");
  const [refundProcessingId, setRefundProcessingId] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState("");

  const fetchStats = async () => {
    setIsLoading(true);
    setErrorStr("");
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        const data = await res.json();
        setErrorStr(data.error || "Failed to load admin stats");
      }
    } catch {
      setErrorStr("Network connection failed to read administrative endpoints.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAdminAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });
      if (res.ok) {
        setAdminPassword("");
        setAuthError("");
        setErrorStr(""); // Clear permission errors!
        await fetchStats();
      } else {
        const data = await res.json();
        setAuthError(data.error || "Incorrect administrative credentials.");
      }
    } catch {
      setAuthError("Network exception checking credentials.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSimulateRefund = async (orderId: string) => {
    setRefundProcessingId(orderId);
    try {
      const res = await fetch("/api/admin/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        // Reload stats context
        await fetchStats();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefundProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-white font-mono space-y-4">
        <div className="w-8 h-8 rounded-none border-2 border-brand-orange border-t-transparent animate-spin" />
        <span className="text-xs uppercase tracking-widest text-[#F5F5F5]">Syncing Admin Cockpit Data Telemetry...</span>
      </div>
    );
  }

  if (errorStr) {
    return (
      <div className="max-w-md mx-auto my-12 animate-fade-in" id="admin-password-gate">
        <div className="bg-brand-black border border-white/10 p-8 shadow-2xl relative text-left space-y-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Lock className="w-5 h-5 text-brand-orange animate-pulse" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Cockpit Admin Terminal Locked</h3>
          </div>
          
          <p className="text-xs text-white/60 leading-relaxed font-sans">
            Please enter your administrative access password to unlock live billing metrics, database stats, webhook simulators, and analytics logs.
          </p>

          <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1.5" id="admin-password-label" htmlFor="admin-security-pass">
                Administrative Password
              </label>
              <input
                id="admin-security-pass"
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="•••••••••••••••••••••"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-orange rounded-none font-mono tracking-widest"
              />
            </div>

            {authError && (
              <p className="text-red-500 font-mono text-[10px] uppercase tracking-wide bg-red-500/5 border border-red-500/10 p-2.5">
                ⚠ {authError}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-grow py-3 bg-brand-orange text-black font-black uppercase text-[10px] tracking-wider hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? "Verifying Keys..." : "Unlock Terminal"}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-3 border border-white/10 text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Calculate percentage ratios
  const conversionRate = stats ? ((stats.paidOrders / Math.max(1, stats.totalOrders)) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in text-left" id="admin-dashboard-root">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-brand-orange animate-spin-slow" />
          <div>
            <h1 className="text-xl font-black uppercase italic tracking-tighter text-white">Cockpit Terminal</h1>
            <p className="text-xs text-white/50 lowercase font-mono">live service state, revenue telemetry and webhook simulators.</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-6 py-3 border border-white/10 hover:border-white text-white font-bold uppercase text-xs rounded-none transition cursor-pointer"
        >
          ← Back to Hub
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white/5 border border-white/10 p-6 rounded-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-brand-orange" />
          </div>
          <div className="text-2xl font-black tracking-tighter text-white uppercase italic">₹{stats?.revenue}.00</div>
          <span className="text-[9px] text-white/40 font-mono uppercase tracking-wide">Accumulated INR from Cashfree PG</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Registered Users</span>
            <Users className="w-5 h-5 text-brand-orange" />
          </div>
          <div className="text-2xl font-black tracking-tighter text-white uppercase italic">{stats?.totalUsers}</div>
          <span className="text-[9px] text-white/40 font-mono uppercase tracking-wide">Unique accounts saved</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Total Orders</span>
            <Receipt className="w-5 h-5 text-brand-orange" />
          </div>
          <div className="text-2xl font-black tracking-tighter text-white uppercase italic">{stats?.totalOrders}</div>
          <span className="text-[9px] text-white/40 font-mono uppercase tracking-wide">{stats?.paidOrders} PAID orders ({conversionRate}% CR)</span>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-none">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Gateway Link</span>
            {stats?.cashfreeStatus.isConfigured ? (
              <ShieldCheck className="w-5 h-5 text-brand-orange" />
            ) : (
              <AlertCircle className="w-5 h-5 text-brand-orange" />
            )}
          </div>
          <div className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 leading-none h-[32px] font-mono">
            {stats?.cashfreeStatus.isConfigured ? (
              <span className="text-brand-orange flex items-center gap-1">● Real Integration</span>
            ) : (
              <span className="text-brand-orange/60 flex items-center gap-1">💳 Sandbox Preview</span>
            )}
          </div>
          <span className="text-[9px] text-white/40 font-mono uppercase tracking-wide">env: {stats?.cashfreeStatus.environment}</span>
        </div>
      </div>

      {/* Main stats layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Orders history */}
        <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-none p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between mb-2 pb-4 border-b border-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#F5F5F5] flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-orange" />
              Recent Service Transactions
            </h3>
            <button
              onClick={fetchStats}
              className="p-1.5 hover:bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-none transition cursor-pointer"
              title="Refresh Logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/10 text-white/40 font-mono uppercase text-[9px] tracking-widest">
                  <th className="pb-3 pt-1">User Info</th>
                  <th className="pb-3 pt-1">Plan</th>
                  <th className="pb-3 pt-1">Cashfree ID</th>
                  <th className="pb-3 pt-1">Status</th>
                  <th className="pb-3 pt-1">Date</th>
                  <th className="pb-3 pt-1 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                {(stats?.recentOrders || []).map((o) => (
                  <tr key={o.id} className="text-[#F5F5F5]">
                    <td className="py-4">
                      <div className="font-extrabold text-white">@{o.username}</div>
                      <div className="text-[9px] text-white/40 font-mono">{o.id}</div>
                    </td>
                    <td className="py-4 font-bold text-brand-orange uppercase">{o.plan}</td>
                    <td className="py-4 text-white/60">{o.cashfreeOrderId || "N/A"}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 text-[9px] uppercase font-black tracking-wider ${
                        o.status === "PAID" ? "bg-brand-orange/15 text-brand-orange border border-brand-orange/20" :
                        o.status === "PENDING" ? "bg-white/5 text-white/50 border border-white/10" :
                        o.status === "REFUNDED" ? "bg-white/10 text-white/85 border border-white/20" :
                        "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 text-white/40">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right">
                      {o.status === "PAID" ? (
                        <button
                          onClick={() => handleSimulateRefund(o.id)}
                          disabled={refundProcessingId === o.id}
                          className="px-3 py-1.5 bg-brand-orange hover:bg-brand-orange/90 text-black font-black uppercase text-[9px] tracking-wider transition disabled:opacity-50 cursor-pointer"
                        >
                          {refundProcessingId === o.id ? "Refunding..." : "Refund ₹" + o.amount}
                        </button>
                      ) : (
                        <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">No Actions</span>
                      )}
                    </td>
                  </tr>
                ))}
                {(stats?.recentOrders || []).length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-white/40 font-mono">
                      No active orders registered in database yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side charts representation */}
        <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-none p-6 shadow-2xl space-y-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#F5F5F5] mb-6 font-mono flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-brand-orange" />
              Plan Metric Share
            </h3>
            
            {/* Visual breakdown widget representing the unified Premium tier */}
            <div className="space-y-4 font-mono">
              {[
                { name: "Premium Plan (Free)", value: (stats?.recentOrders || []).filter(o => o.status === "PAID").length, amount: 0, color: "bg-brand-orange" }
              ].map((tier, idx) => {
                const totalCount = stats?.totalOrders || 1;
                const percentage = (((stats?.recentOrders || []).filter(o => o.status === "PAID").length / totalCount) * 100).toFixed(0);
                return (
                  <div key={idx} className="space-y-1.5 text-xs text-white/80">
                    <div className="flex items-center justify-between uppercase text-[10px]">
                      <span className="font-extrabold text-[#F5F5F5]">{tier.name}</span>
                      <span className="text-white/40">
                        {tier.value} sold ({stats?.recentOrders ? Math.round(((stats.recentOrders.filter(o => o.status === "PAID").length) / Math.max(1, stats.recentOrders.length)) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#111] rounded-none h-1.5 overflow-hidden border border-white/5">
                      <div
                        className={`${tier.color} h-full`}
                        style={{ width: `100%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#F5F5F5] mb-4 font-mono">System Broadcast Feed</h4>
            <div className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1">
              {(stats?.recentPayments || []).map((pay) => (
                <div key={pay.id} className="flex items-start gap-2.5 text-[11px] font-mono">
                  <div className="w-1.5 h-1.5 bg-brand-orange mt-1.5 shrink-0" />
                  <div className="text-left leading-relaxed">
                    <p className="text-white/80">
                      <b className="text-[#F5F5F5] uppercase">₹{pay.amount} PAID:</b> via {pay.method} pg.
                    </p>
                    <span className="text-[9px] text-white/40 uppercase">TXN: {pay.transactionId}</span>
                  </div>
                </div>
              ))}
              {(stats?.recentPayments || []).length === 0 && (
                <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider">Awaiting dynamic activities...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
