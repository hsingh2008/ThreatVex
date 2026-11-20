import { ScanHistoryItem } from '../types/security';

const STORAGE_KEY = 'threatvex_scan_history_v1';
const MAX_HISTORY_ITEMS = 25;

export function getScanHistory(): ScanHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to read scan history from localStorage:', err);
    return [];
  }
}

export function saveScanHistoryItem(item: Omit<ScanHistoryItem, 'id' | 'timestamp'>): void {
  try {
    const existing = getScanHistory();
    const newItem: ScanHistoryItem = {
      ...item,
      id: 'scan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString()
    };

    // Filter out duplicates with the same target/summary in recent history
    const filtered = existing.filter(x => x.target !== item.target || x.tool !== item.tool);
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save item to localStorage:', err);
  }
}

export function clearScanHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear scan history:', err);
  }
}
