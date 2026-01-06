import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building2, Lock, Star, Loader2, SlidersHorizontal, FileCheck } from 'lucide-react';
import { listingsAPI } from '../services/api';
import { Listing } from '../types';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    minProfit: '',
  });

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Map frontend filters to API query params
      const data = await listingsAPI.getAll({
        searchTerm,
        industry: filters.industry,
        location: filters.location,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minProfit: filters.minProfit
      });
      setListings(data);
    } catch (error) {
      console.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchListings();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filters]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Search Header */}
      <section className="py-12 px-4 bg-[#0D1B2A] text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Find Your Next Business</h2>
          
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-[#2EC4B6] outline-none placeholder-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <select 
                value={filters.industry} 
                onChange={e => setFilters({...filters, industry: e.target.value})}
                className="bg-white/10 border border-white/20 p-3 rounded-lg text-sm outline-none"
              >
                <option value="" className="text-black">All Industries</option>
                <option value="Food & Beverage" className="text-black">Food & Beverage</option>
                <option value="Technology" className="text-black">Technology</option>
                <option value="Retail" className="text-black">Retail</option>
              </select>

              <select 
                value={filters.location} 
                onChange={e => setFilters({...filters, location: e.target.value})}
                className="bg-white/10 border border-white/20 p-3 rounded-lg text-sm outline-none"
              >
                <option value="" className="text-black">All Dubai</option>
                <option value="Dubai Marina" className="text-black">Dubai Marina</option>
                <option value="DIFC" className="text-black">DIFC</option>
                <option value="Business Bay" className="text-black">Business Bay</option>
              </select>

              <input 
                type="number" 
                placeholder="Min Price" 
                value={filters.minPrice}
                onChange={e => setFilters({...filters, minPrice: e.target.value})}
                className="bg-white/10 border border-white/20 p-3 rounded-lg text-sm outline-none"
              />
              
              <input 
                type="number" 
                placeholder="Max Price" 
                value={filters.maxPrice}
                onChange={e => setFilters({...filters, maxPrice: e.target.value})}
                className="bg-white/10 border border-white/20 p-3 rounded-lg text-sm outline-none"
              />

              <input 
                type="number" 
                placeholder="Min Profit" 
                value={filters.minProfit}
                onChange={e => setFilters({...filters, minProfit: e.target.value})}
                className="bg-white/10 border border-white/20 p-3 rounded-lg text-sm outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold text-[#0D1B2A]">{listings.length} Businesses Found</h3>
          <div className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
            <SlidersHorizontal size={14}/> Sort: Premium First
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-[#2EC4B6] mb-4" size={40} />
            <p className="text-gray-400">Loading verified listings...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((l) => (
              <div
                key={l.id}
                onClick={() => navigate(`/listing/${l.id}`)}
                className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-xl border ${l.tier === 'premium' ? 'border-[#2EC4B6]/30 ring-1 ring-[#2EC4B6]/10' : 'border-gray-100'}`}
              >
                {/* SRS Requirement: Featured Badge */}
                {l.tier === 'premium' && (
                  <div className="bg-[#2EC4B6] text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <Star size={12} fill="currentColor"/> Featured Listing
                  </div>
                )}

                <div className="p-6">
                  <h4 className="text-lg font-bold text-[#0D1B2A] mb-2 line-clamp-1">{l.publicData.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                    <span className="flex items-center gap-1"><Building2 size={14}/> {l.publicData.industry}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {l.publicData.region}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Asking Price</p>
                      <p className="font-bold text-[#0D1B2A]">AED {(l.publicData.price / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Net Profit</p>
                      <p className="font-bold text-[#10B981]">AED {(l.publicData.netProfit / 1000).toFixed(0)}K</p>
                    </div>
                  </div>

                  {/* SRS FR-B-004: Sale Pack Indicator */}
                  {l.tier === 'premium' && (
                    <div className="mb-6 flex items-center gap-2 text-[#2EC4B6] bg-[#2EC4B6]/5 p-2 rounded-lg border border-[#2EC4B6]/10">
                      <FileCheck size={16} />
                      <span className="text-[10px] font-bold uppercase">Professional Sale Pack Available</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-amber-600 font-bold">
                      <Lock size={12}/> Confidential
                    </div>
                    <button className="text-sm font-bold text-[#2EC4B6] hover:underline">View Opportunity</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};