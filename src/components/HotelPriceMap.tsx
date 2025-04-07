"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Sample hotel data
const hotels = [
  { id: 1, name: "Nairobi Serena Hotel", price: "KES 20,000", lat: -1.286389, lng: 36.817223 },
  { id: 2, name: "Fairmont The Norfolk", price: "KES 22,000", lat: -1.279167, lng: 36.815556 },
  { id: 3, name: "Sarova Stanley", price: "KES 18,000", lat: -1.2868, lng: 36.8185 },
  { id: 4, name: "Villa Rosa Kempinski", price: "KES 25,000", lat: -1.2568, lng: 36.8011 },
  { id: 5, name: "Windsor Golf Hotel & Country Club", price: "KES 15,000", lat: -1.2432, lng: 36.8500 },
  { id: 6, name: "The Sands at Nomad", price: "KES 14,600", lat: -4.2762, lng: 39.5917 },
  { id: 7, name: "Fairmont Mount Kenya Safari Club", price: "KES 12,800", lat: -0.1672, lng: 37.0704 },
  { id: 8, name: "Medina Palms", price: "KES 19,000", lat: -3.3776, lng: 39.8428 },
  { id: 9, name: "Sarova Lion Hill Game Lodge", price: "KES 16,000", lat: -0.3037, lng: 36.0823 },
  { id: 10, name: "Diamonds Leisure Beach & Golf Resort", price: "KES 10,000", lat: -4.3127, lng: 39.5956 },
  { id: 11, name: "The Boma Nairobi", price: "KES 12,000", lat: -1.2788, lng: 36.8126 },
  { id: 12, name: "Ole Sereni Hotel", price: "KES 14,000", lat: -1.3315, lng: 36.8990 },
  { id: 13, name: "Voyager Beach Resort", price: "KES 13,500", lat: -4.0580, lng: 39.6755 },
  { id: 14, name: "PrideInn Hotel Westlands", price: "KES 9,000", lat: -1.2679, lng: 36.8187 },
  { id: 15, name: "Safari Park Hotel", price: "KES 12,050", lat: -1.2364, lng: 36.9217 },
  { id: 16, name: "Best Western Plus Meridian Hotel", price: "KES 8,000", lat: -1.2790, lng: 36.8195 },
  { id: 17, name: "Bahari Beach Hotel", price: "KES 9,300", lat: -4.0661, lng: 39.7797 },
  { id: 18, name: "The Monarch Hotel", price: "KES 8,500", lat: -1.2714, lng: 36.8154 },
  { id: 19, name: "The Concord Hotel and Suites", price: "KES 11,000", lat: -1.2489, lng: 36.8086 },
  { id: 20, name: "Cloud Hotel and Suites", price: "KES 7,500", lat: -1.2452, lng: 36.8217 },
  { id: 21, name: "Novotel Nairobi Westlands", price: "KES 13,000", lat: -1.2683, lng: 36.8028 },
  { id: 22, name: "ibis Styles Hotel Westlands", price: "KES 10,000", lat: -1.2675, lng: 36.8054 },
  { id: 23, name: "Mövenpick Hotel & Residences Nairobi", price: "KES 18,500", lat: -1.2632, lng: 36.8028 },
  { id: 24, name: "Crowne Plaza Nairobi Airport", price: "KES 15,000", lat: -1.3225, lng: 36.9254 },
  { id: 25, name: "Diani Reef Beach Resort & Spa", price: "KES 12,000", lat: -4.2875, lng: 39.5869 },
  { id: 26, name: "Leopard Beach Resort & Spa", price: "KES 14,000", lat: -4.2892, lng: 39.5938 },
  { id: 27, name: "Baobab Beach Resort & Spa", price: "KES 11,500", lat: -4.3811, lng: 39.5500 },
  { id: 28, name: "Sarova Whitesands Beach Resort & Spa", price: "KES 16,000", lat: -3.9788, lng: 39.7445 },
  { id: 29, name: "Pinewood Beach Resort & Spa", price: "KES 13,200", lat: -4.4400, lng: 39.5500 },
  { id: 30, name: "Neptune Paradise Beach Resort & Spa", price: "KES 10,800", lat: -4.4025, lng: 39.5500 },
  { id: 31, name: "Severin Sea Lodge", price: "KES 9,500", lat: -3.9780, lng: 39.7440 },
  { id: 32, name: "PrideInn Paradise Beach Resort", price: "KES 14,500", lat: -3.9445, lng: 39.7875 },
  { id: 33, name: "Southern Palms Beach Resort", price: "KES 12,300", lat: -4.2800, lng: 39.5900 },
  { id: 34, name: "Voyager Ziwani Tented Camp", price: "KES 18,000", lat: -3.4000, lng: 37.6000 },
  { id: 35, name: "Ashnil Mara Camp", price: "KES 20,000", lat: -1.4061, lng: 35.0151 },
  { id: 36, name: "Mara Serena Safari Lodge", price: "KES 22,500", lat: -1.4095, lng: 35.0151 },
  { id: 37, name: "Radisson Blu Hotel Nairobi Upper Hill", price: "KES 18,000", lat: -1.3006, lng: 36.8175 },
  { id: 38, name: "Hemingways Nairobi", price: "KES 30,000", lat: -1.3466, lng: 36.6958 },
  { id: 39, name: "Sarova Panafric", price: "KES 15,500", lat: -1.2921, lng: 36.8123 },
  { id: 40, name: "InterContinental Nairobi", price: "KES 17,000", lat: -1.2884, lng: 36.8233 },
  { id: 41, name: "The Heron Portico", price: "KES 10,500", lat: -1.2900, lng: 36.8100 },
  { id: 42, name: "Eka Hotel Nairobi", price: "KES 12,000", lat: -1.3222, lng: 36.8550 },
  { id: 43, name: "Tribe Hotel", price: "KES 22,000", lat: -1.2232, lng: 36.8028 },
  { id: 44, name: "The Sarova Stanley", price: "KES 16,000", lat: -1.2868, lng: 36.8219 },
  { id: 45, name: "Fairview Hotel", price: "KES 14,000", lat: -1.2925, lng: 36.8120 },
  { id: 46, name: "Ole-Sereni Hotel", price: "KES 14,500", lat: -1.3225, lng: 36.8550 },
  { id: 47, name: "Tamarind Tree Hotel", price: "KES 13,000", lat: -1.3094, lng: 36.8100 },
  { id: 48, name: "The Boma Nairobi", price: "KES 12,500", lat: -1.3123, lng: 36.8289 },
  { id: 49, name: "Sankara Nairobi", price: "KES 19,000", lat: -1.2644, lng: 36.8028 },
  { id: 50, name: "The Social House Nairobi", price: "KES 15,000", lat: -1.2920, lng: 36.7830 },
  { id: 51, name: "Crowne Plaza Nairobi Airport", price: "KES 18,000", lat: -1.3192, lng: 36.9254 },
  { id: 52, name: "Hilton Garden Inn Nairobi Airport", price: "KES 16,500", lat: -1.3225, lng: 36.9254 },
  { id: 53, name: "The Panari Hotel", price: "KES 11,000", lat: -1.3225, lng: 36.8889 },
  { id: 54, name: "Best Western Plus Meridian Hotel", price: "KES 9,500", lat: -1.2833, lng: 36.8219 },
  { id: 55, name: "Ibis Styles Nairobi Westlands", price: "KES 10,000", lat: -1.2675, lng: 36.8054 },
  { id: 56, name: "PrideInn Azure Hotel Nairobi", price: "KES 11,500", lat: -1.2644, lng: 36.8028 },
  { id: 57, name: "The Concord Hotel & Suites", price: "KES 13,000", lat: -1.2489, lng: 36.8086 },
  { id: 58, name: "Golden Tulip Westlands Nairobi", price: "KES 12,000", lat: -1.2644, lng: 36.8028 },
  { id: 59, name: "Jacaranda Nairobi Hotel", price: "KES 10,500", lat: -1.2644, lng: 36.8028 },
  { id: 60, name: "The Monarch Hotel", price: "KES 8,500", lat: -1.2920, lng: 36.7830 },
  { id: 61, name: "Swiss Lenana Mount Hotel", price: "KES 9,000", lat: -1.2925, lng: 36.8120 },
  { id: 62, name: "Weston Hotel", price: "KES 11,000", lat: -1.3192, lng: 36.8550 },
  { id: 63, name: "Lotos Inn & Suites", price: "KES 7,500", lat: -1.2644, lng: 36.8028 },
  { id: 64, name: "Warwick Centre", price: "KES 8,000", lat: -1.2232, lng: 36.8028 },
  { id: 65, name: "Ngong Hills Hotel", price: "KES 9,500", lat: -1.2920, lng: 36.7830 },
  { id: 66, name: "The Clarion Hotel", price: "KES 8,000", lat: -1.2833, lng: 36.8219 },
  { id: 67, name: "Hotel Royal Orchid Azure Nairobi", price: "KES 11,500", lat: -1.2644, lng: 36.8028 },
  { id: 68, name: "Eastland Hotel", price: "KES 9,000", lat: -1.2920, lng: 36.7830 },
  { id: 69, name: "The King Post", price: "KES 10,000", lat: -1.2644, lng: 36.8028 },
  { id: 70, name: "La Maison Royale", price: "KES 9,500", lat: -1.2644, lng: 36.8028 },
  { id: 71, name: "The Zehneria Portico", price: "KES 8,500", lat: -1.2644, lng: 36.8028 },
  { id: 72, name: "Progressive Park Hotel", price: "KES 7,000", lat: -1.2644, lng: 36.8028 },
  { id: 73, name: "Novotel Nairobi Westlands", price: "KES 12,000", lat: -1.2683, lng: 36.8025 },
  { id: 74, name: "Mövenpick Hotel & Residences Nairobi", price: "KES 18,000", lat: -1.2644, lng: 36.8028 },
  { id: 75, name: "Sarova Whitesands Beach Resort & Spa", price: "KES 15,000", lat: -3.9788, lng: 39.7440 },
  { id: 76, name: "Diani Reef Beach Resort & Spa", price: "KES 14,500", lat: -4.2875, lng: 39.5941 },
  { id: 77, name: "PrideInn Paradise Beach Resort", price: "KES 13,000", lat: -3.9440, lng: 39.7576 },
  { id: 78, name: "Baobab Beach Resort & Spa", price: "KES 16,000", lat: -4.3833, lng: 39.5500 },
  { id: 79, name: "Neptune Paradise Beach Resort & Spa", price: "KES 14,000", lat: -4.4095, lng: 39.5296 },
  { id: 80, name: "Southern Palms Beach Resort", price: "KES 15,500", lat: -4.2800, lng: 39.5950 },
  { id: 81, name: "Leopard Beach Resort & Spa", price: "KES 17,000", lat: -4.4333, lng: 39.5500 },
  { id: 82, name: "Swahili Beach Resort", price: "KES 18,500", lat: -4.2800, lng: 39.5930 },
  { id: 83, name: "The Sands at Chale Island", price: "KES 20,000", lat: -4.4333, lng: 39.5500 },
  { id: 84, name: "Voyager Beach Resort", price: "KES 13,500", lat: -4.0283, lng: 39.7194 },
  { id: 85, name: "Serena Beach Resort & Spa", price: "KES 16,000", lat: -3.9450, lng: 39.7570 },
  { id: 86, name: "Turtle Bay Beach Club", price: "KES 12,000", lat: -3.3614, lng: 40.0014 },
  { id: 87, name: "Hemingways Watamu", price: "KES 22,000", lat: -3.3530, lng: 40.0010 },
  { id: 88, name: "Medina Palms", price: "KES 19,000", lat: -3.3614, lng: 40.0014 },
  { id: 89, name: "Ocean Beach Resort & Spa", price: "KES 14,500", lat: -3.2170, lng: 40.1160 },
  { id: 90, name: "Kilili Baharini Resort & Spa", price: "KES 13,000", lat: -3.2170, lng: 40.1160 },
  { id: 91, name: "Diamonds Dream of Africa", price: "KES 18,000", lat: -3.2170, lng: 40.1160 },
  { id: 92, name: "Sandies Tropical Village", price: "KES 12,500", lat: -3.2170, lng: 40.1160 },
  { id: 93, name: "Kobe Suite Resort", price: "KES 15,000", lat: -4.3833, lng: 39.5500 },
  { id: 94, name: "AfroChic Diani Beach", price: "KES 25,000", lat: -4.2800, lng: 39.5930 },
  { id: 95, name: "The Majlis Resort", price: "KES 30,000", lat: -2.2695, lng: 40.9020 },
  { id: 96, name: "Lantana Galu Beach", price: "KES 14,000", lat: -4.3833, lng: 39.5500 },
  { id: 97, name: "Pinewood Beach Resort & Spa", price: "KES 13,500", lat: -4.4095, lng: 39.5296 },
  { id: 98, name: "Kinondo Kwetu", price: "KES 28,000", lat: -4.4333, lng: 39.5500 },
  { id: 99, name: "Amani Tiwi Beach Resort", price: "KES 12,000", lat: -4.2800, lng: 39.5950 },
  { id: 100, name: "Papillon Lagoon Reef", price: "KES 11,500", lat: -4.2800, lng: 39.5930 },
  { id: 101, name: "Jacaranda Indian Ocean Beach Resort", price: "KES 13,000", lat: -4.2800, lng: 39.5950 },
  { id: 102, name: "The Sands at Nomad", price: "KES 14,600", lat: -4.2762, lng: 39.5917 },
  { id: 103, name: "Baobab Sea Lodge", price: "KES 10,000", lat: -3.6093, lng: 39.8400 },
  { id: 104, name: "Silver Palm Spa & Resort", price: "KES 16,000", lat: -3.6093, lng: 39.8400 },
  { id: 105, name: "Sun Palm Beach Resort", price: "KES 12,000", lat: -3.3614, lng: 40.0014 },
  { id: 106, name: "Temple Point Resort", price: "KES 11,500", lat: -3.3614, lng: 40.0014 },
  { id: 107, name: "Kivulini Luxury Resort", price: "KES 13,000", lat: -3.2170, lng: 40.1160 },
  { id: 108, name: "Flamingo Beach Resort & Spa", price: "KES 14,000", lat: -3.9788, lng: 39.7440 },
  { id: 109, name: "Radisson Blu Hotel, Nairobi Upper Hill", price: "KES 22,000", lat: -1.2921, lng: 36.8219 },
  { id: 110, name: "ibis Styles Nairobi Westlands", price: "KES 10,000", lat: -1.2674, lng: 36.8028 },
  { id: 111, name: "Crowne Plaza Nairobi Airport", price: "KES 18,000", lat: -1.3192, lng: 36.9258 },
  { id: 112, name: "The Sarova Stanley", price: "KES 15,000", lat: -1.2868, lng: 36.8219 },
  { id: 113, name: "Villa Rosa Kempinski Nairobi", price: "KES 25,000", lat: -1.2683, lng: 36.8110 },
  { id: 114, name: "Mövenpick Hotel & Residences Nairobi", price: "KES 20,000", lat: -1.2644, lng: 36.8028 },
  { id: 115, name: "Fairview Hotel Nairobi", price: "KES 14,000", lat: -1.2900, lng: 36.8100 },
  { id: 116, name: "The Boma Nairobi", price: "KES 12,000", lat: -1.3220, lng: 36.8370 },
  { id: 117, name: "Sankara Nairobi", price: "KES 22,000", lat: -1.2685, lng: 36.8055 },
  { id: 118, name: "Eka Hotel Nairobi", price: "KES 13,500", lat: -1.3225, lng: 36.8880 },
  { id: 119, name: "Tribe Hotel Nairobi", price: "KES 19,000", lat: -1.2320, lng: 36.8040 },
  { id: 120, name: "Hilton Garden Inn Nairobi Airport", price: "KES 16,000", lat: -1.3190, lng: 36.9250 },
  { id: 121, name: "Ole Sereni Hotel", price: "KES 14,000", lat: -1.3220, lng: 36.8880 },
  { id: 122, name: "The Heron Portico", price: "KES 11,000", lat: -1.2905, lng: 36.8105 },
  { id: 123, name: "Sarova Panafric", price: "KES 13,000", lat: -1.2900, lng: 36.8100 },
  { id: 124, name: "The Concord Hotel and Suites", price: "KES 12,500", lat: -1.2490, lng: 36.8080 },
  { id: 125, name: "Best Western Plus Meridian Hotel", price: "KES 10,000", lat: -1.2790, lng: 36.8210 },
  { id: 126, name: "The Monarch Hotel", price: "KES 9,000", lat: -1.2920, lng: 36.8210 },
  { id: 127, name: "PrideInn Azure Hotel Nairobi", price: "KES 11,500", lat: -1.2680, lng: 36.8050 },
  { id: 128, name: "Nairobi Serena Hotel", price: "KES 20,000", lat: -1.2860, lng: 36.8160 },
  { id: 129, name: "Fairmont The Norfolk", price: "KES 22,000", lat: -1.2790, lng: 36.8150 },
  { id: 130, name: "Sarova Whitesands Beach Resort & Spa", price: "KES 15,000", lat: -3.9788, lng: 39.7440 },
  { id: 131, name: "Diani Reef Beach Resort & Spa", price: "KES 14,500", lat: -4.2875, lng: 39.5941 },
  { id: 132, name: "PrideInn Paradise Beach Resort", price: "KES 13,000", lat: -3.9440, lng: 39.7576 },
  { id: 133, name: "Baobab Beach Resort & Spa", price: "KES 16,000", lat: -4.3833, lng: 39.5500 },
  { id: 134, name: "Neptune Paradise Beach Resort & Spa", price: "KES 14,000", lat: -4.4095, lng: 39.5296 },
  { id: 135, name: "Southern Palms Beach Resort", price: "KES 15,500", lat: -4.2800, lng: 39.5950 },
  { id: 136, name: "Leopard Beach Resort & Spa", price: "KES 17,000", lat: -4.4333, lng: 39.5500 },
  { id: 137, name: "Swahili Beach Resort", price: "KES 18,500", lat: -4.2800, lng: 39.5930 },
  { id: 138, name: "The Sands at Chale Island", price: "KES 20,000", lat: -4.4333, lng: 39.5500 },
  { id: 139, name: "Voyager Beach Resort", price: "KES 13,500", lat: -4.0283, lng: 39.7194 },
  { id: 140, name: "Serena Beach Resort & Spa", price: "KES 16,000", lat: -3.9450, lng: 39.7570 },
  { id: 141, name: "Turtle Bay Beach Club", price: "KES 12,000", lat: -3.3614, lng: 40.0014 },
  { id: 142, name: "Hemingways Watamu", price: "KES 22,000", lat: -3.3530, lng: 40.0010 },
  { id: 143, name: "Medina Palms", price: "KES 19,000", lat: -3.3614, lng: 40.0014 },
  { id: 144, name: "Ocean Beach Resort & Spa", price: "KES 14,500", lat: -3.2170, lng: 40.1160 },
  { id: 145, name: "Kilili Baharini Resort & Spa", price: "KES 15,000", lat: -3.2180, lng: 40.1160 },
  { id: 146, name: "The Sands at Nomad", price: "KES 14,600", lat: -4.2762, lng: 39.5917 },
  { id: 147, name: "Fairmont Mount Kenya Safari Club", price: "KES 12,800", lat: -0.1672, lng: 37.0704 },
  { id: 148, name: "Sarova Lion Hill Game Lodge", price: "KES 16,000", lat: -0.3037, lng: 36.0823 },
  { id: 149, name: "Diamonds Leisure Beach & Golf Resort", price: "KES 10,000", lat: -4.3127, lng: 39.5956 },
  { id: 150, name: "The Boma Nairobi", price: "KES 12,000", lat: -1.2788, lng: 36.8126 },
  { id: 151, name: "Ole Sereni Hotel", price: "KES 14,000", lat: -1.3315, lng: 36.8990 },
  { id: 152, name: "Voyager Beach Resort", price: "KES 13,500", lat: -4.0580, lng: 39.6755 },
  { id: 153, name: "PrideInn Hotel Westlands", price: "KES 9,000", lat: -1.2679, lng: 36.8187 },
  { id: 154, name: "Safari Park Hotel", price: "KES 12,050", lat: -1.2364, lng: 36.9217 },
  { id: 155, name: "Best Western Plus Meridian Hotel", price: "KES 8,000", lat: -1.2790, lng: 36.8195 },
  { id: 156, name: "Bahari Beach Hotel", price: "KES 9,300", lat: -4.0661, lng: 39.7797 },
  { id: 157, name: "The Monarch Hotel", price: "KES 8,500", lat: -1.2714, lng: 36.8154 },
  { id: 158, name: "The Concord Hotel and Suites", price: "KES 11,000", lat: -1.2489, lng: 36.8086 },
  { id: 159, name: "Cloud Hotel and Suites", price: "KES 7,500", lat: -1.2452, lng: 36.8217 },
  { id: 160, name: "Radisson Blu Hotel, Nairobi Upper Hill", price: "KES 22,000", lat: -1.2921, lng: 36.8219 },
  { id: 161, name: "ibis Styles Nairobi Westlands", price: "KES 10,000", lat: -1.2674, lng: 36.8028 },
  { id: 162, name: "Crowne Plaza Nairobi Airport", price: "KES 18,000", lat: -1.3192, lng: 36.9258 },
  { id: 163, name: "Sankara Nairobi", price: "KES 22,000", lat: -1.2685, lng: 36.8055 },
  { id: 164, name: "Eka Hotel Nairobi", price: "KES 13,500", lat: -1.3225, lng: 36.8880 },
  { id: 165, name: "Tribe Hotel Nairobi", price: "KES 19,000", lat: -1.2320, lng: 36.8040 },
  { id: 166, name: "Hilton Garden Inn Nairobi Airport", price: "KES 16,000", lat: -1.3190, lng: 36.9250 },
  { id: 167, name: "The Heron Portico", price: "KES 11,000", lat: -1.2905, lng: 36.8105 },
  { id: 168, name: "Sarova Panafric", price: "KES 13,000", lat: -1.2900, lng: 36.8100 },
  { id: 169, name: "PrideInn Azure Hotel Nairobi", price: "KES 11,500", lat: -1.2680, lng: 36.8050 },
  { id: 170, name: "Sarova Whitesands Beach Resort & Spa", price: "KES 15,000", lat: -3.9788, lng: 39.7440 },
  { id: 171, name: "Diani Reef Beach Resort & Spa", price: "KES 14,500", lat: -4.2875, lng: 39.5941 },
  { id: 172, name: "PrideInn Paradise Beach Resort", price: "KES 13,000", lat: -3.9440, lng: 39.7576 },
  { id: 173, name: "Baobab Beach Resort & Spa", price: "KES 16,000", lat: -4.3833, lng: 39.5500 },
  { id: 174, name: "Neptune Paradise Beach Resort & Spa", price: "KES 14,000", lat: -4.4095, lng: 39.5296 },
  { id: 175, name: "Southern Palms Beach Resort", price: "KES 15,500", lat: -4.2800, lng: 39.5950 },
  { id: 176, name: "Leopard Beach Resort & Spa", price: "KES 17,000", lat: -4.4333, lng: 39.5500 },
  { id: 177, name: "Swahili Beach Resort", price: "KES 18,500", lat: -4.2800, lng: 39.5930 },
  { id: 178, name: "The Sands at Chale Island", price: "KES 20,000", lat: -4.4333, lng: 39.5500 },
  { id: 179, name: "Serena Beach Resort & Spa", price: "KES 16,000", lat: -3.9450, lng: 39.7570 },
  { id: 180, name: "Turtle Bay Beach Club", price: "KES 12,000", lat: -3.3614, lng: 40.0014 },
  { id: 181, name: "Hemingways Watamu", price: "KES 24,000", lat: -3.3533, lng: 40.0020 },
  { id: 182, name: "Turtle Bay Beach Club", price: "KES 12,000", lat: -3.3614, lng: 40.0014 },
  { id: 183, name: "Sarova Whitesands Beach Resort & Spa", price: "KES 15,000", lat: -3.9788, lng: 39.7440 },
  { id: 184, name: "Diani Reef Beach Resort & Spa", price: "KES 14,500", lat: -4.2875, lng: 39.5941 },
  { id: 185, name: "PrideInn Paradise Beach Resort", price: "KES 13,000", lat: -3.9440, lng: 39.7576 },
  { id: 186, name: "Baobab Beach Resort & Spa", price: "KES 16,000", lat: -4.3833, lng: 39.5500 },
  { id: 187, name: "Neptune Paradise Beach Resort & Spa", price: "KES 14,000", lat: -4.4095, lng: 39.5296 },
  { id: 188, name: "Southern Palms Beach Resort", price: "KES 15,500", lat: -4.2800, lng: 39.5950 },
  { id: 189, name: "Leopard Beach Resort & Spa", price: "KES 17,000", lat: -4.4333, lng: 39.5500 },
  { id: 190, name: "Swahili Beach Resort", price: "KES 18,500", lat: -4.2800, lng: 39.5930 },
  { id: 191, name: "The Sands at Chale Island", price: "KES 20,000", lat: -4.4333, lng: 39.5500 },
  { id: 192, name: "Serena Beach Resort & Spa", price: "KES 16,000", lat: -3.9450, lng: 39.7570 },
  { id: 193, name: "Voyager Beach Resort", price: "KES 13,500", lat: -4.0580, lng: 39.6755 },
  { id: 194, name: "Pinewood Beach Resort and Spa", price: "KES 14,200", lat: -4.4380, lng: 39.5550 },
  { id: 195, name: "The Maji Beach Boutique Hotel", price: "KES 22,000", lat: -4.2800, lng: 39.5950 },
  { id: 196, name: "AfroChic Diani", price: "KES 25,000", lat: -4.2800, lng: 39.5950 },
  { id: 197, name: "The Sands at Nomad", price: "KES 14,600", lat: -4.2762, lng: 39.5917 },
  { id: 198, name: "Lantana Galu Beach", price: "KES 15,000", lat: -4.2800, lng: 39.5950 },
  { id: 199, name: "Msambweni Beach House", price: "KES 30,000", lat: -4.4700, lng: 39.5000 },
  { id: 200, name: "Diani Sea Lodge", price: "KES 12,000", lat: -4.2800, lng: 39.5950 },
  { id: 201, name: "Diani Sea Resort", price: "KES 13,000", lat: -4.2800, lng: 39.5950 },
  { id: 202, name: "Neptune Village Beach Resort & Spa", price: "KES 14,000", lat: -4.4095, lng: 39.5296 },
  { id: 203, name: "Neptune Palm Beach Boutique Resort & Spa", price: "KES 15,000", lat: -4.4095, lng: 39.5296 },
  { id: 204, name: "Papillon Lagoon Reef Hotel", price: "KES 11,500", lat: -4.2800, lng: 39.5950 },
  { id: 205, name: "Jacaranda Indian Ocean Beach Resort", price: "KES 14,000", lat: -4.2800, lng: 39.5950 },
  { id: 206, name: "Amani Tiwi Beach Resort", price: "KES 13,500", lat: -4.2800, lng: 39.5950 },
  { id: 207, name: "Hillpark Hotel - Tiwi Beach", price: "KES 10,000", lat: -4.2800, lng: 39.5950 },
  { id: 208, name: "Kole Kole - Baobab Beach Resort", price: "KES 16,500", lat: -4.3833, lng: 39.5500 },
  { id: 209, name: "Maridadi - Baobab Beach Resort", price: "KES 16,500", lat: -4.3833, lng: 39.5500 },
  { id: 210, name: "The Zubeida", price: "KES 20,000", lat: -4.2800, lng: 39.5950 },
  { id: 211, name: "Bahari Dhow Beach Villas", price: "KES 9,000", lat: -4.2800, lng: 39.5950 },
  { id: 212, name: "Morning Star Diani", price: "KES 8,500", lat: -4.2800, lng: 39.5950 },
  { id: 213, name: "Doric Cottages Diani", price: "KES 7,500", lat: -4.2800, lng: 39.5950 },
  { id: 214, name: "Galu Inn", price: "KES 6,500", lat: -4.2800, lng: 39.5950 },
  { id: 215, name: "Sheba Cottages", price: "KES 5,500", lat: -4.2800, lng: 39.5950 },
  { id: 216, name: "Bidi Badu Beach Resort", price: "KES 6,000", lat: -4.2800, lng: 39.5950 },
  { id: 217, name: "Novotel Nairobi Westlands", price: "KES 15,000", lat: -1.2674, lng: 36.8028 },
  { id: 218, name: "Crowne Plaza Nairobi Airport", price: "KES 18,000", lat: -1.3192, lng: 36.9258 },
  { id: 219, name: "ibis Styles Nairobi Westlands", price: "KES 10,500", lat: -1.2674, lng: 36.8028 },
  { id: 220, name: "Mövenpick Hotel & Residences Nairobi", price: "KES 20,000", lat: -1.2632, lng: 36.8025 },
  { id: 221, name: "The Sarova Stanley", price: "KES 14,000", lat: -1.2868, lng: 36.8219 },
  { id: 222, name: "Radisson Blu Hotel Nairobi Upper Hill", price: "KES 22,000", lat: -1.3001, lng: 36.8175 },
  { id: 223, name: "Hilton Garden Inn Nairobi Airport", price: "KES 16,500", lat: -1.3225, lng: 36.9254 },
  { id: 224, name: "Fairview Hotel Nairobi", price: "KES 13,500", lat: -1.2921, lng: 36.8123 },
  { id: 225, name: "The Boma Nairobi", price: "KES 15,000", lat: -1.3171, lng: 36.8375 },
  { id: 226, name: "Eka Hotel Nairobi", price: "KES 14,500", lat: -1.3222, lng: 36.8845 },
  { id: 227, name: "PrideInn Azure Hotel Nairobi", price: "KES 12,000", lat: -1.2644, lng: 36.8029 },
  { id: 228, name: "Golden Tulip Westlands Nairobi", price: "KES 11,500", lat: -1.2640, lng: 36.8026 },
  { id: 229, name: "Best Western Plus Meridian Hotel", price: "KES 9,500", lat: -1.2833, lng: 36.8219 },
  { id: 230, name: "The Heron Portico", price: "KES 10,000", lat: -1.2925, lng: 36.8128 },
  { id: 231, name: "Sarova Panafric", price: "KES 13,000", lat: -1.2921, lng: 36.8125 },
  { id: 232, name: "Villa Rosa Kempinski Nairobi", price: "KES 25,000", lat: -1.2625, lng: 36.8010 },
  { id: 233, name: "Nairobi Serena Hotel", price: "KES 20,000", lat: -1.2864, lng: 36.8172 },
  { id: 234, name: "Fairmont The Norfolk", price: "KES 22,000", lat: -1.2791, lng: 36.8156 },
  { id: 235, name: "Four Points by Sheraton Nairobi Airport", price: "KES 19,000", lat: -1.3192, lng: 36.9258 },
  { id: 236, name: "Four Points by Sheraton Nairobi Hurlingham", price: "KES 14,000", lat: -1.2921, lng: 36.8123 },
  { id: 237, name: "Tamarind Tree Hotel Nairobi", price: "KES 13,500", lat: -1.3064, lng: 36.8344 },
  { id: 238, name: "Ole Sereni Hotel", price: "KES 14,000", lat: -1.3225, lng: 36.8845 },
  { id: 239, name: "The Concord Hotel and Suites", price: "KES 11,000", lat: -1.2489, lng: 36.8086 },
  { id: 240, name: "Cloud Hotel and Suites", price: "KES 7,500", lat: -1.2452, lng: 36.8217 },
  { id: 241, name: "La Maison Royale Nairobi", price: "KES 10,500", lat: -1.2647, lng: 36.8029 },
  { id: 242, name: "The Monarch Hotel", price: "KES 8,500", lat: -1.2714, lng: 36.8154 },
  { id: 243, name: "Waridi Paradise Hotel & Suites", price: "KES 9,000", lat: -1.2921, lng: 36.8123 },
  { id: 244, name: "Lotos Inn & Suites", price: "KES 8,000", lat: -1.2640, lng: 36.8026 },
  { id: 245, name: "The Clarion Hotel", price: "KES 9,500", lat: -1.2833, lng: 36.8219 },
  { id: 246, name: "The Kenya Comfort Hotel Suites", price: "KES 7,000", lat: -1.2925, lng: 36.8128 },
  { id: 247, name: "The Ndemi Place", price: "KES 6,500", lat: -1.2921, lng: 36.8125 },
  { id: 248, name: "The Emory Hotel", price: "KES 9,000", lat: -1.2644, lng: 36.8029 },
  { id: 249, name: "The Grand Gables", price: "KES 8,000", lat: -1.2640, lng: 36.8026 },
  { id: 250, name: "The King Post", price: "KES 10,000", lat: -1.2647, lng: 36.8029 },
  { id: 251, name: "The Palacina Residence & Suites", price: "KES 15,000", lat: -1.2921, lng: 36.8123 },
  { id: 252, name: "The Yaya Hotel & Apartments", price: "KES 12,000", lat: -1.2925, lng: 36.8128 },
  { id: 253, name: "Omega Gardens Hotel", price: "KES 5,000", lat: -0.4865, lng: 37.1274 },
  { id: 254, name: "Derby Place Hotel", price: "KES 4,500", lat: -0.4880, lng: 37.1270 },
  { id: 255, name: "The Plantains Place", price: "KES 4,000", lat: -0.4870, lng: 37.1265 },
  { id: 256, name: "Ibis Hotel", price: "KES 3,800", lat: -0.4860, lng: 37.1280 },
  { id: 257, name: "County Inn Hotel", price: "KES 4,200", lat: -0.4855, lng: 37.1278 },
  { id: 258, name: "Kings Meat World Hotel", price: "KES 4,000", lat: -0.4875, lng: 37.1268 },
  { id: 259, name: "3 In 1 Hotel", price: "KES 3,500", lat: -0.4868, lng: 37.1272 },
  { id: 260, name: "Coconut Palm Hotel", price: "KES 4,300", lat: -0.4862, lng: 37.1285 },
  { id: 261, name: "Rhino Watch Safari Lodge", price: "KES 15,000", lat: -0.1833, lng: 36.9333 },
  { id: 262, name: "The Ark Lodge", price: "KES 18,000", lat: -0.3667, lng: 36.7833 },
  { id: 263, name: "Jaqanaz Resort", price: "KES 12,000", lat: -0.4167, lng: 36.9500 },
  { id: 264, name: "The White Rhino Hotel", price: "KES 10,000", lat: -0.4200, lng: 36.9510 },
  { id: 265, name: "Green Hills Hotel", price: "KES 9,500", lat: -0.4220, lng: 36.9505 },
  { id: 266, name: "Eland Safari Hotel Nyeri", price: "KES 8,500", lat: -0.4215, lng: 36.9520 },
  { id: 267, name: "Davis Court Nyeri", price: "KES 8,000", lat: -0.4230, lng: 36.9515 },
  { id: 268, name: "Tranquil Inn", price: "KES 7,500", lat: -0.4240, lng: 36.9508 },
  { id: 269, name: "The Peak Meadows Hotel", price: "KES 7,000", lat: -0.4250, lng: 36.9502 },
  { id: 270, name: "Le Pristine Wellness and Healing Hotel", price: "KES 11,000", lat: -0.4260, lng: 36.9495 },
  { id: 271, name: "The Plantations Place", price: "KES 6,500", lat: -0.4270, lng: 36.9490 },
  { id: 272, name: "Oldoiyo Lengai Resort & Bistro", price: "KES 9,000", lat: -0.4280, lng: 36.9485 },
  { id: 273, name: "The Monarch Hotel", price: "KES 8,500", lat: -1.2714, lng: 36.8154 },
  { id: 274, name: "The Concord Hotel and Suites", price: "KES 11,000", lat: -1.2489, lng: 36.8086 },
  { id: 275, name: "Cloud Hotel and Suites", price: "KES 7,500", lat: -1.2452, lng: 36.8217 },
  { id: 276, name: "La Maison Royale Nairobi", price: "KES 10,500", lat: -1.2647, lng: 36.8029 },
  { id: 277, name: "The Monarch Hotel", price: "KES 8,500", lat: -1.2714, lng: 36.8154 },
  { id: 278, name: "Waridi Paradise Hotel & Suites", price: "KES 9,000", lat: -1.2921, lng: 36.8123 },
  { id: 279, name: "Lotos Inn & Suites", price: "KES 8,000", lat: -1.2640, lng: 36.8026 },
  { id: 280, name: "The Clarion Hotel", price: "KES 9,500", lat: -1.2833, lng: 36.8219 },
  { id: 281, name: "The Kenya Comfort Hotel Suites", price: "KES 7,000", lat: -1.2925, lng: 36.8128 },
  { id: 282, name: "The Ndemi Place", price: "KES 6,500", lat: -1.2921, lng: 36.8125 },
  { id: 283, name: "The Emory Hotel", price: "KES 9,000", lat: -1.2644, lng: 36.8029 },
  { id: 284, name: "The Grand Gables", price: "KES 8,000", lat: -1.2640, lng: 36.8026 },
  { id: 285, name: "The King Post", price: "KES 10,000", lat: -1.2647, lng: 36.8029 },
  { id: 286, name: "The Palacina Residence & Suites", price: "KES 15,000", lat: -1.2921, lng: 36.8123 },
  { id: 287, name: "The Yaya Hotel & Apartments", price: "KES 12,000", lat: -1.2925, lng: 36.8128 },
  { id: 288, name: "The Woodmere Serviced Apartments", price: "KES 9,000", lat: -1.2921, lng: 36.8125 },
  { id: 289, name: "The Boma Inn Nairobi", price: "KES 10,000", lat: -1.3171, lng: 36.8375 },
  { id: 290, name: "The White Rhino Hotel", price: "KES 10,000", lat: -0.4200, lng: 36.9510 },
  { id: 291, name: "Green Hills Hotel", price: "KES 9,500", lat: -0.4220, lng: 36.9505 },
  { id: 292, name: "Eland Safari Hotel Nyeri", price: "KES 8,500", lat: -0.4215, lng: 36.9520 },
  { id: 293, name: "Davis Court Nyeri", price: "KES 8,000", lat: -0.4230, lng: 36.9515 },
  { id: 294, name: "Tranquil Inn", price: "KES 7,500", lat: -0.4240, lng: 36.9508 },
  { id: 295, name: "The Peak Meadows Hotel", price: "KES 7,000", lat: -0.4250, lng: 36.9502 },
  { id: 296, name: "Le Pristine Wellness and Healing Hotel", price: "KES 11,000", lat: -0.4260, lng: 36.9495 },
  { id: 297, name: "The Plantations Place", price: "KES 6,500", lat: -0.4270, lng: 36.9490 },
  { id: 298, name: "Oldoiyo Lengai Resort & Bistro", price: "KES 9,000", lat: -0.4280, lng: 36.9485 },
  { id: 299, name: "The Ark Lodge", price: "KES 18,000", lat: -0.3667, lng: 36.7833 },
  { id: 300, name: "Outspan Hotel", price: "KES 12,000", lat: -0.4235, lng: 36.9512 },
  { id: 301, name: "Treetops Lodge", price: "KES 15,000", lat: -0.3667, lng: 36.7833 },
  { id: 302, name: "Aberdare Country Club", price: "KES 14,000", lat: -0.3000, lng: 36.8500 },
  { id: 303, name: "Kuniville Guest House", price: "KES 5,500", lat: -0.4290, lng: 36.9475 },
  { id: 304, name: "Batian Grand Hotel", price: "KES 6,000", lat: -0.4300, lng: 36.9468 },
  { id: 305, name: "Westwood Hotel", price: "KES 7,200", lat: -0.4310, lng: 36.9460 },
  { id: 306, name: "Ibiza Club", price: "KES 4,800", lat: -0.4320, lng: 36.9455 },
  { id: 307, name: "Golden Gates Hotel", price: "KES 5,200", lat: -0.4330, lng: 36.9448 },
  { id: 308, name: "Annabelle Guest House", price: "KES 4,500", lat: -0.4340, lng: 36.9440 },
  { id: 309, name: "Senior Chief Wambugu Palace", price: "KES 6,800", lat: -0.4350, lng: 36.9435 },
  { id: 310, name: "Sweetwaters Serena Camp", price: "KES 20,000", lat: -0.0400, lng: 36.9670 },
  { id: 311, name: "Rhino Watch Safari Lodge", price: "KES 15,000", lat: -0.1833, lng: 36.9333 },
  { id: 312, name: "Fairmont Mount Kenya Safari Club", price: "KES 22,000", lat: 0.0679, lng: 37.1343 },
  { id: 313, name: "FK Resort & Spa", price: "KES 13,000", lat: -0.4360, lng: 36.9428 },
  { id: 314, name: "Maru B Court Hotel", price: "KES 5,800", lat: -0.4370, lng: 36.9420 },
  { id: 315, name: "Ibis Hotel Nyeri", price: "KES 6,200", lat: -0.4380, lng: 36.9415 },
  { id: 316, name: "Jaqanaz Resort", price: "KES 12,000", lat: -0.4167, lng: 36.9500 },
  { id: 317, name: "The Stay Comfort", price: "KES 5,000", lat: -0.4390, lng: 36.9408 },
  { id: 318, name: "Thayo Place", price: "KES 4,700", lat: -0.4400, lng: 36.9400 },
  { id: 319, name: "Rawin Hotel", price: "KES 5,300", lat: -0.4410, lng: 36.9395 },
  { id: 320, name: "Sagada Resort Lamuria", price: "KES 6,500", lat: -0.4420, lng: 36.9388 },
  { id: 321, name: "Laikipia Comfort Hotel", price: "KES 7,000", lat: -0.4430, lng: 36.9380 },
  { id: 322, name: "The Coconut Palm Hotel", price: "KES 4,900", lat: -0.4440, lng: 36.9375 },
  { id: 323, name: "The Golden Palm Hotel", price: "KES 5,100", lat: -0.4450, lng: 36.9368 },
  { "id": 326, "name": "The Blue Hills Hotel", "price": "KES 5,800", "lat": -0.4480, "lng": 36.9348 },
  { "id": 327, "name": "The Coconut Palm Hotel", "price": "KES 4,900", "lat": -0.4440, "lng": 36.9375 },
  { "id": 328, "name": "The Golden Palm Hotel", "price": "KES 5,100", "lat": -0.4450, "lng": 36.9368 },
  { "id": 329, "name": "The Silver Springs Hotel", "price": "KES 5,600", "lat": -0.4460, "lng": 36.9360 },
  { "id": 330, "name": "The Royal Court Hotel", "price": "KES 6,200", "lat": -0.4470, "lng": 36.9355 },
  { "id": 331, "name": "The Ark Lodge", "price": "KES 18,000", "lat": -0.3667, "lng": 36.7833 },
  { "id": 332, "name": "Outspan Hotel", "price": "KES 12,000", "lat": -0.4235, "lng": 36.9512 },
  { "id": 333, "name": "Aberdare Country Club", "price": "KES 14,000", "lat": -0.3000, "lng": 36.8500 },
  { "id": 334, "name": "Sweetwaters Serena Camp", "price": "KES 20,000", "lat": -0.0400, "lng": 36.9670 },
  { "id": 335, "name": "Rhino Watch Safari Lodge", "price": "KES 15,000", "lat": -0.1833, "lng": 36.9333 },
  { "id": 336, "name": "Fairmont Mount Kenya Safari Club", "price": "KES 22,000", "lat": 0.0679, "lng": 37.1343 },
  { "id": 337, "name": "FK Resort & Spa", "price": "KES 13,000", "lat": -0.4360, "lng": 36.9428 },
  { "id": 338, "name": "Maru B Court Hotel", "price": "KES 5,800", "lat": -0.4370, "lng": 36.9420 },
  { "id": 339, "name": "Ibis Hotel Nyeri", "price": "KES 6,200", "lat": -0.4380, "lng": 36.9415 },
  { "id": 340, "name": "Jaqanaz Resort", "price": "KES 12,000", "lat": -0.4167, "lng": 36.9500 },
  { "id": 341, "name": "The Stay Comfort", "price": "KES 5,000", "lat": -0.4390, "lng": 36.9408 },
  { "id": 342, "name": "Thayo Place", "price": "KES 4,700", "lat": -0.4400, "lng": 36.9400 },
  { "id": 343, "name": "Rawin Hotel", "price": "KES 5,300", "lat": -0.4410, "lng": 36.9395 },
  { "id": 344, "name": "Sagada Resort Lamuria", "price": "KES 6,500", "lat": -0.4420, "lng": 36.9388 },
  { "id": 345, "name": "Laikipia Comfort Hotel", "price": "KES 7,000", "lat": -0.4430, "lng": 36.9380 },
  { "id": 346, "name": "Derby Place Hotel", "price": "KES 6,500", "lat": -0.4850, "lng": 37.1270 },
  { "id": 347, "name": "Oldoiyo Lengai Resort & Bistro", "price": "KES 7,000", "lat": -0.4820, "lng": 37.1250 },
  { "id": 348, "name": "Ibis Hotel", "price": "KES 5,500", "lat": -0.4860, "lng": 37.1280 },
  { "id": 349, "name": "The Plantains Place", "price": "KES 6,000", "lat": -0.4840, "lng": 37.1260 },
  { "id": 350, "name": "Omega Gardens Hotel", "price": "KES 6,800", "lat": -0.4800, "lng": 37.1240 },
  { "id": 351, "name": "Aberdare Gardens and Resort", "price": "KES 7,200", "lat": -0.4790, "lng": 37.1230 },
  { "id": 352, "name": "Prestige Guest House", "price": "KES 5,200", "lat": -0.4870, "lng": 37.1290 },
  { "id": 353, "name": "Mwahe Resort", "price": "KES 6,300", "lat": -0.4780, "lng": 37.1220 },
  { "id": 354, "name": "The Trade Centre Guest House", "price": "KES 5,000", "lat": -0.4880, "lng": 37.1300 },
  { "id": 355, "name": "Ibis 2000", "price": "KES 5,700", "lat": -0.4890, "lng": 37.1310 },
];

