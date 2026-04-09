"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  Crown,
  Edit3,
  Link2,
  Mail,
  MapPin,
  Monitor,
  Phone,
  Settings,
  Shield,
  Sparkles,
  User2,
} from "lucide-react";

import { useAuth } from "@/context/authContext";
import { getConnectedAccounts, getLoginSessions } from "@/lib/api/auth";
import ProfileSkeleton from "./profileSkeleton";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [extrasLoading, setExtrasLoading] = useState(true);

  useEffect(() => {
    const loadExtras = async () => {
      try {
        const [sessionsRes, connectedRes] = await Promise.allSettled([
          getLoginSessions(),
          getConnectedAccounts(),
        ]);

        if (sessionsRes.status === "fulfilled") {
          setSessions(sessionsRes.value?.data || sessionsRes.value || []);
        } else {
          setSessions([]);
        }

        if (connectedRes.status === "fulfilled") {
          setConnectedAccounts(
            connectedRes.value?.data || connectedRes.value || [],
          );
        } else {
          setConnectedAccounts([]);
        }
      } catch {
        setSessions([]);
        setConnectedAccounts([]);
      } finally {
        setExtrasLoading(false);
      }
    };

    if (user) {
      loadExtras();
    }
  }, [user]);

  const joinedDate = useMemo(() => {
    if (!user?.createdAt) return "Not available";
    try {
      return new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Not available";
    }
  }, [user]);

  const profileCompletion = useMemo(() => {
    if (!user) return 0;

    let total = 5;
    let done = 0;

    if (user?.name) done += 1;
    if (user?.email) done += 1;
    if (user?.contact) done += 1;
    if (user?.image?.url) done += 1;
    if (user?.isVerified) done += 1;

    return Math.round((done / total) * 100);
  }, [user]);

  const emailVerified = !!user?.isVerified;
  const phoneAdded = !!user?.contact;
  const imageUrl = user?.image?.url || "";
  const currentSession = sessions?.[0];

  if (loading || extrasLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-lg font-medium">
            Please login to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  pt-30 bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <section className="overflow-hidden rounded-4xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)]" />

            <div className="relative p-6 md:p-8">
              <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-col items-center gap-5 sm:flex-row">
                  <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-cyan-500/10 shadow-lg ring-4 ring-white/5">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={user?.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-cyan-300">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  <div className="text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      My Profile
                    </div>

                    <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
                      {user?.name}
                    </h1>

                    <p className="mt-2 text-sm text-slate-300 sm:text-base">
                      {user?.email}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                      <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        {user?.role || "user"}
                      </span>

                      {emailVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Email Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                          Email Pending
                        </span>
                      )}

                      {phoneAdded ? (
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                          Phone Added
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-300">
                          Phone Missing
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Completion</p>
                    <p className="mt-2 text-2xl font-bold text-cyan-300">
                      {profileCompletion}%
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Role</p>
                    <p className="mt-2 text-lg font-semibold capitalize">
                      {user?.role || "user"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Joined</p>
                    <p className="mt-2 text-lg font-semibold">{joinedDate}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-400">Status</p>
                    <p className="mt-2 text-lg font-semibold text-green-300">
                      Active
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/account-settings"
                  className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Link>

                <Link
                  href="/account-settings"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Left column */}
          <aside className="space-y-6">
            {/* Profile completion */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Profile Completion</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Improve your profile quality
                  </p>
                </div>
                <span className="text-lg font-bold text-cyan-300">
                  {profileCompletion}%
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>

              <div className="mt-5 space-y-3">
                <ChecklistItem label="Full name added" done={!!user?.name} />
                <ChecklistItem label="Email added" done={!!user?.email} />
                <ChecklistItem
                  label="Phone number added"
                  done={!!user?.contact}
                />
                <ChecklistItem
                  label="Profile photo uploaded"
                  done={!!user?.image?.url}
                />
                <ChecklistItem
                  label="Email verified"
                  done={!!user?.isVerified}
                />
              </div>
            </div>

            {/* Quick overview */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold">Quick Overview</h3>

              <div className="mt-5 space-y-4">
                <OverviewRow
                  icon={<User2 className="h-4 w-4 text-cyan-300" />}
                  label="Full Name"
                  value={user?.name || "Not available"}
                />
                <OverviewRow
                  icon={<Mail className="h-4 w-4 text-cyan-300" />}
                  label="Email"
                  value={user?.email || "Not available"}
                />
                <OverviewRow
                  icon={<Phone className="h-4 w-4 text-cyan-300" />}
                  label="Contact"
                  value={user?.contact || "Not added"}
                />
                <OverviewRow
                  icon={<CalendarDays className="h-4 w-4 text-cyan-300" />}
                  label="Member Since"
                  value={joinedDate}
                />
                <OverviewRow
                  icon={<Crown className="h-4 w-4 text-cyan-300" />}
                  label="Role"
                  value={user?.role || "user"}
                />
              </div>
            </div>
          </aside>

          {/* Right column */}
          <section className="space-y-6">
            {/* Personal details */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-6">
                <h3 className="text-xl font-semibold">Personal Information</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Your current account details and identity information.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard
                  title="User ID"
                  value={user?._id || "Not available"}
                  breakAll
                />
                <InfoCard
                  title="Account Role"
                  value={user?.role || "user"}
                  capitalize
                />
                <InfoCard
                  title="Email Address"
                  value={user?.email || "Not available"}
                />
                <InfoCard
                  title="Contact Number"
                  value={user?.contact || "Not added yet"}
                />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              {/* Session preview */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Current Session</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Basic visibility into your latest session
                    </p>
                  </div>
                </div>

                {currentSession ? (
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-cyan-500/10 p-3">
                        <Monitor className="h-5 w-5 text-cyan-300" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">
                          {currentSession?.device || "Unknown Device"}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {currentSession?.browser || "Unknown Browser"}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                          {currentSession?.location || "Unknown Location"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {currentSession?.ip || "IP not available"}
                        </p>

                        <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                          <Clock3 className="h-3.5 w-3.5" />
                          {currentSession?.lastActive || "Active now"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-6 text-sm text-slate-400">
                    No session details available yet.
                  </div>
                )}
              </div>

              {/* Connected accounts */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">Connected Accounts</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Linked providers and sign-in methods
                  </p>
                </div>

                <div className="space-y-3">
                  {connectedAccounts.length > 0 ? (
                    connectedAccounts.map((account, index) => (
                      <div
                        key={account?._id || index}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-cyan-500/10 p-2">
                            <Link2 className="h-5 w-5 text-cyan-300" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold">
                              {account?.provider || "Connected Provider"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {account?.email || "No linked email"}
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
                          Connected
                        </span>
                      </div>
                    ))
                  ) : (
                    <>
                      <ConnectedFallback
                        icon={
                          <CircleUserRound className="h-5 w-5 text-slate-300" />
                        }
                        title="Google"
                        status="Not connected"
                      />
                      <ConnectedFallback
                        icon={<Shield className="h-5 w-5 text-slate-300" />}
                        title="Email Login"
                        status="Available"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Verification & account status */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-6">
                <h3 className="text-xl font-semibold">Verification & Status</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Trust and security state of your account
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <StatusCard
                  icon={<Mail className="h-5 w-5 text-cyan-300" />}
                  title="Email Verification"
                  value={emailVerified ? "Verified" : "Pending"}
                  tone={emailVerified ? "green" : "yellow"}
                />
                <StatusCard
                  icon={<Phone className="h-5 w-5 text-cyan-300" />}
                  title="Phone Badge"
                  value={phoneAdded ? "Added" : "Missing"}
                  tone={phoneAdded ? "blue" : "slate"}
                />
                <StatusCard
                  icon={<Shield className="h-5 w-5 text-cyan-300" />}
                  title="Account Status"
                  value="Active"
                  tone="green"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ label, done }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
      <span className="text-sm text-slate-200">{label}</span>
      {done ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Done
        </span>
      ) : (
        <span className="rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-300">
          Pending
        </span>
      )}
    </div>
  );
}

function OverviewRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <div className="rounded-xl bg-cyan-500/10 p-2">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 truncate text-sm text-white">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ title, value, breakAll = false, capitalize = false }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <p
        className={`mt-2 text-sm text-white ${
          breakAll ? "break-all" : ""
        } ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function ConnectedFallback({ icon, title, status }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/5 p-2">{icon}</div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-slate-400">{status}</p>
        </div>
      </div>

      <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-300">
        Basic
      </span>
    </div>
  );
}

function StatusCard({ icon, title, value, tone = "slate" }) {
  const toneClass = {
    green: "bg-green-500/10 text-green-300",
    yellow: "bg-yellow-500/10 text-yellow-300",
    blue: "bg-blue-500/10 text-blue-300",
    slate: "bg-slate-500/10 text-slate-300",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-500/10 p-2">{icon}</div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClass[tone]}`}
          >
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}
