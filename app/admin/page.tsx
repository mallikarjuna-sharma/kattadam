"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Users, Package, Home, MessageSquare, Building2, Bell,
  BarChart3, CheckCircle, XCircle, Eye, TrendingUp, ArrowUpRight,
} from "lucide-react";

const STATS = [
  { label: "Total Users", value: "248", change: "+12 this week", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Active Dealers", value: "52", change: "+3 this week", icon: Package, color: "text-orange-500", bg: "bg-orange-50" },
  { label: "Listings", value: "184", change: "+8 pending", icon: Home, color: "text-green-500", bg: "bg-green-50" },
  { label: "New Enquiries", value: "37", change: "↑ 22% this week", icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50" },
];

const ENQUIRIES = [
  { id: "1", name: "Karthik S", phone: "98765XXXXX", type: "Material", subject: "Cement — Ultratech 53", status: "NEW", time: "10 min ago" },
  { id: "2", name: "Priya M", phone: "97654XXXXX", type: "Builder", subject: "Residential construction quote", status: "READ", time: "1 hr ago" },
  { id: "3", name: "Ravi K", phone: "99887XXXXX", type: "Property", subject: "3BHK rent — RS Puram", status: "RESPONDED", time: "3 hr ago" },
  { id: "4", name: "Meena A", phone: "95678XXXXX", type: "Material", subject: "TMT Steel — JSW", status: "NEW", time: "5 hr ago" },
  { id: "5", name: "Suresh P", phone: "94321XXXXX", type: "Builder", subject: "Villa construction 2400 sqft", status: "NEW", time: "8 hr ago" },
];

const PENDING = [
  { id: "1", title: "2BHK Flat — Peelamedu", type: "RENT", price: "₹12,000/mo", by: "Suresh R", time: "2 hr ago" },
  { id: "2", title: "Shop Space — Gandhipuram", type: "SELL", price: "₹45L", by: "Anita M", time: "6 hr ago" },
  { id: "3", title: "Land — Sulur", type: "SELL", price: "₹18L", by: "Bala K", time: "1 day ago" },
];

const NAV = [
  { label: "Dashboard", icon: BarChart3, href: "/admin", active: true },
  { label: "Dealers", icon: Package, href: "/admin" },
  { label: "Builders", icon: Building2, href: "/admin" },
  { label: "Properties", icon: Home, href: "/admin" },
  { label: "Enquiries", icon: MessageSquare, href: "/admin" },
  { label: "Users", icon: Users, href: "/admin" },
];

const statusStyle: Record<string, string> = {
  NEW: "bg-orange-50 text-orange-600",
  READ: "bg-earth-100 text-earth-600",
  RESPONDED: "bg-green-50 text-green-600",
};

export default function AdminPage() {
  const [pendingItems, setPendingItems] = useState(PENDING);

  const remove = (id: string) => setPendingItems(p => p.filter(x => x.id !== id));

  return (
    <div className="min-h-screen bg-earth-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 bg-earth-900 text-white flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-sm">Kattodam</div>
              <div className="text-earth-500 text-xs">Admin Panel</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(n => (
            <Link key={n.label} href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                n.active ? "bg-brand-500 text-white" : "text-earth-400 hover:bg-white/10 hover:text-white"}`}>
              <n.icon className="w-4 h-4" /> {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="text-xs text-earth-500 hover:text-white transition-colors">← Back to site</Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-earth-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-semibold text-earth-900">Dashboard</h1>
            <p className="text-xs text-earth-400">{new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 bg-earth-50 border border-earth-200 rounded-xl flex items-center justify-center">
              <Bell className="w-4 h-4 text-earth-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-white text-[10px] flex items-center justify-center">5</span>
            </button>
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-earth-300" />
                </div>
                <div className="text-2xl font-bold text-earth-900">{s.value}</div>
                <div className="text-xs text-earth-500">{s.label}</div>
                <div className="text-xs text-green-600 mt-1">{s.change}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Enquiries */}
            <div className="card">
              <div className="flex items-center justify-between p-5 border-b border-earth-100">
                <h2 className="font-semibold text-earth-900">Recent Enquiries</h2>
                <span className="text-xs text-brand-500 font-medium cursor-pointer">View all</span>
              </div>
              <div className="divide-y divide-earth-100">
                {ENQUIRIES.map(e => (
                  <div key={e.id} className="p-4 hover:bg-earth-50 transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <span className="font-medium text-sm text-earth-900">{e.name}</span>
                        <span className="text-earth-400 text-xs ml-2">{e.phone}</span>
                      </div>
                      <span className={`badge text-xs ${statusStyle[e.status]}`}>{e.status}</span>
                    </div>
                    <p className="text-xs text-earth-500">{e.type}: {e.subject}</p>
                    <p className="text-xs text-earth-400 mt-1">{e.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="card">
              <div className="flex items-center justify-between p-5 border-b border-earth-100">
                <h2 className="font-semibold text-earth-900">Pending Approvals</h2>
                <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">{pendingItems.length} pending</span>
              </div>
              <div className="divide-y divide-earth-100">
                {pendingItems.map(item => (
                  <div key={item.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm text-earth-900">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="badge bg-earth-100 text-earth-600">{item.type}</span>
                          <span className="text-xs font-bold text-earth-800">{item.price}</span>
                        </div>
                        <p className="text-xs text-earth-400 mt-1">By {item.by} · {item.time}</p>
                      </div>
                      <div className="flex gap-1.5 ml-3">
                        <button onClick={() => remove(item.id)} className="w-8 h-8 bg-green-50 hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors" title="Approve">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </button>
                        <button onClick={() => remove(item.id)} className="w-8 h-8 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors" title="Reject">
                          <XCircle className="w-4 h-4 text-red-400" />
                        </button>
                        <button className="w-8 h-8 bg-earth-50 hover:bg-earth-100 rounded-lg flex items-center justify-center transition-colors" title="View">
                          <Eye className="w-4 h-4 text-earth-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {pendingItems.length === 0 && (
                  <div className="p-8 text-center text-earth-400 text-sm">All caught up! ✓</div>
                )}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <h2 className="font-semibold text-earth-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Add Dealer", icon: Package, color: "text-orange-500", bg: "bg-orange-50" },
                { label: "Add Builder", icon: Building2, color: "text-blue-500", bg: "bg-blue-50" },
                { label: "View All Leads", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" },
                { label: "Manage Users", icon: Users, color: "text-green-500", bg: "bg-green-50" },
              ].map(a => (
                <button key={a.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-earth-200 hover:border-brand-200 hover:bg-brand-50/30 transition-colors">
                  <div className={`w-10 h-10 ${a.bg} rounded-xl flex items-center justify-center`}>
                    <a.icon className={`w-5 h-5 ${a.color}`} />
                  </div>
                  <span className="text-xs font-medium text-earth-700">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
