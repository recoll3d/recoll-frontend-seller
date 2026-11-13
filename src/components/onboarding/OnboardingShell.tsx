import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

type OnboardingShellProps = {
  progressPercent: number;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  backTo?: string;
  backLabel?: string;
  footer?: ReactNode;
};

export function OnboardingShell({
  progressPercent,
  title,
  description,
  children,
  backTo = "/",
  backLabel = "Voltar",
  footer,
}: OnboardingShellProps) {
  const clamped = Math.min(100, Math.max(0, progressPercent));

  return (
    <div className="min-h-full bg-[#e8eaef] px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-xl">
        <div className="onboarding-card">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-title transition-all duration-300"
                style={{ width: `${clamped}%` }}
              />
            </div>
            <span className="text-sm font-bold text-title">{clamped}%</span>
          </div>

          <h1 className="onboarding-title">{title}</h1>
          {description ? (
            <p className="onboarding-text mt-3">{description}</p>
          ) : null}

          <div className="mt-8">{children}</div>

          {footer ? (
            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to={backTo}
                className="inline-flex items-center gap-2 text-sm font-bold text-outline hover:text-title"
              >
                <FaArrowLeft aria-hidden />
                {backLabel}
              </Link>
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
