const UserSavesEntity = require('../models/userSavesEntity');

// Page-specific deserializers
const EnigmaChecklistService = require('./pages/checklists/EnigmaChecklistService');
// (future) const SacksChecklistService = require('./pages/SacksChecklistService');

const pageServices = {
  'checklist.enigma': EnigmaChecklistService,
  // 'checklist.sacks': SacksChecklistService,
};

module.exports = class UserSaveService {

  static getService(pageKey) {
    return pageServices[pageKey] || null;
  }

  static async load(userId, pageKey) {
    const record = await UserSavesEntity.get(userId, pageKey);
    if (!record) return null;

    const service = this.getService(pageKey);
    if (!service) throw new Error(`No service registered for ${pageKey}`);

    return service.fromJson(record.DATA);
  }

  static async save(userId, pageKey, frontendData) {
    const service = this.getService(pageKey);
    if (!service) throw new Error(`No service registered for ${pageKey}`);

    const json = service.toJson(frontendData);
    return UserSavesEntity.upsert(userId, pageKey, json);
  }

  static async delete(userId, pageKey) {
    return UserSavesEntity.delete(userId, pageKey);
  }
}
