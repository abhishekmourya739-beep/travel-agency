"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  Link2,
  Loader2,
  LogOut,
  Mail,
  Monitor,
  Phone,
  Save,
  Shield,
  Smartphone,
  Trash2,
  User,
  LockKeyhole,
  CircleUserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/authContext";
import {
  changePassword,
  getConnectedAccounts,
  getLoginSessions,
  softDeleteAccount,
  updateUserProfile,
} from "@/lib/api/auth";

import AccountSettingsSkeleton from "./accountSettingSkeleton";
import DeleteAccountModal from "./deleteAccountModal";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, refreshUser, logout, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [success, setSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.contact || "",
      });
      setPreview(user?.image?.url || "");
    }
  }, [user]);

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
      }
    };

    if (user) loadExtras();
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

  const profileCompletion = 100;

  const emailVerified = !!user?.isVerified;
  const phoneAdded = !!user?.contact;

  const handleChange = (e) => {
    setSuccess("");
    setError("");

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordSuccess("");
    setPasswordError("");

    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setSuccess("");
    setError("");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("contact", form.contact);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await updateUserProfile(formData);

      await refreshUser();
      setImageFile(null);
      setSuccess(res?.message || "Profile updated successfully.");
    } catch (err) {
      setError(
        err?.message ||
          err?.error ||
          err?.errors?.[0]?.message ||
          "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordSuccess("");
    setPasswordError("");

    try {
      if (
        !passwordForm.currentPassword ||
        !passwordForm.newPassword ||
        !passwordForm.confirmPassword
      ) {
        throw new Error("Please fill all password fields.");
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error("New password and confirm password do not match.");
      }

      const res = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordSuccess(res?.message || "Password changed successfully.");
    } catch (err) {
      setPasswordError(
        err?.message ||
          err?.error ||
          err?.errors?.[0]?.message ||
          "Failed to change password.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async (confirmText, resetInput) => {
    if (confirmText !== "DELETE") {
      setError("Please type DELETE to confirm account deactivation.");
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await softDeleteAccount();
      resetInput();
      setDeleteModalOpen(false);
      logout();
      router.push("/register");
    } catch (err) {
      setError(
        err?.message ||
          err?.error ||
          err?.errors?.[0]?.message ||
          "Failed to deactivate account.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <AccountSettingsSkeleton />;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 pb-16 pt-30 text-white">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-lg font-medium">
            Please login to view account settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DeleteAccountModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        deleting={deleting}
      />

      <div className="min-h-screen bg-slate-950 px-4 pb-10 pt-30 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              <Shield className="h-3.5 w-3.5" />
              Account Center
            </div>

            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
              Account Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
              Manage your profile, security, connected accounts, and account
              preferences from one premium dashboard.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border border-white/10 bg-cyan-500/10 shadow-lg">
                    {preview ? (
                      <Image
                        src={preview}
                        alt={user?.name || "User"}
                        fill
                        className="object-cover"
                        unoptimized={preview.startsWith("blob:")}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-cyan-300">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10">
                    <Camera className="h-4 w-4 text-cyan-300" />
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>

                  <h2 className="mt-5 text-xl font-semibold">{user?.name}</h2>
                  <p className="mt-1 break-all text-sm text-slate-400">
                    {user?.email}
                  </p>

                  <div className="mt-6 w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">
                          Profile Strength
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Complete your account for a better experience
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-cyan-300">
                        110%
                      </span>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                        style={{ width: `100%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid w-full gap-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left">
                      <div className="flex items-center gap-3">
                        <BadgeCheck className="h-5 w-5 text-cyan-300" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">Role</p>
                          <p className="text-xs capitalize text-slate-400">
                            {user?.role || "user"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-cyan-300" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">Member Since</p>
                          <p className="text-xs text-slate-400">{joinedDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold">
                      Verification Status
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Verify your account details to improve trust and security.
                    </p>
                  </div>

                  <div className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    {profileCompletion}% Complete
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="shrink-0 rounded-2xl bg-cyan-500/10 p-2.5">
                          <Mail className="h-5 w-5 text-cyan-300" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-white">
                            Email Verification
                          </p>
                          <p className="mt-1 break-all pr-2 text-xs text-slate-400">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      {emailVerified ? (
                        <span className="inline-flex shrink-0 items-center gap-1 self-start rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex shrink-0 self-start whitespace-nowrap rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="shrink-0 rounded-2xl bg-cyan-500/10 p-2.5">
                          <Phone className="h-5 w-5 text-cyan-300" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">
                            Phone Badge
                          </p>
                          <p className="mt-1 break-all text-xs text-slate-400">
                            {user?.contact || "No phone added"}
                          </p>
                        </div>
                      </div>

                      {phoneAdded ? (
                        <span className="shrink-0 whitespace-nowrap rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                          Added
                        </span>
                      ) : (
                        <span className="shrink-0 whitespace-nowrap rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-300">
                          Missing
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <section className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">
                    Personal Information
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Update the details associated with your account.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                        <User className="h-4 w-4 text-cyan-300" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/70"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                        <Mail className="h-4 w-4 text-cyan-300" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/70"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                        <Phone className="h-4 w-4 text-cyan-300" />
                        Contact Number
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={form.contact}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/70"
                        placeholder="Enter your contact number"
                      />
                    </div>
                  </div>

                  {success && (
                    <div className="rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                      {success}
                    </div>
                  )}

                  {error && (
                    <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-70"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">Change Password</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Keep your account secure with a strong password.
                  </p>
                </div>

                <form
                  onSubmit={handleChangePasswordSubmit}
                  className="space-y-5"
                >
                  <div className="grid gap-5 md:grid-cols-3">
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                        <LockKeyhole className="h-4 w-4 text-cyan-300" />
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/70"
                        placeholder="Current password"
                      />
                    </div>

                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                        <LockKeyhole className="h-4 w-4 text-cyan-300" />
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/70"
                        placeholder="New password"
                      />
                    </div>

                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                        <LockKeyhole className="h-4 w-4 text-cyan-300" />
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300/70"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>

                  {passwordSuccess && (
                    <div className="rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                      {passwordSuccess}
                    </div>
                  )}

                  {passwordError && (
                    <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {passwordError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-400/15 px-6 py-3 font-semibold text-cyan-200 transition hover:bg-cyan-400/20 hover:text-white disabled:opacity-70"
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold">
                      Recent Login Sessions
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Monitor your recent account activity.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {sessions.length > 0 ? (
                      sessions.map((session, index) => (
                        <div
                          key={session?._id || index}
                          className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                              <div className="shrink-0 rounded-2xl bg-cyan-500/10 p-2">
                                <Monitor className="h-5 w-5 text-cyan-300" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                  <p className="text-sm font-semibold">
                                    {session?.device || "Current Device"}
                                  </p>

                                  {index === 0 && (
                                    <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300">
                                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                                      Active now
                                    </span>
                                  )}
                                </div>

                                <p className="mt-1 wrap-break-word text-xs leading-5 text-slate-400">
                                  {session?.browser || "Unknown Browser"} •{" "}
                                  {session?.location || "Unknown Location"}
                                </p>

                                <p className="mt-1 break-all text-xs text-slate-500">
                                  {session?.ip || "IP not available"}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 whitespace-nowrap text-right text-xs text-slate-400">
                              <div className="inline-flex items-center gap-1">
                                <Clock3 className="h-3.5 w-3.5" />
                                {session?.lastActive || "Recent"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-6 text-sm text-slate-400">
                        No recent session data available yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold">
                      Connected Accounts
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Review third-party or linked login providers.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {connectedAccounts.length > 0 ? (
                      connectedAccounts.map((account, index) => (
                        <div
                          key={account?._id || index}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="shrink-0 rounded-2xl bg-cyan-500/10 p-2">
                              <Link2 className="h-5 w-5 text-cyan-300" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold">
                                {account?.provider || "Connected Provider"}
                              </p>
                              <p className="break-all text-xs text-slate-400">
                                {account?.email || "No account email"}
                              </p>
                            </div>
                          </div>

                          <span className="shrink-0 whitespace-nowrap rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-300">
                            Connected
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="shrink-0 rounded-2xl bg-white/5 p-2">
                              <CircleUserRound className="h-5 w-5 text-slate-300" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">Google</p>
                              <p className="text-xs text-slate-400">
                                Not connected
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 whitespace-nowrap rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-300">
                            None
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="shrink-0 rounded-2xl bg-white/5 p-2">
                              <Smartphone className="h-5 w-5 text-slate-300" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">Phone OTP</p>
                              <p className="text-xs text-slate-400">
                                {user?.contact ? "Available" : "Not linked"}
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 whitespace-nowrap rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-300">
                            Basic
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">Account Details</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Read-only account information for reference.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      User ID
                    </p>
                    <p className="mt-2 break-all text-sm text-white">
                      {user?._id || "Not available"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Role
                    </p>
                    <p className="mt-2 text-sm capitalize text-white">
                      {user?.role || "user"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Email
                    </p>
                    <p className="mt-2 break-all text-sm text-white">
                      {user?.email || "Not available"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Contact
                    </p>
                    <p className="mt-2 break-all text-sm text-white">
                      {user?.contact || "Not added"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-red-400/20 bg-red-500/5 p-6 backdrop-blur-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-red-200">
                      Danger Zone
                    </h3>
                    <p className="mt-1 text-sm text-red-200/70">
                      Deactivate your account using soft delete.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    className="inline-flex items-center gap-2 self-start rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
                  >
                    <Trash2 className="h-4 w-4" />
                    Deactivate Account
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
