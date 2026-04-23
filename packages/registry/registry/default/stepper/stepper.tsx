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

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

function Stepper({ steps, currentStep, className }: StepperProps) {
  const lastIndex = steps.length - 1;

  return (
    <div data-slot="stepper" className={cn("w-full", className)}>
      <div className="flex w-full items-start">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const segmentBeforeComplete =
            index > 0 ? index - 1 < currentStep : false;

          return (
            <Fragment key={step.id}>
              <div
                className={cn(
                  "mt-5 h-0.5 min-w-0 flex-1 transition-colors",
                  segmentBeforeComplete ? "bg-primary" : "bg-border"
                )}
                aria-hidden
              />
              <div className="flex shrink-0 flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted && "border-primary bg-primary",
                    isCurrent && "border-primary bg-background",
                    !isCompleted &&
                      !isCurrent &&
                      "border-border bg-background"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        isCurrent
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.id}
                    </span>
                  )}
                </div>
                <div className="mt-2 max-w-[120px] text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description &&
                    (step.tooltip ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <p className="mt-0.5 line-clamp-2 cursor-help text-xs text-muted-foreground transition-colors hover:text-foreground">
                            {step.description}
                          </p>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3">
                          {step.tooltip}
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    ))}
                </div>
              </div>
            </Fragment>
          );
        })}
        <div
          className={cn(
            "mt-5 h-0.5 min-w-0 flex-1 transition-colors",
            lastIndex < currentStep ? "bg-primary" : "bg-border"
          )}
          aria-hidden
        />
      </div>
    </div>
  );
}

export { Stepper, type Step, type StepperProps };
