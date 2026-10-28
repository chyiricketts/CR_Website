// Light mode canvas animation
window.LightCanvas = (function () {
  let canvas, context;
  let shapesArr = [];
  const shapeInitialDensity = 0.08;
  const spawnRate = 0.03;
  let running = false;
  let frameId = null;
  let lastTime = null;

  const requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawShape(h) {
    let size = (1 - h.depth) * 10 + 5;

    context.beginPath();
    context.moveTo(
      h.x + size * Math.cos(h.angle),
      h.y + size * Math.sin(h.angle)
    );

    for (let i = 1; i <= h.numSides; i++) {
      context.lineTo(
        h.x + size * Math.cos((i * 2 * Math.PI) / h.numSides + h.angle),
        h.y + size * Math.sin((i * 2 * Math.PI) / h.numSides + h.angle)
      );
    }

    let alpha = 0.5 - h.depth * h.depth;
    context.strokeStyle = "rgba(155, 170, 207, " + alpha + ")";
    context.lineWidth = 3;
    context.stroke();
  }

  function spawnShape(atTop) {
    let depth = Math.random();
    let dir = -Math.PI / 2;
    let angle = Math.random() * 2 * Math.PI;
    let angspeed = Math.random() * 0.01;
    let size = (1 - depth) * 10 + 5;
    let position = {
      x: Math.random() * (canvas.width - 60) + 30,
      y: atTop ? -size - 5 : Math.random() * canvas.height
    };

    let numSides = Math.random() < 0.6 ? 6 : 3;
    if (numSides === 3) {
      depth += (1 - depth) * 0.2;
    }

    shapesArr.push({
      numSides: numSides,
      x: position.x,
      y: position.y,
      depth: depth,
      dir: dir,
      angle: angle,
      angspeed: angspeed
    });
  }

  function animate() {
    if (!running) return;

    // Scale movement by time since last frame (1 = one 60fps frame)
    const now = performance.now();
    const dt = lastTime === null ? 1 : Math.min((now - lastTime) / (1000 / 60), 3);
    lastTime = now;

    if (Math.random() < spawnRate * dt) spawnShape(true);

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();

    for (let i = 0; i < shapesArr.length; i++) {
      let shape = shapesArr[i];
      drawShape(shape);

      let speed = (1 - shape.depth * shape.depth) / 3 + 0.1;
      shape.x += speed * Math.cos(shape.dir) * dt;
      shape.y -= speed * Math.sin(shape.dir) * dt;
      shape.angle += shape.angspeed * dt;

      let size = (1 - shape.depth) * 10 + 5;
      if (
        shape.x < -size - 6 ||
        shape.x > canvas.width + size + 6 ||
        shape.y < -size - 6 ||
        shape.y > canvas.height + size + 6
      ) {
        shapesArr.splice(i, 1);
        i--;
      }
    }

    frameId = requestAnimFrame(animate);
  }

  function start() {
    if (running) return;
    canvas = document.getElementById("shapes");
    if (!canvas) return;
    context = canvas.getContext("2d");
    running = true;
    lastTime = null;

    resize();
    shapesArr = [];
    let startShapes = shapeInitialDensity * canvas.width;
    for (let i = 0; i < startShapes; i++) {
      spawnShape(false);
    }

    window.addEventListener("resize", resize);
    animate();
  }

  function stop() {
    running = false;
    window.removeEventListener("resize", resize);
    if (frameId) cancelAnimationFrame(frameId);
    if (context && canvas) context.clearRect(0, 0, canvas.width, canvas.height);
  }

  return { start: start, stop: stop };
})();
