"use client";

const WIDTH = {
  default: 1120,
  narrow: 720,
  wide: 1280,
  full: "100%",
};

export function PageContainer({ children, width = "default", style }) {
  const maxWidth = WIDTH[width] ?? WIDTH.default;

  return (
    <div
      style={{
        width: "100%",
        maxWidth,
        margin: "0 auto",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
