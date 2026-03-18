import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Send, Trash2, Globe, Shield, Users } from "lucide-react";
import { api } from "../../services/api";
import { getUser } from "../../services/auth";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const SCOPES = [
  {
    key: "GENERAL",
    label: "General",
    icon: Globe,
    description: "Visible to all approved users",
  },
  {
    key: "LEADERS",
    label: "Admins & Team Leaders",
    icon: Shield,
    description: "Only admins and team leaders",
  },
  {
    key: "TEAM",
    label: "Team Chat",
    icon: Users,
    description: "Only your team members",
  },
];

export default function ChatBoard() {
  const user = getUser();

  const availableScopes = useMemo(() => {
    return SCOPES.filter((s) => {
      if (s.key === "GENERAL") return true;
      if (s.key === "LEADERS") {
        return user?.role === "ADMIN" || user?.role === "TEAM_LEADER";
      }
      if (s.key === "TEAM") return !!user?.teamId;
      return false;
    });
  }, [user]);

  const [scope, setScope] = useState("GENERAL");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  async function loadMessages(selectedScope = scope) {
    try {
      setLoading(true);
      const res = await api.get(`/chat?scope=${selectedScope}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      setMessages([]);
      alert(err?.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    try {
      if (!text.trim()) return;

      setSending(true);

      await api.post("/chat", {
        scope,
        text: text.trim(),
      });

      setText("");
      loadMessages(scope);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  async function deleteMessage(id) {
    try {
      await api.delete(`/chat/${id}`);
      loadMessages(scope);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete message");
    }
  }

  useEffect(() => {
    if (!availableScopes.some((s) => s.key === scope)) {
      setScope(availableScopes[0]?.key || "GENERAL");
      return;
    }
    loadMessages(scope);
  }, [scope]);

  useEffect(() => {
    const timer = setInterval(() => {
      loadMessages(scope);
    }, 5000);

    return () => clearInterval(timer);
  }, [scope]);

  function formatTime(date) {
    if (!date) return "";
    return new Date(date).toLocaleString();
  }

  const currentScope = availableScopes.find((s) => s.key === scope);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">ChatBoard</h1>
        <p className="mt-1 text-sm text-muted">
          Team communication across general, leadership, and team channels.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {availableScopes.map((item) => {
          const Icon = item.icon;
          const active = scope === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setScope(item.key)}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-[rgb(var(--brand))] bg-[rgb(var(--brand))]/10"
                  : "soft-border card-bg hover:border-[rgb(var(--brand))]/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border soft-border">
                  <Icon className="h-5 w-5 text-[rgb(var(--brand))]" />
                </div>
                <div>
                  <div className="font-bold">{item.label}</div>
                  <div className="text-xs text-muted">{item.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="border-b soft-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border soft-border">
              <MessageSquare className="h-5 w-5 text-[rgb(var(--brand))]" />
            </div>
            <div>
              <div className="font-bold">{currentScope?.label || "Chat"}</div>
              <div className="text-xs text-muted">
                {currentScope?.description}
              </div>
            </div>
          </div>
        </div>

        <div className="h-[420px] overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="text-sm text-muted">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="rounded-2xl border soft-border p-8 text-center">
              <div className="text-sm font-medium">No messages yet</div>
              <div className="mt-1 text-xs text-muted">
                Start the conversation in this channel.
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const isMine = String(m.senderId?._id) === String(user?.id || user?._id);
              const canDelete = isMine || user?.role === "ADMIN";

              return (
                <div
                  key={m._id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl border p-4 ${
                      isMine
                        ? "border-[rgb(var(--brand))]/30 bg-[rgb(var(--brand))]/10"
                        : "soft-border card-bg"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold">
                          {m.senderId?.fullName || "Unknown User"}
                        </div>
                        <div className="text-[11px] text-muted">
                          {m.senderId?.role || "-"}
                          {m.scope === "TEAM" && m.teamId?.name ? ` • ${m.teamId.name}` : ""}
                        </div>
                      </div>

                      {canDelete && (
                        <button
                          onClick={() => deleteMessage(m._id)}
                          className="text-muted hover:text-red-400 transition"
                          title="Delete message"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <p className="mt-3 text-sm whitespace-pre-wrap break-words">
                      {m.text}
                    </p>

                    <div className="mt-2 text-[11px] text-muted">
                      {formatTime(m.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t soft-border p-4">
          <div className="flex gap-3">
            <textarea
              rows={2}
              placeholder={`Write a message to ${currentScope?.label || "chat"}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-2xl border soft-border bg-[rgb(var(--card))] px-4 py-3 text-sm text-[rgb(var(--fg))] outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]/20"
            />

            <Button
              onClick={sendMessage}
              disabled={sending || !text.trim()}
              className="self-end flex items-center gap-2"
            >
              <Send size={16} />
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}