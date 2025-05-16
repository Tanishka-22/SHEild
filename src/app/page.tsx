"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      setIsLoading(true); // Ensure loading state is set to true initially

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        // User is not logged in, show loading page for 3 seconds, then navigate to /auth
        setTimeout(() => {
          router.push("/auth");
        }, 3000);
        return;
      }

      // User is logged in, check Firestore for user data
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists() || !userSnap.data()?.emergencyContact) {
        // User data is incomplete, show loading page for 3 seconds, then navigate to /emerdetails
        setTimeout(() => {
          router.push("/emerdetails");
        }, 3000);
      } else {
        // User data is complete, show loading page for 3 seconds, then navigate to /main
        setTimeout(() => {
          router.push("/main");
        }, 3000);
      }
    };

    checkUserStatus();
  }, [router]);

  if (isLoading) {
    // Render the loading page while `isLoading` is true
    return (
      <div className="items-center bg-blue-100 justify-items-center content-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col items-center justify-center">
          <Image
            className="dark:invert"
            src="/LOADING.png"
            alt="logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-3xl text-center font-semibold sm:text-5xl">
            Feel Safe Everywhere
          </h1>
          <p className="text-lg text-center mt-4">Loading...</p>
        </main>
      </div>
    );
  }

  return null; // Return null while navigating to the next page
}