import { FONT_OPTIONS } from '../data/fonts';
import { loadGoogleFont } from '../utils/fontUtils';
import type { Customization } from '../types';
import './CustomizationPanel.css';

interface CustomizationPanelProps {
  value: Customization;
  onChange: (c: Customization) => void;
}

export function CustomizationPanel({ value, onChange }: CustomizationPanelProps) {
  function handleFont(e: React.ChangeEvent<HTMLSelectElement>) {
    const opt = FONT_OPTIONS.find((f) => f.value === e.target.value);
    if (opt?.googleFont) loadGoogleFont(opt.value);
    onChange({ ...value, fontFamily: e.target.value || undefined });
  }

  return (
    <div className="customization-panel">
      <div className="section-label">Customization</div>
      <div className="customization-panel__grid">
        <div className="form-group">
          <label htmlFor="cp-font">Font</label>
          <select id="cp-font" value={value.fontFamily ?? ''} onChange={handleFont}>
            <option value="">Default (Space Mono)</option>
            {FONT_OPTIONS.map((f) => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.stack }}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cp-accent">Accent Color</label>
          <input
            id="cp-accent"
            type="color"
            value={value.accentColor ?? '#ff6b35'}
            onChange={(e) => onChange({ ...value, accentColor: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cp-text">Text Color</label>
          <input
            id="cp-text"
            type="color"
            value={value.textColor ?? '#e0e0e0'}
            onChange={(e) => onChange({ ...value, textColor: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cp-bg">Background</label>
          <input
            id="cp-bg"
            type="color"
            value={value.backgroundColor ?? '#12121e'}
            onChange={(e) => onChange({ ...value, backgroundColor: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
