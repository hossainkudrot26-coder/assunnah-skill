import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";
export const alt = siteConfig.nameBn;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #0B3D2E 0%, #14593F 50%, #0D4530 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(141,198,63,0.5) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              background: "rgba(141, 198, 63, 0.15)",
              borderRadius: "24px",
              border: "1px solid rgba(141, 198, 63, 0.25)",
            }}
          >
            <span style={{ color: "#8DC63F", fontSize: "14px", fontWeight: 600 }}>
              NSDA নিবন্ধিত প্রতিষ্ঠান
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              color: "white",
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.1,
              textAlign: "center",
              margin: 0,
              maxWidth: "900px",
            }}
          >
            আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট
          </h1>

          {/* Tagline */}
          <p
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "22px",
              fontWeight: 500,
              margin: 0,
              textAlign: "center",
            }}
          >
            {siteConfig.tagline}
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginTop: "24px",
            }}
          >
            {[
              { v: "২,৫০০+", l: "শিক্ষার্থী" },
              { v: "২০+", l: "কোর্স" },
              { v: "১০০%", l: "স্কলারশিপ" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ color: "#8DC63F", fontSize: "28px", fontWeight: 800 }}>{s.v}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #1B8A50, #8DC63F, #D4A843)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
