import Image from "next/image";
import Passcode from "./components/Passcode";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Passcode />
    </main>
  );
}
