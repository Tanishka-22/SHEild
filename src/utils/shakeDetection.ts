import { Geolocation } from '@capacitor/geolocation';
import { db } from '../../lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 

export const setupShakeDetection = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('devicemotion', async (event) => {
      const acc = event.accelerationIncludingGravity;
      const power = Math.sqrt((acc?.x ?? 0) ** 2 + (acc?.y ?? 0) ** 2 + (acc?.z ?? 0) ** 2);

      if (power > 20) {
        console.log("Shake detected");
        await handleEmergency();
      }
    });
  }
};

export const handleEmergency = async () => {
  try {
    // 1. Get the authenticated user's ID
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("No authenticated user found. Please log in.");
      return;
    }

    const userId = user.uid;

    // 2. Fetch the emergency contact from Firestore
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("User data not found in Firestore.");
      return;
    }

    const contact = userSnap.data()?.emergencyContact;

    if (!contact) {
      alert("No emergency contact saved.");
      return;
    }

    // 3. Get the user's current location
    const coordinates = await Geolocation.getCurrentPosition();
    const locationURL = `https://maps.google.com/?q=${coordinates.coords.latitude},${coordinates.coords.longitude}`;

    // 4. Send SMS
    const message = `🚨 Emergency Alert!\nLocation: ${locationURL}`;
    (window as any).SMS.sendSMS(contact, message, () => {
      console.log("SMS sent");
    }, (err: any) => {
      console.error("SMS failed:", err);
    });

    // 5. Place a call to the emergency contact
    window.open(`tel:${contact}`);
  } catch (error) {
    console.error("Error handling emergency:", error);
    alert("An error occurred while handling the emergency. Please try again.");
  }
};