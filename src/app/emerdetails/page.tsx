"use client";
import { useState } from "react";
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useRouter } from "next/navigation";


export default function EmerDetails() {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const docId = Math.random().toString(36).substring(2, 15);
        await setDoc(doc(collection(db, "emergContact"), docId), {
          name: contactName,
          phone: contactPhone,
        });
  
      alert("Emergency contact saved successfully!");
      setContactName("");
      setContactPhone("");

      router.push("/main"); 
    } catch (error) {
      console.error("Error saving emergency contact: ", error);
      alert("Failed to save emergency contact. Please try again.");
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