
/*
  Text masked spring particles
    Author: Kushagra Gour a.k.a. Chin Chang
    (@chinchang457)
*/


(function() {
  var H, Particle, W, animate, animationLoop, canvas, changeWord, colors, ctx, damping_constant, density, display_list, draw, getTextArray, init, last_time, min_distance, num_particles, onMouseMove, spring_constant, text_array, update;

  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();

  canvas = null;

  ctx = null;

  num_particles = 500;

  density = 8;

  min_distance = 70;

  text_array = [];

  display_list = [];

  last_time = null;

  spring_constant = 0.2;

  damping_constant = 0.08;

  colors = ['#184DF4', '#F49A03', '#E01730', '#00A415'];

  W = window.innerWidth;

  H = window.innerHeight;

  init = function(e) {
    var i, _i, _results;
    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');
    canvas.width = W;
    canvas.height = H;
    canvas.addEventListener('mousemove', onMouseMove);
    changeWord('code');
    if (text_array.length) {
      _results = [];
      for (i = _i = 0; 0 <= num_particles ? _i < num_particles : _i > num_particles; i = 0 <= num_particles ? ++_i : --_i) {
        _results.push(display_list.push(new Particle));
      }
      return _results;
    }
  };

  getTextArray = function(ox, oy, w, h) {
    var data, i, j, linear_index, _i, _j;
    text_array = [];
    data = ctx.getImageData(ox, oy, w, h).data;
    for (i = _i = 0; 0 <= h ? _i < h : _i > h; i = _i += density) {
      for (j = _j = 0; 0 <= w ? _j < w : _j > w; j = _j += density) {
        linear_index = (i * w + j) * 4;
        if (data[linear_index + 3] !== 0) {
          text_array.push({
            x: j,
            y: i
          });
        }
      }
    }
    return text_array;
  };

  onMouseMove = function(e) {
    var child, d, dx, dy, mx, my, _i, _len, _results;
    mx = e.offsetX || e.pageX;
    my = e.offsetY || e.pageY;
    _results = [];
    for (_i = 0, _len = display_list.length; _i < _len; _i++) {
      child = display_list[_i];
      dx = child.x - mx;
      dy = child.y - my;
      d = Math.sqrt(dx * dx + dy * dy);
      if (d < min_distance) {
        child.speed_x += dx * 0.05;
        _results.push(child.speed_y += dy * 0.05);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  changeWord = function(str) {
    var child, _i, _len, _results;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#000";
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.font = "200px Arial";
    ctx.fillText(str, W / 2, 0);
    text_array = getTextArray(0, 0, W, H);
    _results = [];
    for (_i = 0, _len = display_list.length; _i < _len; _i++) {
      child = display_list[_i];
      _results.push(child.reposition());
    }
    return _results;
  };

  animate = function() {
    animationLoop();
    return requestAnimFrame(animate);
  };

  animationLoop = function() {
    var current_time, dt;
    if (!last_time) {
      last_time = (new Date).getTime();
    }
    current_time = (new Date).getTime();
    dt = (current_time - last_time) / 1000;
    last_time = current_time;
    window.fps = 1 / dt;
    draw();
    return update();
  };

  draw = function() {
    var child, _i, _len, _results;
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W, H);
    _results = [];
    for (_i = 0, _len = display_list.length; _i < _len; _i++) {
      child = display_list[_i];
      if (typeof child.draw !== 'function') {
        continue;
      }
      ctx.save();
      if (!isNaN(child.x || isNaN(child.y))) {
        ctx.translate(child.x, child.y);
      }
      if (!isNaN(child.scale_x || isNaN(child.scale_y))) {
        ctx.scale(child.scale_x, child.scale_y);
      }
      if (!isNaN(child.alpha)) {
        ctx.globalAlpha = child.alpha;
      }
      child.draw();
      _results.push(ctx.restore());
    }
    return _results;
  };

  update = function() {
    var child, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = display_list.length; _i < _len; _i++) {
      child = display_list[_i];
      if (typeof child.update === 'function') {
        _results.push(child.update());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Particle = (function() {

    function Particle(radius, x, y) {
      this.radius = radius != null ? radius : 1;
      this.x = x != null ? x : Math.random() * W;
      this.y = y != null ? y : Math.random() * H;
      this.speed_x = 10 - Math.random() * 20;
      this.speed_y = 10 - Math.random() * 20;
      this.color = "#ff0";
      this.alpha = 1;
      this.reposition();
      this.reset();
    }

    Particle.prototype.draw = function() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(4, 4, 4, 0, Math.PI * 2, true);
      return ctx.fill();
    };

    Particle.prototype.update = function() {
      var acc_x, acc_y;
      acc_x = -spring_constant * (this.x - this.ox) - damping_constant * this.speed_x;
      acc_y = -spring_constant * (this.y - this.oy) - damping_constant * this.speed_y;
      this.speed_x += acc_x;
      this.speed_y += acc_y;
      this.alpha -= 0.019;
      this.scale_x += 0.06;
      this.scale_y += 0.06;
      this.x += this.speed_x;
      this.y += this.speed_y;
      if (this.alpha <= 0) {
        return this.reset();
      }
    };

    Particle.prototype.reset = function() {
      this.alpha = Math.random();
      this.scale_x = this.scale_y = 0;
      return this.color = colors[~~(Math.random() * colors.length)];
    };

    Particle.prototype.reposition = function() {
      var point;
      point = text_array[~~(Math.random() * text_array.length)];
      this.ox = this.x = point.x + ~~(3 + Math.random() * 6);
      return this.oy = this.y = point.y + ~~(3 + Math.random() * 6);
    };

    return Particle;

  })();

  init();

  animate();

}).call(this);
