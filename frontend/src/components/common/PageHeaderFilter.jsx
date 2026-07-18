export default function PageHeaderFilter({
  title,
  description,
  startDate,
  endDate,
  loading,
  onChangeStartDate,
  onChangeEndDate,
  onApply,
  buttonText = "필터 적용",
}) {
  return (
    <div style={headerStyle}>
      <div style={titleBoxStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <span style={descriptionStyle}>{description}</span>
      </div>

      <div style={filterBoxStyle}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onChangeStartDate(e.target.value)}
          style={dateInputStyle}
        />

        <span style={waveStyle}>~</span>

        <input
          type="date"
          value={endDate}
          onChange={(e) => onChangeEndDate(e.target.value)}
          style={dateInputStyle}
        />

        <button
          onClick={onApply}
          disabled={loading}
          style={{
            ...applyButtonStyle,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "조회중..." : buttonText}
        </button>
      </div>
    </div>
  );
}

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 18,
};

const titleBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const titleStyle = {
  margin: 0,
  fontSize: 30,
};

const descriptionStyle = {
  color: "#667085",
  fontSize: 14,
};

const filterBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const dateInputStyle = {
  height: 38,
  border: "1px solid #d0d5dd",
  borderRadius: 8,
  padding: "0 10px",
  background: "#fff",
  fontWeight: 700,
  color: "#344054",
};

const waveStyle = {
  color: "#667085",
  fontWeight: 700,
};

const applyButtonStyle = {
  height: 38,
  padding: "0 18px",
  border: "none",
  borderRadius: 8,
  background: "#14b8a6",
  color: "#fff",
  fontWeight: 700,
};