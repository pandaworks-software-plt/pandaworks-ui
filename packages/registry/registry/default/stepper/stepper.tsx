import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ReactNode } from "react";

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
  return (
    <div data-slot="stepper" className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
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
              {!isLast && (
                <div className="mx-4 flex-1">
                  <div
                    className={cn(
                      "h-0.5 w-full transition-all",
                      isCompleted ? "bg-primary" : "bg-border"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Stepper, type Step, type StepperProps };
