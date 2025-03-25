const fs = require('fs');
const path = require('path');
const cachePath = path.join(__dirname, 'cache.json');

function saveData(data) {
    try {
        fs.writeFileSync(cachePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log('✅ Données sauvegardées dans le cache');
    } catch (err) {
        console.error('❌ Erreur lors de la sauvegarde du cache:', err);
    }
}

function loadDataFromCache() {
    if (fs.existsSync(cachePath)) {
        try {
            const rawData = fs.readFileSync(cachePath, 'utf-8');
            console.log('✅ Cache chargé avec succès');
            return JSON.parse(rawData);
        } catch (err) {
            console.error('❌ Erreur de lecture du cache:', err);
            return null;
        }
    } else {
        console.log('⚠️ Aucun cache trouvé');
        return null;
    }
}

module.exports = { saveData, loadDataFromCache };
