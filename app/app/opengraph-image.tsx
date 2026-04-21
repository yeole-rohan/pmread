import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PMRead — Customer Evidence to Engineering Spec";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #faf9ff 0%, #ede9ff 60%, #f5f3ff 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background accent circle */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(127, 119, 221, 0.12)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(127, 119, 221, 0.08)",
            display: "flex",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(127, 119, 221, 0.12)",
            border: "1px solid rgba(127, 119, 221, 0.3)",
            borderRadius: 100,
            padding: "8px 20px",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#7F77DD",
              display: "flex",
            }}
          />
          <span style={{ fontSize: 18, color: "#7F77DD", fontWeight: 600 }}>
            Evidence-Backed PRD Workflow
          </span>
        </div>

        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 24 }}>
          <span style={{ fontSize: 100, fontWeight: 800, color: "#111827", lineHeight: 1 }}>
            PM
          </span>
          <span style={{ fontSize: 100, fontWeight: 800, color: "#7F77DD", lineHeight: 1 }}>
            Read
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 34,
            color: "#374151",
            fontWeight: 500,
            textAlign: "center",
            maxWidth: 760,
            lineHeight: 1.3,
            marginBottom: 20,
          }}
        >
          Customer Evidence to Engineering Spec
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            fontSize: 22,
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          Upload interviews · Extract insights · Generate cited PRDs
        </div>

        {/* Bottom pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 48,
          }}
        >
          {["Free tier available", "Priced in INR", "Built in India 🇮🇳"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 18px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 16,
                color: "#6b7280",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
