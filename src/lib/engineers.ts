// Digitech HMS Official Engineers Roster & Contact Directory
// Sourced strictly from verified company records & user photo rosters

export const ENGINEERS_ROSTER: Record<string, string> = {
  'Abdul Latif': '8826447778',
  'Afzal Digitech': '6398776924',
  'Ankush Singh': '8802659421',
  'Govind Kumar': '8130148238',
  'Gurvinder Singh': '8802650942',
  'Mohd Ayan': '8920458516',
  'Rajan Digitech': '7600758225',
  'Sameer Saifi': '9311117493',
  'Shahrukh Khan': '7042871709',
  'Sonu Kumar': '9958028414',
  'Yogesh Vishnu': '9012756431',
  // Backward-compatibility aliases for legacy tickets
  'Abdul': '8826447778',
  'Sharukh': '7042871709',
  'Shahrukh': '7042871709',
  'Govind': '8130148238',
  'Rajan': '7600758225',
  'Sameer': '9311117493',
  'Sonu': '9958028414',
  'Yogesh': '9012756431',
  'Ankush': '8802659421',
  'Afzal': '6398776924',
  'Gurvinder': '8802650942',
  'Vineet Mishra': '9999760222',
};

// All active engineers strictly from company roster photos (excluding Himanshu, names only, no emails in selectors)
export const ROSTER_ENGINEERS = [
  'Abdul Latif',
  'Afzal Digitech',
  'Ankush Singh',
  'Govind Kumar',
  'Gurvinder Singh',
  'Mohd Ayan',
  'Rajan Digitech',
  'Sameer Saifi',
  'Shahrukh Khan',
  'Sonu Kumar',
  'Yogesh Vishnu'
] as const;

export type EngineerName = typeof ROSTER_ENGINEERS[number];

export const ADMIN_NAME = 'Vineet Mishra';
export const ADMIN_PHONE = '9999760222';
export const ADMIN_EMAIL = 'vineet@digitechservices.net';
export const OFFICE_PHONE = '9999760444';
export const DEFAULT_ENGINEER_PHONE = '8920458516';

/**
 * Returns the verified direct WhatsApp contact number for a given engineer.
 * Handles "Mr." prefix and legacy aliases.
 */
export function getEngineerPhone(name?: string): string {
  if (!name) return DEFAULT_ENGINEER_PHONE;
  const clean = name.replace(/^Mr\.\s*/i, '').trim();
  if (ENGINEERS_ROSTER[clean]) return ENGINEERS_ROSTER[clean];
  for (const [key, phone] of Object.entries(ENGINEERS_ROSTER)) {
    if (clean.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(clean.toLowerCase())) {
      return phone;
    }
  }
  return DEFAULT_ENGINEER_PHONE;
}
