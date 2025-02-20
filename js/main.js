const API_BASE = 'https://cricbuzz-cricket.p.rapidapi.com';
const API_KEY = '1b44d3f24cmsh25cd65948222963p15f1b4jsnb3f19d0a7009';

class CrickShed {
    constructor() {
        this.currentTab = 'live';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadMatches();
        setInterval(() => this.loadMatches(), 30000);
    }

    bindEvents() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        document.querySelector('.retry-btn')?.addEventListener('click', () => {
            this.loadMatches();
        });
    }

    async loadMatches() {
        const loader = document.getElementById('loader');
        const errorMessage = document.getElementById('error-message');
        const container = document.getElementById('matches-container');

        try {
            loader.classList.remove('hidden');
            errorMessage.classList.add('hidden');
            container.innerHTML = '';

            const response = await fetch(`${API_BASE}/matches/v1/${this.currentTab}`, {
                headers: {
                    'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
                    'x-rapidapi-key': API_KEY
                }
            });
            const matches = await response.json();

            container.innerHTML = matches.typeMatches
                .map(type => type.seriesMatches
                    .map(series => series.seriesAdWrapper?.matches?.map(match => 
                        this.createMatchCard(match)) || []).flat()
                ).flat().join('');

        } catch (error) {
            console.error('Error:', error);
            errorMessage.classList.remove('hidden');
        } finally {
            loader.classList.add('hidden');
        }
    }

    createMatchCard(match) {
        return `
            <a href="match.html?id=${match.matchInfo.matchId}" class="match-card">
                <div class="match-header">
                    <span class="match-type">${match.matchInfo.matchFormat}</span>
                    ${match.matchInfo.state === 'In Progress' ? '<span class="live-badge">LIVE</span>' : ''}
                </div>
                <div class="match-teams">${match.matchInfo.team1.teamName} vs ${match.matchInfo.team2.teamName}</div>
                <div class="match-info">${match.matchInfo.status}</div>
            </a>
        `;
    }

    switchTab(tab) {
        this.currentTab = tab;
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        this.loadMatches();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CrickShed();
});
