import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Fragment, type ReactNode } from "react";

interface Step {
  id: number;
  title: string;
  description?: string;
  tooltip?: ReactNode;
}

type StepperOrientation = "horizontal" | "vertical";

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  /** Default `horizontal`. `vertical` lays steps top-down with a spine on the left. */
  orientation?: StepperOrientation;
}

const circleBase =
  "flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors";

/** Line “fill” uses transform so it can animate; motion-reduce snaps without transition. */
const trackFillTransition =
  "transition-transform duration-500 ease-out motion-reduce:transition-none motion-reduce:duration-0";

function HorizontalTrackSegment({ filled }: { filled: boolean }) {
  return (
    <div className="relative mt-3.5 h-0.5 min-w-0 flex-1" aria-hidden>
      <div className="pointer-events-none absolute inset-0 rounded-full bg-border" />
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-full origin-left rounded-full bg-emerald-600 dark:bg-emerald-500",
          trackFillTransition,
          filled ? "scale-x-100" : "scale-x-0"
        )}
      />
    </div>
  );
}

function VerticalTrackSegment({ filled }: { filled: boolean }) {
  return (
    <div
      className="relative mt-1 flex w-0.5 min-h-10 flex-1 shrink-0"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 rounded-full bg-border" />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-full w-full origin-top rounded-full bg-emerald-600 dark:bg-emerald-500",
          trackFillTransition,
          filled ? "scale-y-100" : "scale-y-0"
        )}
      />
    </div>
  );
}

function StepCircle({
  step,
  isCompleted,
  isCurrent,
}: {
  step: Step;
  isCompleted: boolean;
  isCurrent: boolean;
}) {
  return (
    <div
      className={cn(
        circleBase,
        isCompleted &&
          "border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500",
        isCurrent &&
          !isCompleted &&
          "border-primary bg-background text-primary shadow-sm ring-2 ring-primary/25 ring-offset-1 ring-offset-background dark:ring-offset-background",
        !isCompleted &&
          !isCurrent &&
          "border-border bg-muted/30 text-muted-foreground"
      )}
      aria-hidden
    >
      {isCompleted ? (
        <Check className="size-3.5 stroke-[2.5]" aria-hidden />
      ) : (
        <span>{step.id}</span>
      )}
    </div>
  );
}

function StepTextBlock({
  step,
  isCurrent,
}: {
  step: Step;
  isCurrent: boolean;
}) {
  const titleId = `stepper-step-${step.id}-title`;
  const showDetail = isCurrent && Boolean(step.description);
  return (
    <div className={cn("min-w-0", showDetail ? "pt-0.5" : "pt-1")}>
      <p
        id={titleId}
        className={cn(
          "text-xs font-medium leading-tight",
          isCurrent ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {step.title}
      </p>
      {showDetail &&
        (step.tooltip ? (
          <Popover>
            <PopoverTrigger asChild>
              <p className="mt-0.5 line-clamp-2 cursor-help text-[11px] leading-snug text-muted-foreground transition-colors hover:text-foreground">
                {step.description}
              </p>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">{step.tooltip}</PopoverContent>
          </Popover>
        ) : (
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
            {step.description}
          </p>
        ))}
    </div>
  );
}

function StepperHorizontal({
  steps,
  currentStep,
  className,
}: Omit<StepperProps, "orientation">) {
  const lastIndex = steps.length - 1;

  return (
    <nav
      data-slot="stepper"
      aria-label="Progress"
      className={cn("w-full", className)}
    >
      <div className="flex w-full items-start">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const segmentBeforeComplete =
            index > 0 ? index - 1 < currentStep : false;

          return (
            <Fragment key={step.id}>
              <HorizontalTrackSegment filled={segmentBeforeComplete} />
              <div
                className="flex w-22 max-w-26 shrink-0 flex-col items-center px-0.5 sm:w-24 sm:max-w-28"
                aria-labelledby={`stepper-step-${step.id}-title`}
                aria-current={isCurrent ? "step" : undefined}
              >
                <StepCircle
                  step={step}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent}
                />
                <div className="mt-1.5 w-full text-center">
                  <StepTextBlock step={step} isCurrent={isCurrent} />
                </div>
              </div>
            </Fragment>
          );
        })}
        <HorizontalTrackSegment filled={lastIndex < currentStep} />
      </div>
    </nav>
  );
}

function StepperVertical({
  steps,
  currentStep,
  className,
}: Omit<StepperProps, "orientation">) {
  const lastIndex = steps.length - 1;

  return (
    <nav
      data-slot="stepper"
      data-orientation="vertical"
      aria-label="Progress"
      className={cn("w-full max-w-md", className)}
    >
      <ul className="m-0 list-none p-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const spineComplete = index < currentStep;

          return (
            <li
              key={step.id}
              className="m-0 flex gap-2.5 p-0"
              aria-labelledby={`stepper-step-${step.id}-title`}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="flex shrink-0 flex-col items-center">
                <StepCircle
                  step={step}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent}
                />
                {index < lastIndex ? (
                  <VerticalTrackSegment filled={spineComplete} />
                ) : null}
              </div>
              <div className="min-w-0 flex-1 pb-5 pt-0.5">
                <StepTextBlock step={step} isCurrent={isCurrent} />
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Stepper({
  steps,
  currentStep,
  className,
  orientation = "horizontal",
}: StepperProps) {
  if (orientation === "vertical") {
    return (
      <StepperVertical
        steps={steps}
        currentStep={currentStep}
        className={className}
      />
    );
  }
  return (
    <StepperHorizontal
      steps={steps}
      currentStep={currentStep}
      className={className}
    />
  );
}

export {
  Stepper,
  type Step,
  type StepperOrientation,
  type StepperProps,
};
