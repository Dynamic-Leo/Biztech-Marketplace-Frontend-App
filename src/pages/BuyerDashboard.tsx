import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, MessageSquare, Building2, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { DashboardHeader } from '../components/DashboardHeader';
import { leadsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Lead } from '../types';

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'saved'>('enquiries');
  const [enquiries, setEnquiries] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      // NOTE: We'll create this helper in api.ts next
      const data = await leadsAPI.getBuyerEnquiries();
      setEnquiries(data);
    } catch (error) {
      console.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardHeader
          title={`Welcome, ${user?.name}`}
          description={`Investor Profile: ${user?.financialMeans || 'Not Set'}`}
        >
          <Link to="/search">
            <button className="px-6 py-3 rounded-xl bg-[#2EC4B6] text-white font-bold flex items-center gap-2 hover:opacity-90">
              <Search size={20} /> Browse Listings
            </button>
          </Link>
        </DashboardHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-50">
                <button onClick={() => setActiveTab('enquiries')} className={`px-8 py-4 font-bold text-sm ${activeTab === 'enquiries' ? 'text-[#2EC4B6] border-b-2 border-[#2EC4B6]' : 'text-gray-400'}`}>My Enquiries</button>
              </div>

              <div className="p-6">
                {loading ? (
                   <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#2EC4B6]"/></div>
                ) : enquiries.length === 0 ? (
                  <div className="text-center py-20">
                    <MessageSquare size={40} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400">You haven't made any enquiries yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enquiries.map(lead => (
                      <div key={lead.id} className="p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-[#0D1B2A]">{(lead as any).Listing?.title}</h4>
                            <p className="text-xs text-gray-400 mt-1">Submitted on {new Date(lead.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${lead.status === 'new' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                            {lead.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 italic mb-4">"{lead.message}"</p>
                        <div className="flex gap-2">
                           <Link to={`/listing/${lead.listingId}`} className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-600">View Listing</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
             <div className="bg-[#0D1B2A] text-white rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-[#2EC4B6] mb-4">Buying Power</h4>
                <div className="space-y-4">
                   <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Financial Means</p>
                      <p className="text-lg font-bold">{user?.financialMeans || 'Not specified'}</p>
                   </div>
                   <p className="text-xs text-gray-400 leading-relaxed">Agents use this information to prioritize access to confidential Sale Packs.</p>
                   <Link to="/profile" className="block w-full py-3 bg-white/10 text-center rounded-xl text-xs font-bold hover:bg-white/20">Update Profile</Link>
                </div>
             </div>

             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h4 className="font-bold mb-4">Recommended Matches</h4>
                <div className="flex flex-col items-center py-8 text-center">
                   <Building2 size={32} className="text-gray-100 mb-3" />
                   <p className="text-xs text-gray-400">We'll notify you when businesses matching your criteria are listed.</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};