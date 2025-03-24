document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/cities')
      .then(response => response.json())
      .then(data => {
        const citiesDiv = document.getElementById('cities');
        if (data && data.length) {
          const list = document.createElement('ul');
          data.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city.city;
            li.textContent += " " + city.lat;
            li.textContent += " " + city.lng;
            list.appendChild(li);
          });
          citiesDiv.appendChild(list);
        } else {
          citiesDiv.textContent = 'No cities found.';
        }
      })
      .catch(err => {
        console.error('Error fetching cities:', err);
      });
  });
  