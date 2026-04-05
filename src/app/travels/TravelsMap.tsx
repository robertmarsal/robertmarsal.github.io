"use client";

import { useEffect, useRef } from "react";
import { travelPoints } from "@/data/travels";

type TravelsMapElement = HTMLElement & {
  points?: typeof travelPoints;
};

export function TravelsMap() {
  const mapRef = useRef<TravelsMapElement | null>(null);

  useEffect(() => {
    void import("travels-map").then(() => {
      if (mapRef.current) {
        mapRef.current.points = travelPoints;
      }
    });
  }, []);

  return (
    <travels-map
      ref={mapRef}
      theme="dark-monochrome"
      marker-color="#FF6600"
      center="38.957083,-39.074225"
      zoom="3"
      className="block h-[calc(100dvh-64px)] w-full overflow-hidden"
    />
  );
}
