"use client";

import { useState } from "react";
import { Calendar, AlertTriangle, Zap, Lock } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ScheduleEstimate } from "@/lib/types";

interface Props {
  analysisId: string;
  canUse: boolean; // Teams+ plan
  onUpgrade: () => void;
}

export default function ScheduleEstimator({ analysisId, canUse, onUpgrade }: Props) {
  const [teamSize, setTeamSize] = useState(2);
  const [sprintWeeks, setSprintWeeks] = useState(2);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch<ScheduleEstimate>(`/analyses/${analysisId}/schedule-estimate`, {
        method: "POST",
        body: JSON.stringify({ team_size: teamSize, sprint_weeks: sprintWeeks, start_date: startDate }),
      });
      setSchedule(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate schedule");
    } finally {
      setLoading(false);
    }
  }

  if (!canUse) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Lock size={20} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Schedule Estimator is a Teams feature</p>
        <p className="text-xs text-gray-500 mb-4">
          Turn engineering tasks into a sprint plan automatically. Available on Teams and Studio.
        </p>
        <button
          onClick={onUpgrade}
          className="px-4 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Upgrade to Teams →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Config */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">Configure estimate</p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Team size</label>
            <input
              type="number"
              min={1} max={20}
              value={teamSize}
              onChange={(e) => setTeamSize(Math.max(1, Math.min(20, +e.target.value)))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sprint length (weeks)</label>
            <select
              value={sprintWeeks}
              onChange={(e) => setSprintWeeks(+e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value={1}>1 week</option>
              <option value={2}>2 weeks</option>
              <option value={3}>3 weeks</option>
              <option value={4}>4 weeks</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#7F77DD] hover:bg-[#6b64c4] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Calendar size={14} />
          {loading ? "Estimating..." : schedule ? "Re-estimate" : "Generate schedule"}
        </button>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {/* Results */}
      {schedule && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total points", value: schedule.total_points },
              { label: "Velocity / sprint", value: schedule.velocity_per_sprint },
              { label: "Sprints", value: schedule.total_sprints },
              { label: "Completion", value: new Date(schedule.estimated_completion).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-purple-50 rounded-lg px-3 py-2.5 text-center">
                <p className="text-base font-semibold text-purple-700">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Sprint cards */}
          <div className="space-y-3">
            {schedule.sprints.map((sprint) => (
              <div key={sprint.sprint} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-800">Sprint {sprint.sprint}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{new Date(sprint.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {new Date(sprint.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">{sprint.story_points} pts</span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {sprint.tasks.map((task, i) => {
                    const isCritical = schedule.critical_path.includes(task);
                    return (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${isCritical ? "bg-orange-400" : "bg-gray-300"}`} />
                        <span className={isCritical ? "font-medium text-gray-800" : ""}>{task}</span>
                        {isCritical && <span className="text-xs text-orange-500 ml-1 flex-shrink-0">critical</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Risks */}
          {schedule.risks.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={14} className="text-amber-500" />
                <p className="text-xs font-semibold text-amber-700">Risks to watch</p>
              </div>
              <ul className="space-y-1">
                {schedule.risks.map((r, i) => (
                  <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
                    <span className="mt-1">·</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Critical path note */}
          {schedule.critical_path.length > 0 && (
            <div className="flex items-start gap-2 text-xs text-gray-400">
              <Zap size={12} className="text-orange-400 mt-0.5 flex-shrink-0" />
              <span><strong className="text-gray-500">Critical path:</strong> {schedule.critical_path.join(" → ")}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
