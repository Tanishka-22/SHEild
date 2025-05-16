"use client";

import { useEffect, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, signInAnonymously } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export default function RegisterPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
      
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("Recaptcha verified");
        },
      });
    }

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    };
  }, []);

  const sendOtp = async () => {
    try {
      if (!phone) {
        setError("Please enter a phone number");
        return;
      }

      // Clear any existing reCAPTCHA
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }

      // Create new reCAPTCHA instance
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("Recaptcha verified");
        },
        "expired-callback": () => {
          setError("reCAPTCHA expired. Please try again.");
        }
      });

      // Render the reCAPTCHA
      await window.recaptchaVerifier.render();

      const formattedPhone = `+91${phone}`; 
      console.log("Sending OTP to:", formattedPhone); // Debug log

      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier!);
      setConfirmationResult(confirmation);
      setShowOTP(true);
      setError("");
      console.log("OTP sent successfully");
    } catch (err: any) {
      console.error("Detailed error:", err); // Debug log
      setError(err.message || "Failed to send OTP");
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    }
  };

  const verifyOtp = async () => {
    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otp);
        const userId = result.user.uid;
        const userPhone = result.user.phoneNumber || phone;

        console.log("Authentication successful:", userId); // Debug log

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const userData = {
            uid: userId,
            phone: userPhone,
            createdAt: new Date().toISOString(),
            isProfileComplete: false
          };
          console.log("Creating new user:", userData); // Debug log
          
          try {
            await setDoc(userRef, userData);
            console.log("User document created successfully"); // Debug log
          } catch (dbError) {
            console.error("Error creating user document:", dbError);
            throw dbError;
          }
          router.push("/emerdetails");
        } else {
          const userData = userSnap.data();
          console.log("Existing user data:", userData); // Debug log
          if (!userData.isProfileComplete || !userData.emergencyContacts) {
            router.push("/emerdetails");
          } else {
            router.push("/main");
          }
        }
      } else {
        setError("Please request OTP first");
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
      console.error("Error in verification process:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="mx-auto sm:w-80 sm:px-4 mt-10 p-6 border rounded-lg shadow-lg space-y-4 bg-white">
        <h1 className="text-2xl font-bold text-center sm:text-l">Register your Phone</h1>

        {!showOTP ? (
          <>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none sm:py-1 sm:text-sm"
            />
            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 sm:py-1 sm:text-sm"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none sm:py-1 sm:text-sm"
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 sm:py-1 sm:text-sm"
            >
              Verify OTP
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-sm sm:text-xs">{error}</p>}
        <div id="recaptcha-container" />
      </div>
    </div>
  );
}