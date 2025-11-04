/**
 * Handles serialization/deserialization for Enigma Soul checklist saves.
 * The frontend sends an object like:
 * {
 *   "souls": {
 *     "0": true,
 *     "1": false,
 *     "2": true
 *   }
 * }
 */
module.exports = class EnigmaChecklistService {
    
  static fromJson(jsonData) {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.souls || typeof parsed.souls !== 'object') {
        return { souls: {} };
      }
      return parsed;
    } catch (err) {
      console.error('Failed to parse Enigma save JSON:', err);
      return { souls: {} };
    }
  }

  
  static toJson(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid Enigma data payload');
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(data.souls || {})) {
      sanitized[key] = !!value;
    }

    return JSON.stringify({ souls: sanitized });
  }
}
