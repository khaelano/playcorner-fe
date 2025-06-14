import { useCallback } from "react";

type SelectorProps = Omit<React.HTMLProps<HTMLDivElement>, "onChange"> & {
  items?: React.ReactNode[];
  selectedIndex?: number;
  onChange: (i: number, action: "selected" | "unselected") => void;
};

export default function Selector({
  items,
  selectedIndex,
  onChange,
  ...htmlProps
}: SelectorProps) {
  const onChangeCallback = useCallback(
    (i: number) => {
      if (selectedIndex === i) {
        onChange(i, "unselected");
        return;
      }
      onChange(i, "selected");
    },
    [selectedIndex, onChange],
  );

  return (
    <div {...htmlProps}>
      {items?.map((item, i) => (
        <button
          key={i}
          disabled={htmlProps.disabled}
          onClick={() => onChangeCallback(i)}
          className={`flex place-content-center px-4 py-2 border-1 rounded-lg border-primary-500 transition-all duration-75 ${selectedIndex === i ? "bg-secondary-500 border-secondary-500 text-white" : "border-primary-500 text-primary-500"} disabled:border-primary-200 disabled:text-primary-200`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
