"use client";
import { useState, useEffect } from "react";
import type { PlatformCredential, PlatformName } from "@/lib/supabase";

interface PlatformInfo {
  name: PlatformName;
  label: string;
  icon: string;
  color: string;
  description: string;
  fields: { key: string; label: string; placeholder: string; secret?: boolean }[];
}

const PLATFORMS: PlatformInfo[] = [
  {
    name: "telegram",
    label: "Telegram",
    icon: "TG",
    color: "#26A5E4",
    description: "Easiest to set up. Create a bot via @BotFather, create a channel, add the bot as admin.",
    fields: [
      { key: "bot_token", label: "Bot Token", placeholder: "123456:ABCdefGHI...", secret: true },
      { key: "channel_id", label: "Channel ID", placeholder: "@yourchannel or -100XXXX" },
    ],
  },
  {
    name: "instagram",
    label: "Instagram",
    icon: "IG",
    color: "#E4405F",
    description: "Requires Business account linked to a Facebook Page. Needs Meta App Review (2-6 weeks).",
    fields: [
      { key: "access_token", label: "Access Token", placeholder: "Meta Graph API token", secret: true },
      { key: "instagram_business_id", label: "Instagram Business ID", placeholder: "17841400..." },
      { key: "facebook_page_id", label: "Facebook Page ID", placeholder: "1234567890" },
    ],
  },
  {
    name: "facebook",
    label: "Facebook",
    icon: "FB",
    color: "#1877F2",
    description: "Post to your Facebook Page. Uses the same Meta Developer App as Instagram.",
    fields: [
      { key: "page_access_token", label: "Page Access Token", placeholder: "Long-lived page token", secret: true },
      { key: "page_id", label: "Page ID", placeholder: "1234567890" },
    ],
  },
  {
    name: "twitter",
    label: "Twitter / X",
    icon: "X",
    color: "#000000",
    description: "Free tier: 1,500 tweets/month (text only). Apply at developer.twitter.com.",
    fields: [
      { key: "api_key", label: "API Key", placeholder: "Your API key", secret: true },
      { key: "api_secret", label: "API Secret", placeholder: "Your API secret", secret: true },
      { key: "access_token", label: "Access Token", placeholder: "User access token", secret: true },
      { key: "access_token_secret", label: "Access Token Secret", placeholder: "User access token secret", secret: true },
    ],
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    icon: "LI",
    color: "#0A66C2",
    description: "Post to your profile or company page. Tokens expire in 60 days — auto-refreshed.",
    fields: [
      { key: "access_token", label: "Access Token", placeholder: "OAuth 2.0 token", secret: true },
      { key: "refresh_token", label: "Refresh Token", placeholder: "For auto-renewal", secret: true },
      { key: "person_urn", label: "Person/Org URN", placeholder: "urn:li:person:XXXX" },
    ],
  },
  {
    name: "threads",
    label: "Threads",
    icon: "TH",
    color: "#000000",
    description: "Uses Meta Graph API. Requires Instagram Business account.",
    fields: [
      { key: "access_token", label: "Access Token", placeholder: "Threads API token", secret: true },
      { key: "threads_user_id", label: "Threads User ID", placeholder: "1234567890" },
    ],
  },
  {
    name: "youtube",
    label: "YouTube",
    icon: "YT",
    color: "#FF0000",
    description: "Upload Shorts & videos. Enable YouTube Data API v3 in Google Cloud Console.",
    fields: [
      { key: "access_token", label: "Access Token", placeholder: "OAuth 2.0 token", secret: true },
      { key: "refresh_token", label: "Refresh Token", placeholder: "For auto-renewal", secret: true },
      { key: "channel_id", label: "Channel ID", placeholder: "UCxxxxxxxx" },
    ],
  },
  {
    name: "pinterest",
    label: "Pinterest",
    icon: "PI",
    color: "#BD081C",
    description: "Post pins with images. Good for Data Drop visuals and infographics.",
    fields: [
      { key: "access_token", label: "Access Token", placeholder: "OAuth 2.0 token", secret: true },
      { key: "refresh_token", label: "Refresh Token", placeholder: "For auto-renewal", secret: true },
      { key: "board_id", label: "Board ID", placeholder: "1234567890" },
    ],
  },
  {
    name: "whatsapp",
    label: "WhatsApp",
    icon: "WA",
    color: "#25D366",
    description: "WhatsApp Business Cloud API. Requires pre-approved message templates.",
    fields: [
      { key: "access_token", label: "Access Token", placeholder: "WhatsApp Cloud API token", secret: true },
      { key: "phone_number_id", label: "Phone Number ID", placeholder: "1234567890" },
      { key: "waba_id", label: "Business Account ID", placeholder: "1234567890" },
    ],
  },
  {
    name: "reddit",
    label: "Reddit",
    icon: "RD",
    color: "#FF4500",
    description: "Post to subreddits. Create app at reddit.com/prefs/apps.",
    fields: [
      { key: "client_id", label: "Client ID", placeholder: "App client ID", secret: true },
      { key: "client_secret", label: "Client Secret", placeholder: "App client secret", secret: true },
      { key: "username", label: "Username", placeholder: "Your Reddit username" },
      { key: "password", label: "Password", placeholder: "Your Reddit password", secret: true },
      { key: "subreddit", label: "Subreddit", placeholder: "IndianStudents" },
    ],
  },
];

