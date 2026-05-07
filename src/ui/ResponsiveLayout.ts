export interface LayoutMetrics {
  padding: number;
  headerFont: string;
  bodyFont: string;
  isPortrait: boolean;
}

export class ResponsiveLayout {
  get(width: number, height: number): LayoutMetrics {
    const isPortrait = height > width;
    const minSide = Math.min(width, height);
    const padding = Math.max(12, Math.round(minSide * 0.03));
    const bodySize = Math.max(13, Math.round(minSide * 0.022));
    const headerSize = Math.max(18, Math.round(minSide * 0.03));

    return {
      padding,
      isPortrait,
      headerFont: `${headerSize}px`,
      bodyFont: `${bodySize}px`
    };
  }
}
