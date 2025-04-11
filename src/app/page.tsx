import Image from "next/image";

export default function Home() {
  return (
    <div className=" items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center justify-center">
        <Image
          className="dark:invert"
          src="/LOADING.png"
          alt="logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-3xl font-semibold sm:text-5xl">
          Feel Safe Everywhere
          </h1>
      </main>
    </div>
  );
}
