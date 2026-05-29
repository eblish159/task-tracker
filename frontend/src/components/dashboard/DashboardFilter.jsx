export default function DashboardFilter({
  startDate,
  endDate,
  categoryId,
  categories,
  loading,
  categoryLoading,
  categoryError,
  onChangeStartDate,
  onChangeEndDate,
  onChangeCategoryId,
  onSearch,
  onQuickRange,
  onThisMonth,
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        display: "flex",
        gap: 12,
        alignItems: "end",
        flexWrap: "wrap",
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <button onClick={() => onQuickRange(7)}>최근 7일</button>
        <button onClick={() => onQuickRange(14)}>최근 14일</button>
        <button onClick={() => onQuickRange(30)}>최근 30일</button>
        <button onClick={onThisMonth}>이번 달</button>
      </div>

      <FilterInput
        label="시작일"
        type="date"
        value={startDate}
        onChange={onChangeStartDate}
      />

      <FilterInput
        label="종료일"
        type="date"
        value={endDate}
        onChange={onChangeEndDate}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 220 }}>
        <label style={labelStyle}>카테고리</label>
        <select
          value={categoryId}
          onChange={(e) => onChangeCategoryId(e.target.value)}
          disabled={categoryLoading}
          style={inputStyle}
        >
          <option value="">전체</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>
        {categoryError && (
          <div style={{ color: "crimson", fontSize: 12 }}>{categoryError}</div>
        )}
      </div>

      <button
        onClick={onSearch}
        disabled={loading}
        style={{
          height: 38,
          padding: "0 18px",
          border: "none",
          borderRadius: 8,
          background: "#14b8a6",
          color: "#fff",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "조회중..." : "조회"}
      </button>
    </div>
  );
}

function FilterInput({ label, type, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

const labelStyle = {
  fontSize: 13,
  color: "#475467",
  fontWeight: 700,
};

const inputStyle = {
  height: 38,
  border: "1px solid #d0d5dd",
  borderRadius: 8,
  padding: "0 10px",
  background: "#fff",
};