export default function PlatformConnector() {
  const [credentials, setCredentials] = useState<PlatformCredential[]>([]);
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/platforms")
      .then((r) => r.json())
      .then((data) => setCredentials(data.platforms || []))
      .catch(() => {});
  }, []);

  const getStatus = (platform: string) => {
    const cred = credentials.find((c) => c.platform === platform);
    return cred?.status || "disconnected";
  };

  async function connect(platform: PlatformInfo) {
    setSaving(true);
    const body: Record<string, string> = {};
    platform.fields.forEach((f) => {
      if (formData[`${platform.name}.${f.key}`]) {
        body[f.key] = formData[`${platform.name}.${f.key}`];
      }
    });

    try {
      const res = await fetch(`/api/platforms/${platform.name}/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        // Refresh
        const data = await fetch("/api/platforms").then((r) => r.json());
        setCredentials(data.platforms || []);
        setExpandedPlatform(null);
        setFormData({});
      }
    } catch {}
    setSaving(false);
  }

  async function disconnect(platform: string) {
    if (!confirm(`Disconnect ${platform}?`)) return;
    await fetch(`/api/platforms/${platform}/disconnect`, { method: "POST" });
    const data = await fetch("/api/platforms").then((r) => r.json());
    setCredentials(data.platforms || []);
  }

  return (
    <div>
      <p className="text-xs text-slate-500 mb-6">
        Connect your social media accounts. Telegram is the easiest — start there to test. Meta platforms (Instagram, Facebook, Threads, WhatsApp) require App Review.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PLATFORMS.map((p) => {
          const status = getStatus(p.name);
          const isExpanded = expandedPlatform === p.name;
          const isConnected = status === "connected";

          return (
            <div
              key={p.name}
              className={`bg-white/[0.03] border rounded-xl overflow-hidden transition ${
                isConnected ? "border-green-500/20" : "border-white/[0.06]"
              }`}
            >
              {/* Card header */}
              <div className="p-4 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `${p.color}30` }}
                >
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-200">{p.label}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isConnected
                          ? "bg-green-500/10 text-green-400"
                          : status === "expired"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-slate-500/10 text-slate-500"
                      }`}
                    >
                      {status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {isConnected && (
                    <button
                      onClick={() => disconnect(p.name)}
                      className="text-[10px] text-red-400/50 hover:text-red-400 font-semibold"
                    >
                      Disconnect
                    </button>
                  )}
                  <button
                    onClick={() => setExpandedPlatform(isExpanded ? null : p.name)}
                    className="text-[10px] font-semibold px-2 py-1 rounded-lg transition"
                    style={{ background: `${p.color}15`, color: p.color }}
                  >
                    {isExpanded ? "Close" : isConnected ? "Update" : "Connect"}
                  </button>
                </div>
              </div>

              {/* Expanded form */}
              {isExpanded && (
                <div className="border-t border-white/[0.04] p-4 bg-white/[0.01]">
                  <div className="space-y-2">
                    {p.fields.map((f) => (
                      <div key={f.key}>
                        <label className="text-[10px] text-slate-500 font-semibold block mb-1">
                          {f.label}
                        </label>
                        <input
                          type={f.secret ? "password" : "text"}
                          placeholder={f.placeholder}
                          value={formData[`${p.name}.${f.key}`] || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, [`${p.name}.${f.key}`]: e.target.value }))
                          }
                          className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-teal-500/30"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => connect(p)}
                    disabled={saving}
                    className="mt-3 w-full text-xs font-semibold py-2 rounded-lg transition"
                    style={{ background: `${p.color}20`, color: p.color }}
                  >
                    {saving ? "Saving..." : "Save & Connect"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
