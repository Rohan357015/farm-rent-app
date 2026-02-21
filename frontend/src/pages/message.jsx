import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/chat.store.js";
import { useAuthStore } from "../store/authstore.js";
import FarmerNavabar from "./dashboard/navBar2.jsx";

export default function MessageBox() {
  const { user } = useAuthStore();

  const {
    connections,
    selectedUser,
    messages,
    isLoadingConnections,
    isLoadingMessages,
    fetchConnections,
    setSelectedUser,
    sendMessage,
    connectSocket,
    disconnectSocket,
  } = useChatStore();

  const [text, setText] = useState("");
  const [showSidebar, setShowSidebar] = useState(true); // mobile toggle
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    connectSocket(user._id);
    fetchConnections();
    return () => disconnectSocket();
  }, [user?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getOtherUser = (conn) => {
    const sender = conn.senderId;
    const receiver = conn.receiverId;
    if (!sender || !receiver) return null;
    return String(sender._id) === String(user._id) ? receiver : sender;
  };

  const handleSelectUser = (other) => {
    setSelectedUser(other);
    setShowSidebar(false); // on mobile, hide sidebar and show chat
  };

  const handleBack = () => {
    setShowSidebar(true); // on mobile, go back to sidebar
  };

  return (
    <>
    <FarmerNavabar/>
    <div className="flex h-screen bg-yellow-50 text-black overflow-hidden">

      {/* ── SIDEBAR ──────────────────────────────────────────── */}
      <div className={`
        flex flex-col bg-white border-r border-green-200
        w-full md:w-72 lg:w-80 shrink-0
        ${showSidebar ? "flex" : "hidden"} md:flex
      `}>

        {/* Sidebar Header */}
        <div className="px-4 py-3 bg-green-600 text-white font-bold text-lg tracking-wide shrink-0">
          Chats
        </div>

        {/* Search bar */}
        <div className="px-3 py-2 bg-green-50 border-b border-green-100 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-green-200 rounded-lg px-3 py-1.5">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <span className="text-sm text-green-400">Search chats</span>
          </div>
        </div>

        {/* Connection List */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingConnections ? (
            <div className="flex flex-col gap-3 px-4 pt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-green-100 shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-green-100 rounded w-28 mb-2" />
                    <div className="h-2.5 bg-green-50 rounded w-40" />
                  </div>
                </div>
              ))}
            </div>
          ) : connections.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-5.197-3.793M9 20H4v-2a4 4 0 015.197-3.793M15 7a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 11-6 0 3 3 0 016 0zM3 11a3 3 0 116 0 3 3 0 01-6 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No accepted connections</p>
            </div>
          ) : (
            connections.map((conn) => {
              const other = getOtherUser(conn);
              if (!other) return null;
              const isActive = String(selectedUser?._id) === String(other._id);
              const initials = (other.name || other.username || "?")
                .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

              return (
                <div
                  key={conn._id}
                  onClick={() => handleSelectUser(other)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-green-50 transition-colors
                    ${isActive ? "bg-green-100 border-l-4 border-l-green-500" : "hover:bg-green-50"}
                  `}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-sm shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${isActive ? "font-semibold text-green-800" : "font-medium text-black"}`}>
                      {other.name || other.username || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">Tap to chat</p>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── CHAT AREA ─────────────────────────────────────────── */}
      <div className={`
        flex-1 flex flex-col bg-yellow-50 overflow-hidden
        ${!showSidebar ? "flex" : "hidden"} md:flex
      `}>

        {!selectedUser ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-green-700">Select a chat</p>
              <p className="text-sm text-gray-400 mt-1">Choose a connection from the left to start messaging</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-green-600 text-white shrink-0 shadow-sm">
              {/* Back button — mobile only */}
              <button
                onClick={handleBack}
                className="md:hidden p-1 rounded-full hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-green-400 text-white flex items-center justify-center font-semibold text-sm shrink-0">
                {(selectedUser.name || selectedUser.username || "?")
                  .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight truncate">
                  {selectedUser.name || selectedUser.username}
                </p>
                <p className="text-xs text-green-200">online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
              {isLoadingMessages ? (
                <div className="flex items-center justify-center flex-1">
                  <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-gray-400 bg-white px-4 py-2 rounded-full border border-green-100">
                    No messages yet — say hello! 👋
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine =
                    String(msg.senderId?._id || msg.senderId) === String(user._id);
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <span className={`
                        px-4 py-2 rounded-2xl text-sm leading-relaxed max-w-xs md:max-w-md break-words shadow-sm
                        ${isMine
                          ? "bg-green-500 text-white rounded-br-sm"
                          : "bg-white text-black border border-green-100 rounded-bl-sm"
                        }
                      `}>
                        {msg.text}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Bar */}
            <div className="px-4 py-3 bg-white border-t border-green-100 flex items-end gap-3 shrink-0">
              <textarea
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 resize-none bg-yellow-50 border border-green-200 rounded-xl px-4 py-2.5 text-sm text-black placeholder-gray-400 outline-none focus:border-green-400 focus:ring-1 focus:ring-green-300 max-h-32 overflow-y-auto leading-relaxed transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!text.trim()}
                className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-green-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}