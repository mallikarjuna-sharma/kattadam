"use client";

// app/admin/page.tsx — Admin Dashboard

import { useState } from "react";
import Link from "next/link";
import {
  Users, Package, Home, MessageSquare, TrendingUp,
  CheckCircle, XCircle, Clock, Building2, Bell,
  BarChart3, ArrowUpRight, Eye
} from "lucide-react";

const STATS = [
  { label: "Total Users", value: "248", change: "+12 this week", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Active Dealers", value: "52", change: "+3 this week", icon: Package, color: "text-orange-500", bg: "bg-orange-50" },
  { label: "Listings", value: "184", change: "+8 pending", icon: Home, color: "text-green-500", bg: "bg-green-50" },
  { label: "New Enquiries", value: "37", change: "↑ 22% this week", icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50" },
];

const RECENT_ENQUIRIES = [
  { id: "1", name: "Karthik S", phone: "98765XXXXX", type: "Material", subject: "Cement - Ultratech 53", status: "NEW", time: "10 min ago" },
  { id: "2", name: "Priya M", phone: "97654XXXXX", type: "Builder", subject: "Residential construction quote", status: "READ", time: "1 hr ago" },
  { id: "3", name: "Ravi K", phone: "99887XXXXX", type: "Property", subject: "3BHK rent - RS Puram", status: "RESPONDED", time: "3 hr ago" },
  { id: "4", name: "Meena A", phone: "95678XXXXX", type: "Material", subject: "TMT Steel - JSW", status: "NEW", time: "5 hr ago" },
];

const PENDING_LISTINGS = [
  { id: "1", title: "2BHK Flat - Peelamedu", type: "RENT", price: "₹12,000/mo", submittedBy: "Suresh R", time: "2 hr ago" },
  { id: "2", title: "Shop Space - Gandhipuram", type: "SELL", price: "₹45L", submittedBy: "Anita M", time: "6 hr ago" },
  { id: "3", title: "Land - Sulur", type: "SELL", price: "₹18L", submittedBy: "Bala K", time: "1 day ago" },
];

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: BarChart3, active: true },
  { label: "Dealers", href: "/admin/dealers", icon: Package },
  { label: "Builders", href: "/admin/builders", icon: Building2 },
  { label: "Properties", href: "/admin/properties", icon: Home },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { label: "Users", href: "/admin/users", icon: Users },
];

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-earth-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 bg-earth-900 text-white flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-sm">Kattodam</div>
              <div className="text-earth-500 text-xs">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                item.active
                  ? "bg-brand-500 text-white"
                  : "text-earth-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="text-xs text-earth-500 hover:text-white transition-colors">
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-earth-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-semibold text-earth-900">Dashboard</h1>
            <p className="text-xs text-earth-500">Coimbatore — Today, {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 bg-earth-50 border border-earth-200 rounded-xl flex items-center justify-center hover:bg-earth-100 transition-colors">
              <Bell className="w-4 h-4 text-earth-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full text-white text-[10px] flex items-center justify-center">5</span>
            </button>
            <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-earth-300" />
                </div>
                <div className="text-2xl font-bold text-earth-900 mb-0.5">{stat.value}</div>
                <div className="text-xs text-earth-500">{stat.label}</div>
                <div className="text-xs text-green-600 mt-1">{stat.change}</div>
              </div>
            ))}
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Enquiries */}
            <div className="card">
              <div className="flex items-center justify-between p-5 border-b border-earth-100">
                <h2 className="font-semibold text-earth-900">Recent Enquiries</h2>
                <Link href="/admin/enquiries" className="text-xs text-brand-500 font-medium flex items-center gap-1">
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-earth-100">
                {RECENT_ENQUIRIES.map((enq) => (
                  <div key={enq.id} className="p-4 hover:bg-earth-50 transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <span className="font-medium text-sm text-earth-900">{enq.name}</span>
                        <span className="text-earth-400 text-xs ml-2">{enq.phone}</span>
                      </div>
                      <span className={`badge text-xs ${
                        enq.status === "NEW" ? "badge-orange" :
                        enq.status === "READ" ? "badge-gray" :
                        "badge-green"
                      }`}>
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-xs text-earth-500">{enq.type}: {enq.subject}</p>
                    <p className="text-xs text-earth-400 mt-1">{enq.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Listings */}
            <div className="card">
              <div className="flex items-center justify-between p-5 border-b border-earth-100">
                <h2 className="font-semibold text-earth-900">Pending Approvals</h2>
                <Link href="/admin/properties" className="text-xs text-brand-500 font-medium flex items-center gap-1">
                  View all <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-earth-100">
                {PENDING_LISTINGS.map((listing) => (
                  <div key={listing.id} className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 pr-4">
                        <p className="font-medium text-sm text-earth-900">{listing.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="badge badge-gray">{listing.type}</span>
                          <span className="text-xs font-semibold text-earth-700">{listing.price}</span>
                        </div>
                        <p className="text-xs text-earth-400 mt-1">By {listing.submittedBy} · {listing.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="w-7 h-7 bg-green-50 hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors" title="Approve">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </button>
                        <button className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors" title="Reject">
                          <XCircle className="w-4 h-4 text-red-400" />
                        </button>
                        <button className="w-7 h-7 bg-earth-50 hover:bg-earth-100 rounded-lg flex items-center justify-center transition-colors" title="View">
                          <Eye className="w-4 h-4 text-earth-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="card p-5">
            <h2 className="font-semibold text-earth-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Add Dealer", icon: Package, href: "/admin/dealers/new", color: "text-orange-500", bg: "bg-orange-50" },
                { label: "Add Builder", icon: Building2, href: "/admin/builders/new", color: "text-blue-500", bg: "bg-blue-50" },
                { label: "View All Leads", icon: TrendingUp, href: "/admin/enquiries", color: "text-purple-500", bg: "bg-purple-50" },
                { label: "Manage Users", icon: Users, href: "/admin/users", color: "text-green-500", bg: "bg-green-50" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-earth-200 hover:border-brand-200 hover:bg-brand-50/30 transition-colors text-center"
                >
                  <div className={`w-10 h-10 ${action.bg} rounded-xl flex items-center justify-center`}>
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <span className="text-xs font-medium text-earth-700">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
