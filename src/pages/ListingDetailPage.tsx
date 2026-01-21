import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  BarChart3,
  MessageSquare,
  ArrowLeft,
  Loader2,
  Lock,
  ShieldCheck,
  Heart,
  Share2,
  AlertCircle,
  CheckCircle // Ensure this is imported
} from "lucide-react";
import { listingsAPI, leadsAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { Listing } from "../types";
import { toast } from "sonner";

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success Modal State
  
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const data = await listingsAPI.getById(id);
        setListing(data);
      } catch (error) {
        console.error("Failed to load listing");
        toast.error("Listing not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleEnquire = () => {
    // 1. Check Authentication
    if (!isAuthenticated) {
      toast.error("Please login or register to enquire.");
      // Optional: Store return URL logic here if you implement it
      navigate("/register");
      return;
    }

    // 2. Check Role (Only Buyers can enquire)
    if (user?.role !== "buyer") {
      toast.warning("Only Buyer accounts can submit enquiries. Please register as a buyer.");
      return;
    }

    // 3. Open Modal
    setShowEnquiryModal(true);
  };

  const submitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    setIsSubmitting(true);
    try {
      await leadsAPI.create({
        listingId: listing.id,
        message: enquiryMessage,
      });
      
      // Close Form & Show Success
      setShowEnquiryModal(false);
      setShowSuccessModal(true);
      setEnquiryMessage(""); // Reset form
      
    } catch (error: any) {
      // Handle "Duplicate Enquiry" or other backend errors
      const msg = error.message || "Failed to send enquiry.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#2EC4B6]" />
      </div>
    );
  if (!listing)
    return <div className="text-center py-20">Listing not found.</div>;

  const isOwner = user?.id === listing.sellerId;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation / Back Button */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() =>
              isOwner ? navigate("/dashboard/seller") : navigate("/search")
            }
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0D1B2A]"
          >
            <ArrowLeft size={16} />{" "}
            {isOwner ? "Back to Seller Dashboard" : "Back to Search"}
          </button>

          {isOwner && (
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
              Owner View
            </div>
          )}
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-2 py-1 bg-gray-100 rounded font-bold uppercase text-gray-500">
                  {listing.publicData.industry}
                </span>
                {listing.tier === "premium" && (
                  <span className="text-[10px] px-2 py-1 bg-amber-100 text-amber-700 rounded font-bold uppercase">
                    Premium
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-[#0D1B2A] mt-2">
                {listing.publicData.title}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {listing.publicData.region}
                </span>
                <span>•</span>
                <span>{listing.views} Total Views</span>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-3">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                  Asking Price
                </p>
                <p className="text-3xl font-bold text-[#2EC4B6]">
                  AED {listing.publicData.price.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <Heart
                    className={`w-5 h-5 ${isSaved ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                  />
                </button>
                <button
                  className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <Share2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Metrics */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="text-[#2EC4B6]" /> Key Financials
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Annual Turnover
                  </p>
                  <p className="text-lg font-bold text-[#0D1B2A]">
                    AED {listing.publicData.turnover.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Net Profit
                  </p>
                  <p className="text-lg font-bold text-[#10B981]">
                    AED {listing.publicData.netProfit.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Listing Type
                  </p>
                  <p className="text-lg font-bold uppercase text-[#0D1B2A]">
                    {listing.tier}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h3 className="font-bold mb-4 text-lg">Business Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {(listing as any).description || "No description provided."}
              </p>
            </div>

            {/* Private Data Section (Only for Owners/Authorized) */}
            <div
              className={`rounded-2xl p-8 border ${isOwner ? "bg-blue-50 border-blue-100" : "bg-amber-50 border-amber-100"}`}
            >
              <h3
                className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isOwner ? "text-blue-700" : "text-amber-700"}`}
              >
                {isOwner ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}{" "}
                Confidential Business Information
              </h3>

              {isOwner ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase">
                      Legal Business Name
                    </p>
                    <p className="font-bold text-blue-900">
                      {listing.privateData?.legalBusinessName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase">
                      Owner Name
                    </p>
                    <p className="font-bold text-blue-900">
                      {listing.privateData?.ownerName}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[10px] font-bold text-blue-400 uppercase">
                      Full Address
                    </p>
                    <p className="font-bold text-blue-900">
                      {listing.privateData?.fullAddress}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-amber-800 text-sm mb-1">
                      Privacy Protected
                    </p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      The business name, exact address, and owner details are
                      kept confidential. This information will only be shared
                      with qualified buyers through our agent after submitting
                      an enquiry.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {!isOwner && (
              <div className="bg-[#0D1B2A] text-white rounded-2xl p-8 shadow-xl sticky top-6">
                <h3 className="text-xl font-bold mb-4 text-[#2EC4B6]">
                  Interested?
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  Our dedicated agent will contact you within 24 hours to
                  facilitate the introduction.
                </p>
                <button
                  onClick={handleEnquire}
                  className="w-full py-4 bg-[#2EC4B6] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  <MessageSquare size={18} /> Enquire Now
                </button>
                <p className="text-xs text-center text-gray-500 mt-4">
                  Login as Buyer required
                </p>
              </div>
            )}

            {isOwner && (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm sticky top-6">
                <h3 className="font-bold mb-4">Manage Listing</h3>
                <p className="text-xs text-gray-400 mb-6">
                  Update your business details or manage leads from your
                  dashboard.
                </p>
                <Link
                  to="/dashboard/seller"
                  className="block w-full py-3 bg-[#0D1B2A] text-white rounded-xl font-bold text-center text-sm hover:opacity-90"
                >
                  Open Lead Manager
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-[#0D1B2A] mb-2">
              Submit Enquiry
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Fill out the form below and our agent will contact you with the
              confidential details.
            </p>
            <form onSubmit={submitEnquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={user?.name}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Message (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2EC4B6] outline-none transition-all"
                  rows={3}
                  placeholder="I'm interested in viewing the financials..."
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEnquiryModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-[#2EC4B6] text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#0D1B2A] mb-2">
              Enquiry Sent!
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Your interest has been registered. Our agent will review your
              request and contact you shortly with the confidential business
              details.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 rounded-xl bg-[#0D1B2A] text-white font-bold hover:opacity-90 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};