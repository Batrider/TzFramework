window.Game = {
    gameManager: null
}

window.GameState = cc.Enum({
    None: 0,
    Pause: 1,
    Play: 2,
    Over: 3
})

window.GLB = {
    RANDOM_MATCH: 1,
    PROPERTY_MATCH: 2,
    COOPERATION: 1,
    COMPETITION: 2,
    MAX_PLAYER_COUNT: 3,
    PLAYER_COUNTS: [1, 2],

    GAME_START_EVENT: "gameStart",
    GAME_OVER_EVENT: "gameOver",
    ROUND_START_EVENT: "roundStar",
    SCORE_EVENT: "score",

    channel: 'MatchVS',
    platform: 'alpha',
    gameId: 201409,
    gameVersion: 1,
    appKey: '311842dafe7846418420fc37886f97bf',
    secret: '688468ba92ce462fa97b286d4a30f3d3',

    matchType: 1,
    gameType: 1,
    userInfo: null,
    playerUserIds: [],
    isRoomOwner: false,

    syncFrame: false,
    FRAME_RATE: 5,
    isGameOver: false,
}
