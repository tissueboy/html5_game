import "./style.scss";

// phina.jsを有効化 <--- (1)
import 'phina.js'
phina.globalize()

// メインシーン定義 <--- (2)
phina.define('MainScene', {
    superClass: 'DisplayScene',
    init() {
        this.superInit()
        // 背景色指定
        this.backgroundColor = 'gray'
        // スプライト作成・表示
        this.label = Label({
            text: 'Hello Parcel + Phina.js',
            fill: 'white',
            x: this.gridX.center(),
            y: this.gridY.center()
        }).addChildTo(this)
    }
})

// アプリ実行 <--- (3)
phina.main(() => {
    const app = GameApp({
        startLabel: 'main'
    })
    app.run()
})
