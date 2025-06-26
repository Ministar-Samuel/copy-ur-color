
export type ColorFormat = 'HEX' | 'RGB' | 'HSL' | 'HSB' | 'CMYK';

export interface ColorValue {
  r: number;
  g: number;
  b: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface HSBColor {
  h: number;
  s: number;
  b: number;
}

export interface CMYKColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

export const parseColor = (input: string, format: ColorFormat): ColorValue => {
  const trimmed = input.trim();
  
  switch (format) {
    case 'HEX':
      return parseHex(trimmed);
    case 'RGB':
      return parseRGB(trimmed);
    case 'HSL':
      return parseHSL(trimmed);
    case 'HSB':
      return parseHSB(trimmed);
    case 'CMYK':
      return parseCMYK(trimmed);
    default:
      throw new Error('Unsupported format');
  }
};

const parseHex = (hex: string): ColorValue => {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) throw new Error('Invalid HEX format');
  
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
};

const parseRGB = (rgb: string): ColorValue => {
  const match = rgb.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (!match) throw new Error('Invalid RGB format');
  
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  };
};

const parseHSL = (hsl: string): ColorValue => {
  const match = hsl.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i);
  if (!match) throw new Error('Invalid HSL format');
  
  const h = parseInt(match[1], 10) / 360;
  const s = parseInt(match[2], 10) / 100;
  const l = parseInt(match[3], 10) / 100;
  
  return hslToRgb(h, s, l);
};

const parseHSB = (hsb: string): ColorValue => {
  const match = hsb.match(/hsb\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i);
  if (!match) throw new Error('Invalid HSB format');
  
  const h = parseInt(match[1], 10) / 360;
  const s = parseInt(match[2], 10) / 100;
  const b = parseInt(match[3], 10) / 100;
  
  return hsbToRgb(h, s, b);
};

const parseCMYK = (cmyk: string): ColorValue => {
  const match = cmyk.match(/cmyk\s*\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i);
  if (!match) throw new Error('Invalid CMYK format');
  
  const c = parseInt(match[1], 10) / 100;
  const m = parseInt(match[2], 10) / 100;
  const y = parseInt(match[3], 10) / 100;
  const k = parseInt(match[4], 10) / 100;
  
  return cmykToRgb(c, m, y, k);
};

export const convertColor = (color: ColorValue, toFormat: ColorFormat): any => {
  switch (toFormat) {
    case 'HEX':
      return color;
    case 'RGB':
      return color;
    case 'HSL':
      return rgbToHsl(color.r, color.g, color.b);
    case 'HSB':
      return rgbToHsb(color.r, color.g, color.b);
    case 'CMYK':
      return rgbToCmyk(color.r, color.g, color.b);
    default:
      return color;
  }
};

export const formatColor = (color: any, format: ColorFormat): string => {
  switch (format) {
    case 'HEX':
      return `#${Math.round(color.r).toString(16).padStart(2, '0')}${Math.round(color.g).toString(16).padStart(2, '0')}${Math.round(color.b).toString(16).padStart(2, '0')}`.toUpperCase();
    case 'RGB':
      return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;
    case 'HSL':
      return `hsl(${Math.round(color.h)}, ${Math.round(color.s)}%, ${Math.round(color.l)}%)`;
    case 'HSB':
      return `hsb(${Math.round(color.h)}, ${Math.round(color.s)}%, ${Math.round(color.b)}%)`;
    case 'CMYK':
      return `cmyk(${Math.round(color.c)}%, ${Math.round(color.m)}%, ${Math.round(color.y)}%, ${Math.round(color.k)}%)`;
    default:
      return '';
  }
};

// Conversion helper functions
const hslToRgb = (h: number, s: number, l: number): ColorValue => {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

const rgbToHsl = (r: number, g: number, b: number): HSLColor => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const hsbToRgb = (h: number, s: number, b: number): ColorValue => {
  const c = b * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = b - c;

  let r = 0, g = 0, bl = 0;

  if (h >= 0 && h < 1/6) {
    [r, g, bl] = [c, x, 0];
  } else if (h >= 1/6 && h < 2/6) {
    [r, g, bl] = [x, c, 0];
  } else if (h >= 2/6 && h < 3/6) {
    [r, g, bl] = [0, c, x];
  } else if (h >= 3/6 && h < 4/6) {
    [r, g, bl] = [0, x, c];
  } else if (h >= 4/6 && h < 5/6) {
    [r, g, bl] = [x, 0, c];
  } else {
    [r, g, bl] = [c, 0, x];
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((bl + m) * 255),
  };
};

const rgbToHsb = (r: number, g: number, b: number): HSBColor => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const brightness = Math.round(max * 100);

  return { h, s, b: brightness };
};

const cmykToRgb = (c: number, m: number, y: number, k: number): ColorValue => {
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  };
};

const rgbToCmyk = (r: number, g: number, b: number): CMYKColor => {
  r /= 255;
  g /= 255;
  b /= 255;

  const k = 1 - Math.max(r, g, b);
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
};
