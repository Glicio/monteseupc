import React from "react";
export default function Arrow({
  side,
}: {
  side?: "left" | "right" | "up" | "down";
}) {
  if (side === "down")
    return (
      <svg
        id="eL2XxZVvW6l1"
        viewBox="0 0 300 300"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        className="w-2 h-2"
      >
        <polygon
          points="0,-79.783717 69.094726,40.953067 -69.094726,40.953067 0,-79.783717"
          transform="matrix(-2.170933 0 0-2.484744 149.282304 102.818803)"
          fill="currentColor"
          strokeWidth="0"
        />
      </svg>
    );
  if (side === "right")
    return (
      <svg
        id="eI54ENBXs1W1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 300"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        className="w-2 h-2"
      >
        <polygon
          points="0,-79.783717 69.094726,40.953067 -69.094726,40.953067 0,-79.783717"
          transform="matrix(0 2.170933-2.484744 0 101.757888 150.000021)"
          fill="currentColor"
          strokeWidth="0"
        />
      </svg>
    );

  return (
    <svg
      id="eRHoEz5MnDT1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 300"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      className="w-2 h-2"
    >
      <polygon
        points="0,-79.783717 69.094726,40.953067 -69.094726,40.953067 0,-79.783717"
        transform="matrix(2.170933 0 0 2.484744 150 198.242112)"
        fill="currentColor"
        strokeWidth="0"
      />
    </svg>
  );
}
