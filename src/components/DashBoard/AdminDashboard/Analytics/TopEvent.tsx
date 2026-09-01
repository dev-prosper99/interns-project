interface EventItem {
  rank: number;
  name: string;
  revenue: number;
  ticketsSold: number;
}
 
const events: EventItem[] = [
  { rank: 1, name: "Afrobeats & Vibes Festival 2026", revenue: 27300000, ticketsSold: 1820 },
  { rank: 2, name: "TechFest West Africa 2026", revenue: 21750000, ticketsSold: 870 },
  { rank: 3, name: "Lagos Comedy Fiesta", revenue: 11400000, ticketsSold: 950 },
  { rank: 4, name: "AFCON Watch Party — Grand Final", revenue: 6700000, ticketsSold: 333 },
  { rank: 2, name: "Nollywood & Afro Art Exhibition", revenue: 6600000, ticketsSold: 500 },
];
 
function formatNaira(value: number): string {
  return `₦${value.toLocaleString("en-NG")}`;
}
 
export default function TopPerformingEvents() {
  return (
    <div
      style={{
        backgroundColor: "#151515",
        borderRadius: "16px",
        padding: "24px",
        maxWidth: "480px",
        width: "100%",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <h2
        style={{
          color: "#F5F5F5",
          fontSize: "17px",
          fontWeight: 500,
          margin: "0 0 20px 0",
        }}
      >
        Top Performing Events (Top 5)
      </h2>
 
      <div>
        {events.map((event, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 0",
              borderTop: index === 0 ? "none" : "1px solid #2A2A2A",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  backgroundColor: "#7C3AED",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {event.rank}
              </div>
              <span
                style={{
                  color: "#EDEDED",
                  fontSize: "15px",
                  fontWeight: 400,
                }}
              >
                {event.name}
              </span>
            </div>
 
            <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "12px" }}>
              <div
                style={{
                  color: "#FF6A3D",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                {formatNaira(event.revenue)}
              </div>
              <div
                style={{
                  color: "#8A8A8A",
                  fontSize: "12.5px",
                  marginTop: "2px",
                }}
              >
                {event.ticketsSold.toLocaleString()} tickets sold
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 