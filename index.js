
var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;

// グローバルに展開
phina.globalize();
// アセット
var ASSETS = {
  // 画像
  image: {
    'player': './assets/player_sprite.png',
    'player_bullet': './assets/bullet_sprite.png',
    'enemy': './assets/enemy_sprite.png',
  },
  // フレームアニメーション情報
  // スプライトシート
  spritesheet: {
    'player_ss':
    {
      // フレーム情報
      "frame": {
        "width": 64, // 1フレームの画像サイズ（横）
        "height": 64, // 1フレームの画像サイズ（縦）
        "cols": 12, // フレーム数（横）
        "rows": 8, // フレーム数（縦）
      },
      // アニメーション情報
      "animations" : {
        "wait": { // アニメーション名
          "frames": [52], // フレーム番号範囲
          "next": "wait", // 次のアニメーション
          "frequency": 2, // アニメーション間隔
        },
        "walk": { // アニメーション名
          "frames": [60,61,62,63,64,65,66,67,68,69,70,71], // フレーム番号範囲
          "next": "walk", // 次のアニメーション
          "frequency": 2, // アニメーション間隔
        },
        "jump": { // アニメーション名
          "frames": [72,73,74,75,76], // フレーム番号範囲
          // "next": "jump", // 次のアニメーション
          "frequency": 2, // アニメーション間隔
        },
      }
    },
    'bullet_ss':
    {
      // フレーム情報
      "frame": {
        "width": 64, // 1フレームの画像サイズ（横）
        "height": 64, // 1フレームの画像サイズ（縦）
        "cols": 8, // フレーム数（横）
        "rows": 1, // フレーム数（縦）
      },
      // アニメーション情報
      "animations" : {
        "bullet": { // アニメーション名
          "frames": [1], // フレーム番号範囲
          "next": "bullet", // 次のアニメーション
          "frequency": 1, // アニメーション間隔
        },
      }
    },
    'enemy_ss':
    {
      // フレーム情報
      "frame": {
        "width": 64, // 1フレームの画像サイズ（横）
        "height": 64, // 1フレームの画像サイズ（縦）
        "cols": 8, // フレーム数（横）
        "rows": 1, // フレーム数（縦）
      },
      // アニメーション情報
      "animations" : {
        "enemy": { // アニメーション名
          "frames": [1], // フレーム番号範囲
          "next": "enemy", // 次のアニメーション
          "frequency": 1, // アニメーション間隔
        }
      }
    }
  },
  //LoadingSceneで読み込む場合の設定
  tmx: {
    "map": './assets/stage.tmx',
  }
};
// 定数
var JUMP_POWOR = 20; // ジャンプ力
var GRAVITY = 0.97; // 重力
var FLG_TOUCH = false;
var DIRECTION = 0;
var SPEED = 4;
var TOUCH_START_X = 0;
var TOUCH_START_Y = 0;
var HIT_RADIUS = 40;
var FLG_WAIT = true;

var PLAYER_BULLET_SPEED = 15; // 自弾速度

/*
 * メインシーン
 */
