"use client";

export function LearnerEmptyState({ icon, title, description, action }) {
  return (
    <div className="learner-empty-state">
      {icon ? <div className="learner-empty-state-icon">{icon}</div> : null}
      <h3 className="learner-empty-state-title">{title}</h3>
      {description ? <p className="learner-empty-state-desc">{description}</p> : null}
      {action}
    </div>
  );
}
