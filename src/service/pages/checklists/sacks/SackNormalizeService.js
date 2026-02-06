module.exports = class SackNormalizeService {

    static normalizeSacks(items) {
        const map = new Map();

        for (const item of items) {
            let size = 'Unsized';
            let baseName = item.name;

            if (item.name.includes('Small ')) {
                size = 'Small';
                baseName = item.name.replace('Small ', '');
            } else if (item.name.includes('Medium ')) {
                size = 'Medium';
                baseName = item.name.replace('Medium ', '');
            } else if (item.name.includes('Large Enchanted')) {
                size = 'Enchanted';
                baseName = item.name.replace('Large Enchanted ', '');
            } else if (item.name.includes('Extra Large')) {
                size = 'Extra Large';
                baseName = item.name.replace('Extra Large ', '');
            } else if (item.name.includes('Large ')) {
                size = 'Large';
                baseName = item.name.replace('Large ', '');
            }

            if (!map.has(baseName)) {
                map.set(baseName, {
                    name: baseName,
                    sizes: {
                        Unsized: false,
                        Small: false,
                        Medium: false,
                        Large: false,
                        'Extra Large': false,
                        Enchanted: false
                    }
                });
            }

            map.get(baseName).sizes[size] = true;
        }

        return Array.from(map.values()).sort((a, b) => this.sortSacks(a, b));
    }

    static sortSacks(a, b) {
        let weightedScore = 0;
        
        weightedScore += (b.sizes.Unsized * 32);
        weightedScore += (b.sizes.Enchanted * 16);
        weightedScore += (b.sizes['Extra Large'] * 8);
        
        weightedScore -= (a.sizes.Unsized * 32);
        weightedScore -= (a.sizes.Enchanted * 16);
        weightedScore -= (a.sizes['Extra Large'] * 8);

        return weightedScore;
    }
}