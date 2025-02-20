const API_BASE = 'https://cricbuzz-cricket.p.rapidapi.com';
const API_KEY = '1b44d3f24cmsh25cd65948222963p15f1b4jsnb3f19d0a7009';

class MatchDetails {
    constructor() {
        this.matchId = new URLSearchParams(window.location.search).get('id');
        this.init();
    }

    init() {
        this.loadMatchDetails();
        setInterval(() => this.loadMatchDetails(), 30000);
    }

    async loadMatchDetails() {
        const loader = document.getElementById('loader');
        const errorMessage = document.getElementById('error-message');
        const container = document.getElementById('match-details');

        try {
            loader.classList.remove('hidden');
            errorMessage.classList.add('hidden');

            const response = await fetch(`${API_BASE}/mcenter/v1/${this.matchId}`, {
                headers: {
                    'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
                    'x-rapidapi-key': API_KEY
                }
            });
            const matchData = await response.json();
            container.innerHTML = this.createDetailedMatchView(matchData);

        } catch (error) {
            console.error('Error:', error);
            errorMessage.classList.remove('hidden');
        } finally {
            loader.classList.add('hidden');
        }
    }

    createDetailedMatchView(matchData) {
        const match = matchData.matchInfo;
        const venue = matchData.venueInfo;
    
        return `
            <div class="match-details-card">
                <div class="match-header">
                    <h2 class="match-title">${match.matchDescription}</h2>
                    <div class="match-meta">
                        <span class="match-format">${match.matchFormat} • ${match.matchType}</span>
                        ${match.state === "inprogress" ? '<span class="live-badge">LIVE</span>' : ''}
                    </div>
                </div>
    
                <div class="match-status">
                    <div class="status-text">${match.status}</div>
                    <div class="short-status">${match.shortStatus}</div>
                </div>
    
                <div class="teams-container">
                    <div class="team">
                        <h3>${match.team1.name}</h3>
                        <div class="team-score">
                            ${match.team1.score ? `${match.team1.score}/${match.team1.wickets} (${match.team1.overs})` : ''}
                        </div>
                        ${match.tossResults?.tossWinnerId === match.team1.id ? 
                            `<span class="toss-winner">Won Toss - ${match.tossResults.decision}</span>` : ''}
                    </div>
                    <div class="versus">VS</div>
                    <div class="team">
                        <h3>${match.team2.name}</h3>
                        <div class="team-score">
                            ${match.team2.score ? `${match.team2.score}/${match.team2.wickets} (${match.team2.overs})` : ''}
                        </div>
                        ${match.tossResults?.tossWinnerId === match.team2.id ? 
                            `<span class="toss-winner">Won Toss - ${match.tossResults.decision}</span>` : ''}
                    </div>
                </div>
    
                <div class="venue-details">
                    <h4>Venue Information</h4>
                    <p class="venue-name">${venue.ground}, ${venue.city}, ${venue.country}</p>
                    <div class="venue-meta">
                        <span><i class="material-icons">people</i> Capacity: ${venue.capacity}</span>
                        <span><i class="material-icons">info</i> Known as: ${venue.knownAs}</span>
                        ${venue.floodlights ? '<span><i class="material-icons">lightbulb</i> Floodlights Available</span>' : ''}
                    </div>
                </div>
    
                <div class="match-info-grid">
                    <div class="info-item">
                        <label>Match Type</label>
                        <span>${match.matchType} ${match.dayNight ? '(Day-Night)' : ''}</span>
                    </div>
                    <div class="info-item">
                        <label>Series</label>
                        <span>${match.series.name}</span>
                    </div>
                    <div class="info-item">
                        <label>Umpires</label>
                        <span>${match.umpire1.name}, ${match.umpire2.name}</span>
                    </div>
                    <div class="info-item">
                        <label>Match Referee</label>
                        <span>${match.referee.name}</span>
                    </div>
                </div>
            </div>
        `;
    }}

document.addEventListener('DOMContentLoaded', () => {
    new MatchDetails();
});
