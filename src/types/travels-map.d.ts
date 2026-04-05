import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "travels-map": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        center?: string;
        "data-src"?: string;
        "marker-color"?: string;
        "show-legends"?: string;
        theme?: string;
        "tiles-url"?: string;
        zoom?: string;
      };
    }
  }
}
