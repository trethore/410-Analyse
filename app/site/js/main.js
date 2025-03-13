import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

// Initialiser la carte
const map = L.map('map').setView([48.4, -4.25], 13);

// Ajouter une couche OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Créer un groupe de clusters
const markers = L.markerClusterGroup();

// Ajouter des marqueurs aléatoires
const locations = [
    [48.41, -4.26],
    [48.42, -4.24],
    [48.40, -4.23],
    [48.39, -4.25]
];

locations.forEach(coords => {
    const marker = L.marker(coords);
    markers.addLayer(marker);
});

// Ajouter le groupe de clusters à la carte
map.addLayer(markers);

