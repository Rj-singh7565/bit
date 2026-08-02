import React from "react";
import { getCurrentUser } from "src/actions/auth";
import Header from "src/components/common/Header";
import Footer from "src/components/common/Footer";
import Chatbot from "src/components/ai/Chatbot";
import AdmissionFormClient from "./AdmissionFormClient";

export const dynamic = "force-dynamic";

export default async function AdmissionFormPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header user={user} />
      
      <main className="flex-grow">
        <AdmissionFormClient />
      </main>

      <Chatbot />
      <Footer />
    </div>
  );
}
