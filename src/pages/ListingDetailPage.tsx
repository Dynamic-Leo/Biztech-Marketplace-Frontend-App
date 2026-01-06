import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, BarChart3, Heart, Share2, AlertCircle, MessageSquare, ArrowLeft, Loader2, Lock, ShieldCheck } from 'lucide-react';
import { listingsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Listing } from '../types';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const data = await listingsAPI.getById(id);
        setListing(data);
      } catch (error) {
        console.error("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#2EC4B6]" /></div>;
  if (!listing) return <div className="text-center py-20">Listing not found.</div>;

  const isOwner = user?.id === listing.sellerId;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Navigation / Back Button */}
        <div className="mb-6 flex justify-between items-center">
          <button 
            onClick={() => isOwner ? navigate('/dashboard/seller') : navigate('/search')} 
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0D1B2A]"
          >
            <ArrowLeft size={16} /> {isOwner ? 'Back to Seller Dashboard' : 'Back to Search'}
          </button>
          
          {isOwner && (
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
              Owner View
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <span className="text-[10px] px-2 py-1 bg-gray-100 rounded font-bold uppercase text-gray-500">{listing.publicData.industry}</span>
              <h1 className="text-3xl font-bold text-[#0D1B2A] mt-2">{listing.publicData.title}</h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={14}/> {listing.publicData.region}</span>
                <span>•</span>
                <span>{listing.views} Total Views</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Asking Price</p>
              <p className="text-3xl font-bold text-[#2EC4B6]">AED {listing.publicData.price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Financial Metrics */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><BarChart3 className="text-[#2EC4B6]"/> Key Financials</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Annual Turnover</p>
                  <p className="text-lg font-bold">AED {listing.publicData.turnover.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Net Profit</p>
                  <p className="text-lg font-bold text-[#10B981]">AED {listing.publicData.netProfit.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Tier</p>
                  <p className="text-lg font-bold uppercase">{listing.tier}</p>
                </div>
              </div>
            </div>

            {/* Private Data Section (Only for Owners/Authorized) */}
            <div className={`rounded-2xl p-8 border ${isOwner ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'}`}>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isOwner ? 'text-blue-700' : 'text-amber-700'}`}>
                {isOwner ? <ShieldCheck /> : <Lock />} Confidential Business Information
              </h3>
              
              {isOwner ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase">Legal Business Name</p>
                      <p className="font-bold text-blue-900">{listing.privateData?.legalBusinessName}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-blue-400 uppercase">Owner Name</p>
                      <p className="font-bold text-blue-900">{listing.privateData?.ownerName}</p>
                   </div>
                   <div className="md:col-span-2">
                      <p className="text-[10px] font-bold text-blue-400 uppercase">Full Address</p>
                      <p className="font-bold text-blue-900">{listing.privateData?.fullAddress}</p>
                   </div>
                </div>
              ) : (
                <p className="text-sm text-amber-800">
                  Business name and exact location are hidden. Submit an enquiry to connect with an agent and receive the full Sale Pack.
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h3 className="font-bold mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed">{(listing as any).description || 'No description provided.'}</p>
            </div>
          </div>

          <div className="space-y-6">
             {!isOwner && (
               <div className="bg-[#0D1B2A] text-white rounded-2xl p-8 shadow-xl">
                 <h3 className="text-xl font-bold mb-4 text-[#2EC4B6]">Interested?</h3>
                 <p className="text-sm text-gray-400 mb-6">Our dedicated agent will contact you within 24 hours to facilitate the introduction.</p>
                 <button className="w-full py-4 bg-[#2EC4B6] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90">
                   <MessageSquare size={18}/> Enquire Now
                 </button>
               </div>
             )}
             
             {isOwner && (
               <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                 <h3 className="font-bold mb-4">Manage Listing</h3>
                 <p className="text-xs text-gray-400 mb-6">Update your business details or manage leads from your dashboard.</p>
                 <Link to="/dashboard/seller" className="block w-full py-3 bg-[#0D1B2A] text-white rounded-xl font-bold text-center text-sm">Open Lead Manager</Link>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};