// Custom Leaflet Icon for the markers
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -40],
});

// Helper component to update map view based on center
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function HotelPriceMap() {
  const [mapCenter, setMapCenter] = useState<[number, number]>([-1.286389, 36.817223]); // Default to Nairobi
  const [budget, setBudget] = useState<number | null>(null); // Initially no budget filter
  const [search, setSearch] = useState(""); // Search query for hotel names
  const [nearbyHotels, setNearbyHotels] = useState(hotels); // Hotels to display on map

  // Get user's geolocation and update map center
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude]);
      },
      () => console.log("Location access denied"),
      { enableHighAccuracy: true }
    );
  }, []);

  // Apply budget filter when it's set
  useEffect(() => {
    if (budget !== null) {
      setNearbyHotels(hotels.filter((hotel) => Number(hotel.price.replace(/[^0-9]/g, "")) <= budget));
    } else {
      setNearbyHotels(hotels); // Show all hotels if no budget is set
    }
  }, [budget]);

  // Search for a hotel by name and center the map on its location
  const handleSearch = () => {
    const hotel = hotels.find((h) => h.name.toLowerCase().includes(search.toLowerCase()));
    if (hotel) {
      setMapCenter([hotel.lat, hotel.lng]);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="mb-4 w-full sm:w-96 flex flex-col items-center">
        {/* Search Input */}
        <div className="mb-4 flex items-center justify-center space-x-2 w-full">
          <input
            type="text"
            className="border p-2 rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search for a hotel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="p-2 from-pink-500 to-purple-500 text-white rounded-lg shadow-md hover:bg-pink-500 transition-all"
          >
            🔍
          </button>
        </div>

        {/* Budget Filter */}
        <div className="w-full text-center">
          <label className="text-gray-700 font-semibold">Filter by Budget: {budget ? `KES ${budget}` : "No Filter"}</label>
          <input
            type="range"
            min="5000"
            max="25000"
            step="500"
            value={budget || 25000} // Default to max when no filter is set
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full mt-2 from-pink-500 to-purple-500"
          />
        </div>
      </div>

      {/* Map Component */}
      <MapContainer center={mapCenter} zoom={12} className="w-full h-full rounded-lg shadow-lg">
        <MapUpdater center={mapCenter} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {nearbyHotels.map((hotel) => (
          <Marker key={hotel.id} position={[hotel.lat, hotel.lng]} icon={customIcon}>
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg text-blue-700">{hotel.name}</h3>
                <p className="text-gray-600">KES {hotel.price}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
