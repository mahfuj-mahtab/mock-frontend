"use client";

export function LearnerStatTile({ icon, label, value }) {
  return (
    <div className="learner-stat-tile">
      {icon ? <div className="learner-stat-tile-icon">{icon}</div> : null}
      <span className="learner-stat-tile-label">{label}</span>
      <div className="learner-stat-tile-value">{value}</div>
    </div>
  );
}
