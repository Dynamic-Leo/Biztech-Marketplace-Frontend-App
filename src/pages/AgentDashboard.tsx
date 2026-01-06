import React, { useState, useEffect } from 'react';
import { FileText, BarChart3, ShieldCheck, Clock, Users, MessageSquare, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { DashboardHeader } from '../components/DashboardHeader';
import { agentAPI, leadsAPI } from '../services/api';
import { Listing, Lead } from '../types';
import { toast } from 'sonner';

export const AgentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'listings' | 'leads' | 'deliverables'>('listings');
  const [listings, setListings] = useState<Listing[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [listingsData, leadsData] = await Promise.all([
        agentAPI.getAssignedListings(),
        leadsAPI.getByAgent()
      ]);
      setListings(listingsData);
      setLeads(leadsData);
    } catch (error) {
      toast.error("Failed to load workspace data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleDeliverable = async (listingId: string, field: string, currentVal: boolean) => {
    setUpdating(listingId + field);
    try {
      await agentAPI.updateDeliverable(listingId, field, !currentVal);
      toast.success("Deliverable status updated");
      loadData();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, status: string) => {
    try {
      await leadsAPI.updateStatus(leadId, status);
      toast.success(`Lead marked as ${status}`);
      loadData();
    } catch (error) {
      toast.error("Failed to update lead");
    }
  };

  if (loading && listings.length === 0) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#2EC4B6]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardHeader 
          title="Agent Workspace" 
          description="Manage your assigned portfolio and fulfill service deliverables" 
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {[
              { id: 'listings', label: 'Assigned Portfolio', icon: FileText },
              { id: 'deliverables', label: 'Deliverables (Sale Packs)', icon: BarChart3 },
              { id: 'leads', label: 'Buyer Enquiries', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-8 py-5 font-bold text-sm transition-all ${activeTab === tab.id ? 'text-[#2EC4B6] border-b-2 border-[#2EC4B6]' : 'text-gray-400'}`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* PORTFOLIO TAB */}
            {activeTab === 'listings' && (
              <div className="space-y-4">
                {listings.length === 0 ? (
                   <div className="text-center py-20 text-gray-400">No listings assigned to you yet.</div>
                ) : (
                  listings.map(l => (
                    <div key={l.id} className="p-6 border border-gray-100 rounded-2xl flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-[#0D1B2A]">{l.publicData.title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${l.tier === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{l.tier}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Seller: {(l as any).Seller?.name} • {(l as any).Seller?.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold uppercase ${l.status === 'active' ? 'text-green-500' : 'text-amber-500'}`}>{l.status}</span>
                        <div className="h-8 w-px bg-gray-100" />
                        <button 
                          onClick={() => setActiveTab('deliverables')}
                          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:border-[#2EC4B6]"
                        >
                          Manage Deliverables
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* DELIVERABLES TAB (SRS FR-AG-002) */}
            {activeTab === 'deliverables' && (
              <div className="space-y-8">
                {listings.filter(l => l.tier === 'premium').length === 0 ? (
                   <div className="text-center py-20 text-gray-400">No Premium listings in your portfolio.</div>
                ) : (
                  listings.filter(l => l.tier === 'premium').map(l => (
                    <div key={l.id} className="p-8 border border-gray-100 rounded-3xl bg-gray-50/50">
                      <h4 className="font-bold text-[#0D1B2A] mb-6">{l.publicData.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* deliverable Item 1 */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <div className="flex justify-between items-start mb-4">
                            <FileText className="text-[#2EC4B6]" />
                            {updating === l.id + 'sale_pack_ready' ? <Loader2 className="animate-spin text-gray-300" size={16}/> : 
                             (l as any).sale_pack_ready ? <CheckCircle2 className="text-green-500" size={20}/> : <Circle className="text-gray-200" size={20}/>}
                          </div>
                          <h5 className="font-bold text-sm mb-1">Professional Sale Pack</h5>
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-4 tracking-widest">Business Assessment</p>
                          <button 
                            onClick={() => handleToggleDeliverable(l.id, 'sale_pack_ready', (l as any).sale_pack_ready)}
                            className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${(l as any).sale_pack_ready ? 'bg-gray-100 text-gray-500' : 'bg-[#2EC4B6] text-white'}`}
                          >
                            {(l as any).sale_pack_ready ? 'Mark as Incomplete' : 'Mark as Ready'}
                          </button>
                        </div>

                        {/* deliverable Item 2 */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <div className="flex justify-between items-start mb-4">
                            <BarChart3 className="text-[#2EC4B6]" />
                            {(l as any).financial_analysis_ready ? <CheckCircle2 className="text-green-500" size={20}/> : <Circle className="text-gray-200" size={20}/>}
                          </div>
                          <h5 className="font-bold text-sm mb-1">Financial Analysis</h5>
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-4 tracking-widest">Growth Projections</p>
                          <button 
                            onClick={() => handleToggleDeliverable(l.id, 'financial_analysis_ready', (l as any).financial_analysis_ready)}
                            className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${(l as any).financial_analysis_ready ? 'bg-gray-100 text-gray-500' : 'bg-[#2EC4B6] text-white'}`}
                          >
                            {(l as any).financial_analysis_ready ? 'Mark as Incomplete' : 'Mark as Ready'}
                          </button>
                        </div>

                        {/* deliverable Item 3 */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <div className="flex justify-between items-start mb-4">
                            <ShieldCheck className="text-[#2EC4B6]" />
                            {(l as any).legal_attestation_ready ? <CheckCircle2 className="text-green-500" size={20}/> : <Circle className="text-gray-200" size={20}/>}
                          </div>
                          <h5 className="font-bold text-sm mb-1">Legal Attestation</h5>
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-4 tracking-widest">Final Arrangements</p>
                          <button 
                            onClick={() => handleToggleDeliverable(l.id, 'legal_attestation_ready', (l as any).legal_attestation_ready)}
                            className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${(l as any).legal_attestation_ready ? 'bg-gray-100 text-gray-500' : 'bg-[#2EC4B6] text-white'}`}
                          >
                            {(l as any).legal_attestation_ready ? 'Mark as Incomplete' : 'Mark as Ready'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* LEADS TAB (SRS FR-AG-003) */}
            {activeTab === 'leads' && (
              <div className="space-y-4">
                {leads.length === 0 ? (
                   <div className="text-center py-20 text-gray-400">No buyer enquiries found for your listings.</div>
                ) : (
                  leads.map(lead => (
                    <div key={lead.id} className="p-6 border border-gray-100 rounded-3xl bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <h4 className="font-bold text-[#0D1B2A]">{lead.Buyer?.name}</h4>
                           <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-bold uppercase tracking-wider">{lead.Buyer?.financial_means}</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Enquired about: <span className="text-[#0D1B2A]">{lead.Listing?.title}</span></p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <MessageSquare size={14}/>
                          <p className="italic">"{lead.message}"</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                         <div className="text-right sm:mr-4">
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Lead Status</p>
                            <select 
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                              className="text-sm font-bold text-[#2EC4B6] outline-none bg-transparent cursor-pointer border-b-2 border-transparent hover:border-[#2EC4B6]"
                            >
                               <option value="new">NEW</option>
                               <option value="contacted">CONTACTED</option>
                               <option value="negotiating">NEGOTIATING</option>
                               <option value="closed">CLOSED</option>
                            </select>
                         </div>
                         <a href={`mailto:${lead.Buyer?.email}`} className="px-6 py-3 bg-[#0D1B2A] text-white rounded-xl text-xs font-bold hover:opacity-90">Email Buyer</a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};