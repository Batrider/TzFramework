window.Game = {
    duckManger: null,
    gameManager: null,
    bulletManger: null,
    itemManager: null,

    fireInterval: 2,
    itemInterval: 5,
    roundSeconds: 30
}

window.Camp = cc.Enum({
    None: 0,
    Friend: -1,
    Enemy: -1
})

window.ItemType = cc.Enum({
    None: 0,
    Shield: 1,
    Track: 2
})

window.GameState = cc.Enum({
    None: 0,
    Pause: 1,
    Play: 2,
    Over: 3
})
