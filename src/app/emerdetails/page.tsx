"use client";
import { useState } from "react";
import { collection, setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { getAuth } from "firebase/auth"; 
import { useRouter } from "next/navigation";

export default function EmerDetails() {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactName || !contactPhone) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("No authenticated user found. Please log in.");
        router.push("/auth");
        return;
      }

      const userId = user.uid;
      console.log("Current user ID:", userId); // Debug log

      // First update user document
      const userRef = doc(db, "users", userId);
      try {
        await updateDoc(userRef, {
          isProfileComplete: true
        });
        console.log("User document updated"); // Debug log
      } catch (userError) {
        console.error("Error updating user document:", userError);
      }

      // Then save emergency contact
      const emergContactRef = doc(db, "emergContact", userId);
      const emergContactData = {
        name: contactName,
        phone: contactPhone,
        userId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log("Saving emergency contact:", emergContactData); // Debug log

      await setDoc(emergContactRef, emergContactData);
      console.log("Emergency contact saved"); // Debug log

      alert("Emergency contact saved successfully!");
      router.push("/main");
    } catch (error: any) {
      console.error("Detailed error:", error); // Debug log
      alert(`Failed to save: ${error.message}`);
    }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-6 bg-white rounded-lg shadow-md"
      >
        <h1 className="text-2xl p-4 font-bold">Emergency Details</h1>
        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="emergency-contact" className="font-semibold">
            Emergency Contact Name:
          </label>
          <input
            type="text"
            id="emergency-contact"
            className="border border-gray-300 rounded p-2"
            placeholder="Enter emergency contact name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="emergency-phone" className="font-semibold">
            Emergency Contact Phone:
          </label>
          <input
            type="tel"
            id="emergency-phone"
            className="border border-gray-300 rounded p-2"
            placeholder="Enter emergency contact phone number"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded m-2 p-2 hover:bg-blue-600"
        >
          Save Details
        </button>
      </form>
    </div>
  );
}