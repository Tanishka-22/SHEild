"use client";
import { handleEmergency } from "@/utils/shakeDetection"; // Import handleEmergency directly

export default function main() {
  const triggerEmergency = async () => {
    try {
      await handleEmergency(); // Call the handleEmergency function
    } catch (error) {
      console.error("Error triggering emergency:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={triggerEmergency}
        className="bg-red-500 text-white rounded m-2 p-2 hover:bg-red-600"
      >
        Start
      </button>
      <button
        className="bg-red-500 text-white rounded m-2 p-2 hover:bg-red-600"
      >
        Stop
      </button>
    </div>
  );
}