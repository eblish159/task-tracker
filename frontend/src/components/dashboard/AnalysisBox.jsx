export default function AnalysisBox({ title, icon, lines }) {
                  return (
                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 14,
                        padding: 16,
                        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                      }}
                    >
                      <h3 style={{ margin: "0 0 10px 0", fontSize: 17 }}>
                        {icon} {title}
                      </h3>

                      <ul style={{ margin: 0, paddingLeft: 20, color: "#374151", lineHeight: 1.7 }}>
                        {lines.map((line, index) => (
                          <li key={index}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }