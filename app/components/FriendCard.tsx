"use client";

import { useState } from "react";
import { Phone, Trash2, User } from "lucide-react";

interface Friend {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
}

interface FriendCardProps {
  friend: Friend;
  onCall: (phoneNumber: string, name: string) => Promise<void>;
  onDelete: (id: string, name: string) => void;
}

// Generate a deterministic pastel color based on the name
function getAvatarColor(name: string): string {
  const colors = [
    "bg-violet-100 text-violet-600",
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-orange-100 text-orange-600",
    "bg-pink-100 text-pink-600",
    "bg-teal-100 text-teal-600",
    "bg-amber-100 text-amber-600",
    "bg-cyan-100 text-cyan-600",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function FriendCard({ friend, onCall, onDelete }: FriendCardProps) {
  const [calling, setCalling] = useState(false);

  const handleCall = async () => {
    setCalling(true);
    try {
      await onCall(friend.phoneNumber, friend.name);
    } finally {
      setCalling(false);
    }
  };

  const initials = friend.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const avatarColor = getAvatarColor(friend.name);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md hover:border-indigo-100 transition-all group">
      {/* Avatar */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-base shrink-0 ${avatarColor}`}
      >
        {initials || <User className="w-5 h-5" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{friend.name}</p>
        <p className="text-sm text-gray-500 truncate">{friend.phoneNumber}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleCall}
          disabled={calling}
          title={`Call ${friend.name}`}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
        >
          {calling ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Phone className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{calling ? "Calling…" : "Call"}</span>
        </button>

        <button
          onClick={() => onDelete(friend.id, friend.name)}
          title={`Delete ${friend.name}`}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Delete friend"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
