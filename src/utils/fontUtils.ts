const loadedFonts = new Set<string>();

export function loadGoogleFont(fontFamily: string): void {
  if (loadedFonts.has(fontFamily)) return;
  // Check if already in DOM
  const id = `gf-${fontFamily.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) {
    loadedFonts.add(fontFamily);
    return;
  }
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(fontFamily);
}
