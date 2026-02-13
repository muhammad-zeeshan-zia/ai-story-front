// ==========================================
// 1. Type Definitions
// ==========================================

export type TrimSize =
  | "0600X0900" // US Trade (6.00 x 9.00 inches)
  | "0700X1000" // Executive (7.00 x 10.00 inches)
  | "0744X0968" // Crown Quarto (7.44 x 9.68 inches)
  | "0614X0921" // Royal (6.14 x 9.21 inches)
  ;

export enum BindingType {
  CaseWrap = "CW",         // Hardcover
  CoilBound = "CO",        // Spiral
  SaddleStitch = "SS",     // Stapled (Booklet)
  LinenWrap = "LW",        // Hardcover Linen
  PerfectBound = "PB",     // Paperback (Standard)
}

export enum InteriorColor {
  BlackWhiteStandard = "BWSTD",
  BlackWhitePremium = "BWPRE",
  ColorStandard = "FCSTD",
  ColorPremium = "FCPRE",
}

export enum PaperType {
  WhiteUncoated60 = "060UW444", // 60# White Uncoated (Standard for B&W)
  WhiteCoated80 = "080CW444",   // 80# White Coated (Standard for Color)
}

export enum CoverFinish {
  Glossy = "GXX",
  Matte = "MXX",
}

// Interface for the selection object
export interface BookSpecification {
  size: TrimSize;
  color: InteriorColor;
  binding: BindingType;
  paper: PaperType;
  finish: CoverFinish;
}

// ==========================================
// 2. Options Data (JSON Structure)
// ==========================================

export const luluOptions = {
  defaults: {
    trimSize: "0600X0900", // default: US Trade (6x9)
  },
  // available trim sizes for users to choose
  sizes: [
    { label: "US Trade (6.00 x 9.00)", code: "0600X0900" },
    { label: "Executive (7.00 x 10.00)", code: "0700X1000" },
    { label: "Crown Quarto (7.44 x 9.68)", code: "0744X0968" },
    { label: "Royal (6.14 x 9.21)", code: "0614X0921" },
  ],
  bindings: [
    { label: "Perfect Bound (Softcover)", code: BindingType.PerfectBound },
    { label: "Case Wrap (Hardcover)", code: BindingType.CaseWrap },
    // { label: "Linen Wrap (Hardcover)", code: BindingType.LinenWrap },
    { label: "Coil Bound (Spiral)", code: BindingType.CoilBound },
    { label: "Saddle Stitch (Booklet)", code: BindingType.SaddleStitch },
  ],
  interiorColors: [
    { label: "Standard Black & White", code: InteriorColor.BlackWhiteStandard },
    { label: "Premium Black & White", code: InteriorColor.BlackWhitePremium },
    { label: "Standard Color", code: InteriorColor.ColorStandard },
    { label: "Premium Color", code: InteriorColor.ColorPremium },
  ],
  paperTypes: [
    { label: "60# White Uncoated", code: PaperType.WhiteUncoated60 },
    { label: "80# White Coated", code: PaperType.WhiteCoated80 },
  ],
  coverFinishes: [
    { label: "Glossy", code: CoverFinish.Glossy },
    { label: "Matte", code: CoverFinish.Matte },
  ]
};

// ==========================================
// 3. Helper Function to Generate ID
// ==========================================

/**
 * Generates the Lulu POD Package ID.
 * Pattern: [Size][Color][Binding][Paper][Finish]
 * Example: 0600X0900 + FCSTD + PB + 080CW444 + GXX
 */
export const generatePodPackageId = (spec: BookSpecification): string => {
  return `${spec.size}${spec.color}${spec.binding}${spec.paper}${spec.finish}`;
};

// ==========================================
// 4. Example Usage
// ==========================================

/*
// Example 1: Standard Color Paperback
const myBookConfig: BookSpecification = {
    size: "0600X0900",
    color: InteriorColor.ColorStandard,  // FCSTD
    binding: BindingType.PerfectBound,   // PB
    paper: PaperType.WhiteCoated80,      // 080CW444
    finish: CoverFinish.Glossy           // GXX
};

// Result: 0600X0900FCSTDPB080CW444GXX
const podId = generatePodPackageId(myBookConfig);
console.log(podId); 
*/