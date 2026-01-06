import React, { useState, useEffect } from 'react';
import { Users, Building2, UserCog, TrendingUp, CheckCircle, Clock, XCircle, RefreshCw, X, Mail, Lock, User as UserIcon, Eye } from 'lucide-react';
import { DashboardHeader } from '../components/DashboardHeader';
import { adminAPI } from '../services/api';
import { User, Listing } from '../types';
import { toast } from 'sonner'; 

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings' | 'agents'>('overview');
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState<'pending' | 'all'>('pending');
  
  // Modals State
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  
  // Form State for New Agent
  const [agentForm, setAgentForm] = useState({ name: '', email: '', password: '' });

  // Dynamic State
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    activeListings: 0,
    totalAgents: 0,
    monthlyRevenue: 0
  });

  const [users, setUsers] = useState<User[]>([]);
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [agents, setAgents] = useState<User[]>([]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, listingsData, agentsData] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(userFilter === 'pending' ? { role: 'seller', status: 'pending' } : {}),
        adminAPI.getPendingListings(),
        adminAPI.getUsers({ role: 'agent' })
      ]);

      setStats(statsData);
      setUsers(usersData);
      setPendingListings(listingsData);
      setAgents(agentsData);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [userFilter]);

  const handleUserAction = async (userId: string, status: 'active' | 'rejected') => {
    try {
      await adminAPI.updateUserStatus(userId, status);
      toast.success(`User ${status === 'active' ? 'approved' : 'rejected'}`);
      loadDashboardData();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleAssignAgent = async (listingId: string, agentId: string) => {
    if (!agentId) return;
    try {
      await adminAPI.assignListingToAgent(listingId, agentId);
      toast.success("Agent assigned and Listing activated!");
      loadDashboardData();
    } catch (error) {
      toast.error("Assignment failed");
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminAPI.createAgent(agentForm);
      toast.success("Internal Agent account created");
      setIsAgentModalOpen(false);
      setAgentForm({ name: '', email: '', password: '' });
      loadDashboardData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create agent");
    }
  };

  if (loading && stats.totalUsers === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-[#2EC4B6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardHeader 
          title="Admin Dashboard" 
          description="Manage users, listings, and agent assignments" 
          action={
            <button 
              onClick={loadDashboardData}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          }
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Total Platform Users</p>
              <Users className="w-5 h-5 text-[#2EC4B6]" />
            </div>
            <p className="text-3xl font-bold text-[#0D1B2A]">{stats.totalUsers}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-[#0D1B2A]">{stats.pendingApprovals}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Live Business Listings</p>
              <Building2 className="w-5 h-5 text-[#2EC4B6]" />
            </div>
            <p className="text-3xl font-bold text-[#0D1B2A]">{stats.activeListings}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Monthly Tier Revenue</p>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-[#0D1B2A]">AED {stats.monthlyRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: `User Management` },
            { id: 'listings', label: `Pending Listings (${pendingListings.length})` },
            { id: 'agents', label: 'Agent Management' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all font-medium border ${
                activeTab === tab.id 
                ? 'bg-[#0D1B2A] text-white border-[#0D1B2A]' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#2EC4B6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
          
          {/* USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#0D1B2A]">User Accounts</h3>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setUserFilter('pending')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${userFilter === 'pending' ? 'bg-white shadow text-[#2EC4B6]' : 'text-gray-500'}`}
                  >
                    Pending Sellers
                  </button>
                  <button 
                    onClick={() => setUserFilter('all')}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${userFilter === 'all' ? 'bg-white shadow text-[#2EC4B6]' : 'text-gray-500'}`}
                  >
                    All Users
                  </button>
                </div>
              </div>
              
              {users.length === 0 ? (
                <div className="text-center py-20 text-gray-400">No users match your filter</div>
              ) : (
                <div className="space-y-4">
                  {users.map(user => (
                    <div key={user.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="mb-4 md:mb-0">
                        <p className="font-bold text-[#0D1B2A]">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${user.role === 'seller' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                            {user.role}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${(user as any).account_status === 'active' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                            {(user as any).account_status}
                          </span>
                        </div>
                      </div>
                      {(user as any).account_status === 'pending' && (
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleUserAction(user.id, 'active')}
                            className="flex-1 md:flex-none px-6 py-2 bg-green-500 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" /> Approve
                          </button>
                          <button 
                            onClick={() => handleUserAction(user.id, 'rejected')}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LISTING MANAGEMENT */}
          {activeTab === 'listings' && (
            <div className="p-6">
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-6">Review & Assign Agents</h3>
              {pendingListings.length === 0 ? (
                <div className="text-center py-20 text-gray-400">No listings awaiting assignment</div>
              ) : (
                <div className="space-y-4">
                  {pendingListings.map(listing => (
                    <div key={listing.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-gray-100 rounded-xl">
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                           <h4 className="font-bold text-[#0D1B2A]">{listing.publicData.title}</h4>
                           <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${listing.tier === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                             {listing.tier}
                           </span>
                        </div>
                        <p className="text-sm text-gray-500">Owner: {(listing as any).Seller?.name}</p>
                        <button 
                          onClick={() => setSelectedListing(listing)}
                          className="text-xs text-[#2EC4B6] font-bold mt-1 flex items-center gap-1 hover:underline"
                        >
                          <Eye className="w-3 h-3" /> Review Private Details
                        </button>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <select 
                          className="w-full sm:w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2EC4B6]"
                          onChange={(e) => handleAssignAgent(listing.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Choose Agent...</option>
                          {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>{agent.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AGENT MANAGEMENT */}
          {activeTab === 'agents' && (
             <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-[#0D1B2A]">Internal Brokerage Team</h3>
                   <button 
                    onClick={() => setIsAgentModalOpen(true)}
                    className="px-4 py-2 bg-[#2EC4B6] text-white rounded-lg text-sm font-bold"
                   >
                    Add New Agent
                   </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   {agents.map(agent => (
                      <div key={agent.id} className="p-4 border border-gray-100 rounded-xl">
                         <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <UserCog className="w-5 h-5 text-[#0D1B2A]" />
                         </div>
                         <p className="font-bold text-sm">{agent.name}</p>
                         <p className="text-xs text-gray-500 mb-3">{agent.email}</p>
                         <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Agent</div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'overview' && (
             <div className="p-6">
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-6">Platform Overview</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-700 mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <button onClick={() => setActiveTab('listings')} className="w-full text-left p-3 bg-white rounded-lg text-sm border hover:border-[#2EC4B6] transition-all flex justify-between">
                      Review Pending Listings <Clock className="w-4 h-4 text-amber-500" />
                    </button>
                    <button onClick={() => setActiveTab('users')} className="w-full text-left p-3 bg-white rounded-lg text-sm border hover:border-[#2EC4B6] transition-all flex justify-between">
                      Manage User Accounts <Users className="w-4 h-4 text-[#2EC4B6]" />
                    </button>
                  </div>
                </div>
                <div className="bg-[#0D1B2A] p-6 rounded-xl text-white">
                  <h4 className="font-bold text-[#2EC4B6] mb-2">Revenue Insights</h4>
                  <p className="text-3xl font-bold">AED {stats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-2">Projection based on current active Premium ads.</p>
                </div>
              </div>
             </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD AGENT */}
      {isAgentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setIsAgentModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
            <h3 className="text-xl font-bold text-[#0D1B2A] mb-2 text-center">Create Agent Account</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Internal brokers handle listing review and buyer leads.</p>
            
            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                  <input 
                    required 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2EC4B6]" 
                    value={agentForm.name}
                    onChange={(e) => setAgentForm({...agentForm, name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                  <input 
                    required 
                    type="email" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2EC4B6]" 
                    value={agentForm.email}
                    onChange={(e) => setAgentForm({...agentForm, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Default Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                  <input 
                    required 
                    type="password" 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#2EC4B6]" 
                    value={agentForm.password}
                    onChange={(e) => setAgentForm({...agentForm, password: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-[#0D1B2A] text-white rounded-lg font-bold hover:opacity-90">Register Agent</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW LISTING DETAILS */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedListing(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
            <h3 className="text-xl font-bold text-[#0D1B2A] mb-4">Business Review: {selectedListing.publicData.title}</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Industry</p>
                  <p className="text-sm font-bold">{selectedListing.publicData.industry}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Region</p>
                  <p className="text-sm font-bold">{selectedListing.publicData.region}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-xs font-bold text-[#2EC4B6] uppercase mb-3">Private Business Data</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Legal Name</p>
                    <p className="text-sm">{selectedListing.privateData?.legalBusinessName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Owner Name</p>
                    <p className="text-sm">{selectedListing.privateData?.ownerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Full Address</p>
                    <p className="text-sm">{selectedListing.privateData?.fullAddress || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-xs font-bold text-[#2EC4B6] uppercase mb-3">Public Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{(selectedListing as any).description || 'No description provided.'}</p>
              </div>

              <button 
                onClick={() => setSelectedListing(null)}
                className="w-full py-3 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};