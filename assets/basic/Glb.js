var obj = {
    RANDOM_MATCH: 1,  // 随机匹配
    PROPERTY_MATCH: 2,  // 属性匹配
    COOPERATION: 1,
    COMPETITION: 2,
    MAX_PLAYER_COUNT: 3,
    PLAYER_COUNTS: [1, 2, 3],
    GAME_START_EVENT: "gameStart",
    NEW_START_EVENT: "newStar",
    PLAYER_MOVE_EVENT: "playerMove",
    GAIN_SCORE_EVENT: "gainScore",
    PLAYER_POSITION_EVENT: "playerPosition",

    channel: 'MatchVS',
    platform: 'alpha',
    gameId: 200757,
    gameVersion: 1,
    appKey: '6783e7d174ef41b98a91957c561cf305',
    secret: 'da47754579fa47e4affab5785451622c',

    matchType: 1,
    gameType: 1,
    tagsInfo: { "title": "A" },
    userInfo: null,
    playerUserIds: [],
    playerSet: new Set(),
    isRoomOwner: false,
    events: {},

    syncFrame: false,
    FRAME_RATE: 5,
    roomId: 0,
    playertime: 180,
    isGameOver: false,

    scoreMap: new Map(),

    number1: "",
    number2: "",
    number3: "",
};
module.exports = obj;