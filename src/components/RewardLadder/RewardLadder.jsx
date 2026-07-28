import { useState, useMemo, useRef, useEffect } from "react";
import { Flag, KeyRound, Gem, Briefcase, Crown, Trophy } from "lucide-react";
import "./RewardLadder.css";

const MILESTONES = [
  {
    value: 0,
    title: "Scout",
    sub: null,
    icon: Flag,
    rewards: ["Private community access", "Starter kit", "Part of the movement from day one"],
  },
  {
    value: 25,
    title: "Campus Ambassador",
    sub: "25 regs",
    icon: KeyRound,
    rewards: ["Official title and badge", "First swag drop", "Cash-prize challenge"],
  },
  {
    value: 50,
    title: "Level Up",
    sub: "50 regs",
    icon: Gem,
    rewards: ["Event grants for your campus", "Exclusive merch"],
  },
  {
    value: 75,
    title: "Go Further",
    sub: "75 regs",
    icon: Briefcase,
    rewards: ["Mentorship access", "Campus event grants"],
  },
  {
    value: 100,
    title: "Paid Internship Opportunity",
    sub: "100 regs",
    icon: Crown,
    rewards: ["Internship opportunities", "Invite to ambassador events"],
  },
  {
    value: 200,
    title: "Founding Team",
    sub: "200 regs",
    icon: Trophy,
    rewards: ["Consideration for the Founding Team", "Next wave"],
  },
];

const MAX = 200;

export default function RewardLadder() {
  const [regs, setRegs] = useState(0);
  const pathRef = useRef(null);
  const [totalLen, setTotalLen] = useState(0);

  useEffect(() => {
    if (pathRef.current) setTotalLen(pathRef.current.getTotalLength());
  }, []);

  // figure out which segment we're in
  const { idx, overallFrac, current } = useMemo(() => {
    let i = 0;
    for (let k = 0; k < MILESTONES.length - 1; k++) {
      if (regs >= MILESTONES[k].value) i = k;
    }
    const cur = MILESTONES[i];
    const next = MILESTONES[i + 1];
    const segFrac = next ? Math.min(1, (regs - cur.value) / (next.value - cur.value)) : 1;
    const frac = (i + segFrac) / (MILESTONES.length - 1);
    return { idx: i, overallFrac: frac, current: cur };
  }, [regs]);

  const markerPos = useMemo(() => {
    if (!pathRef.current || !totalLen) return { x: 0, y: 0 };
    return pathRef.current.getPointAtLength(overallFrac * totalLen);
  }, [overallFrac, totalLen]);

  return (
    <section className="rl-wrap">
      <div className="rl-bgdots" aria-hidden="true" />

      <div className="rl-header">
        <h2 className="rl-title">
          Earned, <span className="rl-lime">not handed.</span>
        </h2>
        <p className="rl-subtitle">Drag the slider, watch what you'd unlock at each stage.</p>
      </div>

      <div className="rl-grid">
        {/* LEFT: winding coin path */}
        <div className="rl-path-col">
          <svg className="rl-path-svg" viewBox="0 0 340 560" preserveAspectRatio="none">
            <path
              ref={pathRef}
              className="rl-path-bg"
              d="M 170 540 C 40 480, 40 400, 170 350 C 300 300, 300 220, 170 170 C 40 120, 40 60, 170 20"
            />
            <path
              className="rl-path-fg"
              d="M 170 540 C 40 480, 40 400, 170 350 C 300 300, 300 220, 170 170 C 40 120, 40 60, 170 20"
              style={{
                strokeDasharray: totalLen,
                strokeDashoffset: totalLen - overallFrac * totalLen,
              }}
            />
          </svg>

          {totalLen > 0 &&
            MILESTONES.map((m, i) => {
              const frac = i / (MILESTONES.length - 1);
              const pt = pathRef.current.getPointAtLength(frac * totalLen);
              const unlocked = regs >= m.value;
              const isCurrent = i === idx;
              const Icon = m.icon;
              return (
                <div
                  key={m.value}
                  className={`rl-node ${unlocked ? "is-unlocked" : ""} ${isCurrent ? "is-current" : ""}`}
                  style={{ left: `${(pt.x / 340) * 100}%`, top: `${(pt.y / 560) * 100}%` }}
                >
                  <span className="rl-node-shadow" />
                  <span className="rl-node-coin">
                    <Icon size={20} strokeWidth={2} />
                    <span className="rl-node-ring" />
                  </span>
                  <span className="rl-node-val">{m.value}</span>
                </div>
              );
            })}

          {totalLen > 0 && (
            <div
              className="rl-marker"
              style={{ left: `${(markerPos.x / 340) * 100}%`, top: `${(markerPos.y / 560) * 100}%` }}
            />
          )}
        </div>

        {/* RIGHT: slider + reward panel */}
        <div className="rl-panel">
          <div className="rl-counter-card">
            <div className="rl-counter-top">
              <span className="rl-counter-label">Your registrations</span>
              <span className="rl-counter-num">{regs}</span>
            </div>
            <input
              type="range"
              className="rl-slider"
              min="0"
              max={MAX}
              step="1"
              value={regs}
              aria-label="Registrations"
              onChange={(e) => setRegs(parseInt(e.target.value, 10))}
            />
            <div className="rl-scale">
              {MILESTONES.map((m) => (
                <span key={m.value}>{m.value}</span>
              ))}
            </div>
            <p className="rl-status">You're at {current.title}.</p>
          </div>

          <div className="rl-reward-list">
            {MILESTONES.map((m, i) => {
              const unlocked = regs >= m.value;
              const isCurrent = i === idx;
              const Icon = m.icon;
              return (
                <div
                  key={m.value}
                  className={`rl-reward-row ${unlocked ? "is-unlocked" : "is-locked"} ${
                    isCurrent ? "is-current" : ""
                  }`}
                >
                  <span className="rl-reward-icon-wrap">
                    <span className="rl-reward-icon-shadow" />
                    <span className="rl-reward-icon">
                      <Icon size={20} strokeWidth={2} />
                      <span className="rl-reward-icon-ring" />
                    </span>
                  </span>
                  <div>
                    <p className="rl-reward-title">
                      {m.title}
                      {m.sub && <span className="rl-reward-sub"> · {m.sub}</span>}
                    </p>
                    <p className="rl-reward-desc">{m.rewards.join(", ")}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
