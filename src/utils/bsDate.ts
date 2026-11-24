import type { Language } from '../types/hub';

const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export const BS_MONTHS_EN = [
  'Baisakh',
  'Jestha',
  'Ashadh',
  'Shrawan',
  'Bhadra',
  'Ashwin',
  'Kartik',
  'Mangsir',
  'Poush',
  'Magh',
  'Falgun',
  'Chaitra',
];

export const BS_MONTHS_NE = [
  'बैशाख',
  'जेठ',
  'असार',
  'साउन',
  'भदौ',
  'असोज',
  'कार्तिक',
  'मंसिर',
  'पुस',
  'माघ',
  'फागुन',
  'चैत',
];

// BS month day counts for years 2080..2085 BS
const BS_CALENDAR_DATA: Record<number, number[]> = {
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2023-04-14
  2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2024-04-13
  2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2025-04-14
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], // 2026-04-14
  2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2027-04-14
  2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], // 2028-04-13
};

// Anchor: 2081-01-01 BS = 2024-04-13 AD
const ANCHOR_AD_UTC = Date.UTC(2024, 3, 13);
const ANCHOR_BS_YEAR = 2081;

export function toNepaliDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => NEPALI_DIGITS[Number(d)]);
}

export interface BsDateParts {
  year: number;
  monthIndex: number; // 0-11
  day: number;
}

export function adToBs(isoOrDate: string | Date): BsDateParts {
  let targetUtc: number;
  if (typeof isoOrDate === 'string') {
    const [y, m, d] = isoOrDate.split('T')[0].split('-').map(Number);
    if (!y || !m || !d) {
      const now = new Date();
      targetUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    } else {
      targetUtc = Date.UTC(y, m - 1, d);
    }
  } else {
    targetUtc = Date.UTC(
      isoOrDate.getFullYear(),
      isoOrDate.getMonth(),
      isoOrDate.getDate()
    );
  }

  let diffDays = Math.round((targetUtc - ANCHOR_AD_UTC) / 86400000);
  let year = ANCHOR_BS_YEAR;
  let monthIndex = 0;
  let day = 1;

  if (diffDays >= 0) {
    while (diffDays > 0) {
      const months = BS_CALENDAR_DATA[year] ?? BS_CALENDAR_DATA[2083];
      const daysInMonth = months[monthIndex];
      if (diffDays >= daysInMonth - day + 1) {
        diffDays -= daysInMonth - day + 1;
        day = 1;
        monthIndex += 1;
        if (monthIndex >= 12) {
          monthIndex = 0;
          year += 1;
        }
      } else {
        day += diffDays;
        diffDays = 0;
      }
    }
  } else {
    let remaining = -diffDays;
    while (remaining > 0) {
      if (day > remaining) {
        day -= remaining;
        remaining = 0;
      } else {
        remaining -= day;
        monthIndex -= 1;
        if (monthIndex < 0) {
          year -= 1;
          monthIndex = 11;
        }
        const months = BS_CALENDAR_DATA[year] ?? BS_CALENDAR_DATA[2080];
        day = months[monthIndex];
      }
    }
  }

  return { year, monthIndex, day };
}

export function formatDualDate(isoDate: string, lang: Language): { bs: string; ad: string } {
  const bsParts = adToBs(isoDate);
  const [y, m, d] = isoDate.split('T')[0].split('-').map(Number);
  const adObj = new Date(Date.UTC(y || 2026, (m || 11) - 1, d || 24));

  const ad = adObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });

  if (lang === 'ne') {
    const bs = `${toNepaliDigits(bsParts.year)} ${BS_MONTHS_NE[bsParts.monthIndex]} ${toNepaliDigits(bsParts.day)}`;
    return { bs, ad };
  }

  const bs = `${bsParts.day} ${BS_MONTHS_EN[bsParts.monthIndex]} ${bsParts.year} BS`;
  return { bs, ad };
}
