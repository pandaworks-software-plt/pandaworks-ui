import { useState } from 'react';
import { MetaEditPill } from '@/components/ui/meta-edit-pill';
import { DemoSection } from '@/showcase/component-page';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const SEVERITY_OPTIONS = [
  { value: 'minor', label: 'Minor' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'major', label: 'Major' },
  { value: 'critical', label: 'Critical' },
];

const MODULE_OPTIONS = [
  { value: 'hr', label: 'HR Management' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'leave', label: 'Leave Management' },
  { value: 'attendance', label: 'Attendance' },
];

const PLATFORM_OPTIONS = [
  { value: 'web', label: 'Web' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
];

export default function MetaEditPillDemo() {
  const [priority, setPriority] = useState<string | null>('medium');
  const [severity, setSeverity] = useState<string | null>(null);
  const [moduleValue, setModuleValue] = useState<string | null>('hr');
  const [platforms, setPlatforms] = useState<string[]>(['web']);

  return (
    <>
      <DemoSection
        title="Inline meta strip"
        code={`import { MetaEditPill } from "@/components/ui/meta-edit-pill"

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

<div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
  <MetaEditPill
    label="Priority"
    mode="single"
    value={priority}
    options={PRIORITY_OPTIONS}
    canEdit
    onChange={setPriority}
  />
  <MetaEditPill
    label="Module"
    mode="single"
    value={moduleValue}
    options={MODULE_OPTIONS}
    allowClear
    clearLabel="No module"
    canEdit
    onChange={setModuleValue}
  />
</div>`}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          <MetaEditPill
            label="Priority"
            mode="single"
            value={priority}
            options={PRIORITY_OPTIONS}
            canEdit
            onChange={setPriority}
          />
          <MetaEditPill
            label="Severity"
            mode="single"
            value={severity}
            options={SEVERITY_OPTIONS}
            allowClear
            clearLabel="No severity"
            canEdit
            onChange={setSeverity}
          />
          <MetaEditPill
            label="Module"
            mode="single"
            value={moduleValue}
            options={MODULE_OPTIONS}
            allowClear
            clearLabel="No module"
            canEdit
            onChange={setModuleValue}
          />
          <MetaEditPill
            label="Platforms"
            mode="multi"
            value={platforms}
            options={PLATFORM_OPTIONS}
            canEdit
            onChange={setPlatforms}
          />
        </div>
      </DemoSection>

      <DemoSection
        title="Read-only fallback"
        code={`<MetaEditPill
  label="Priority"
  mode="single"
  value="high"
  options={PRIORITY_OPTIONS}
  canEdit={false}
  onChange={() => {}}
/>`}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          <p className="w-full text-sm text-muted-foreground">
            With <code className="rounded bg-muted px-1">canEdit=false</code>, the pill renders as plain label + value
            text. Use it to keep the same JSX in viewer-only roles.
          </p>
          <MetaEditPill
            label="Priority"
            mode="single"
            value="high"
            options={PRIORITY_OPTIONS}
            canEdit={false}
            onChange={() => {}}
          />
          <MetaEditPill
            label="Platforms"
            mode="multi"
            value={['web', 'ios']}
            options={PLATFORM_OPTIONS}
            canEdit={false}
            onChange={() => {}}
          />
        </div>
      </DemoSection>

      <DemoSection
        title="Busy state"
        code={`<MetaEditPill
  label="Priority"
  mode="single"
  value={priority}
  options={PRIORITY_OPTIONS}
  canEdit
  disabled // greys the trigger while a mutation is in flight
  onChange={setPriority}
/>`}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          <p className="w-full text-sm text-muted-foreground">
            Set <code className="rounded bg-muted px-1">disabled</code> while your mutation hook is pending so the
            trigger reads as inactive.
          </p>
          <MetaEditPill
            label="Priority"
            mode="single"
            value={priority}
            options={PRIORITY_OPTIONS}
            canEdit
            disabled
            onChange={setPriority}
          />
        </div>
      </DemoSection>
    </>
  );
}
