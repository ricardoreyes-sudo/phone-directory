"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, Search, PhoneCall } from "lucide-react";
import FriendCard from "./components/FriendCard";
import AddFriendModal from "./components/AddFriendModal";
import Toast, { ToastMessage } from "./components/Toast";

interface Friend {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: string;
}

export default function HomePage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: "success" | "error", message: string) => {
    setToasts((prev) => [...prev, { id: Date.now(), type, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchFriends = useCallback(async () => {
    try {
      const res = await fetch("/api/friends");
      if (!res.ok) throw new Error("Failed to load");
      setFriends(await res.json());
    } catch {
      addToast("error", "Could not load friends. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const handleAddFriend = async (name: string, phoneNumber: string) => {
    const res = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phoneNumber }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      addToast("error", error ?? "Failed to add friend.");
      throw new Error(error);
    }

    const newFriend: Friend = await res.json();
    setFriends((prev) => [newFriend, ...prev]);
    addToast("success", `${newFriend.name} added to your directory!`);
  };

  const handleCall = async (phoneNumber: string, name: string) => {
    const res = await fetch("/api/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callee: phoneNumber }),
    });

    const data = await res.json();

    if (!res.ok) {
      addToast("error", data?.error ?? `Could not call ${name}.`);
    } else {
      addToast("success", `Call initiated to ${name} (${phoneNumber})`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from your directory?`)) return;

    const res = await fetch(`/api/friends/${id}`, { method: "DELETE" });

    if (!res.ok) {
      addToast("error", `Failed to remove ${name}.`);
      return;
    }

    setFriends((prev) => prev.filter((f) => f.id !== id));
    addToast("success", `${name} has been removed.`);
  };

  const filtered = friends.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.phoneNumber.includes(search)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-sm">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Friend Directory</h1>
              <p className="text-xs text-gray-500">Powered by CloudTalk</p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Friend</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-medium">
              {friends.length} {friends.length === 1 ? "friend" : "friends"} in directory
            </span>
          </div>
        </div>

        {/* Search */}
        {friends.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone number…"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400 shadow-sm"
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading your friends…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            {friends.length === 0 ? (
              <>
                <div className="bg-indigo-100 p-5 rounded-2xl">
                  <Users className="w-10 h-10 text-indigo-400" />
                </div>
                <div>
                  <p className="text-gray-700 font-semibold text-lg">Your directory is empty</p>
                  <p className="text-gray-500 text-sm mt-1">Add a friend to get started!</p>
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Add your first friend
                </button>
              </>
            ) : (
              <>
                <div className="bg-gray-100 p-5 rounded-2xl">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-700 font-semibold text-lg">No results found</p>
                  <p className="text-gray-500 text-sm mt-1">
                    No match for &ldquo;{search}&rdquo;
                  </p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onCall={handleCall}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <AddFriendModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddFriend}
      />
    </div>
  );
}
