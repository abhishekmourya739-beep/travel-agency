import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { getDashboardStats } from "../services/dashboard";
import "../styles/dashboard.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  FaUsers,
  FaCalendarCheck,
  FaBoxOpen,
  FaIndianRupeeSign,
  FaArrowTrendUp,
  FaWallet,
  FaChartLine,
  FaLayerGroup,
  FaClockRotateLeft,
  FaMoneyCheckDollar,
  FaBan,
  FaCubesStacked,
} from "react-icons/fa6";

function DashboardSkeleton() {
  return (
    <div className="row g-4">
      {[1, 2, 3, 4].map((item) => (
        <div className="col-md-6 col-xl-3" key={item}>
          <div className="dashboard-skeleton-card h-100">
            <div className="d-flex flex-column gap-3">
              <div
                className="dashboard-skeleton-box"
                style={{ width: "42%", height: "16px" }}
              />
              <div
                className="dashboard-skeleton-box"
                style={{ width: "72%", height: "34px" }}
              />
              <div
                className="dashboard-skeleton-box"
                style={{ width: "55%", height: "14px" }}
              />
              <div
                className="dashboard-skeleton-box mt-2"
                style={{ width: "100%", height: "8px" }}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="col-xl-8">
        <div className="dashboard-skeleton-card h-100">
          <div className="d-flex flex-column gap-3">
            <div
              className="dashboard-skeleton-box"
              style={{ width: "30%", height: "18px" }}
            />
            <div
              className="dashboard-skeleton-box"
              style={{ width: "45%", height: "14px" }}
            />
            <div
              className="dashboard-skeleton-box mt-2"
              style={{ width: "100%", height: "300px" }}
            />
          </div>
        </div>
      </div>

      <div className="col-xl-4">
        <div className="dashboard-skeleton-card h-100">
          <div className="d-flex flex-column gap-3">
            <div
              className="dashboard-skeleton-box"
              style={{ width: "40%", height: "18px" }}
            />
            <div
              className="dashboard-skeleton-box"
              style={{ width: "55%", height: "14px" }}
            />
            <div
              className="dashboard-skeleton-box mt-2"
              style={{
                width: "100%",
                height: "240px",
                borderRadius: "999px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  subtitle,
  iconBg,
  textGradient,
  orbBg,
  progress = 70,
}) {
  return (
    <div className="dashboard-stat-card">
      <div
        className="dashboard-stat-orb"
        style={{
          background: orbBg || "rgba(59,130,246,0.08)",
        }}
      />

      <div className="d-flex align-items-start justify-content-between gap-3 mb-4 position-relative">
        <div style={{ minWidth: 0 }}>
          <p className="dashboard-stat-title">{title}</p>
          <h3
            className="dashboard-stat-value"
            style={{
              background: textGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {value}
          </h3>
          <small className="dashboard-stat-subtitle">{subtitle}</small>
        </div>

        <div
          className="dashboard-icon-box d-flex align-items-center justify-content-center"
          style={{
            background: iconBg,
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <div className="d-flex justify-content-between mb-2">
          <small className="text-muted">Performance</small>
          <small className="fw-semibold text-dark">{progress}%</small>
        </div>

        <div className="dashboard-progress-track">
          <div
            className="dashboard-progress-fill"
            style={{
              width: `${progress}%`,
              background: textGradient,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function MiniInsightCard({ title, value, icon, bg, iconBg }) {
  return (
    <div className="dashboard-mini-card" style={{ background: bg }}>
      <div className="d-flex align-items-center gap-3">
        <div
          className="dashboard-mini-icon d-flex align-items-center justify-content-center"
          style={{ background: iconBg }}
        >
          {icon}
        </div>

        <div style={{ minWidth: 0 }}>
          <small className="text-muted d-block">{title}</small>
          <div className="fw-bold fs-5 text-truncate">{value}</div>
        </div>
      </div>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
  isCurrency = false,
  labelFormatter,
}) {
  if (!active || !payload || !payload.length) return null;

  const finalLabel = labelFormatter ? labelFormatter(label) : label;

  return (
    <div
      className="rounded-4 p-3"
      style={{
        background: "#0f172a",
        color: "#fff",
        boxShadow: "0 12px 30px rgba(15,23,42,0.18)",
        border: "1px solid rgba(255,255,255,0.08)",
        minWidth: 140,
      }}
    >
      {finalLabel ? <div className="fw-semibold mb-2">{finalLabel}</div> : null}

      {payload.map((entry, index) => (
        <div key={index} className="small mb-1">
          <span className="fw-semibold">{entry.name}: </span>
          <span>
            {isCurrency
              ? `₹ ${Number(entry.value || 0).toLocaleString("en-IN")}`
              : Number(entry.value || 0).toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
}

function getStatusBadgeClass(status) {
  const value = String(status || "").toLowerCase();

  if (value === "paid" || value === "confirmed" || value === "completed") {
    return "dashboard-badge dashboard-badge-success";
  }

  if (value === "pending") {
    return "dashboard-badge dashboard-badge-warning";
  }

  if (value === "failed" || value === "cancelled" || value === "refunded") {
    return "dashboard-badge dashboard-badge-danger";
  }

  return "dashboard-badge dashboard-badge-secondary";
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function formatCurrency(value) {
  return `₹ ${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN");
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalUsers: 0,
      totalBookings: 0,
      totalPackages: 0,
      totalRevenue: 0,
      totalPaidBookings: 0,
      totalPendingBookings: 0,
      totalCancelledBookings: 0,
      totalPendingPayments: 0,
      totalFailedPayments: 0,
      bookingPerUser: 0,
      revenuePerBooking: 0,
      conversionRate: 0,
    },
    charts: {
      monthlyRevenue: [],
      bookingStatus: [],
      paymentStatus: [],
    },
    recent: {
      latestUsers: [],
      latestBookings: [],
      latestPackages: [],
    },
    topPackages: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setDashboardData(res?.data || {});
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load dashboard stats",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = dashboardData?.overview || {};
  const monthlyRevenue = dashboardData?.charts?.monthlyRevenue || [];
  const bookingStatusData = dashboardData?.charts?.bookingStatus || [];
  const paymentStatusData = dashboardData?.charts?.paymentStatus || [];
  const latestUsers = dashboardData?.recent?.latestUsers || [];
  const latestBookings = dashboardData?.recent?.latestBookings || [];
  const latestPackages = dashboardData?.recent?.latestPackages || [];
  const topPackages = dashboardData?.topPackages || [];

  const summaryCards = useMemo(() => {
    return [
      {
        title: "Total Users",
        value: formatNumber(stats.totalUsers),
        subtitle: "Registered customers",
        icon: <FaUsers />,
        iconBg: "linear-gradient(135deg, #2563eb, #60a5fa)",
        textGradient: "linear-gradient(135deg, #2563eb, #60a5fa)",
        orbBg: "rgba(37,99,235,0.08)",
        progress: Math.min((stats.totalUsers || 0) % 100, 100),
      },
      {
        title: "Total Bookings",
        value: formatNumber(stats.totalBookings),
        subtitle: "All trip bookings",
        icon: <FaCalendarCheck />,
        iconBg: "linear-gradient(135deg, #7c3aed, #c084fc)",
        textGradient: "linear-gradient(135deg, #7c3aed, #c084fc)",
        orbBg: "rgba(124,58,237,0.08)",
        progress: Math.min((stats.totalBookings || 0) % 100, 100),
      },
      {
        title: "Total Packages",
        value: formatNumber(stats.totalPackages),
        subtitle: "Travel packages available",
        icon: <FaBoxOpen />,
        iconBg: "linear-gradient(135deg, #ea580c, #fb923c)",
        textGradient: "linear-gradient(135deg, #ea580c, #fb923c)",
        orbBg: "rgba(234,88,12,0.08)",
        progress: Math.min((stats.totalPackages || 0) % 100, 100),
      },
      {
        title: "Total Revenue",
        value: formatCurrency(stats.totalRevenue),
        subtitle: "Revenue from paid bookings",
        icon: <FaIndianRupeeSign />,
        iconBg: "linear-gradient(135deg, #059669, #34d399)",
        textGradient: "linear-gradient(135deg, #059669, #34d399)",
        orbBg: "rgba(5,150,105,0.08)",
        progress: 84,
      },
    ];
  }, [stats]);

  const comparisonData = useMemo(() => {
    return [
      { name: "Users", value: stats.totalUsers || 0 },
      { name: "Bookings", value: stats.totalBookings || 0 },
      { name: "Packages", value: stats.totalPackages || 0 },
      {
        name: "Revenue (÷1000)",
        value: Math.round((stats.totalRevenue || 0) / 1000),
      },
    ];
  }, [stats]);

  const revenueTrendData = useMemo(() => {
    return monthlyRevenue.map((item) => ({
      month: item.month,
      revenue: item.revenue || 0,
      bookings: item.bookings || 0,
    }));
  }, [monthlyRevenue]);

  const bookingStatusColors = ["#3b82f6", "#8b5cf6", "#f97316", "#10b981"];
  const paymentStatusColors = ["#10b981", "#f59e0b", "#ef4444", "#6366f1"];

  const bookingPerUser =
    stats.bookingPerUser !== undefined
      ? Number(stats.bookingPerUser).toFixed(2)
      : "0.00";

  const revenuePerBooking =
    stats.revenuePerBooking > 0
      ? formatCurrency(stats.revenuePerBooking)
      : "₹ 0";

  const conversionRate =
    stats.conversionRate !== undefined ? `${stats.conversionRate}%` : "0%";

  const packageUtilization =
    stats.totalPackages > 0
      ? `${Math.min(
          Math.round((stats.totalBookings / stats.totalPackages) * 100),
          999,
        )}%`
      : "0%";

  return (
    <AdminLayout>
      <div className="dashboard-page">
        <div className="container-fluid px-0">
          <div className="dashboard-hero mb-4">
            <div className="dashboard-hero-grid d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
              <div style={{ minWidth: 0 }}>
                <div className="dashboard-chip mb-3">
                  <FaChartLine />
                  Live Business Snapshot
                </div>

                <h2 className="dashboard-hero-title">Dashboard Overview</h2>
                <p className="dashboard-hero-subtitle">
                  Welcome to your ultra premium travel admin dashboard. Track
                  growth, bookings, revenue, payment status and recent platform
                  activity from one place.
                </p>
              </div>

              <div className="d-flex flex-wrap gap-3">
                <div className="dashboard-glass-stat">
                  <small className="dashboard-glass-stat-label">
                    Booking / User
                  </small>
                  <div className="dashboard-glass-stat-value">
                    {bookingPerUser}
                  </div>
                </div>

                <div className="dashboard-glass-stat">
                  <small className="dashboard-glass-stat-label">
                    Revenue / Booking
                  </small>
                  <div className="dashboard-glass-stat-value">
                    {revenuePerBooking}
                  </div>
                </div>

                <div className="dashboard-glass-stat">
                  <small className="dashboard-glass-stat-label">
                    Paid Conversion
                  </small>
                  <div className="dashboard-glass-stat-value">
                    {conversionRate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <DashboardSkeleton />
          ) : error ? (
            <div className="alert alert-danger rounded-4">{error}</div>
          ) : (
            <>
              <div className="row g-4 mb-4">
                {summaryCards.map((card) => (
                  <div className="col-md-6 col-xl-3" key={card.title}>
                    <StatCard {...card} />
                  </div>
                ))}
              </div>

              <div className="row g-4 mb-4">
                <div className="col-xl-8">
                  <div className="dashboard-card h-100">
                    <div className="dashboard-card-body h-100">
                      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                        <div>
                          <h5 className="dashboard-section-title">
                            Business Comparison
                          </h5>
                          <p className="dashboard-section-subtitle">
                            Snapshot comparison of overall platform metrics
                          </p>
                        </div>

                        <div className="dashboard-pill dashboard-pill-blue">
                          Overview Chart
                        </div>
                      </div>

                      <div className="dashboard-chart-box">
                        <ResponsiveContainer>
                          <BarChart data={comparisonData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                            />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                              dataKey="value"
                              radius={[10, 10, 0, 0]}
                              fill="#3b82f6"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-4">
                  <div className="dashboard-card h-100">
                    <div className="dashboard-card-body h-100">
                      <div className="mb-4">
                        <h5 className="dashboard-section-title">
                          Booking Status
                        </h5>
                        <p className="dashboard-section-subtitle">
                          Distribution of all booking statuses
                        </p>
                      </div>

                      <div className="dashboard-chart-box-sm">
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={bookingStatusData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={95}
                              paddingAngle={4}
                            >
                              {bookingStatusData.map((entry, index) => (
                                <Cell
                                  key={`${entry.name}-${index}`}
                                  fill={
                                    bookingStatusColors[
                                      index % bookingStatusColors.length
                                    ]
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="d-flex flex-column gap-3 mt-3">
                        {bookingStatusData.length > 0 ? (
                          bookingStatusData.map((item, index) => (
                            <div
                              key={`${item.name}-${index}`}
                              className="d-flex align-items-center justify-content-between"
                            >
                              <div className="d-flex align-items-center gap-2">
                                <span
                                  style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    background:
                                      bookingStatusColors[
                                        index % bookingStatusColors.length
                                      ],
                                    display: "inline-block",
                                    flexShrink: 0,
                                  }}
                                />
                                <span className="text-muted text-capitalize">
                                  {item.name}
                                </span>
                              </div>

                              <span className="fw-semibold text-dark">
                                {formatNumber(item.value)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="dashboard-empty">
                            No booking status data found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4 mb-4">
                <div className="col-xl-8">
                  <div className="dashboard-card h-100">
                    <div className="dashboard-card-body h-100">
                      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                        <div>
                          <h5 className="dashboard-section-title">
                            Monthly Revenue Trend
                          </h5>
                          <p className="dashboard-section-subtitle">
                            Month-wise paid revenue analytics
                          </p>
                        </div>

                        <div className="dashboard-pill dashboard-pill-cyan">
                          Premium Analytics
                        </div>
                      </div>

                      <div className="dashboard-chart-box">
                        <ResponsiveContainer>
                          <AreaChart data={revenueTrendData}>
                            <defs>
                              <linearGradient
                                id="colorRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#8b5cf6"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#8b5cf6"
                                  stopOpacity={0.05}
                                />
                              </linearGradient>
                            </defs>

                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                            />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                              content={<CustomTooltip isCurrency={true} />}
                            />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stroke="#8b5cf6"
                              fillOpacity={1}
                              fill="url(#colorRevenue)"
                              strokeWidth={3}
                              name="Revenue"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-4">
                  <div className="dashboard-card h-100">
                    <div className="dashboard-card-body h-100">
                      <div className="mb-4">
                        <h5 className="dashboard-section-title">
                          Quick Insights
                        </h5>
                        <p className="dashboard-section-subtitle">
                          Smart business indicators
                        </p>
                      </div>

                      <div className="d-flex flex-column gap-3">
                        <MiniInsightCard
                          title="Booking to User Ratio"
                          value={bookingPerUser}
                          icon={<FaArrowTrendUp />}
                          bg="linear-gradient(135deg,#eff6ff,#dbeafe)"
                          iconBg="#2563eb"
                        />

                        <MiniInsightCard
                          title="Revenue Per Booking"
                          value={revenuePerBooking}
                          icon={<FaWallet />}
                          bg="linear-gradient(135deg,#ecfdf5,#d1fae5)"
                          iconBg="#059669"
                        />

                        <MiniInsightCard
                          title="Package Utilization"
                          value={packageUtilization}
                          icon={<FaLayerGroup />}
                          bg="linear-gradient(135deg,#fff7ed,#ffedd5)"
                          iconBg="#ea580c"
                        />

                        <MiniInsightCard
                          title="Paid Conversion Rate"
                          value={conversionRate}
                          icon={<FaMoneyCheckDollar />}
                          bg="linear-gradient(135deg,#f5f3ff,#ede9fe)"
                          iconBg="#7c3aed"
                        />
                      </div>

                      <div className="dashboard-dark-card mt-4">
                        <small className="d-block mb-2">
                          Total Revenue Snapshot
                        </small>
                        <h3 className="fw-bold mb-0">
                          {formatCurrency(stats.totalRevenue)}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4 mb-4">
                <div className="col-xl-4">
                  <div className="dashboard-card h-100">
                    <div className="dashboard-card-body h-100">
                      <div className="mb-4">
                        <h5 className="dashboard-section-title">
                          Payment Status
                        </h5>
                        <p className="dashboard-section-subtitle">
                          Paid, pending and failed payment distribution
                        </p>
                      </div>

                      <div className="dashboard-chart-box-sm">
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={paymentStatusData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={58}
                              outerRadius={88}
                              paddingAngle={4}
                            >
                              {paymentStatusData.map((entry, index) => (
                                <Cell
                                  key={`${entry.name}-${index}`}
                                  fill={
                                    paymentStatusColors[
                                      index % paymentStatusColors.length
                                    ]
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="d-flex flex-column gap-3 mt-3">
                        {paymentStatusData.length > 0 ? (
                          paymentStatusData.map((item, index) => (
                            <div
                              key={`${item.name}-${index}`}
                              className="d-flex align-items-center justify-content-between"
                            >
                              <div className="d-flex align-items-center gap-2">
                                <span
                                  style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    background:
                                      paymentStatusColors[
                                        index % paymentStatusColors.length
                                      ],
                                    display: "inline-block",
                                    flexShrink: 0,
                                  }}
                                />
                                <span className="text-muted text-capitalize">
                                  {item.name}
                                </span>
                              </div>

                              <span className="fw-semibold text-dark">
                                {formatNumber(item.value)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="dashboard-empty">
                            No payment status data found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-8">
                  <div className="dashboard-card h-100">
                    <div className="dashboard-card-body h-100">
                      <div className="mb-4">
                        <h5 className="dashboard-section-title">
                          Recent Bookings
                        </h5>
                        <p className="dashboard-section-subtitle">
                          Latest booking activity across the platform
                        </p>
                      </div>

                      <div className="table-responsive dashboard-table-wrap dashboard-scrollbar">
                        <table className="table dashboard-table align-middle">
                          <thead>
                            <tr>
                              <th>Booking ID</th>
                              <th>User</th>
                              <th>Package</th>
                              <th>Amount</th>
                              <th>Booking</th>
                              <th>Payment</th>
                            </tr>
                          </thead>

                          <tbody>
                            {latestBookings.length > 0 ? (
                              latestBookings.map((booking) => (
                                <tr key={booking._id}>
                                  <td className="fw-semibold">
                                    {booking.bookingId || "-"}
                                  </td>

                                  <td style={{ maxWidth: 150 }}>
                                    <div
                                      className="text-truncate"
                                      title={booking?.user?.name || ""}
                                    >
                                      {booking?.user?.name || "-"}
                                    </div>
                                  </td>

                                  <td style={{ maxWidth: 230 }}>
                                    <div
                                      className="text-truncate"
                                      title={
                                        booking?.travelPackage?.title || ""
                                      }
                                    >
                                      {booking?.travelPackage?.title || "-"}
                                    </div>
                                  </td>

                                  <td className="fw-semibold">
                                    {formatCurrency(booking?.totalPrice)}
                                  </td>

                                  <td>
                                    <span
                                      className={getStatusBadgeClass(
                                        booking?.bookingStatus,
                                      )}
                                    >
                                      {booking?.bookingStatus || "-"}
                                    </span>
                                  </td>

                                  <td>
                                    <span
                                      className={getStatusBadgeClass(
                                        booking?.paymentStatus,
                                      )}
                                    >
                                      {booking?.paymentStatus || "-"}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6">
                                  <div className="dashboard-empty">
                                    No recent bookings found
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4 mb-4">
                <div className="col-lg-6 col-xl-4">
                  <div className="dashboard-card h-100">
                    <div className="dashboard-card-body h-100">
                      <div className="mb-4">
                        <h5 className="dashboard-section-title">
                          Recently Joined Users
                        </h5>
                        <p className="dashboard-section-subtitle">
                          New customers added to the platform
                        </p>
                      </div>

                      <div className="d-flex flex-column gap-3">
                        {latestUsers.length > 0 ? (
                          latestUsers.map((user) => (
                            <div
                              key={user._id}
                              className="dashboard-list-item d-flex align-items-center justify-content-between gap-3"
                            >
                              <div
                                className="d-flex align-items-center gap-3"
                                style={{ minWidth: 0, flex: 1 }}
                              >
                                <img
                                  src={
                                    user?.image?.url ||
                                    "https://ui-avatars.com/api/?name=User&background=0f172a&color=fff"
                                  }
                                  alt={user?.name || "User"}
                                  className="dashboard-user-avatar"
                                />

                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div
                                    className="fw-semibold text-dark text-truncate"
                                    title={user?.name || ""}
                                  >
                                    {user?.name || "User"}
                                  </div>

                                  <small
                                    className="text-muted d-block text-truncate"
                                    title={user?.email || ""}
                                  >
                                    {user?.email || "-"}
                                  </small>
                                </div>
                              </div>

                              <small
                                className="text-muted flex-shrink-0"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {formatDate(user?.createdAt)}
                              </small>
                            </div>
                          ))
                        ) : (
                          <div className="dashboard-empty">No users found</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-xl-4">
                  <div className="dashboard-card h-100">
                    <div className="dashboard-card-body h-100">
                      <div className="mb-4">
                        <h5 className="dashboard-section-title">
                          Recently Added Packages
                        </h5>
                        <p className="dashboard-section-subtitle">
                          Fresh travel experiences added recently
                        </p>
                      </div>

                      <div className="d-flex flex-column gap-3">
                        {latestPackages.length > 0 ? (
                          latestPackages.map((pkg) => (
                            <div
                              key={pkg._id}
                              className="dashboard-list-item d-flex align-items-center justify-content-between gap-3"
                            >
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div
                                  className="fw-semibold text-dark text-truncate"
                                  title={pkg?.title || ""}
                                >
                                  {pkg?.title || "-"}
                                </div>

                                <small className="text-muted text-capitalize d-block">
                                  {pkg?.tripType || "-"} • {pkg?.duration || 0}{" "}
                                  Days
                                </small>
                              </div>

                              <div
                                className="text-end flex-shrink-0"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                <div className="fw-bold text-dark">
                                  {formatCurrency(pkg?.price)}
                                </div>
                                <small className="text-muted">
                                  {formatDate(pkg?.createdAt)}
                                </small>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="dashboard-empty">
                            No recent packages found
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-4">
                  <div className="dashboard-card h-100">
                    <div className="dashboard-card-body h-100">
                      <div className="mb-4">
                        <h5 className="dashboard-section-title">
                          System Highlights
                        </h5>
                        <p className="dashboard-section-subtitle">
                          Fast operational view of core activity
                        </p>
                      </div>

                      <div className="d-flex flex-column gap-3">
                        <MiniInsightCard
                          title="Paid Bookings"
                          value={formatNumber(stats.totalPaidBookings)}
                          icon={<FaMoneyCheckDollar />}
                          bg="linear-gradient(135deg,#ecfdf5,#d1fae5)"
                          iconBg="#059669"
                        />

                        <MiniInsightCard
                          title="Pending Bookings"
                          value={formatNumber(stats.totalPendingBookings)}
                          icon={<FaClockRotateLeft />}
                          bg="linear-gradient(135deg,#fffbeb,#fef3c7)"
                          iconBg="#d97706"
                        />

                        <MiniInsightCard
                          title="Cancelled Bookings"
                          value={formatNumber(stats.totalCancelledBookings)}
                          icon={<FaBan />}
                          bg="linear-gradient(135deg,#fef2f2,#fee2e2)"
                          iconBg="#dc2626"
                        />

                        <MiniInsightCard
                          title="Pending Payments"
                          value={formatNumber(stats.totalPendingPayments)}
                          icon={<FaCubesStacked />}
                          bg="linear-gradient(135deg,#eef2ff,#e0e7ff)"
                          iconBg="#4f46e5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-12">
                  <div className="dashboard-card">
                    <div className="dashboard-card-body">
                      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                        <div>
                          <h5 className="dashboard-section-title">
                            Top Performing Packages
                          </h5>
                          <p className="dashboard-section-subtitle">
                            Best selling packages based on bookings and revenue
                          </p>
                        </div>

                        <div className="dashboard-pill dashboard-pill-blue">
                          Top 5 Packages
                        </div>
                      </div>

                      <div className="row g-3">
                        {topPackages.length > 0 ? (
                          topPackages.map((pkg, index) => (
                            <div
                              className="col-md-6 col-xl-4"
                              key={pkg.packageId || index}
                            >
                              <div className="dashboard-top-package-card h-100">
                                <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                                  <div
                                    className="d-flex align-items-center gap-3"
                                    style={{ minWidth: 0, flex: 1 }}
                                  >
                                    <div className="dashboard-rank-badge d-flex align-items-center justify-content-center">
                                      #{index + 1}
                                    </div>

                                    <div style={{ minWidth: 0, flex: 1 }}>
                                      <div
                                        className="fw-semibold text-dark text-truncate"
                                        title={pkg?.title || ""}
                                      >
                                        {pkg?.title || "-"}
                                      </div>

                                      <small className="text-muted d-block">
                                        {formatNumber(pkg?.totalBookings)}{" "}
                                        bookings
                                      </small>
                                    </div>
                                  </div>

                                  <div
                                    className="text-end flex-shrink-0"
                                    style={{ whiteSpace: "nowrap" }}
                                  >
                                    <div className="fw-bold text-dark">
                                      {formatCurrency(pkg?.totalRevenue)}
                                    </div>
                                    <small className="text-muted">
                                      Revenue
                                    </small>
                                  </div>
                                </div>

                                <div className="dashboard-progress-premium">
                                  <span
                                    style={{
                                      width: `${Math.min(
                                        (pkg?.totalBookings || 0) * 10,
                                        100,
                                      )}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-12">
                            <div className="dashboard-empty">
                              No top packages found
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