phina.define("MainScene", {
  // 継承
  superClass: 'DisplayScene',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });
    // 背景
    this.backgroundColor = 'skyblue';

    this.mapBase = phina.display.DisplayElement()
      .setPosition(0, 0)
      .addChildTo(this);

    //.tmxファイルからマップをイメージとして取得し、スプライトで表示
    this.tmx = phina.asset.AssetManager.get("tmx", "map");
    this.map = phina.display.Sprite(this.tmx.getImage())
      .setOrigin(0, 0)
      .setPosition(0, 0)
      .addChildTo(this);

    // 自弾グループ
    this.playerBulletGroup = DisplayElement().addChildTo(this);

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
    var player = Player('player').addChildTo(this);
    // var c1 = Circle(player.x, player.y, HIT_RADIUS); 
    var player_collider = CircleShape().addChildTo(this);
    player_collider.radius = HIT_RADIUS;
    player_collider.fill = null;
    player_collider.stroke = null;  
    // shape.stroke = 'gold';  

    // 初期位置
    player.x = this.gridX.center();
    player.bottom = 80;

    // 敵作成
    var enemy = Enemy('enemy').addChildTo(this);
    // 初期位置
    enemy.x = this.gridX.center();
    enemy.bottom = 100;

    // 画面タッチ時処理
    // タッチ開始時 onpointstart
    this.onpointstart = function(e) {
      FLG_TOUCH = true;

      // 床の上なら

      if (player.isOnFloor) {
        console.log("isOnFloor");
      
      }else{
        console.log("isOnFloor 2");
        PlayerBullet().addChildTo(this.playerBulletGroup).setPosition(this.player.x, this.player.y);
      }

      // 上方向に速度を与える（ジャンプ）
      player.physical.velocity.y = -JUMP_POWOR;
      // 重力復活
      player.physical.gravity.y = GRAVITY;
      // フラグ変更
      player.isOnFloor = false;
      // アニメーション変更
      player.anim.gotoAndPlay('jump');

      player.physical.friction = 0.97;//摩擦力


      //タッチした位置を保存
      TOUCH_START_X = e.pointer.x;
      TOUCH_START_Y = e.pointer.y;

    };
    // タッチ終了時 
    this.onpointend = function(e) {

      FLG_TOUCH = false;
      DIRECTION = 0;
      if (player.isOnFloor) {
        FLG_WAIT = true;
      }

    };

    // タッチ移動時
    this.onpointmove = function(e) {  
      // 左に移動
      if( ( TOUCH_START_X - e.pointer.x ) > 10 ){
        DIRECTION = -1;
        player.scaleX = DIRECTION;
        FLG_WAIT = false;
      }
      // 右に移動
      if( ( TOUCH_START_X - e.pointer.x ) < -10 ){
        DIRECTION = 1;
        player.scaleX = DIRECTION;
        FLG_WAIT = false;
      }
      if( ( TOUCH_START_X - e.pointer.x ) <= 10 && ( TOUCH_START_X - e.pointer.x ) >= -10 ){
        FLG_WAIT = true;
      }

    }

    // 参照用
    this.player = player;
    this.player_collider = player_collider;
  },
  // 毎フレーム処理
  update: function() {
    var player = this.player;
    var player_collider = this.player;
    player_collider.setPosition(player.x, player.y);

    // 床とヒットしたらv1
    if (player_collider.hitTestElement(this.floor)) {
      // alert("stop");
      // 位置調整
      player.bottom = this.floor.top;
      // y方向の速度と重力を無効にする
      player.physical.velocity.y = 0;
      player.physical.gravity.y = 0;
      // フラグ立て
      player.isOnFloor = true;
      console.log("hit v1");
      // アニメーション変更
    }
    if(player.isOnFloor === true){
      if(FLG_WAIT == true){
        player.anim.gotoAndPlay('wait');
      }else{
        player.anim.gotoAndPlay('walk');
      }
    }
    if(FLG_TOUCH === true){
      player.physical.velocity.x = SPEED*DIRECTION;
      if(player.isOnFloor === true && FLG_WAIT == false){
        player.anim.gotoAndPlay('walk');
      }
    }else{
      if(player.physical.velocity.y < 0 && player.isOnFloor === false){
        player.physical.velocity.y = player.physical.velocity.y*0.5;
        player.physical.gravity.y = 0.6; 
      }
    }
    //床と接触している場合
    if(player.isOnFloor === true){
      //床の摩擦力を変更
      player.physical.friction = 0.6;//摩擦力
    }else{
      //空中にいる時
      // 重力復活
      player.physical.gravity.y = GRAVITY;
    }

    //画面端から出さない
    if (player.left < 0) {
      player.left = 0;
    }
    if (player.right > SCREEN_WIDTH) {
      player.right = SCREEN_WIDTH;
    }
    if(this.mapCollision(player.x, player.y) === true){
      // player.physical.velocity.y = 0;
      // player.physical.gravity.y = 0;      
    }

  },
  //マップ衝突判定
  mapCollision: function(x, y) {

    console.log("x="+x+"/y="+y);

    var mapx = Math.floor(x / 64);
    var mapy = Math.floor(y / 128);
    // var chara_area_x = x + 64;
    // var chara_area_y = y + 64;

    //マップデータから'Collision'レイヤーを取得
    var collision = this.tmx.getMapData("collision");
    console.log("-//"+this.tmx.width);
    console.log("mapx="+mapx+"/mapy="+mapx);
    console.log(mapy * this.tmx.width + mapx);

    //指定座標にマップチップがあると真を返す
    var chip = collision[mapy * this.tmx.width + mapx];
    if (chip !== -1){
      return true;
    }else{
      return false;
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
    this.anim = FrameAnimation('player_ss').attachTo(this);
    // 初期アニメーション指定
    this.anim.gotoAndPlay('wait');
    // 初速度を与える
    // this.physical.force(-2, 0);
    // 床の上かどうか
    this.isOnFloor = false;
  },
  // 毎フレーム処理
  update: function() {

  },
});
// PlayerBulletクラス
phina.define('PlayerBullet',{
  superClass: 'Sprite',
  // コンストラクタ
  init: function() {
    this.superInit('player_bullet');
    // フレームアニメーションをアタッチ
    this.anim = FrameAnimation('bullet_ss').attachTo(this);
    // 初期アニメーション指定
    this.anim.gotoAndPlay('bullet');
    this.physical.velocity.y = +PLAYER_BULLET_SPEED; //弾速
  },
  // 毎フレーム更新処理
  update: function() {
    // 画面上到達で削除
    if (this.top < 0) {
      this.remove();
    }
  }
});
// PlayerBulletクラス
phina.define('Enemy',{
  superClass: 'Sprite',
  // コンストラクタ
  init: function() {
    this.superInit('enemy');
    // フレームアニメーションをアタッチ
    this.anim = FrameAnimation('enemy_ss').attachTo(this);
    // 初期アニメーション指定
    this.anim.gotoAndPlay('enemy');
    // this.physical.velocity.y = +PLAYER_BULLET_SPEED; //弾速
  },
  // 毎フレーム更新処理
  update: function() {

  }
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