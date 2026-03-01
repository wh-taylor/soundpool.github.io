export interface FontOption {
  label: string;
  value: string;
  googleFont: boolean;
  stack: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    label: 'Space Mono (Default)',
    value: 'Space Mono',
    googleFont: true,
    stack: "'Space Mono', monospace",
  },
  {
    label: 'Share Tech Mono',
    value: 'Share Tech Mono',
    googleFont: true,
    stack: "'Share Tech Mono', monospace",
  },
  {
    label: 'VT323',
    value: 'VT323',
    googleFont: true,
    stack: "'VT323', monospace",
  },
  {
    label: 'Oxanium',
    value: 'Oxanium',
    googleFont: true,
    stack: "'Oxanium', sans-serif",
  },
  {
    label: 'Rajdhani',
    value: 'Rajdhani',
    googleFont: true,
    stack: "'Rajdhani', sans-serif",
  },
  {
    label: 'Bebas Neue',
    value: 'Bebas Neue',
    googleFont: true,
    stack: "'Bebas Neue', sans-serif",
  },
  {
    label: 'System Default',
    value: 'system-ui',
    googleFont: false,
    stack: 'system-ui, -apple-system, sans-serif',
  },
  {
    label: 'Monospace',
    value: 'monospace',
    googleFont: false,
    stack: 'monospace',
  },
];
