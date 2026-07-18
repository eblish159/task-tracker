export default function DashboardFilter({
  selectedRange,
  onQuickRange,
  onThisMonth,
}) {
  return (
    <div style={filterWrapperStyle}>
      <button
        style={selectedRange === 7 ? activeButtonStyle : buttonStyle}
        onClick={() => onQuickRange(7)}
      >
        최근 7일
      </button>

      <button
        style={selectedRange === 14 ? activeButtonStyle : buttonStyle}
        onClick={() => onQuickRange(14)}
      >
        최근 14일
      </button>

      <button
        style={selectedRange === 30 ? activeButtonStyle : buttonStyle}
        onClick={() => onQuickRange(30)}
      >
        최근 30일
      </button>

      <button
        style={selectedRange === "month" ? activeButtonStyle : buttonStyle}
        onClick={onThisMonth}
      >
        이번 달
      </button>
    </div>
  );
}

const filterWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginBottom: 20,
};

const buttonStyle = {
  height: 42,
  minWidth: 96,
  padding: "0 20px",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "#ffffff",
  color: "#475467",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all .2s ease",
};

const activeButtonStyle = {
  ...buttonStyle,
  background: "#ecfdf5",
  border: "1px solid #14b8a6",
  color: "#0f766e",
  boxShadow: "0 2px 8px rgba(20,184,166,.12)",
};