"use client";

import { useState } from "react";
import { predictHotelPrice, HotelPrediction } from "@/lib/gemini";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  PanelRightClose, 
  PanelRightOpen,
  Sparkles,
  MapPin,
  History,
  MessageSquare,
  Hotel,
  Calendar,
  Star
} from "lucide-react";

type HotelPriceMapProps = {
  hotels: {
    query: string;
    price: number;
    currency: string;
    location?: { lat: number; lng: number };
  }[];
  zoomToLocation?: { lat: number; lng: number } | null;
};

const HotelPriceMap = dynamic<HotelPriceMapProps>(
  () => import("@/components/HotelPriceMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-cyan-100 to-blue-100">
        <div className="flex flex-col items-center">
          <MapPin className="w-12 h-12 text-blue-500 animate-pulse" />
          <p className="mt-2 text-blue-600 font-medium">Loading hotel map...</p>
        </div>
      </div>
    )
  }
);

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  data?: {
    price?: number;
    currency?: string;
    confidence?: string;
    location?: { lat: number; lng: number };
  };
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [zoomToLocation, setZoomToLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      id: Date.now().toString(),
      text: input, 
      sender: "user" 
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await predictHotelPrice(input);
      const { prediction, price, currency, confidence, isError, location } = result as HotelPrediction & { location?: { lat: number; lng: number } };

      if (location) {
        setZoomToLocation(location);
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: isError ? prediction : `🏨 ${prediction}`,
        sender: "ai",
        data: !isError ? { price, currency, confidence, location } : undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now().toString(),
          text: "Sorry, I encountered an error. Please try again.", 
          sender: "ai" 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const mappedHotels = messages
    .filter((m) => m.data?.price && m.data?.currency)
    .map((m) => ({
      query: m.text,
      price: m.data?.price ?? 0,
      currency: m.data?.currency ?? 'KSH',
      location: m.data?.location
    }));

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <button 
          onClick={() => setShowHistory(!showHistory)} 
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
        >
          {showHistory ? <PanelLeftClose className="text-white" /> : <PanelLeftOpen className="text-white" />}
        </button>
        <div className="flex items-center gap-2">
          <Hotel className="text-yellow-300" />
          <h1 className="text-lg font-bold">Kenya Hotel AI</h1>
          <Sparkles className="text-yellow-300" />
        </div>
        <button 
          onClick={() => setShowMap(!showMap)} 
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
        >
          {showMap ? <PanelRightClose className="text-white" /> : <PanelRightOpen className="text-white" />}
        </button>
      </div>

      {/* History Area */}
      <div className={`${showHistory ? "flex" : "hidden"} md:flex w-full md:w-[300px] transition-all duration-300`}>
        <Card className="w-full flex flex-col bg-gradient-to-b from-purple-50 to-pink-50 border-0 shadow-lg">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5" />
              <h2 className="text-lg font-bold">Search History</h2>
            </div>
            <button 
              onClick={() => setShowHistory(false)} 
              className="md:hidden p-1 rounded-full hover:bg-white/20"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {messages
              .filter((m) => m.sender === "user")
              .map((msg) => (
                <div 
                  key={msg.id}
                  onClick={() => setInput(msg.text)}
                  className="p-3 rounded-lg bg-white/80 backdrop-blur-sm border border-purple-100 shadow-sm hover:shadow-md transition-all cursor-pointer hover:bg-white"
                >
                  <p className="text-purple-800">{msg.text}</p>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <Card className="h-full flex flex-col bg-gradient-to-b from-white to-blue-50 border-0 shadow-lg mx-0 md:mx-2">
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <h2 className="text-lg font-bold">Hotel Assistant</h2>
            </div>
            <div className="flex gap-2">
              <Star className="w-5 h-5 text-yellow-300" />
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4 bg-gradient-to-b from-white/50 to-blue-50/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div 
                  className={`p-4 rounded-2xl max-w-[90%] md:max-w-[80%] shadow-sm transition-all ${
                    msg.sender === "user" 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none" 
                      : "bg-gradient-to-r from-white to-purple-50 border border-purple-100 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.data?.price && (
                    <div className="mt-3 p-3 bg-white/90 rounded-lg shadow-inner">
                      <div className="flex items-center gap-2 text-blue-600">
                        <span className="font-bold">💵 {msg.data.price} {msg.data.currency}</span>
                        <span className="text-sm px-2 py-1 bg-blue-100 rounded-full">
                          {msg.data.confidence} confidence
                        </span>
                      </div>
                      {msg.data.location && (
                        <button 
                          onClick={() => msg.data?.location && setZoomToLocation(msg.data.location)}
                          className="mt-2 flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
                        >
                          <MapPin className="w-4 h-4" />
                          Show on map
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-white to-purple-50 border border-purple-100 rounded-bl-none max-w-[80%]">
                  <div className="flex items-center gap-2 text-purple-600">
                    <div className="animate-pulse flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                      <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                      <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                    </div>
                    <span>Analyzing hotel prices...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t bg-gradient-to-r from-pink-100 to-white/50">
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Ask about hotel prices..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }} 
              />
              <Button 
                variant="outline" 
                onClick={handleSendMessage} 
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Map Area */}
      <div className={`${showMap ? "flex" : "hidden"} md:flex w-full md:w-[500px] transition-all duration-300`}>
        <HotelPriceMap hotels={mappedHotels} zoomToLocation={zoomToLocation} />
      </div>
    </div>
  );
}