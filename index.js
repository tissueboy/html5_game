import "./style.scss";

// phina.jsを有効化 <--- (1)
import 'phina.js'

// グローバルに展開
phina.globalize();
// アセット
var ASSETS = {
  // 画像
  image: {
    'tomapiko': 'https://rawgit.com/phi-jp/phina.js/develop/assets/images/tomapiko_ss.png',
  },
  // フレームアニメーション情報
  spritesheet: {
    'tomapiko_ss': 'https://rawgit.com/phi-jp/phina.js/develop/assets/tmss/tomapiko.tmss',
  },
};
// 定数
var JUMP_POWOR = 10; // ジャンプ力
var GRAVITY = 0.5; // 重力
/*
 * メインシーン
 */
phina.define("MainScene", {
  // 継承
  superClass: 'DisplayScene',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit();
    // 背景
    this.backgroundColor = 'skyblue';

    Label({
      text: 'Touch To Jump',
      fontSize: 48,
      fill: 'gray',
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(3));
    // 床
    this.floor = RectangleShape({
      width: this.gridX.width,
      height: this.gridY.span(1),
      fill: 'silver',
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(2));
    // プレイヤー作成
    var player = Player('tomapiko').addChildTo(this);
    // 初期位置
    player.x = this.gridX.center();
    player.bottom = this.floor.top;
    // 画面タッチ時処理
    this.onpointend = function() {
      // 床の上なら
      if (player.isOnFloor) {
        // 上方向に速度を与える（ジャンプ）
        player.physical.velocity.y = -JUMP_POWOR;
        // 重力復活
        player.physical.gravity.y = GRAVITY;
        // フラグ変更
        player.isOnFloor = false;
        // アニメーション変更
        player.anim.gotoAndPlay('fly');
      }
    };
    // 参照用
    this.player = player;
  },
  // 毎フレーム処理
  update: function() {
    var player = this.player;
    // 床とヒットしたら
    if (player.hitTestElement(this.floor)) {
      // y方向の速度と重力を無効にする
      player.physical.velocity.y = 0;
      player.physical.gravity.y = 0;
      // 位置調整
      player.bottom = this.floor.top;
      // フラグ立て
      player.isOnFloor = true;
      // アニメーション変更
      player.anim.gotoAndPlay('left');
    }
  },
});
/*
 * プレイヤークラス
 */
phina.define('Player', {
  superClass: 'Sprite',
  // コンストラクタ
  init: function(image) {
    // 親クラス初期化
    this.superInit(image);
    // フレームアニメーションをアタッチ
    this.anim = FrameAnimation('tomapiko_ss').attachTo(this);
    // 初期アニメーション指定
    this.anim.gotoAndPlay('left');
    // 初速度を与える
    this.physical.force(-2, 0);
    // 床の上かどうか
    this.isOnFloor = true;
  },
  // 毎フレーム処理
  update: function() {
    // 画面端で速度と向き反転
    if (this.left < 0 || this.right > 640) {
      this.physical.velocity.x *= -1;
      this.scaleX *= -1;
    }
  },
});
/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    // MainScene から開始
    startLabel: 'main',
    // アセット読み込み
    assets: ASSETS,
  });
  // fps表示
  //app.enableStats();
  // 実行
  app.run();
});