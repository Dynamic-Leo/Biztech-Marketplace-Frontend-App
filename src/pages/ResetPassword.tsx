import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, AlertCircle, Check, Circle } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [validations, setValidations] = useState({
    length: false,
    number: false,
    uppercase: false,
  });

  useEffect(() => {
    setValidations({
      length: password.length >= 8,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      const msg = "Reset link is invalid or expired.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!validations.length || !validations.number || !validations.uppercase) {
      setError("Password does not meet requirements.");
      return;
    }

    setIsLoading(true);

    try {
      // Construct the full URL using Vite environment variable
      const url = `${API_BASE_URL}/auth/resetpassword/${token}`;
      
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      toast.success(data.message || "Password reset successful.");
      navigate("/login");
    } catch (err: any) {
      const msg =
        err?.message ||
        "Failed to reset password. The link may be invalid or expired.";
      
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationCheck = ({
    label,
    isValid,
  }: {
    label: string;
    isValid: boolean;
  }) => (
    <div
      className={`flex items-center gap-2 text-sm ${
        isValid ? "text-green-600" : "text-gray-500"
      }`}
    >
      {isValid ? <Check size={16} /> : <Circle size={16} />}
      {label}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">

        <h2 className="text-2xl font-bold text-navy mb-5 text-center">
          Set New Password
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md flex items-center gap-2 border border-red-200">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-navy text-sm font-semibold mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#F5F5F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/50"
              required
            />
          </div>

          <div className="space-y-1 pl-1">
            <ValidationCheck
              label="At least 8 characters"
              isValid={validations.length}
            />
            <ValidationCheck
              label="Contains a number"
              isValid={validations.number}
            />
            <ValidationCheck
              label="Contains an uppercase letter"
              isValid={validations.uppercase}
            />
          </div>

          <div>
            <label className="block text-navy text-sm font-semibold mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#F5F5F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal/50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal hover:bg-teal/90 disabled:opacity-60 text-white font-medium py-3 rounded-lg flex justify-center items-center gap-2 mt-6 bg-[#0D1B2A] hover:bg-[#0d1b2a]/90 disabled:opacity-60 hover:cursor-pointer"
          >
            {isLoading && <Loader2 className="animate-spin" size={20} />}
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}