document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/articlesWithCoords')
    .then(response => response.json())
    .then(data => {
      const articlesDiv = document.getElementById('articles');
      if (data && data.length) {
        const list = document.createElement('ul');
        data.forEach(article => {
          const li = document.createElement('li');
          if (article.title_s) li.innerHTML += `<strong>Title:</strong> ${article.title_s} <br>`;
          if (article.authFullName_s) li.innerHTML += `<strong>Authors:</strong> ${article.authFullName_s} <br>`;
          if (article.producedDateY_i) li.innerHTML += `<strong>Year:</strong> ${article.producedDateY_i} <br>`;
          if (article.publisher_s) li.innerHTML += `<strong>Publisher:</strong> ${article.publisher_s} <br>`;
          if (article.docid) li.innerHTML += `<strong>DocID:</strong> ${article.docid} <br>`;
          if (article.uri_s) li.innerHTML += `<strong>URI:</strong> <a href="${article.uri_s}" target="_blank">${article.uri_s}</a> <br>`;
          if (article.fileMain_s) li.innerHTML += `<strong>Main File:</strong> ${article.fileMain_s} <br>`;
          if (article.labStructAcronym_s) li.innerHTML += `<strong>Lab Acronym:</strong> ${article.labStructAcronym_s} <br>`;
          if (article.page_s) li.innerHTML += `<strong>Page:</strong> ${article.page_s} <br>`;
          if (article.structCountry_s) li.innerHTML += `<strong>Country:</strong> ${article.structCountry_s} <br>`;
          if (article.city_s) li.innerHTML += `<strong>City:</strong> ${article.city_s} <br>`;
          if (article.labStructAddress_s) li.innerHTML += `<strong>Lab Address:</strong> ${article.labStructAddress_s} <br>`;
          
          if (article.latitude) li.innerHTML += `<strong>Latitude:</strong> ${article.latitude} <br>`;
          if (article.longitude) li.innerHTML += `<strong>Longitude:</strong> ${article.longitude} <br>`;

          li.innerHTML += '<hr>';
          list.appendChild(li);
        });
        articlesDiv.appendChild(list);
      } else {
        articlesDiv.textContent = 'No articles found.';
      }
    })
    .catch(err => {
      console.error('Error fetching enriched articles:', err);
    });
});
