import $ from 'jquery';

import * as PIXI from 'pixi.js';

import {
  TimelineMax, TweenMax
} from 'gsap';

export default class ImageLoader {
  constructor($wrapper) {

    this.wrapper = $wrapper;
    this.width = $wrapper.width();
    this.height = $wrapper.height();
    this.src = $wrapper.data('src');
    this.mouseOn = false;
    this.animated = false;

    this.app = new PIXI.Application(this.width, this.height, {
      transparent: true
    });

    this.wrapper.append(this.app.view);

    this.container = new PIXI.Container();

    this.app.stage.addChild(this.container);

    this.load(this.startAnimation.bind(this));

  }

  load(afterLoad) {
    let tmpImg = new Image();
    tmpImg.src = this.src;
    tmpImg.onload = function() {
      afterLoad();
    };
  }

  startAnimation() {

    let that = this;

    this.bg = PIXI.Sprite.fromImage(that.src);

    this.bg.width = this.width;
    this.bg.height = this.height;
    this.bg.position.x = 0;
    this.bg.position.y = 0;

    this.container.addChild(this.bg);

    this.displacementSprite = PIXI.Sprite.fromImage('img/displacement.jpg');
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite); 

    this.displacementFilter.scale.set(1e3 + Math.random() * 1000);
    this.displacementSprite.scale.set(0.4 + 0.6 * Math.random());

    this.app.stage.addChild(this.displacementSprite);

    this.container.filters = [this.displacementFilter];
    let tl = new TimelineMax({
      onComplete: function() {
        that.animated = true;
      }
    });

    tl.to(that.displacementFilter.scale, 1, {
      x: 1,
      y: 1
    });
    this.hover();
  }

  click() {
    let that = this;
    this.wrapper.on('click', function() {
      let tl = new TimelineMax({
        onComplete: function() {
          that.animated = true;
        }
      });

      tl.to(that.displacementFilter.scale, 1, {
        x: 1,
        y: 1
      });
    });
  }

  hover() {
    let that = this;

    this.wrapper.on('mouseenter', function() {
      if (!that.mouseOn && that.animated) {
        that.mouseOn = true;

        TweenMax.ticker.addEventListener('tick', that.doWaves, that);

        let tl = new TimelineMax();

        tl.to(that.displacementFilter.scale, 0.5, {x: 15, y: 15});
      }
    });

    this.wrapper.on('mouseleave', function() {
      if (that.mouseOn && that.animated) {
        that.mouseOn = false;

        TweenMax.ticker.removeEventListener('tick', that.doWaves, that);
        
        let tl = new TimelineMax();

        tl.to(that.displacementFilter.scale, 0.5, {x: 1, y: 1});
      }
    });
  }

  doWaves() {
    this.displacementSprite.x += 1;
  }
}
