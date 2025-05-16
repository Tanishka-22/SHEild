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
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("No authenticated user found. Please log in.");
      return;
    }

    const userId = user.uid;

    // Fetch emergency contact from emergContact collection
    const emergContactRef = doc(db, "emergContact", userId);
    const emergContactSnap = await getDoc(emergContactRef);

    if (!emergContactSnap.exists()) {
      alert("No emergency contact found. Please add emergency contact in settings.");
      return;
    }

    const contactData = emergContactSnap.data();
    const contactPhone = contactData.phone;
    const contactName = contactData.name;

    if (!contactPhone) {
      alert("Emergency contact phone number is missing. Please update your emergency contact.");
      return;
    }

    // Request location permission first
    const permissionStatus = await Geolocation.checkPermissions();
    if (permissionStatus.location !== 'granted') {
      await Geolocation.requestPermissions();
    }

    const coordinates = await Geolocation.getCurrentPosition();
    const locationURL = `https://maps.google.com/?q=${coordinates.coords.latitude},${coordinates.coords.longitude}`;

    const message = `🚨 Emergency Alert from Women Safety App!\nContact: ${contactName}\nLocation: ${locationURL}`;
    
    // Try sending SMS through different methods
    if ((window as any).SMS) {
      await new Promise((resolve) => {
        (window as any).SMS.sendSMS(contactPhone, message, 
          () => {
            console.log("SMS sent successfully");
            resolve(true);
          },
          (err: any) => {
            // Fallback to other SMS methods
            window.open(`sms:${contactPhone}?body=${encodeURIComponent(message)}`);
            resolve(false);
          }
        );
      });
    } else {
      // Fallback for web browsers
      window.open(`sms:${contactPhone}?body=${encodeURIComponent(message)}`);
    }

    // Call options
    const callOptions = [
      `tel:${contactPhone}`,
      `whatsapp://send?phone=${contactPhone.replace('+', '')}`,
      `https://wa.me/${contactPhone.replace('+', '')}?text=${encodeURIComponent(message)}`
    ];

    // Try primary calling method first
    window.open(callOptions[0]);

    // Provide alternative communication buttons
    alert("Emergency initiated! If call fails, check notification for alternative contact methods.");
    alert("Emergency alert sent successfully!");
    alert("Failed to send SMS. Initiating call...");
  } catch (error) {
    console.error("Error handling emergency:", error);
    alert("An error occurred. Please try again or manually contact emergency services.");
  }
};