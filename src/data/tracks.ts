import type { TrackDef } from '../types';

const CUPS = [
  { id: 'cup_nova', name: 'ノヴァカップ', theme: 'city' as const },
  { id: 'cup_frost', name: 'フロストカップ', theme: 'ice' as const },
  { id: 'cup_blaze', name: 'ブレイズカップ', theme: 'volcano' as const },
  { id: 'cup_astro', name: 'アストロカップ', theme: 'space' as const }
];

function createTrack(cupId: string, theme: TrackDef['backgroundTheme'], index: number, name: string): TrackDef {
  const centerX = 640;
  const centerY = 360;
  const radiusX = 280 + index * 12;
  const radiusY = 170 + index * 10;
  const points = 72;

  const aiPath = Array.from({ length: points }, (_, i) => {
    const angle = (Math.PI * 2 * i) / points;
    return {
      x: centerX + Math.cos(angle) * radiusX,
      y: centerY + Math.sin(angle) * radiusY,
      speedHint: 0.75 + 0.25 * Math.abs(Math.sin(angle * 2))
    };
  });

  const checkpoints = Array.from({ length: 8 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 8;
    return {
      x: centerX + Math.cos(angle) * radiusX,
      y: centerY + Math.sin(angle) * radiusY,
      radius: 70
    };
  });

  const itemBoxes = [6, 16, 26, 36, 46, 56, 66].map((p) => ({
    x: aiPath[p]!.x,
    y: aiPath[p]!.y,
    respawnMs: 3200
  }));

  const hazards = [
    { id: `${cupId}_${index}_hz1`, type: 'oil' as const, x: aiPath[11]!.x + 14, y: aiPath[11]!.y + 8, radius: 22, power: 0.35 },
    { id: `${cupId}_${index}_hz2`, type: 'slowZone' as const, x: aiPath[33]!.x - 10, y: aiPath[33]!.y - 12, radius: 28, power: 0.45 },
    { id: `${cupId}_${index}_hz3`, type: 'pulse' as const, x: aiPath[51]!.x, y: aiPath[51]!.y, radius: 20, power: 0.4 }
  ];

  const startBase = aiPath[0]!;
  const startGrid = Array.from({ length: 8 }, (_, i) => ({
    x: startBase.x - (i % 2) * 44 - Math.floor(i / 2) * 32,
    y: startBase.y + ((i % 2) * 2 - 1) * 24,
    heading: Math.PI / 2
  }));

  return {
    id: `${cupId}_t${index + 1}`,
    name,
    cupId,
    laps: 3,
    length: Math.round(Math.PI * (radiusX + radiusY) * 2),
    checkpoints,
    aiPath,
    hazards,
    itemBoxes,
    startGrid,
    backgroundTheme: theme
  };
}

export const TRACKS: TrackDef[] = [
  createTrack(CUPS[0]!.id, CUPS[0]!.theme, 0, 'ネオン・リングウェイ'),
  createTrack(CUPS[0]!.id, CUPS[0]!.theme, 1, 'アークシティ高速帯'),
  createTrack(CUPS[0]!.id, CUPS[0]!.theme, 2, 'ミラージュ高架'),
  createTrack(CUPS[0]!.id, CUPS[0]!.theme, 3, 'メトロポリス周回線'),

  createTrack(CUPS[1]!.id, CUPS[1]!.theme, 0, '氷晶トンネル'),
  createTrack(CUPS[1]!.id, CUPS[1]!.theme, 1, 'ブリザードループ'),
  createTrack(CUPS[1]!.id, CUPS[1]!.theme, 2, 'フロストブリッジ'),
  createTrack(CUPS[1]!.id, CUPS[1]!.theme, 3, '白夜ベイライン'),

  createTrack(CUPS[2]!.id, CUPS[2]!.theme, 0, 'マグマ採掘路'),
  createTrack(CUPS[2]!.id, CUPS[2]!.theme, 1, '火口外輪線'),
  createTrack(CUPS[2]!.id, CUPS[2]!.theme, 2, 'スモークキャニオン'),
  createTrack(CUPS[2]!.id, CUPS[2]!.theme, 3, '灼熱搬送ライン'),

  createTrack(CUPS[3]!.id, CUPS[3]!.theme, 0, 'オービタル・リンク'),
  createTrack(CUPS[3]!.id, CUPS[3]!.theme, 1, 'スターゲート回廊'),
  createTrack(CUPS[3]!.id, CUPS[3]!.theme, 2, '流星軌道帯'),
  createTrack(CUPS[3]!.id, CUPS[3]!.theme, 3, 'アストラル終端線')
];

export const CUPS_BY_ID: Record<string, { id: string; name: string }> = Object.fromEntries(
  CUPS.map((cup) => [cup.id, { id: cup.id, name: cup.name }])
);
