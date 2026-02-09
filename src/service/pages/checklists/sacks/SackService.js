const SackNormalizeService = require('./SackNormalizeService');

module.exports = class SackService {

    static async getSacks(path, fs) {
        const sacksDataPath = path.join(__dirname, '../../../../../public/data/items.json');
              const raw = await fs.readFile(sacksDataPath, 'utf8');
              const items = JSON.parse(raw);
        
              const sacks = items.items.filter(
                (item) =>
                  item.id.includes('SACK') &&
                  item.material !== 'INK_SACK' &&
                  item.tier !== 'SPECIAL'
              );
        return sacks;
    }

    static normalizeSacks(items) {
        return SackNormalizeService.normalizeSacks(items);
    }
}