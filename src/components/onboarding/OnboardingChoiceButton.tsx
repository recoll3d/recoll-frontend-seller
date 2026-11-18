import type { ReactNode } from "react";
import { FaCircleCheck } from "react-icons/fa6";

type OnboardingChoiceButtonProps = {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: ReactNode;
};

export function OnboardingChoiceButton({
  selected,
  onSelect,
  title,
  description,
}: OnboardingChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border p-4 text-left transition-all ${
        selected
          ? "border-accent bg-accent/10 shadow-[0_0_0_1px_rgba(5,242,131,0.35)]"
          : "border-edge bg-body/30 hover:border-outline"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-title">{title}</p>
          {description ? (
            <div className="mt-2 text-sm leading-6 text-text">{description}</div>
          ) : null}
        </div>
        {selected ? (
          <FaCircleCheck className="mt-0.5 shrink-0 text-lg text-accent" aria-hidden />
        ) : (
          <span
            className="mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-edge"
            aria-hidden
          />
        )}
      </div>
    </button>
  );
}