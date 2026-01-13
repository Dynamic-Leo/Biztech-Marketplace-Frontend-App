import React, { useState } from 'react';
import { Calculator, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export const ValuationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    industry: '',
    yearEstablished: '',
    annualRevenue: '',
    netProfit: '',
    numberOfEmployees: '',
    reason: '',
    additionalInfo: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Valuation request:', formData);
    setSubmitted(true);
    
    // Reset form after a delay
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        industry: '',
        yearEstablished: '',
        annualRevenue: '',
        netProfit: '',
        numberOfEmployees: '',
        reason: '',
        additionalInfo: '',
      });
      setCurrentStep(1);
    }, 3000);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email && formData.phone;
      case 2:
        return formData.businessName && formData.industry && formData.yearEstablished;
      case 3:
        return formData.annualRevenue && formData.netProfit;
      case 4:
        return formData.reason;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Calculator className="w-16 h-16" style={{ color: 'var(--color-accent)' }} />
          </div>
          <h2 style={{ color: 'var(--color-primary)' }}>
            Business Valuation Request
          </h2>
          <p className="text-lg mt-4" style={{ color: 'var(--color-text-light)' }}>
            Get a professional valuation of your business from our expert team
          </p>
        </div>

        {/* Form or Success Message */}
        {submitted ? (
          <div className="bg-white rounded-lg p-12 text-center" style={{ 
            boxShadow: 'var(--shadow-card)',
            borderRadius: 'var(--radius-card)'
          }}>
            <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-success)' }} />
            <h3 style={{ color: 'var(--color-primary)' }}>Request Submitted Successfully!</h3>
            <p className="mt-4" style={{ color: 'var(--color-text-light)' }}>
              Thank you for your valuation request. Our team will review your information and 
              contact you within 2-3 business days with a comprehensive valuation report.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8" style={{ 
            boxShadow: 'var(--shadow-card)',
            borderRadius: 'var(--radius-card)'
          }}>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          step === currentStep ? 'ring-4 ring-opacity-30' : ''
                        }`}
                        style={{ 
                          backgroundColor: step <= currentStep ? '#2EC4B6' : '#E5E7EB',
                          color: step <= currentStep ? 'white' : '#9CA3AF',
                          borderColor: step === currentStep ? 'rgba(46, 196, 182, 0.3)' : undefined
                        }}
                      >
                        {step}
                      </div>
                      <span className="text-xs mt-2" style={{ color: step <= currentStep ? '#2EC4B6' : '#9CA3AF' }}>
                        {step === 1 && 'Contact'}
                        {step === 2 && 'Business'}
                        {step === 3 && 'Financials'}
                        {step === 4 && 'Details'}
                      </span>
                    </div>
                    {step < 4 && (
                      <div 
                        className="flex-1 h-1 mx-2 transition-all"
                        style={{ backgroundColor: step < currentStep ? '#2EC4B6' : '#E5E7EB' }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4" style={{ color: 'var(--color-primary)' }}>
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2" style={{ color: 'var(--color-text)' }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: 'var(--color-surface)',
                            borderRadius: 'var(--radius-sharp)'
                          }}
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2" style={{ color: 'var(--color-text)' }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: 'var(--color-surface)',
                            borderRadius: 'var(--radius-sharp)'
                          }}
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2" style={{ color: 'var(--color-text)' }}>
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: 'var(--color-surface)',
                            borderRadius: 'var(--radius-sharp)'
                          }}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Business Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4" style={{ color: 'var(--color-primary)' }}>
                      Business Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2" style={{ color: 'var(--color-text)' }}>
                          Business Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: 'var(--color-surface)',
                            borderRadius: 'var(--radius-sharp)'
                          }}
                          placeholder="Your Business Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2" style={{ color: 'var(--color-text)' }}>
                          Industry *
                        </label>
                        <select
                          required
                          value={formData.industry}
                          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: 'var(--color-surface)',
                            borderRadius: 'var(--radius-sharp)'
                          }}
                        >
                          <option value="">Select Industry</option>
                          <option value="ecommerce">E-commerce</option>
                          <option value="food">Food & Beverage</option>
                          <option value="retail">Retail</option>
                          <option value="services">Professional Services</option>
                          <option value="technology">Technology</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="education">Education</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm mb-2" style={{ color: 'var(--color-text)' }}>
                          Year Established *
                        </label>
                        <input
                          type="number"
                          required
                          min="1900"
                          max={new Date().getFullYear()}
                          value={formData.yearEstablished}
                          onChange={(e) => setFormData({ ...formData, yearEstablished: e.target.value })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: 'var(--color-surface)',
                            borderRadius: 'var(--radius-sharp)'
                          }}
                          placeholder="2020"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Financial Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4" style={{ color: 'var(--color-primary)' }}>
                      Financial Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2" style={{ color: 'var(--color-text)' }}>
                          Annual Revenue (USD) *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.annualRevenue}
                          onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: 'var(--color-surface)',
                            borderRadius: 'var(--radius-sharp)'
                          }}
                          placeholder="1000000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2" style={{ color: 'var(--color-text)' }}>
                          Net Profit (USD) *
                        </label>
                        <input
                          type="number"
                          required
                          value={formData.netProfit}
                          onChange={(e) => setFormData({ ...formData, netProfit: e.target.value })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: 'var(--color-surface)',
                            borderRadius: 'var(--radius-sharp)'
                          }}
                          placeholder="200000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2" style={{ color: 'var(--color-text)' }}>
                          Number of Employees
                        </label>
                        <input
                          type="number"
                          value={formData.numberOfEmployees}
                          onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: 'var(--color-surface)',
                            borderRadius: 'var(--radius-sharp)'
                          }}
                          placeholder="10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Additional Details */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4" style={{ color: 'var(--color-primary)' }}>
                      Additional Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2" style={{ color: 'var(--color-text)' }}>
                          Reason for Valuation *
                        </label>
                        <select
                          required
                          value={formData.reason}
                          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: 'var(--color-surface)',
                            borderRadius: 'var(--radius-sharp)'
                          }}
                        >
                          <option value="">Select Reason</option>
                          <option value="selling">Planning to Sell</option>
                          <option value="expansion">Seeking Expansion/Investment</option>
                          <option value="partnership">Partnership Discussion</option>
                          <option value="general">General Information</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm mb-2" style={{ color: 'var(--color-text)' }}>
                          Additional Information
                        </label>
                        <textarea
                          rows={4}
                          value={formData.additionalInfo}
                          onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                          style={{
                            borderColor: 'var(--color-surface)',
                            borderRadius: 'var(--radius-sharp)'
                          }}
                          placeholder="Any additional details that might help with the valuation..."
                        />
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 p-4 rounded" style={{ 
                      backgroundColor: 'rgba(46, 196, 182, 0.05)',
                      border: '1px solid var(--color-accent)',
                      borderRadius: 'var(--radius-sharp)'
                    }}>
                      <div className="text-sm" style={{ color: 'var(--color-text)' }}>
                        <strong>What to expect:</strong> Our expert team will conduct a comprehensive analysis 
                        of your business, including market comparisons, financial assessment, and growth potential. 
                        You will receive a detailed valuation report within 2-3 business days.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: '#E5E7EB' }}>
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                    currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: 'white',
                    color: '#6B7280',
                    border: '1px solid #E5E7EB',
                    borderRadius: 'var(--radius-sharp)'
                  }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                      !isStepValid() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                    }`}
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      color: 'white',
                      borderRadius: 'var(--radius-sharp)'
                    }}
                  >
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isStepValid()}
                    className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                      !isStepValid() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                    }`}
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      color: 'white',
                      borderRadius: 'var(--radius-sharp)'
                    }}
                  >
                    Submit Request
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
