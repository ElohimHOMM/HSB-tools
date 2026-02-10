module.exports = class SacksChecklistService {
  static toJson(frontendData) {
    // store as JSON string
    return JSON.stringify(frontendData || {})
  }

  static fromJson(dbData) {
    try {
      return dbData ? JSON.parse(dbData) : {}
    } catch (err) {
      console.error('Failed to parse sacks checklist data:', err)
      return {}
    }
  }
}