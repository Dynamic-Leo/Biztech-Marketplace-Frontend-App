import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export function VerifyEmail() {
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. Please request a new one.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verifyemail/${token}`, {
          method: "PUT", 
        });

        let data;
        try {
          data = await response.json();
        } catch {
          throw new Error("Server returned an unexpected response.");
        }

        if (!response.ok) throw new Error(data.message || "Verification failed.");

        setStatus("success");
        setMessage(
          data.message ||
            "Email verified successfully! Your account is now pending admin approval."
        );
        toast.success("Email verified successfully!");
      } catch (error) {
        setStatus("error");
        const errMsg =
          error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : "This verification link is invalid or has expired. Please request a new one.";
        setMessage(errMsg);
        toast.error("Email verification failed.");
      }
    };

    verifyEmail();
  }, [token]);

  // --- Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <Card>
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <CardDescription>Verifying your email...</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- Success State
  if (status === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600 flex justify-center items-center gap-2">
                <CheckCircle2 className="w-6 h-6" /> Email Verified
              </CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- Error State
  return (
    <div className="min-h-screen bg-lightgray flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* <a href="/" className="flex justify-center mb-6">
            <img src={logoImage} alt="BizSetup" className="h-20 w-auto" />
          </a> */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-destructive flex justify-center items-center gap-2 text-[#fc3232]">
              <XCircle className="w-6 h-6 text-[#fc3232]" /> Verification Failed
            </CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => navigate("/signin")}
              className="w-full bg-[#102536] text-white hover:bg-[#0d1b2a]/90 hover:cursor-pointer"
            >
              Back to Login
            </Button>
            <Link
              to="/register"
              className="text-sm text-accent hover:underline block text-center !text-[#45AFAC]"
            >
              Need a new account? Register here
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}