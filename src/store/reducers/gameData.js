import { ACTION_PARSE_CSV } from '../actions/parseCsv';
import { ACTION_SORT_STATS_BY_PLAYER } from '../actions/sortStatsByPlayer';
import { ACTION_SORT_STATS_BY_GOAL_DIFFERENCE } from '../actions/sortStatsByGoalDifference';
import { ACTION_SORT_STATS_BY_WIN_RATE } from '../actions/sortStatsByWinRate';
import { compareUsingWinRate,
  compareUsingGoalDifference, 
  compareUsingCloseRate, 
  compareAscendingUsing, 
  compareDescendingUsing } from './sortUtil';
import { ACTION_SORT_STATS_BY_CLOSE_RATE } from '../actions/sortStatsByCloseRate';
import { ACTION_SORT_STATS_BY_POINTS } from '../actions/sortStatsByPoints';
import { ACTION_SORT_STATS_BY_POINTS_CLOSE } from '../actions/sortStatsByPointsClose';

function parseCsvToPlayers(csvAsText) {
  const games = csvAsText
      .split('\n')
      .filter((line, index) => index !== 0)
      .filter((line) => line.split(',').length === 4)
      .map(line => line.split(','))
      .map((line, index) => { return {
          id: index,
          playerA: line[0],
          playerB: line[1],
          scoreA: parseInt(line[2]),
          scoreB: parseInt(line[3]),
      }});
  return games;
}

function mapGamesToPlayerStats(games) {
  const playerStats = [];
  let playerId = 0;

  games.forEach(game => {
    [{
      name: game.playerA,
      win: game.scoreA > game.scoreB,
      closeGame: Math.abs(game.scoreA-game.scoreB) <= 1,
      playerScore: game.scoreA,
      opponentScore: game.scoreB,
    },
    {
      name: game.playerB,
      win: game.scoreB > game.scoreA,
      playerScore: game.scoreB,
      closeGame: Math.abs(game.scoreA-game.scoreB) <= 1,
      opponentScore: game.scoreA,
    }]
    .forEach(({name, win, closeGame, playerScore, opponentScore})=> {
      if(!playerStats.find(stats => stats.name===name)){
        playerStats.push({
          id: playerId++,
          name,
          wins: 0,
          losses: 0,
          closeGames: 0,
          points: 0,
          pointsWitCloseScores: 0,
          goalsShot: 0,
          goalsReceived: 0,
        });
      }
      const currentPlayerStats = playerStats.find(stats => stats.name===name);
      currentPlayerStats.goalsShot += playerScore;
      currentPlayerStats.goalsReceived += opponentScore;
      currentPlayerStats.closeGames += closeGame;
      if(win) {
        currentPlayerStats.wins += 1;
        currentPlayerStats.points += 3;
        currentPlayerStats.pointsWitCloseScores += closeGame ? 2 : 3;
      } else {
        currentPlayerStats.losses += 1;
        if(closeGame) {
          currentPlayerStats.pointsWitCloseScores += 1;
        }
      }
    })
    
  })
  return playerStats;
}

const initialState = {
    games: [],
    playerStats: [],
};

const gameData = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_PARSE_CSV: {
      const games = parseCsvToPlayers(action.csvAsText);
      const playerStats = mapGamesToPlayerStats(games);
      return {
        ...state,
        games,
        playerStats,
      };
    }
    case ACTION_SORT_STATS_BY_PLAYER: {
      const sortedStats = state.playerStats.sort(compareAscendingUsing('name'))
        .filter(() => true); // force redux to notice state change by creating new array
      return {
        ...state,
        playerStats: sortedStats,
      };
    }
    case ACTION_SORT_STATS_BY_WIN_RATE: {
      const sortedStats = state.playerStats.sort(compareUsingWinRate)
        .filter(() => true); // force redux to notice state change by creating new array
      return {
        ...state,
        playerStats: sortedStats,
      };
    }
    case ACTION_SORT_STATS_BY_GOAL_DIFFERENCE: {
      const sortedStats = state.playerStats.sort(compareUsingGoalDifference)
        .filter(() => true); // force redux to notice state change by creating new array
      return {
        ...state,
        playerStats: sortedStats,
      };
    }
    case ACTION_SORT_STATS_BY_CLOSE_RATE: {
      const sortedStats = state.playerStats.sort(compareUsingCloseRate)
        .filter(() => true); // force redux to notice state change by creating new array
      return {
        ...state,
        playerStats: sortedStats,
      };
    }
    case ACTION_SORT_STATS_BY_POINTS: {
      const sortedStats = state.playerStats.sort(compareDescendingUsing('points'))
        .filter(() => true); // force redux to notice state change by creating new array
      return {
        ...state,
        playerStats: sortedStats,
      };
    }
    case ACTION_SORT_STATS_BY_POINTS_CLOSE: {
      const sortedStats = state.playerStats.sort(compareDescendingUsing('pointsWitCloseScores'))
        .filter(() => true); // force redux to notice state change by creating new array
      return {
        ...state,
        playerStats: sortedStats,
      };
    }
    default:
      return state;
  }
}

export default gameData;
