import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 20,
        background: "#0F172A",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        borderRadius: "6px",
        fontWeight: 800,
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "6px",
          right: "6px",
          width: "6px",
          height: "6px",
          background: "#3B82F6",
          borderRadius: "50%",
        }}
      />
      B
    </div>,
    // ImageResponse ayarları
    {
      ...size,
    },
  );
}
