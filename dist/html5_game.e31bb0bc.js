// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960; // グローバルに展開

phina.globalize(); // アセット

var ASSETS = {
  // 画像
  image: {
    'player': './assets/player_sprite.png',
    'player_bullet': './assets/bullet_sprite.png',
    'enemy': './assets/enemy_sprite.png'
  },
  // フレームアニメーション情報
  // スプライトシート
  spritesheet: {
    'player_ss': {
      // フレーム情報
      "frame": {
        "width": 64,
        // 1フレームの画像サイズ（横）
        "height": 64,
        // 1フレームの画像サイズ（縦）
        "cols": 12,
        // フレーム数（横）
        "rows": 8 // フレーム数（縦）

      },
      // アニメーション情報
      "animations": {
        "wait": {
          // アニメーション名
          "frames": [52],
          // フレーム番号範囲
          "next": "wait",
          // 次のアニメーション
          "frequency": 2 // アニメーション間隔

        },
        "walk": {
          // アニメーション名
          "frames": [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
          // フレーム番号範囲
          "next": "walk",
          // 次のアニメーション
          "frequency": 2 // アニメーション間隔

        },
        "jump": {
          // アニメーション名
          "frames": [72, 73, 74, 75, 76],
          // フレーム番号範囲
          // "next": "jump", // 次のアニメーション
          "frequency": 2 // アニメーション間隔

        }
      }
    },
    'bullet_ss': {
      // フレーム情報
      "frame": {
        "width": 64,
        // 1フレームの画像サイズ（横）
        "height": 64,
        // 1フレームの画像サイズ（縦）
        "cols": 8,
        // フレーム数（横）
        "rows": 1 // フレーム数（縦）

      },
      // アニメーション情報
      "animations": {
        "bullet": {
          // アニメーション名
          "frames": [1],
          // フレーム番号範囲
          "next": "bullet",
          // 次のアニメーション
          "frequency": 1 // アニメーション間隔

        }
      }
    },
    'enemy_ss': {
      // フレーム情報
      "frame": {
        "width": 64,
        // 1フレームの画像サイズ（横）
        "height": 64,
        // 1フレームの画像サイズ（縦）
        "cols": 8,
        // フレーム数（横）
        "rows": 1 // フレーム数（縦）

      },
      // アニメーション情報
      "animations": {
        "enemy": {
          // アニメーション名
          "frames": [1],
          // フレーム番号範囲
          "next": "enemy",
          // 次のアニメーション
          "frequency": 1 // アニメーション間隔

        }
      }
    }
  },
  //LoadingSceneで読み込む場合の設定
  tmx: {
    "map": './assets/stage.tmx'
  }
}; // 定数

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
  init: function init() {
    // 親クラス初期化
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT
    }); // 背景

    this.backgroundColor = 'skyblue'; // 自弾グループ

    this.playerBulletGroup = DisplayElement().addChildTo(this);
    Label({
      text: 'Touch To Jump',
      fontSize: 48,
      fill: 'gray'
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(3)); // 床

    this.floor = RectangleShape({
      width: this.gridX.width,
      height: this.gridY.span(1),
      fill: 'silver'
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(2)); // プレイヤー作成

    var player = Player('player').addChildTo(this); // var c1 = Circle(player.x, player.y, HIT_RADIUS); 

    var player_collider = CircleShape().addChildTo(this);
    player_collider.radius = HIT_RADIUS;
    player_collider.fill = null;
    player_collider.stroke = null; // shape.stroke = 'gold';  
    // 初期位置

    player.x = this.gridX.center();
    player.bottom = 20; // 敵作成

    var enemy = Enemy('enemy').addChildTo(this); // 初期位置

    enemy.x = this.gridX.center();
    enemy.bottom = 100; // 画面タッチ時処理
    // タッチ開始時 onpointstart

    this.onpointstart = function (e) {
      FLG_TOUCH = true; // 床の上なら

      if (player.isOnFloor) {
        console.log("isOnFloor");
      } else {
        console.log("isOnFloor 2");
        PlayerBullet().addChildTo(this.playerBulletGroup).setPosition(this.player.x, this.player.y);
      } // 上方向に速度を与える（ジャンプ）


      player.physical.velocity.y = -JUMP_POWOR; // 重力復活

      player.physical.gravity.y = GRAVITY; // フラグ変更

      player.isOnFloor = false; // アニメーション変更

      player.anim.gotoAndPlay('jump');
      player.physical.friction = 0.97; //摩擦力
      //タッチした位置を保存

      TOUCH_START_X = e.pointer.x;
      TOUCH_START_Y = e.pointer.y;
    }; // タッチ終了時 


    this.onpointend = function (e) {
      FLG_TOUCH = false;
      DIRECTION = 0;

      if (player.isOnFloor) {
        FLG_WAIT = true;
      }
    }; // タッチ移動時


    this.onpointmove = function (e) {
      // 左に移動
      if (TOUCH_START_X - e.pointer.x > 10) {
        DIRECTION = -1;
        player.scaleX = DIRECTION;
        FLG_WAIT = false;
      } // 右に移動


      if (TOUCH_START_X - e.pointer.x < -10) {
        DIRECTION = 1;
        player.scaleX = DIRECTION;
        FLG_WAIT = false;
      }

      if (TOUCH_START_X - e.pointer.x <= 10 && TOUCH_START_X - e.pointer.x >= -10) {
        FLG_WAIT = true;
      }
    }; // 参照用


    this.player = player;
    this.player_collider = player_collider;
  },
  // 毎フレーム処理
  update: function update() {
    var player = this.player;
    var player_collider = this.player;
    player_collider.setPosition(player.x, player.y); // 床とヒットしたらv1

    if (player_collider.hitTestElement(this.floor)) {
      // alert("stop");
      // 位置調整
      player.bottom = this.floor.top; // y方向の速度と重力を無効にする

      player.physical.velocity.y = 0;
      player.physical.gravity.y = 0; // フラグ立て

      player.isOnFloor = true;
      console.log("hit v1"); // アニメーション変更
    }

    if (player.isOnFloor === true) {
      if (FLG_WAIT == true) {
        player.anim.gotoAndPlay('wait');
      } else {
        player.anim.gotoAndPlay('walk');
      }
    }

    if (FLG_TOUCH === true) {
      player.physical.velocity.x = SPEED * DIRECTION;

      if (player.isOnFloor === true && FLG_WAIT == false) {
        player.anim.gotoAndPlay('walk');
      }
    } else {
      if (player.physical.velocity.y < 0 && player.isOnFloor === false) {
        player.physical.velocity.y = player.physical.velocity.y * 0.5;
        player.physical.gravity.y = 0.6;
      }
    } //床と接触している場合


    if (player.isOnFloor === true) {
      //床の摩擦力を変更
      player.physical.friction = 0.6; //摩擦力
    } else {
      //空中にいる時
      // 重力復活
      player.physical.gravity.y = GRAVITY;
    } //画面端から出さない


    if (player.left < 0) {
      player.left = 0;
    }

    if (player.right > SCREEN_WIDTH) {
      player.right = SCREEN_WIDTH;
    }
  }
});
/*
 * プレイヤークラス
 */

