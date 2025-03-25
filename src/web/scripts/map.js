document.addEventListener('DOMContentLoaded', () => {
    console.log("map loaded");
    const map = L.map('map').setView([48.8566, 2.3522], 6); 
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    const markers = L.markerClusterGroup();
  
    fetch('/api/articlesWithCoords')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        data.forEach(article => {
          if (article.latitude && article.longitude) {
            const marker = L.marker([article.latitude, article.longitude])
                .bindPopup(`<strong>${article.title_s}</strong><br><a href="${article.uri_s}" target="_blank">Link</a>`);
            markers.addLayer(marker);
          }
        });
        map.addLayer(markers);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
      });
  });
  