"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, User, Bot, Check, Paperclip, ChevronDown, RefreshCw } from "lucide-react";
import { submitEnquiry } from "@/lib/enquiries-api";
import { KD360_PHONE_DISPLAY } from "@/lib/kd360-contact";

type Step = 
  | "CATEGORY"
  | "NAME"
  | "PHONE"
  | "EMAIL"
  | "AREA"
  | "ADDRESS"
  | "DETAILS"
  | "SUMMARY"
  | "SUCCESS";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string | React.ReactNode;
  isTyping?: boolean;
}

interface FormState {
  target: string;
  name: string;
  phone: string;
  email: string;
  area: string;
  deliveryAddress: string;
  details: string;
}

const CATEGORY_OPTIONS = [
  "Materials (Cement, Steel, etc.)",
  "Builder / Architect",
  "Property (Buy / Rent)",
  "Home Services",
  "Custom Enquiry"
];

const AREA_OPTIONS = [
  "RS Puram",
  "Gandhipuram",
  "Peelamedu",
  "Saravanampatti",
  "Tirupur",
  "Pollachi"
];

export default function ChatEnquiryWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const [step, setStep] = useState<Step>("CATEGORY");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [form, setForm] = useState<FormState>({
    target: "",
    name: "",
    phone: "",
    email: "",
    area: "",
    deliveryAddress: "",
    details: "",
  });
  
  const [enquiryId, setEnquiryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const addBotMessage = (text: string | React.ReactNode, delay = 600) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Math.random().toString(), sender: "bot", text }]);
    }, delay);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: Math.random().toString(), sender: "user", text }]);
  };

  // Initialize chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage("Hi! Welcome to Kattadam 👋 What are you looking for today?");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleCategorySelect = (category: string) => {
    setForm(prev => ({ ...prev, target: category }));
    addUserMessage(category);
    setStep("NAME");
    addBotMessage("Great! What is your full name?");
  };

  const handleNameSubmit = () => {
    const val = inputValue.trim();
    if (!val) return;
    setForm(prev => ({ ...prev, name: val }));
    addUserMessage(val);
    setInputValue("");
    setStep("PHONE");
    addBotMessage(`Nice to meet you, ${val}! What is your 10-digit mobile number?`);
  };

  const handlePhoneSubmit = () => {
    const val = inputValue.trim().replace(/\D/g, "");
    if (val.length < 10) {
      setErrorMsg("Please enter a valid 10-digit number.");
      return;
    }
    setErrorMsg("");
    setForm(prev => ({ ...prev, phone: val }));
    addUserMessage(val);
    setInputValue("");
    setStep("EMAIL");
    addBotMessage("Thanks! What is your email address? (Optional, you can skip)");
  };
  
  const handleEmailSubmit = (skipped = false) => {
    const val = inputValue.trim();
    if (!skipped && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
       setErrorMsg("Please enter a valid email or click skip.");
       return;
    }
    setErrorMsg("");
    if (skipped) {
       addUserMessage("Skip");
       setForm(prev => ({ ...prev, email: "" }));
    } else {
       addUserMessage(val);
       setForm(prev => ({ ...prev, email: val }));
    }
    setInputValue("");
    setStep("AREA");
    addBotMessage("Which city or area is this for?");
  };

  const handleAreaSubmit = (area?: string) => {
    const val = area || inputValue.trim();
    if (!val) return;
    setForm(prev => ({ ...prev, area: val }));
    addUserMessage(val);
    setInputValue("");
    setStep("ADDRESS");
    addBotMessage("Got it. What is the exact site or delivery address?");
  };

  const handleAddressSubmit = (skipped = false) => {
    const val = inputValue.trim();
    if (!skipped && !val) return;
    
    const finalAddress = skipped ? form.area : val;
    setForm(prev => ({ ...prev, deliveryAddress: finalAddress }));
    addUserMessage(skipped ? "Same as area" : val);
    setInputValue("");
    setStep("DETAILS");
    addBotMessage("Lastly, please describe your requirement in detail (e.g., 50 bags Ultratech cement, 3BHK builder, etc.)");
  };

  const handleDetailsSubmit = () => {
    const val = inputValue.trim();
    if (!val) return;
    setForm(prev => ({ ...prev, details: val }));
    addUserMessage(val);
    setInputValue("");
    setStep("SUMMARY");
    addBotMessage("Thank you! Here is a summary of your enquiry. Shall I submit it?");
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg("");
    
    const payload = {
      customerName: form.name,
      phone: form.phone,
      email: form.email || undefined,
      currentAddress: form.area,
      deliveryAddress: form.deliveryAddress,
      target: form.target,
      message: form.details,
    };
    
    const res = await submitEnquiry(payload);
    setIsSubmitting(false);
    
    if (res.ok) {
      setEnquiryId(res.id);
      setStep("SUCCESS");
      addBotMessage(
        <div className="flex flex-col gap-1">
          <p>Your enquiry has been submitted successfully! 🎉</p>
          <p className="font-mono text-xs opacity-70">ID: {res.id}</p>
          <p className="mt-1 text-sm">Our team will contact you shortly.</p>
        </div>
      );
    } else {
      addBotMessage(`Oops! Something went wrong: ${res.error}. Please try again.`);
      setStep("SUMMARY"); // Revert to summary so they can retry
    }
  };

  const resetChat = () => {
    setMessages([]);
    setStep("CATEGORY");
    setForm({
      target: "",
      name: "",
      phone: "",
      email: "",
      area: "",
      deliveryAddress: "",
      details: "",
    });
    setInputValue("");
    setErrorMsg("");
    setEnquiryId("");
    setTimeout(() => {
      addBotMessage("Hi! Welcome to Kattadam 👋 What are you looking for today?");
    }, 100);
  };
  
  const whatsappLink = `https://wa.me/91${KD360_PHONE_DISPLAY.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi Kattadam, I submitted an enquiry (ID: ${enquiryId}).\nName: ${form.name}\nRequirement: ${form.target}\nDetails: ${form.details}`)}`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (step === "NAME") handleNameSubmit();
      else if (step === "PHONE") handlePhoneSubmit();
      else if (step === "EMAIL") handleEmailSubmit(false);
      else if (step === "AREA") handleAreaSubmit();
      else if (step === "ADDRESS") handleAddressSubmit(false);
      else if (step === "DETAILS") handleDetailsSubmit();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed bottom-24 right-4 md:right-6 z-[94] flex h-14 w-14 items-center justify-center rounded-full bg-primary hover:bg-[#5ee06a] text-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        aria-label="Open Chat"
      >
        <MessageSquare className="h-6 w-6 text-foreground fill-current" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-foreground shadow-md ring-2 ring-[#0d120e]">
          1
        </span>
        
        {/* Tooltip */}
        <div className={`absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#0d1810]/95 border border-primary/30 px-3.5 py-1.5 text-xs font-extrabold text-primary shadow-2xl backdrop-blur-md transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"}`}>
          Quick Enquiry Chat
          <div className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[#0d1810] border-r border-t border-primary/30"></div>
        </div>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-4 md:right-6 z-[101] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-primary/40 bg-[#0b140c]/95 backdrop-blur-2xl shadow-2xl transition-all duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        }`}
        style={{ height: "550px", maxHeight: "calc(100vh - 4rem)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-[#122014] px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 border border-primary/40">
              <Bot className="h-5 w-5 text-primary" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-[#0b140c]"></span>
            </div>
            <div>
              <h3 className="font-extrabold text-foreground text-sm">Kattadam Assistant</h3>
              <p className="text-[10px] font-bold text-primary">Online · Instant Support</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#052010] to-[#0a2e18]/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`relative max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  msg.sender === "user"
                    ? "bg-[#50D890] text-[#052010] rounded-br-sm"
                    : "bg-[#113a20] text-zinc-100 rounded-bl-sm border border-[#50D890]/10"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-[#113a20] px-4 py-3 border border-[#50D890]/10">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#50D890]/60 [animation-delay:-0.3s]"></div>
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#50D890]/60 [animation-delay:-0.15s]"></div>
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#50D890]/60"></div>
              </div>
            </div>
          )}
          
          {/* Summary Card before submission */}
          {step === "SUMMARY" && !isTyping && (
            <div className="mt-4 rounded-xl border border-[#50D890]/30 bg-[#0a2e18] p-4 text-sm animate-in zoom-in-95 duration-300">
              <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Check className="h-4 w-4 text-[#50D890]" /> Enquiry Details
              </h4>
              <div className="space-y-2 text-muted-foreground text-xs">
                <p><span className="text-muted-foreground w-16 inline-block">Name:</span> {form.name}</p>
                <p><span className="text-muted-foreground w-16 inline-block">Phone:</span> {form.phone}</p>
                {form.email && <p><span className="text-muted-foreground w-16 inline-block">Email:</span> {form.email}</p>}
                <p><span className="text-muted-foreground w-16 inline-block">Category:</span> {form.target}</p>
                <p><span className="text-muted-foreground w-16 inline-block">Location:</span> {form.area}</p>
                <p><span className="text-muted-foreground w-16 inline-block">Delivery:</span> {form.deliveryAddress}</p>
                <div className="pt-2 mt-2 border-t border-[#50D890]/10">
                  <p className="text-muted-foreground italic">"{form.details}"</p>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button
                  onClick={resetChat}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg border border-[#50D890]/30 py-2 text-xs font-bold text-[#50D890] transition-colors hover:bg-[#50D890]/10 disabled:opacity-50"
                >
                  Edit / Restart
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-[#50D890] py-2 text-xs font-bold text-[#052010] transition-colors hover:bg-[#5ee89d] flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* Success actions */}
          {step === "SUCCESS" && !isTyping && (
            <div className="mt-2 space-y-2 animate-in slide-in-from-bottom-2 duration-300">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-bold text-foreground shadow-lg shadow-green-500/20 transition-all hover:bg-green-400 hover:scale-[1.02]"
              >
                Chat on WhatsApp
              </a>
              <button
                onClick={resetChat}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#50D890]/20 bg-[#113a20] px-4 py-3 text-sm font-semibold text-[#50D890] transition-colors hover:bg-[#50D890]/10"
              >
                New Enquiry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-[#50D890]/20 bg-[#052010] p-4">
          {errorMsg && <p className="mb-2 text-xs text-red-400 animate-pulse">{errorMsg}</p>}
          
          {step === "CATEGORY" && !isTyping ? (
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className="rounded-full border border-[#50D890]/30 bg-[#0a2e18] px-3 py-1.5 text-xs font-medium text-[#50D890] transition-all hover:bg-[#50D890]/20"
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : step === "AREA" && !isTyping ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {AREA_OPTIONS.map((area) => (
                  <button
                    key={area}
                    onClick={() => handleAreaSubmit(area)}
                    className="rounded-full border border-[#50D890]/30 bg-[#0a2e18] px-3 py-1.5 text-xs font-medium text-[#50D890] transition-all hover:bg-[#50D890]/20"
                  >
                    {area}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Or type your city/area..."
                  className="flex-1 rounded-xl border border-[#50D890]/20 bg-[#0a2e18] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#50D890] focus:outline-none focus:ring-1 focus:ring-[#50D890]"
                />
                <button
                  onClick={() => handleAreaSubmit()}
                  disabled={!inputValue.trim()}
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-[#50D890] text-[#052010] transition-colors hover:bg-[#5ee89d] disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : step === "SUMMARY" || step === "SUCCESS" || isTyping ? (
            <div className="text-center text-xs text-muted-foreground italic">
              {isTyping ? "Kattadam Assistant is typing..." : "Conversation finished"}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                {step === "DETAILS" ? (
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your details..."
                    rows={2}
                    className="flex-1 resize-none rounded-xl border border-[#50D890]/20 bg-[#0a2e18] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#50D890] focus:outline-none focus:ring-1 focus:ring-[#50D890]"
                  />
                ) : (
                  <input
                    type={step === "EMAIL" ? "email" : step === "PHONE" ? "tel" : "text"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      step === "NAME" ? "Enter your name..." :
                      step === "PHONE" ? "10-digit number..." :
                      step === "EMAIL" ? "Email address..." :
                      step === "ADDRESS" ? "Delivery address..." : "Type a message..."
                    }
                    className="flex-1 rounded-xl border border-[#50D890]/20 bg-[#0a2e18] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#50D890] focus:outline-none focus:ring-1 focus:ring-[#50D890]"
                    autoFocus
                  />
                )}
                <button
                  onClick={() => {
                    if (step === "NAME") handleNameSubmit();
                    else if (step === "PHONE") handlePhoneSubmit();
                    else if (step === "EMAIL") handleEmailSubmit(false);
                    else if (step === "ADDRESS") handleAddressSubmit(false);
                    else if (step === "DETAILS") handleDetailsSubmit();
                  }}
                  disabled={!inputValue.trim()}
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#50D890] text-[#052010] transition-colors hover:bg-[#5ee89d] disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              
              {/* Optional Skips */}
              {step === "EMAIL" && (
                <button onClick={() => handleEmailSubmit(true)} className="text-xs text-[#50D890]/70 hover:text-[#50D890] text-left px-1">
                  Skip this step
                </button>
              )}
              {step === "ADDRESS" && (
                <button onClick={() => handleAddressSubmit(true)} className="text-xs text-[#50D890]/70 hover:text-[#50D890] text-left px-1">
                  Same as area
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
