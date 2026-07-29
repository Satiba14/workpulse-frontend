const isDark = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

export const getSelectStyles = () => {
  const dark = isDark();
  return {
    control: (base, state) => ({
      ...base,
      minHeight: "38px",
      borderRadius: "8px",
      borderColor: state.isFocused
        ? "#38bdf8"
        : dark ? "#374151" : "#e5e7eb",
      boxShadow: state.isFocused
        ? "0 0 0 1px rgba(56,189,248,0.3)"
        : "none",
      fontSize: "14px",
      fontWeight: 500,
      backgroundColor: dark ? "#111827" : "white",
      color: dark ? "#f1f5f9" : "#374151",
      cursor: "pointer",
      transition: "border-color 0.15s",
      "&:hover": { borderColor: "#38bdf8" },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 10px",
    }),
    singleValue: (base) => ({
      ...base,
      color: dark ? "#f1f5f9" : "#374151",
      fontSize: "14px",
      fontWeight: 500,
    }),
    placeholder: (base) => ({
      ...base,
      color: dark ? "#6b7280" : "#9ca3af",
      fontSize: "14px",
      fontWeight: 500,
    }),
    input: (base) => ({
      ...base,
      color: dark ? "#f1f5f9" : "#374151",
      fontSize: "14px",
      fontWeight: 500,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? dark ? "#1f2937" : "#f3f4f6"
        : dark ? "#111827" : "white",
      color: dark ? "#e2e8f0" : "#374151",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "12px",
      overflow: "hidden",
      zIndex: 9999,
      backgroundColor: dark ? "#111827" : "white",
      border: dark ? "1px solid #374151" : "1px solid #e5e7eb",
      boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
    }),
    clearIndicator: (base) => ({
      ...base,
      color: dark ? "#6b7280" : "#9ca3af",
      "&:hover": { color: dark ? "#e2e8f0" : "#374151" },
      padding: "0 4px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: dark ? "#6b7280" : "#9ca3af",
      padding: "0 6px",
    }),
    indicatorSeparator: () => ({ display: "none" }),
  };
};