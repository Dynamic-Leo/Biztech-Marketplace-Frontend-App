import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Search,
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  Lock,
  Award,
  ArrowRight,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-block px-4 py-2 rounded-full mb-6"
              style={{
                backgroundColor: "rgba(46, 196, 182, 0.1)",
                border: "1px solid rgba(46, 196, 182, 0.3)",
              }}
            >
              <span className="text-sm">🌍 Global Business Marketplace</span>
            </div>

            <h1 style={{ color: "var(--color-primary)", fontSize: "2.5rem" }}>
              Connect. Compete. Collaborate.
            </h1>

            <p
              className="text-lg mb-8"
              style={{ color: "var(--color-text-light)" }}
            >
              The premier platform where businesses find the right partners for
              their projects, and professionals discover their next opportunity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                // Show Dashboard link if logged in
                <Link
                  to={`/dashboard/${user?.role || "buyer"}`}
                  className="px-8 py-3 rounded text-center transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                    borderRadius: "var(--radius-sharp)",
                  }}
                >
                  Go to Dashboard
                </Link>
              ) : (
                // Show Get Started if logged out
                <Link
                  to="/register"
                  className="px-8 py-3 rounded text-center transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                    borderRadius: "var(--radius-sharp)",
                  }}
                >
                  Get Started
                </Link>
              )}

              <Link
                to="/search"
                className="px-8 py-3 rounded text-center border-2 transition-all hover:shadow-md"
                style={{
                  borderColor: "var(--color-accent)",
                  color: "var(--color-accent)",
                  borderRadius: "var(--radius-sharp)",
                  backgroundColor: "white",
                }}
              >
                Browse Listings
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div
                className="rounded-lg p-4"
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  className="metric"
                  style={{
                    fontSize: "2rem",
                    color: "var(--color-accent)",
                    fontWeight: 700,
                  }}
                >
                  150+
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--color-text-light)" }}
                >
                  Active Listings
                </div>
              </div>
              <div
                className="rounded-lg p-4"
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  className="metric"
                  style={{
                    fontSize: "2rem",
                    color: "var(--color-accent)",
                    fontWeight: 700,
                  }}
                >
                  85+
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--color-text-light)" }}
                >
                  Deals Closed
                </div>
              </div>
              <div
                className="rounded-lg p-4"
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  className="metric"
                  style={{
                    fontSize: "2rem",
                    color: "var(--color-accent)",
                    fontWeight: 700,
                  }}
                >
                  500+
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--color-text-light)" }}
                >
                  Active Buyers
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ color: "white" }}>Why Choose BizTech?</h2>
            <p
              className="text-lg mt-4"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Empowering partnerships with transparency, trust, and technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div
              className="p-6 rounded-lg transition-all hover:shadow-lg"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "var(--radius-card)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{
                  backgroundColor: "rgba(46, 196, 182, 0.2)",
                }}
              >
                <Lock
                  className="w-6 h-6"
                  style={{ color: "var(--color-accent)" }}
                />
              </div>
              <h3 style={{ color: "white" }}>Complete Confidentiality</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Business details remain private until you connect with verified
                buyers through our trusted agents.
              </p>
            </div>

            <div
              className="p-6 rounded-lg transition-all hover:shadow-lg"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "var(--radius-card)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{
                  backgroundColor: "rgba(46, 196, 182, 0.2)",
                }}
              >
                <Users
                  className="w-6 h-6"
                  style={{ color: "var(--color-accent)" }}
                />
              </div>
              <h3 style={{ color: "white" }}>Expert Brokerage</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Dedicated agents manage every inquiry, match qualified buyers,
                and guide you through negotiations.
              </p>
            </div>

            <div
              className="p-6 rounded-lg transition-all hover:shadow-lg"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "var(--radius-card)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{
                  backgroundColor: "rgba(46, 196, 182, 0.2)",
                }}
              >
                <Award
                  className="w-6 h-6"
                  style={{ color: "var(--color-accent)" }}
                />
              </div>
              <h3 style={{ color: "white" }}>Premium Visibility</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Get your listing featured at the top and reach serious buyers
                with our premium subscription plans.
              </p>
            </div>

            <div
              className="p-6 rounded-lg transition-all hover:shadow-lg"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "var(--radius-card)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{
                  backgroundColor: "rgba(46, 196, 182, 0.2)",
                }}
              >
                <Search
                  className="w-6 h-6"
                  style={{ color: "var(--color-accent)" }}
                />
              </div>
              <h3 style={{ color: "white" }}>Advanced Search</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Filter by industry, location, price range, and profitability to
                find the perfect business opportunity.
              </p>
            </div>

            <div
              className="p-6 rounded-lg transition-all hover:shadow-lg"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "var(--radius-card)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{
                  backgroundColor: "rgba(46, 196, 182, 0.2)",
                }}
              >
                <TrendingUp
                  className="w-6 h-6"
                  style={{ color: "var(--color-accent)" }}
                />
              </div>
              <h3 style={{ color: "white" }}>Business Valuation</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Get professional valuation services to price your business
                accurately and attract serious offers.
              </p>
            </div>

            <div
              className="p-6 rounded-lg transition-all hover:shadow-lg"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "var(--radius-card)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{
                  backgroundColor: "rgba(46, 196, 182, 0.2)",
                }}
              >
                <Shield
                  className="w-6 h-6"
                  style={{ color: "var(--color-accent)" }}
                />
              </div>
              <h3 style={{ color: "white" }}>Verified Transactions</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Secure payment processing and legal compliance ensure every
                transaction is protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{ color: "var(--color-primary)" }}>How It Works</h2>
            <p
              className="text-lg mt-4"
              style={{ color: "var(--color-text-light)" }}
            >
              Four simple steps to connect and collaborate
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative">
              <div
                className="p-6 rounded-lg h-full"
                style={{
                  backgroundColor: "white",
                  borderRadius: "var(--radius-card)",
                  border: "2px solid var(--color-accent)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 metric"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                  }}
                >
                  1
                </div>
                <h4>Register</h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-light)" }}
                >
                  Create your account as a Seller or Buyer with financial
                  profile
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className="p-6 rounded-lg h-full"
                style={{
                  backgroundColor: "white",
                  borderRadius: "var(--radius-card)",
                  border: "2px solid var(--color-accent)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 metric"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                  }}
                >
                  2
                </div>
                <h4>List or Search</h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-light)" }}
                >
                  Sellers create listings, Buyers browse opportunities by
                  criteria
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className="p-6 rounded-lg h-full"
                style={{
                  backgroundColor: "white",
                  borderRadius: "var(--radius-card)",
                  border: "2px solid var(--color-accent)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 metric"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                  }}
                >
                  3
                </div>
                <h4>Agent Connect</h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-light)" }}
                >
                  Your dedicated agent reviews and manages all inquiries
                  professionally
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className="p-6 rounded-lg h-full"
                style={{
                  backgroundColor: "white",
                  borderRadius: "var(--radius-card)",
                  border: "2px solid var(--color-accent)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 metric"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                  }}
                >
                  4
                </div>
                <h4>Close Deal</h4>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-light)" }}
                >
                  Complete the transaction with full legal and financial support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Social Proof Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className="rounded-lg overflow-hidden"
              style={{
                boxShadow: "var(--shadow-card-hover)",
                borderRadius: "var(--radius-card)",
              }}
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758518730384-be3d205838e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaGFrZSUyMG1lZXRpbmd8ZW58MXx8fHwxNzY1MTg1NDk2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Business Deal"
                className="w-full h-auto"
              />
            </div>

            <div>
              <h2 style={{ color: "var(--color-primary)" }}>
                Trusted by Business Owners Worldwide
              </h2>
              <p
                className="text-lg mb-8"
                style={{ color: "var(--color-text-light)" }}
              >
                Our managed marketplace approach ensures every transaction is
                handled with professionalism, confidentiality, and expert
                guidance.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle
                    className="w-6 h-6 flex-shrink-0 mt-1"
                    style={{ color: "var(--color-success)" }}
                  />
                  <div>
                    <h4>Secure & Professional</h4>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-text-light)" }}
                    >
                      Fully compliant platform with secure transactions and
                      professional support
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle
                    className="w-6 h-6 flex-shrink-0 mt-1"
                    style={{ color: "var(--color-success)" }}
                  />
                  <div>
                    <h4>Transparent Commission</h4>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-text-light)" }}
                    >
                      Clear 1% success fee structure - you only pay when your
                      deal closes
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle
                    className="w-6 h-6 flex-shrink-0 mt-1"
                    style={{ color: "var(--color-success)" }}
                  />
                  <div>
                    <h4>Expert Support</h4>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-text-light)" }}
                    >
                      Dedicated agents with deep market knowledge guide you
                      through every step
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-white mb-6">Ready to Get Started?</h2>
          <p
            className="text-lg mb-8"
            style={{ color: "rgba(255, 255, 255, 0.8)" }}
          >
            Join our global marketplace and connect with serious buyers or
            discover your next business opportunity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 rounded inline-flex items-center justify-center gap-2 transition-all hover:shadow-lg"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "white",
                borderRadius: "var(--radius-sharp)",
              }}
            >
              Create Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/valuation"
              className="px-8 py-3 rounded border-2 inline-flex items-center justify-center transition-all"
              style={{
                borderColor: "white",
                color: "white",
                borderRadius: "var(--radius-sharp)",
              }}
            >
              Get Valuation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