phina.define('Player', {
  superClass: 'Sprite',
  // コンストラクタ
  init: function init(image) {
    // 親クラス初期化
    this.superInit(image); // フレームアニメーションをアタッチ

    this.anim = FrameAnimation('player_ss').attachTo(this); // 初期アニメーション指定

    this.anim.gotoAndPlay('wait'); // 初速度を与える
    // this.physical.force(-2, 0);
    // 床の上かどうか

    this.isOnFloor = false;
  },
  // 毎フレーム処理
  update: function update() {}
}); // PlayerBulletクラス

phina.define('PlayerBullet', {
  superClass: 'Sprite',
  // コンストラクタ
  init: function init() {
    this.superInit('player_bullet'); // フレームアニメーションをアタッチ

    this.anim = FrameAnimation('bullet_ss').attachTo(this); // 初期アニメーション指定

    this.anim.gotoAndPlay('bullet');
    this.physical.velocity.y = +PLAYER_BULLET_SPEED; //弾速
  },
  // 毎フレーム更新処理
  update: function update() {
    // 画面上到達で削除
    if (this.top < 0) {
      this.remove();
    }
  }
}); // PlayerBulletクラス

phina.define('Enemy', {
  superClass: 'Sprite',
  // コンストラクタ
  init: function init() {
    this.superInit('enemy'); // フレームアニメーションをアタッチ

    this.anim = FrameAnimation('enemy_ss').attachTo(this); // 初期アニメーション指定

    this.anim.gotoAndPlay('enemy'); // this.physical.velocity.y = +PLAYER_BULLET_SPEED; //弾速
  },
  // 毎フレーム更新処理
  update: function update() {}
});
/*
 * メイン処理
 */

phina.main(function () {
  // アプリケーションを生成
  var app = GameApp({
    // MainScene から開始
    startLabel: 'main',
    // アセット読み込み
    assets: ASSETS
  }); // fps表示
  //app.enableStats();
  // 実行

  app.run();
});
},{}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59524" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/html5_game.e31bb0bc.js.map