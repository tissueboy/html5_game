import "./style.scss";

// phina.jsを有効化 <--- (1)
import 'phina.js'

import parcelPlayer from './assets/player_sprite.png'

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;

// グローバルに展開
phina.globalize();
// アセット
var ASSETS = {
  // 画像
  image: {
    'player': parcelPlayer,
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
    // 初期位置
    player.x = this.gridX.center();
    player.bottom = this.floor.top;
    // 画面タッチ時処理
    // タッチ開始時 onpointstart
    this.onpointstart = function(e) {
      FLG_TOUCH = true;

      // 床の上なら
      if (player.isOnFloor) {

        // 上方向に速度を与える（ジャンプ）
        player.physical.velocity.y = -JUMP_POWOR;
        // 重力復活
        player.physical.gravity.y = GRAVITY;
        // フラグ変更
        player.isOnFloor = false;
        // アニメーション変更
        player.anim.gotoAndPlay('jump');

        player.physical.friction = 0.97;//摩擦力
      
      }

      //タッチした位置を保存
      TOUCH_START_X = e.pointer.x;
      TOUCH_START_Y = e.pointer.y;



    };
    // タッチ終了時 
    this.onpointend = function(e) {

      FLG_TOUCH = false;
      DIRECTION = 0;
      if (player.isOnFloor) {
        player.anim.gotoAndPlay('wait');
      }

    };

    // タッチ移動時
    this.onpointmove = function(e) {  
     // 左に移動
     if( ( TOUCH_START_X - e.pointer.x ) > 10 ){
        DIRECTION = -1;
        player.scaleX = DIRECTION;
        if (player.isOnFloor) {
          player.anim.gotoAndPlay('walk');
        }
     }
     // 右に移動
     if( ( TOUCH_START_X - e.pointer.x ) < 10 ){
        DIRECTION = 1;
        player.scaleX = DIRECTION;
        if (player.isOnFloor) {
          player.anim.gotoAndPlay('walk');
        }
     }
    }

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
      player.anim.gotoAndPlay('wait');
    }else{
    }
    if(FLG_TOUCH === true){
      player.physical.velocity.x = SPEED*DIRECTION;
    }else{
      if(player.physical.velocity.y < 0){
        player.physical.velocity.y = player.physical.velocity.y*0.5;
      }
      if(player.isOnFloor === true){//床の摩擦力を変更
        player.physical.friction = 0.6;//摩擦力
      }
    }
    if(player.isOnFloor === false){//途中でタッチをやめたら重力を減してゆっくり落下（小ジャンプ）
      player.physical.gravity.y = 0.6; 
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
    this.isOnFloor = true;
  },
  // 毎フレーム処理
  update: function() {

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