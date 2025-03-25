async function fetchData() {
    const response = await fetch('/api/articlesWithCoords');
    const articles = await response.json();
    return articles;
}

async function renderCharts() {
    const articles = await fetchData();

    const yearCounts = {};
    const cityCounts = {};
    const publisherCounts = {};

    articles.forEach(article => {
        if (article.producedDateY_i) yearCounts[article.producedDateY_i] = (yearCounts[article.producedDateY_i] || 0) + 1;
        if (article.city_s) cityCounts[article.city_s] = (cityCounts[article.city_s] || 0) + 1;
        if (article.publisher_s) publisherCounts[article.publisher_s] = (publisherCounts[article.publisher_s] || 0) + 1;
    });
    

    const createChart = (ctxId, label, dataObj, type = 'bar') => {
        const ctx = document.getElementById(ctxId).getContext('2d');
        new Chart(ctx, {
            type,
            data: {
                labels: Object.keys(dataObj),
                datasets: [{
                    label,
                    data: Object.values(dataObj),
                    backgroundColor: '#4e79a7'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: label }
                }
            }
        });
    };

    createChart('yearChart', 'Articles per Year', yearCounts, 'bar');
}

function sortAndLimit(obj, limit = 10) {
    return Object.fromEntries(Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, limit));
}

document.addEventListener('DOMContentLoaded', renderCharts);
