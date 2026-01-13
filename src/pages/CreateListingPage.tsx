import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Lock, Info, Loader2,  CreditCard } from 'lucide-react';
import { listingsAPI, paymentAPI } from '../services/api';
import { toast } from 'sonner';

export const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    industry: '',
    region: '',
    price: '',
    netProfit: '',
    turnover: '',
    description: '',
    legalBusinessName: '',
    fullAddress: '',
    ownerName: '',
    tier: 'basic' as 'basic' | 'premium',
    agreedToCommission: false,
  });

  // SRS FR-S-001: Automatic Tier Logic based on Price Threshold (500,000 AED)
  useEffect(() => {
    const priceNum = parseFloat(formData.price);
    if (priceNum >= 500000) {
      setFormData(prev => ({ ...prev, tier: 'premium' }));
    } else {
      setFormData(prev => ({ ...prev, tier: 'basic' }));
    }
  }, [formData.price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToCommission) {
      toast.error("You must agree to the commission terms.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create listing (Status will be 'pending')
      const newListing = await listingsAPI.create(formData);
      
      // 2. If Premium, trigger payment flow
      if (formData.tier === 'premium') {
        await paymentAPI.createSubscription({
          listingId: newListing.id,
          amount: 1500 // Aligned with SRS
        });
        toast.success("Premium Listing created and Payment Successful!");
      } else {
        toast.success("Free Listing submitted for Admin review!");
      }

      navigate('/dashboard/seller');
    } catch (error: any) {
      toast.error(error.message || "Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const industries = ['Food & Beverage', 'Technology', 'Retail', 'Healthcare', 'Education', 'Real Estate', 'Manufacturing', 'Services', 'Other'];

  return (
    <div className="min-h-screen py-12 px-4 bg-[#F9FAFB]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0D1B2A]">Sell Your Business</h1>
          <p className="text-gray-500">List your company on the managed marketplace</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= s ? 'bg-[#2EC4B6] text-white' : 'bg-gray-200 text-gray-400'}`}>{s}</div>
              <span className={`text-xs font-bold uppercase tracking-wider ${currentStep >= s ? 'text-[#0D1B2A]' : 'text-gray-400'}`}>
                {s === 1 ? 'Public' : s === 2 ? 'Private' : 'Review'}
              </span>
              {s < 3 && <div className="w-8 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit}>
            
            {/* STEP 1: PUBLIC DATA (SRS FR-S-004 Step 1) */}
            {currentStep === 1 && (
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                  <FileText className="text-[#2EC4B6]" />
                  <h3 className="font-bold text-lg">Step 1: Public Teaser Data</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Listing Title *</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#2EC4B6]" placeholder="e.g. Profitable Tech Startup in DIFC" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Industry *</label>
                    <select required value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl">
                      <option value="">Select Industry</option>
                      {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Selling Price (AED) *</label>
                    <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl" placeholder="500000" />
                    <p className="text-[10px] mt-1 text-gray-400">Listings over 500k AED are automatically Premium.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Annual Turnover *</label>
                    <input type="number" required value={formData.turnover} onChange={e => setFormData({...formData, turnover: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Net Profit *</label>
                    <input type="number" required value={formData.netProfit} onChange={e => setFormData({...formData, netProfit: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl" />
                  </div>
                </div>

                <button type="button" onClick={() => setCurrentStep(2)} className="w-full py-4 bg-[#2EC4B6] text-white rounded-xl font-bold hover:opacity-90">Continue to Private Details</button>
              </div>
            )}

            {/* STEP 2: PRIVATE DATA (SRS FR-S-004 Step 2) */}
            {currentStep === 2 && (
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                  <Lock className="text-[#2EC4B6]" />
                  <h3 className="font-bold text-lg">Step 2: Confidential Information</h3>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                  <Info className="text-amber-600 shrink-0" size={20} />
                  <p className="text-xs text-amber-700 leading-relaxed">This data is hidden from the public. Only assigned agents and verified premium buyers can request access.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Legal Business Name *</label>
                    <input type="text" required value={formData.legalBusinessName} onChange={e => setFormData({...formData, legalBusinessName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Physical Address *</label>
                    <textarea required value={formData.fullAddress} onChange={e => setFormData({...formData, fullAddress: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl" rows={3} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Owner Full Name *</label>
                    <input type="text" required value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setCurrentStep(1)} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-500">Back</button>
                  <button type="button" onClick={() => setCurrentStep(3)} className="flex-1 py-4 bg-[#2EC4B6] text-white rounded-xl font-bold">Review Listing</button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & PAYMENT */}
            {currentStep === 3 && (
              <div className="p-8 space-y-6">
                <h3 className="font-bold text-xl text-center">Review & Confirm</h3>
                
                <div className="p-6 rounded-2xl border-2 border-dashed border-gray-100 space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Calculated Service Tier:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${formData.tier === 'premium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                        {formData.tier === 'premium' ? 'Premium (Paid)' : 'Basic (Free)'}
                      </span>
                   </div>
                   {formData.tier === 'premium' && (
                     <div className="flex justify-between items-center py-4 border-y border-gray-50">
                        <div className="flex items-center gap-2">
                           <CreditCard className="text-[#2EC4B6]" size={18} />
                           <span className="text-sm font-bold">Service Fee (90 Days)</span>
                        </div>
                        <span className="text-lg font-bold text-[#0D1B2A]">AED 1,500</span>
                     </div>
                   )}
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required 
                      checked={formData.agreedToCommission} 
                      onChange={e => setFormData({...formData, agreedToCommission: e.target.checked})}
                      className="mt-1 w-5 h-5 rounded border-blue-300 text-[#2EC4B6] focus:ring-[#2EC4B6]" 
                    />
                    <span className="text-sm text-blue-900 leading-relaxed">
                      I agree to pay a <strong>1% success commission fee</strong> on the final sale price upon conclusion of a deal.
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setCurrentStep(2)} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-500">Back</button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="flex-[2] py-4 bg-[#0D1B2A] text-white rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : (formData.tier === 'premium' ? 'Pay AED 1,500 & Submit' : 'Submit for Review')}
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};