        let currentPage = 1;
        let currentFilter = '';
        let currentSearch = '';

        function loadCharacters(page = 1) {
            currentPage = page;
            const content = document.getElementById('content');
            content.innerHTML = '<div class="loading">Indlæser karakterer...</div>';

            let url = `https://rickandmortyapi.com/api/character/?page=${page}`;
            
            if (currentFilter) {
                url += `&status=${currentFilter}`;
            }
            
            if (currentSearch) {
                url += `&name=${currentSearch}`;
            }

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ingen karakterer fundet');
                    }
                    return response.json();
                })
                .then(data => {
                    view(data);
                })
                .catch(error => {
                    content.innerHTML = `<div class="error">❌ ${error.message}</div>`;
                });
        }

        function view(data) {
            const content = document.getElementById('content');
            const pagination = document.getElementById('pagination');
            
            let html = '<div class="character-grid">';
            
            data.results.forEach(character => {
                const statusClass = character.status.toLowerCase();
                html += `
                    <div class="character-card" onclick="showCharacterDetails(${character.id})">
                        <img src="${character.image}" alt="${character.name}" class="character-image">
                        <div class="character-info">
                            <div class="character-name">${character.name}</div>
                            <div class="character-detail">
                                <span class="status-dot status-${statusClass}"></span>
                                ${character.status} - ${character.species}
                            </div>
                            <div class="character-detail">
                                📍 ${character.location.name}
                            </div>
                            <div class="character-detail">
                                🌍 ${character.origin.name}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            content.innerHTML = html;

            // Pagination
            let paginationHtml = '';
            if (data.info.prev) {
                paginationHtml += `<button onclick="loadCharacters(${currentPage - 1})">⬅️ Forrige</button>`;
            }
            paginationHtml += `<button disabled>Side ${currentPage}</button>`;
            if (data.info.next) {
                paginationHtml += `<button onclick="loadCharacters(${currentPage + 1})">Næste ➡️</button>`;
            }
            pagination.innerHTML = paginationHtml;
        }

        function loadRandomCharacter() {
            const content = document.getElementById('content');
            content.innerHTML = '<div class="loading">Finder en tilfældig karakter...</div>';
            
            const randomId = Math.floor(Math.random() * 826) + 1;
            
            fetch(`https://rickandmortyapi.com/api/character/${randomId}`)
                .then(response => response.json())
                .then(character => {
                    view({ results: [character], info: {} });
                    document.getElementById('pagination').innerHTML = '';
                })
                .catch(error => {
                    content.innerHTML = `<div class="error">❌ Kunne ikke finde karakter</div>`;
                });
        }

        function filterByStatus(status) {
            currentFilter = status;
            currentPage = 1;
            loadCharacters(1);
        }

        function searchCharacters() {
            const searchInput = document.getElementById('searchInput');
            currentSearch = searchInput.value;
            currentPage = 1;
            currentFilter = '';
            loadCharacters(1);
        }

        function showCharacterDetails(id) {
            fetch(`https://rickandmortyapi.com/api/character/${id}`)
                .then(response => response.json())
                .then(character => {
                    alert(`
🎭 ${character.name}

Status: ${character.status}
Art: ${character.species}
Køn: ${character.gender}
Oprindelse: ${character.origin.name}
Nuværende lokation: ${character.location.name}

Optrådt i ${character.episode.length} episoder!
                    `);
                });
        }

        // Indlæs karakterer ved start
        loadCharacters(1);

        // Tilføj enter-taste support til søgning
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchCharacters();
            }
        });