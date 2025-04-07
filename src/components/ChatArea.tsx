"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { useChat } from "ai/react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, addDoc } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState } from "react";

export function ChatArea() {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: "/api/gemini",
  });

  // Firestore query to fetch hotel prices
  const hotelPricesRef = collection(db, "hotelPrices");
  const hotelQuery = query(hotelPricesRef, orderBy("timestamp", "desc"));
  const [hotelPricesSnapshot] = useCollectionData(hotelQuery);

  // State to handle the zoomed hotel
  const [zoomedHotel, setZoomedHotel] = useState<string | null>(null);

  // Extract structured Firestore responses
  const hotelPrices = hotelPricesSnapshot?.map((doc) => ({
    id: doc.id,
    query: doc.query, // Explicitly map the 'query' field
    response: doc.response, // Map other fields as needed
    timestamp: doc.timestamp,
  }));

  // Function to store user queries & AI responses in Firestore
  const saveToFirestore = async (query: string, response: object) => {
    await addDoc(hotelPricesRef, {
      query,
      response,
      timestamp: new Date(),
    });
  };

  // Function to handle zooming into the specific hotel based on user input
  const zoomToHotel = (query: string) => {
    // Match the query to a specific hotel (simple logic for now, can be more complex)
    const matchedHotel = hotelPrices?.find((hotel) =>
      hotel.query.toLowerCase().includes(query.toLowerCase())
    );
    if (matchedHotel) {
      setZoomedHotel(matchedHotel.id); // Zoom in on the matched hotel
    } else {
      setZoomedHotel(null); // Clear zoom if no match found
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-lg ${
              m.role === "user" ? "bg-blue-100" : "bg-pink-100"
            }`}
          >
            {m.content}
          </div>
        ))}

        {/* Display stored hotel queries */}
        <div className="mt-4">
          <h2 className="text-lg font-bold">Hotel Price Predictions</h2>
          {hotelPrices?.map((hotel) => (
            <div
              key={hotel.id}
              className={`p-3 rounded-lg mt-2 ${
                zoomedHotel === hotel.id ? "bg-yellow-100" : "bg-green-100"
              }`}
            >
              <p className="font-semibold">Query: {hotel.query}</p>
              <pre className="text-gray-700">{JSON.stringify(hotel.response, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!input.trim()) return;

          const userMessage = input;
          handleSubmit(e); // Send to Gemini API

          try {
            const res = await fetch("/api/gemini", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: userMessage }),
            });

            const aiResponse = await res.json(); // Expecting structured response

            append({ role: "assistant", content: JSON.stringify(aiResponse, null, 2) });

            // Save structured response to Firestore
            saveToFirestore(userMessage, aiResponse);

            // Zoom to hotel if the response contains a reference to a hotel
            zoomToHotel(userMessage);
          } catch (err) {
            console.error("Error fetching AI response:", err);
          }
        }}
        className="mt-4 flex flex-col sm:flex-row gap-2"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about hotel prices..."
          className="border-2 border-purple-300 w-full sm:w-auto"
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-500 w-full sm:w-auto mt-2 sm:mt-0"
        >
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
