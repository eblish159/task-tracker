export default function SummaryCard ({ title, value, subtitle, icon, onClick }) {
                                     return (
                                       <div
                                         style={{
                                           background: "#fff",
                                           border: "1px solid #e5e7eb",
                                           borderRadius: 14,
                                           padding: 16,
                                           minHeight: 112,
                                           boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                                           cursor: onClick ? "pointer" : "default",
                                         }}
                                         onClick={onClick}
                                       >
                                         <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                                           <div>
                                             <div style={{ color: "#667085", fontSize: 13, fontWeight: 700 }}>{title}</div>
                                             <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10, color: "#111827" }}>
                                               {value}
                                             </div>
                                             <div style={{ color: "#667085", fontSize: 12, marginTop: 6 }}>{subtitle}</div>
                                           </div>

                                           <div
                                             style={{
                                               width: 42,
                                               height: 42,
                                               borderRadius: "50%",
                                               background: "#eff6ff",
                                               display: "flex",
                                               alignItems: "center",
                                               justifyContent: "center",
                                               fontSize: 22,
                                             }}
                                           >
                                             {icon}
                                           </div>
                                         </div>
                                       </div>
                                     );
                                   }