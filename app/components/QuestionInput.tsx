"use client";

const SUGGESTED = [
  "What should I build next quarter?",
  "What's causing the most user frustration?",
  "What feature would most improve retention?",
  "Summarise the top 3 user pain points",
];

interface QuestionInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function QuestionInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: QuestionInputProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        What do you want to know?
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={3}
        maxLength={500}
        placeholder="What should I build next quarter? What's causing the most user frustration?"
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
      />
      <div className="flex items-center justify-between mt-1">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              onClick={() => onChange(s)}
              disabled={disabled}
              className="text-xs px-2 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-700 transition-colors disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{value.length}/500</span>
      </div>
    </div>
  );
}
