document.addEventListener('DOMContentLoaded', () => {
  let allArticles = [];
  let filteredArticles = [];
  let currentPage = 1;
  const itemsPerPage = 50;

  // Get DOM elements
  const articlesDiv = document.getElementById('articles');
  const paginationDiv = document.getElementById('pagination');
  const filterInputs = {
    title: document.getElementById('filterTitle'),
    year: document.getElementById('filterYear'),
    publisher: document.getElementById('filterPublisher'),
    lab: document.getElementById('filterLab'),
    city: document.getElementById('filterCity')
  };

  // Check that pagination element exists
  if (!paginationDiv) {
    console.error('Pagination element not found!');
  }

  // Fetch articles from API
  fetch('/api/articlesWithCoords')
    .then(response => response.json())
    .then(data => {
      allArticles = data;
      filteredArticles = data;
      displayArticles();
      displayPagination();
    })
    .catch(err => {
      console.error('Error fetching enriched articles:', err);
    });

  // Filter articles using safe string conversion
  function filterArticles() {
    filteredArticles = allArticles.filter(article => {
      let match = true;
      const filterTitle = filterInputs.title.value.toLowerCase().trim();
      const filterYear = filterInputs.year.value.toLowerCase().trim();
      const filterPublisher = filterInputs.publisher.value.toLowerCase().trim();
      const filterLab = filterInputs.lab.value.toLowerCase().trim();
      const filterCity = filterInputs.city.value.toLowerCase().trim();

      if (filterTitle) {
        if (!article.title_s || String(article.title_s).toLowerCase().indexOf(filterTitle) === -1) {
          match = false;
        }
      }
      if (filterYear) {
        if (!article.producedDateY_i || String(article.producedDateY_i).toLowerCase().indexOf(filterYear) === -1) {
          match = false;
        }
      }
      if (filterPublisher) {
        if (!article.publisher_s || String(article.publisher_s).toLowerCase().indexOf(filterPublisher) === -1) {
          match = false;
        }
      }
      if (filterLab) {
        if (!article.labStructAcronym_s || String(article.labStructAcronym_s).toLowerCase().indexOf(filterLab) === -1) {
          match = false;
        }
      }
      if (filterCity) {
        if (!article.city_s || String(article.city_s).toLowerCase().indexOf(filterCity) === -1) {
          match = false;
        }
      }
      return match;
    });
  }

  // Display the articles for the current page
  function displayArticles() {
    articlesDiv.innerHTML = '';

    filterArticles();
    const totalItems = filteredArticles.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Ensure currentPage is within bounds
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const articlesToShow = filteredArticles.slice(startIndex, endIndex);

    if (articlesToShow.length) {
      const list = document.createElement('ul');
      articlesToShow.forEach(article => {
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
    displayPagination();
  }

  // Create pagination controls
  function displayPagination() {
    if (!paginationDiv) return;
    paginationDiv.innerHTML = '';
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        displayArticles();
      }
    });
    paginationDiv.appendChild(prevBtn);

    const pageInfo = document.createElement('span');
    pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;
    paginationDiv.appendChild(pageInfo);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayArticles();
      }
    });
    paginationDiv.appendChild(nextBtn);
  }

  // Attach event listeners to filter inputs
  Object.values(filterInputs).forEach(input => {
    input.addEventListener('input', () => {
      currentPage = 1;
      displayArticles();
    });
  });
});
