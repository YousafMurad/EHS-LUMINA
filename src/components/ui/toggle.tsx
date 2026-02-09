// Toggle/Switch Component
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-6 w-11 items-center rounded-full"
      >
        <span className="sr-only">{label}</span>
        {/* Toggle track and thumb will be styled here */}
      </button>
      {label && <span>{label}</span>}
    </label>
  );
}
