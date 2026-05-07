import React, { useEffect, useState } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock, ArrowUpRight } from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
        setTimeout(() => setMounted(true), 50);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Spinner />;

  if (!dashboardData?.data || !dashboardData?.data?.overview) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>
          <TrendingUp size={28} color="#a3e635" />
        </div>
        <p style={styles.emptyText}>No dashboard data available.</p>
      </div>
    );
  }

  const { totalDocuments, totalFlashcards, totalQuizzes } = dashboardData.data.overview;

  const stats = [
    { label: "Documents", value: totalDocuments, icon: FileText, accent: "#a3e635", tag: "TOTAL" },
    { label: "Flashcards", value: totalFlashcards, icon: BookOpen, accent: "#fb923c", tag: "TOTAL" },
    { label: "Quizzes", value: totalQuizzes, icon: BrainCircuit, accent: "#38bdf8", tag: "TOTAL" },
  ];

  const activities = [
    ...(dashboardData.recentActivity?.documents || []).map((doc) => ({
      id: doc._id,
      description: doc.title,
      timestamp: doc.lastAccessed,
      link: `/documents/${doc._id}`,
      type: "document",
    })),
    ...(dashboardData.recentActivity?.quizzes || []).map((quiz) => ({
      id: quiz._id,
      description: quiz.title,
      timestamp: quiz.lastAccessed,
      link: `/quizzes/${quiz._id}`,
      type: "quiz",
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div style={styles.root}>
      <style>{cssAnimations}</style>

      {/* Decorative background lines */}
      <div style={styles.bgLines}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ ...styles.bgLine, left: `${i * 20}%` }} />
        ))}
      </div>

      <div style={{ ...styles.container, opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease" }}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.eyebrow}>LEARNING HQ</span>
            <h1 style={styles.title}>Dashboard</h1>
          </div>
          <div style={styles.headerRight}>
            <p style={styles.subtitle}>Track your progress,<br />own your learning.</p>
          </div>
        </div>

        <div style={styles.divider} />

        {/* Stats Row */}
        <div style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>

        {/* Recent Activity */}
        <div style={styles.activitySection}>
          <div style={styles.activityHeader}>
            <div style={styles.activityTitleRow}>
              <Clock size={14} color="#737373" />
              <span style={styles.activityLabel}>RECENT ACTIVITY</span>
            </div>
            <span style={styles.activityCount}>{activities.length} events</span>
          </div>

          {activities.length > 0 ? (
            <div style={styles.activityList}>
              {activities.map((activity, index) => (
                <ActivityRow key={activity.id || index} activity={activity} index={index} />
              ))}
            </div>
          ) : (
            <div style={styles.emptyActivity}>
              <div style={styles.emptyActivityDot} />
              <p style={styles.emptyActivityText}>No activity yet. Start learning to see your history here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

/* ── Sub-components ── */

const StatCard = ({ stat, index }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = stat.icon;

  return (
    <div
      style={{
        ...styles.statCard,
        borderColor: hovered ? stat.accent : "#262626",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        animationDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="stat-card-anim"
    >
      <div style={styles.statTop}>
        <span style={{ ...styles.statTag, color: stat.accent, borderColor: stat.accent }}>
          {stat.tag}
        </span>
        <div style={{ ...styles.statIconBox, background: stat.accent + "18" }}>
          <Icon size={16} color={stat.accent} strokeWidth={2} />
        </div>
      </div>

      <div style={styles.statValue}>{stat.value ?? "—"}</div>
      <div style={styles.statLabel}>{stat.label}</div>

      {/* Bottom accent bar */}
      <div
        style={{
          ...styles.statAccentBar,
          background: stat.accent,
          width: hovered ? "100%" : "0%",
        }}
      />
    </div>
  );
};

const ActivityRow = ({ activity, index }) => {
  const [hovered, setHovered] = useState(false);
  const isDoc = activity.type === "document";
  const accent = isDoc ? "#a3e635" : "#38bdf8";

  const timeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp);
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <a
      href={activity.link}
      style={{
        ...styles.activityRow,
        background: hovered ? "#1a1a1a" : "transparent",
        borderColor: hovered ? "#333" : "#1c1c1c",
        animationDelay: `${index * 0.06}s`,
        textDecoration: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="activity-row-anim"
    >
      <div style={{ ...styles.activityDot, background: accent }} />

      <div style={styles.activityMeta}>
        <span style={{ ...styles.activityType, color: accent }}>
          {isDoc ? "DOCUMENT" : "QUIZ"}
        </span>
        <span style={styles.activityName}>{activity.description}</span>
      </div>

      <div style={styles.activityRight}>
        <span style={styles.activityTime}>{timeAgo(activity.timestamp)}</span>
        <ArrowUpRight
          size={14}
          color={hovered ? accent : "#404040"}
          style={{ transition: "color 0.2s" }}
        />
      </div>
    </a>
  );
};

/* ── Styles ── */

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#e5e5e5",
    fontFamily: "'DM Mono', 'Fira Mono', 'Courier New', monospace",
    position: "relative",
    overflow: "hidden",
  },
  bgLines: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
  },
  bgLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "1px",
    background: "linear-gradient(to bottom, transparent, #ffffff08 30%, #ffffff08 70%, transparent)",
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: "900px",
    margin: "0 auto",
    padding: "48px 32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "32px",
    gap: "24px",
  },
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  eyebrow: {
    fontSize: "10px",
    letterSpacing: "0.2em",
    color: "#525252",
    fontWeight: 500,
  },
  title: {
    fontSize: "clamp(36px, 6vw, 60px)",
    fontWeight: 700,
    color: "#fafafa",
    margin: 0,
    letterSpacing: "-0.03em",
    lineHeight: 1,
    fontFamily: "'DM Serif Display', Georgia, serif",
  },
  headerRight: {
    textAlign: "right",
    flexShrink: 0,
  },
  subtitle: {
    fontSize: "13px",
    color: "#525252",
    lineHeight: 1.6,
    margin: 0,
  },
  divider: {
    height: "1px",
    background: "linear-gradient(to right, #a3e635, #38bdf8, transparent)",
    marginBottom: "40px",
    opacity: 0.5,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "40px",
  },
  statCard: {
    background: "#111111",
    border: "1px solid #262626",
    borderRadius: "4px",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
    cursor: "default",
    transition: "border-color 0.25s ease, transform 0.25s ease",
  },
  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  statTag: {
    fontSize: "9px",
    letterSpacing: "0.18em",
    border: "1px solid",
    padding: "2px 7px",
    borderRadius: "2px",
  },
  statIconBox: {
    width: "30px",
    height: "30px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: "48px",
    fontWeight: 700,
    color: "#fafafa",
    lineHeight: 1,
    marginBottom: "6px",
    fontFamily: "'DM Serif Display', Georgia, serif",
    letterSpacing: "-0.02em",
  },
  statLabel: {
    fontSize: "11px",
    color: "#525252",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  statAccentBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: "2px",
    transition: "width 0.35s ease",
  },
  activitySection: {
    background: "#111111",
    border: "1px solid #1c1c1c",
    borderRadius: "4px",
    overflow: "hidden",
  },
  activityHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #1c1c1c",
  },
  activityTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  activityLabel: {
    fontSize: "10px",
    letterSpacing: "0.18em",
    color: "#525252",
    fontWeight: 500,
  },
  activityCount: {
    fontSize: "10px",
    color: "#404040",
    letterSpacing: "0.05em",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
  },
  activityRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "14px 24px",
    borderBottom: "1px solid",
    transition: "background 0.2s ease, border-color 0.2s ease",
    cursor: "pointer",
  },
  activityDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  activityMeta: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  activityType: {
    fontSize: "9px",
    letterSpacing: "0.15em",
    flexShrink: 0,
    fontWeight: 600,
  },
  activityName: {
    fontSize: "13px",
    color: "#a3a3a3",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  activityRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },
  activityTime: {
    fontSize: "11px",
    color: "#404040",
    letterSpacing: "0.05em",
  },
  emptyActivity: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "40px 24px",
  },
  emptyActivityDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#333",
    flexShrink: 0,
  },
  emptyActivityText: {
    fontSize: "13px",
    color: "#404040",
    margin: 0,
  },
  emptyState: {
    minHeight: "100vh",
    background: "#0a0a0a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    fontFamily: "'DM Mono', monospace",
  },
  emptyIcon: {
    width: "56px",
    height: "56px",
    background: "#111",
    border: "1px solid #262626",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#525252",
    fontSize: "13px",
    margin: 0,
  },
};

const cssAnimations = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Serif+Display&display=swap');

  .stat-card-anim {
    animation: fadeSlideUp 0.4s ease both;
  }
  .activity-row-anim {
    animation: fadeIn 0.35s ease both;
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

export default DashboardPage;