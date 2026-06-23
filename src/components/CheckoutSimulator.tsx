import React, { useState, useEffect } from "react";
import { CreditCard, Shield, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Order } from "../types";

interface CheckoutSimulatorProps {
  order: Order;
  paymentLink: string;
  isMock: boolean;
  onPaymentVerified: (verifiedOrder: Order) => void;
  onCancel: () => void;
}

export default function CheckoutSimulator({ order, paymentLink, isMock, onPaymentVerified, onCancel }: CheckoutSimulatorProps) {
  const [verificationStatus, setVerificationStatus] = useState<"awaiting" | "verifying" | "success" | "failed">("awaiting");
  const [errorMessage, setErrorMessage] = useState("");

  const runVerificationRequest = async () => {
    setVerificationStatus("verifying");
    try {
      const res = await fetch("/api/orders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVerificationStatus("success");
        setTimeout(() => {
          onPaymentVerified(data.order);
        }, 1500);
      } else {
        setVerificationStatus("failed");
        setErrorMessage(data.message || "Gateway did not record successful transition yet.");
      }
    } catch (err: any) {
      setVerificationStatus("failed");
      setErrorMessage("System timeout trying to establish secure connection.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-none p-6 sm:p-8 shadow-2xl relative" id="checkout-root">
      <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#111] border border-brand-orange/45 text-brand-orange px-3.5 py-1 text-[9px] font-mono uppercase tracking-wider">
        Cashfree Secure Routing Module
      </div>

      <div className="text-center mb-8 mt-4">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">Initialize Payment</h2>
        <p className="text-white/40 text-[10.5px] font-mono uppercase">Order Reference: {order.id}</p>
      </div>

      {/* Pricing Summary */}
      <div className="bg-black/40 border border-white/10 rounded-none p-5 mb-6 text-left space-y-3.5">
        <div className="flex items-center justify-between text-xs text-white/50 uppercase tracking-wider font-mono">
          <span>Order Plan:</span>
          <span className="font-extrabold text-[#F5F5F5]">{order.plan} License</span>
        </div>
        <div className="flex items-center justify-between text-xs text-white/50 uppercase tracking-wider font-mono">
          <span>Developer Username:</span>
          <span className="font-bold text-brand-orange">@{order.readmeData.githubUsername}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-white/50 uppercase tracking-wider font-mono">
          <span>Processing Gateway:</span>
          <span className="text-[#F5F5F5] font-bold">Cashfree (PROD SECURE)</span>
        </div>
        <hr className="border-white/5" />
        <div className="flex items-center justify-between text-base font-bold uppercase tracking-tight">
          <span className="text-white font-black italic">Amount Due:</span>
          <span className="text-brand-orange text-xl font-black">₹{order.amount}.00 <span className="text-[10px] font-mono text-white/40">INR</span></span>
        </div>
      </div>

      {/* Gateway triggers */}
      <div className="space-y-4">
        {verificationStatus === "awaiting" && (
          <div className="space-y-4">
            <a
              href={paymentLink}
              target="_blank"
              rel="referrer"
              className="w-full py-4 bg-brand-orange text-black font-black uppercase tracking-widest rounded-none text-center block transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              id="checkout-redirect-btn"
            >
              <CreditCard className="w-5 h-5 stroke-[2.5px]" />
              Pay via Cashfree UI
              <ArrowRight className="w-4 h-4 stroke-[2.5px]" />
            </a>

            <p className="text-center text-[10px] text-brand-orange/80 font-mono tracking-wider uppercase animate-pulse">
              ⏳ Waiting for secure gateway signal. We poll records automatically...
            </p>
          </div>
        )}

        {verificationStatus === "verifying" && (
          <div className="flex flex-col items-center justify-center p-8 bg-black/40 border border-white/10 rounded-none space-y-4">
            <div className="w-8 h-8 rounded-none border-2 border-brand-orange border-t-transparent animate-spin" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Establishing Secure Verification...</h3>
            <p className="text-white/40 text-[9px] uppercase font-mono tracking-widest leading-none">Interfacing with Cashfree Webhooks</p>
          </div>
        )}

        {verificationStatus === "success" && (
          <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-brand-orange/40 rounded-none text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 bg-white/5 text-brand-orange rounded-none flex items-center justify-center border border-brand-orange/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">Payment Success Verified</h3>
            <p className="text-xs text-white/60">Order status updated. Building markdown assets...</p>
          </div>
        )}

        {verificationStatus === "failed" && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-none p-5 text-left space-y-3">
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider font-mono">
              <AlertTriangle className="w-5 h-5" />
              Verification Error
            </div>
            <p className="text-xs text-white/60 leading-relaxed font-sans">{errorMessage}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={runVerificationRequest}
                className="px-4 py-2 border border-white/10 hover:bg-white hover:text-black font-bold uppercase text-[10px] tracking-wider transition cursor-pointer"
              >
                Re-poll Status
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="text-xs font-bold text-white/40 hover:text-white uppercase tracking-widest cursor-pointer"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}
