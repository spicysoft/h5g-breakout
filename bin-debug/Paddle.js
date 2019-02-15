var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Paddle = (function (_super) {
    __extends(Paddle, _super);
    function Paddle() {
        var _this = _super.call(this) || this;
        _this.touchOffsetX = 0;
        _this.ballCount = 3;
        _this.itemType = ItemType.None;
        _this.itemSpan = 0;
        _this.state = _this.stateWave;
        Paddle.I = _this;
        _this.sizeW = PADDLE_SIZE_PER_WIDTH * Util.width;
        _this.sizeH = _this.sizeW * Paddle.sizeRateH;
        _this.setShape(Util.width * 0.5, Util.height * 0.9);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) { return _this.touchBegin(e); }, _this);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (e) { return _this.touchMove(e); }, _this);
        return _this;
    }
    Paddle.prototype.onDestroy = function () {
        var _this = this;
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) { return _this.touchBegin(e); }, this);
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, function (e) { return _this.touchMove(e); }, this);
        Paddle.I = null;
    };
    Paddle.prototype.setShape = function (x, y) {
        if (this.shape)
            GameObject.display.removeChild(this.shape);
        this.shape = new egret.Shape();
        this.shape.graphics.beginFill(0xe00030);
        this.shape.graphics.drawRect(-0.5 * this.sizeW, -0.5 * this.sizeH, this.sizeW, this.sizeH);
        this.shape.graphics.endFill();
        GameObject.display.addChild(this.shape);
        this.shape.x = x;
        this.shape.y = y;
    };
    Paddle.prototype.update = function () {
        this.state();
    };
    Paddle.prototype.stateWave = function () {
        Box.boxes.forEach(function (box) {
            box.shape.y += BOX_SIZE_PER_WIDTH * Util.width * Box.sizeRateH;
        });
        var sizeW = BOX_SIZE_PER_WIDTH * Util.width;
        var sizeH = sizeW * Box.sizeRateH;
        for (var i = 1; i < BOXES_IN_WIDTH; i++)
            new Box(sizeW * i, sizeH * 1, Util.randomInt(1, Box.maxHp));
        this.state = this.stateShoot;
    };
    Paddle.prototype.stateShoot = function () {
    };
    Paddle.prototype.stateCatch = function () {
        var _this = this;
        // ボールとの接触判定
        Ball.balls.forEach(function (ball) {
            if (ball.vy > 0) {
                var dx = ball.shape.x - _this.shape.x;
                var dy = ball.shape.y - _this.shape.y;
                var xr = ball.radius + _this.sizeW * 0.5;
                var yr = ball.radius + _this.sizeH * 0.5;
                if (dx * dx < xr * xr && dy * dy < yr * yr) {
                    ball.destroy();
                }
            }
        });
        if (Ball.balls.length == 0)
            this.state = this.stateWave;
    };
    Paddle.prototype.touchBegin = function (e) {
        if (this.deleteFlag)
            return;
        this.touchOffsetX = this.shape.x - e.localX;
        if (this.state == this.stateShoot) {
            var x = this.shape.x;
            var y = this.shape.y - this.sizeH * 0.5 - (BALL_SIZE_PER_WIDTH * Util.width * 0.5);
            var vx = BALL_SIZE_PER_WIDTH * Util.width * 0.5 * 0.5;
            var vy = BALL_SIZE_PER_WIDTH * Util.width * 0.5 * -0.5;
            for (var i = 0; i < this.ballCount; i++) {
                var rate = 1 + i * 0.2;
                new Ball(x, y, vx * rate, vy * rate);
            }
            this.state = this.stateCatch;
        }
    };
    Paddle.prototype.touchMove = function (e) {
        if (this.deleteFlag)
            return;
        this.shape.x = e.localX + this.touchOffsetX;
        this.shape.x = Util.clamp(this.shape.x, this.sizeW * 0.5, Util.width - this.sizeW * 0.5);
        this.touchOffsetX = this.shape.x - e.localX;
    };
    Paddle.prototype.pickItem = function (item) {
        switch (item) {
            case ItemType.Ball:
                this.ballCount++;
                break;
        }
    };
    Paddle.I = null; // singleton instance
    Paddle.sizeRateH = (1 / 3);
    return Paddle;
}(GameObject));
__reflect(Paddle.prototype, "Paddle");
//# sourceMappingURL=Paddle.js.map