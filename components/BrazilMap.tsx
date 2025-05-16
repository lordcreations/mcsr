"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "/maps/brazil.json";  // Correct path to your geojson

export default function BrazilMap() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 300, // Adjust this value based on your map's size
          center: [-55, -10], // Adjust the center of the map to focus on Brazil
        }}
        width={800}
        height={600}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "#E0E0E0",
                    stroke: "#FFFFFF",
                    strokeWidth: 0.75,
                  },
                  hover: {
                    fill: "#FFD54F",
                    cursor: "pointer",
                  },
                  pressed: {
                    fill: "#FFB300",
                  },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
