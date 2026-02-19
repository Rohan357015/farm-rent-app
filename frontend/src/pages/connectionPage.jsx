import { useEffect, useState } from "react";
import { useConnectionStore } from "../store/connection.store";
import { useAuthStore } from "../store/authstore.js"; 

/* ─────────────────────────────────────────────
   Tiny helpers
───────────────────────────────────────────── */
const Avatar = ({ name = "?" }) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colors = [
    "#2d6a4f", "#1b4332", "#40916c", "#52b788",
    "#1e6091", "#154360", "#1a5276", "#117a65",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      style={{ background: color }}
      className="avatar-circle"
    >
      {initials}
    </div>
  );
};

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
);

/* ─────────────────────────────────────────────
   ConnectionCard
───────────────────────────────────────────── */
const ConnectionCard = ({ conn, currentUserId, actions }) => {
  const isReceiver = conn.receiverId === currentUserId || conn.receiver?._id === currentUserId;
  const isPending = conn.status === "Pending";
  const isAccepted = conn.status === "Accepted";
  const isSentByMe = conn.senderId === currentUserId || conn.sender?._id === currentUserId;

  const person = isSentByMe ? conn.receiver : conn.sender;
  const personName = person?.name || "Unknown";
  const personEmail = person?.email || "";
  const role = isSentByMe ? conn.receiverRole : conn.senderRole;

  return (
    <div className="conn-card">
      <div className="conn-card-left">
        <Avatar name={personName} />
        <div className="conn-info">
          <p className="conn-name">{personName}</p>
          <p className="conn-email">{personEmail}</p>
          <p className="conn-role">{role}</p>
        </div>
      </div>

      <div className="conn-card-right">
        <StatusBadge status={conn.status} />

        <div className="conn-actions">
          {/* Incoming pending → Accept / Decline */}
          {isPending && isReceiver && (
            <>
              <button
                className="btn btn-accept"
                onClick={() => actions.accept(conn._id)}
              >
                ✓ Accept
              </button>
              <button
                className="btn btn-decline"
                onClick={() => actions.decline(conn._id)}
              >
                ✗ Decline
              </button>
            </>
          )}

          {/* Sent pending → Withdraw */}
          {isPending && isSentByMe && (
            <button
              className="btn btn-withdraw"
              onClick={() => actions.withdraw(conn._id)}
            >
              Withdraw
            </button>
          )}

          {/* Accepted → Remove */}
          {isAccepted && (
            <button
              className="btn btn-remove"
              onClick={() => actions.remove(conn._id)}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Tabs
───────────────────────────────────────────── */
const TABS = ["All", "Connected", "Pending Received", "Pending Sent"];

/* ─────────────────────────────────────────────
   ConnectionsPage
───────────────────────────────────────────── */
export default function ConnectionsPage() {
  const {
    connections,
    loading,
    fetchConnections,
    acceptConnectionRequest,
    declineConnectionRequest,
    removeConnection,
    withdrawRequest,
    initSocketListeners,
    removeSocketListeners,
  } = useConnectionStore();

  const { authUser } = useAuthStore(); // { id, role, ... }
  const currentUserId = authUser?._id || authUser?.id;

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchConnections();
    initSocketListeners();
    return () => removeSocketListeners();
  }, []);

  /* ── Filter by tab ── */
  const filtered = connections.filter((c) => {
    const isSentByMe =
      c.senderId === currentUserId || c.sender?._id === currentUserId;
    const isReceiver =
      c.receiverId === currentUserId || c.receiver?._id === currentUserId;

    if (activeTab === "Connected") return c.status === "Accepted";
    if (activeTab === "Pending Received")
      return c.status === "Pending" && isReceiver;
    if (activeTab === "Pending Sent")
      return c.status === "Pending" && isSentByMe;
    return true;
  });

  /* ── Search filter ── */
  const displayed = filtered.filter((c) => {
    const name =
      (c.sender?.name || "") + " " + (c.receiver?.name || "");
    return name.toLowerCase().includes(search.toLowerCase());
  });

  /* ── Tab counts ── */
  const counts = {
    All: connections.length,
    Connected: connections.filter((c) => c.status === "Accepted").length,
    "Pending Received": connections.filter(
      (c) =>
        c.status === "Pending" &&
        (c.receiverId === currentUserId || c.receiver?._id === currentUserId)
    ).length,
    "Pending Sent": connections.filter(
      (c) =>
        c.status === "Pending" &&
        (c.senderId === currentUserId || c.sender?._id === currentUserId)
    ).length,
  };

  const actions = {
    accept: acceptConnectionRequest,
    decline: declineConnectionRequest,
    remove: removeConnection,
    withdraw: withdrawRequest,
  };

  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cp-root {
          min-height: 100vh;
          background: #0d1117;
          color: #e6edf3;
          font-family: 'Sora', sans-serif;
          padding: 2rem;
        }

        /* Header */
        .cp-header {
          max-width: 860px;
          margin: 0 auto 2.5rem;
        }
        .cp-title {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, #58d68d, #1abc9c, #3498db);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.3rem;
        }
        .cp-subtitle {
          font-size: 0.85rem;
          color: #7d8590;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.05em;
        }

        /* Search */
        .cp-search-wrap {
          max-width: 860px;
          margin: 0 auto 1.5rem;
        }
        .cp-search {
          width: 100%;
          background: #161b22;
          border: 1px solid #30363d;
          color: #e6edf3;
          padding: 0.7rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: 'Sora', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .cp-search:focus { border-color: #58d68d; }
        .cp-search::placeholder { color: #484f58; }

        /* Tabs */
        .cp-tabs {
          max-width: 860px;
          margin: 0 auto 1.5rem;
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 2px;
        }
        .cp-tabs::-webkit-scrollbar { display: none; }
        .tab-btn {
          background: #161b22;
          border: 1px solid #30363d;
          color: #7d8590;
          padding: 0.45rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.8rem;
          font-family: 'Sora', sans-serif;
          white-space: nowrap;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .tab-btn:hover { border-color: #58d68d; color: #e6edf3; }
        .tab-btn.active {
          background: #1a2f23;
          border-color: #58d68d;
          color: #58d68d;
          font-weight: 600;
        }
        .tab-count {
          background: #21262d;
          border-radius: 10px;
          padding: 0 6px;
          font-size: 0.72rem;
          font-family: 'JetBrains Mono', monospace;
          color: inherit;
        }
        .tab-btn.active .tab-count { background: #2d6a4f; }

        /* List */
        .cp-list {
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* Card */
        .conn-card {
          background: #161b22;
          border: 1px solid #21262d;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          transition: border-color 0.2s, transform 0.15s;
          animation: fadeUp 0.3s ease both;
        }
        .conn-card:hover {
          border-color: #30363d;
          transform: translateY(-1px);
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .conn-card-left { display: flex; align-items: center; gap: 1rem; }
        .conn-card-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.6rem;
        }

        /* Avatar */
        .avatar-circle {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          flex-shrink: 0;
          color: #fff;
        }

        /* Info */
        .conn-name { font-weight: 600; font-size: 0.95rem; color: #e6edf3; }
        .conn-email { font-size: 0.78rem; color: #7d8590; margin-top: 1px; }
        .conn-role {
          font-size: 0.72rem;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #40916c;
          margin-top: 3px;
        }

        /* Badge */
        .badge {
          font-size: 0.7rem;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          padding: 2px 10px;
          border-radius: 20px;
          letter-spacing: 0.05em;
        }
        .badge-pending  { background: #2d2a1a; color: #e6a817; border: 1px solid #5a4700; }
        .badge-accepted { background: #1a2f23; color: #58d68d; border: 1px solid #2d6a4f; }
        .badge-rejected { background: #2a1a1a; color: #e05c5c; border: 1px solid #6a2d2d; }

        /* Action buttons */
        .conn-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: flex-end; }
        .btn {
          padding: 0.38rem 0.85rem;
          border-radius: 7px;
          border: none;
          cursor: pointer;
          font-size: 0.78rem;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          transition: all 0.15s;
          letter-spacing: 0.01em;
        }
        .btn-accept  { background: #2d6a4f; color: #d8f3dc; }
        .btn-accept:hover  { background: #40916c; }
        .btn-decline { background: #3d1a1a; color: #f4a0a0; }
        .btn-decline:hover { background: #5c2828; }
        .btn-withdraw { background: #21262d; color: #8b949e; border: 1px solid #30363d; }
        .btn-withdraw:hover { background: #30363d; color: #e6edf3; }
        .btn-remove  { background: #21262d; color: #e05c5c; border: 1px solid #3d1a1a; }
        .btn-remove:hover  { background: #3d1a1a; }

        /* Empty */
        .cp-empty {
          max-width: 860px;
          margin: 4rem auto;
          text-align: center;
          color: #484f58;
        }
        .cp-empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .cp-empty-title { font-size: 1.1rem; font-weight: 600; color: #7d8590; margin-bottom: 0.4rem; }
        .cp-empty-sub { font-size: 0.82rem; }

        /* Loading */
        .cp-loading {
          max-width: 860px;
          margin: 4rem auto;
          text-align: center;
          color: #7d8590;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          animation: pulse 1.4s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        @media (max-width: 600px) {
          .cp-root { padding: 1rem; }
          .conn-card { flex-direction: column; align-items: flex-start; }
          .conn-card-right { align-items: flex-start; width: 100%; }
        }
      `}</style>

      <div className="cp-root">
        {/* Header */}
        <div className="cp-header">
          <h1 className="cp-title">My Network</h1>
          <p className="cp-subtitle">// manage connections & requests</p>
        </div>

        {/* Search */}
        <div className="cp-search-wrap">
          <input
            className="cp-search"
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="cp-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span className="tab-count">{counts[tab]}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <p className="cp-loading">loading connections…</p>
        ) : displayed.length === 0 ? (
          <div className="cp-empty">
            <div className="cp-empty-icon">🌾</div>
            <p className="cp-empty-title">Nothing here yet</p>
            <p className="cp-empty-sub">
              {search
                ? "No connections match your search."
                : "Start connecting with farmers and suppliers!"}
            </p>
          </div>
        ) : (
          <div className="cp-list">
            {displayed.map((conn, i) => (
              <div key={conn._id} style={{ animationDelay: `${i * 0.04}s` }}>
                <ConnectionCard
                  conn={conn}
                  currentUserId={currentUserId}
                  actions={actions}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}