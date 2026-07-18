canvas = document.getElementById("shapes");
let context = canvas.getContext("2d");
let shapesArr = new Array();
let shapeInitialDensity = 0.30;
let spawnRate = 0.30;
const speedMultiplier = 0.5;  // ← tune this one value
var startShapes = 0;

let mouse = { x: -9999, y: -9999 }; // start offscreen

window.addEventListener('mousemove', function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  console.log(mouse.x, mouse.y);
});

window.onload = function () {
  resize();

  // Randomly spawn shapes
  startShapes = shapeInitialDensity * canvas.width;
  for (var i = 0; i < startShapes; i++) {
    spawnShape(false);
  }
};

window.onresize = resize;

// Resizes when the window resizes
function resize() {
  // Set up canvas
  // canvas.height = window.innerHeight * 0.8;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Get color themes from variables.css
function getThemeColors() {
  const style = getComputedStyle(document.body);
  return {
    glow: style.getPropertyValue('--glow').trim(),
    atomColor: style.getPropertyValue('--glow').trim(),
    bondColor: style.getPropertyValue('--glow').trim(),
  };
}

// get glow for length
function glowWithAlpha(glowVar, alpha) {
  const match = glowVar.match(/[\d.]+,\s*[\d.]+,\s*[\d.]+/);
  if (!match) return `rgba(120,200,255,${alpha})`;
  return `rgba(${match[0]}, ${alpha})`;
}


function drawShape(h, colors) {

  if(h.type === "atom") {

    let radius = (1 - h.depth) * 3;

    context.beginPath();

    context.arc(
        h.x,
        h.y,
        radius,
        0,
        Math.PI * 2
    );

    context.fillStyle = glowWithAlpha(colors.glow, 0.9);
    context.shadowColor = glowWithAlpha(colors.glow, 1);
    context.shadowBlur = 15;

    context.fill();

    context.shadowBlur = 0;

    return;
}

  let size = (1 - h.depth) * 10 + 5;

  context.beginPath();
  context.moveTo(
    h.x + size * Math.cos(h.angle),
    h.y + size * Math.sin(h.angle)
  );

  for (var i = 1; i <= h.numSides; i++) {
    context.lineTo(
      h.x + size * Math.cos((i * 2 * Math.PI) / h.numSides + h.angle),
      h.y + size * Math.sin((i * 2 * Math.PI) / h.numSides + h.angle)
    );
  }

  let alpha = 0.5 - h.depth * h.depth;
  // context.strokeStyle = "rgba(147, 148, 152, " + alpha + ")";
  context.strokeStyle = "rgba(155, 170, 207, " + alpha + ")";
  context.lineWidth = 3; // edited to make the shapes thicker
  context.stroke();
}

// added for bonds
function drawBonds(colors) {

    for(let i = 0; i < shapesArr.length; i++) {

        for(let j = i + 1; j < shapesArr.length; j++) {

            let a = shapesArr[i];
            let b = shapesArr[j];

            let dx = a.x - b.x;
            let dy = a.y - b.y;

            let dist = Math.sqrt(dx * dx + dy * dy);

            if(dist < 60) {   // CONTROL FOR THE BOND DISTANCE
                let alpha =
                    (1 - dist / 60) * 0.2;

                context.beginPath();

                context.moveTo(a.x, a.y);
                context.lineTo(b.x, b.y);

                context.strokeStyle = glowWithAlpha(colors.bondColor, alpha);

                context.lineWidth = 1;

                context.shadowBlur = 8;

                context.shadowColor = glowWithAlpha(colors.glow, 0.8);

                context.stroke();

                context.shadowBlur = 0;
            }
        }
    }
}

function spawnShape(atTop) {
  var depth = Math.random();
  
  // direction: downwards or random
  let dir = Math.random() * Math.PI * 2;

  let angle = Math.random() * 2 * Math.PI;
  let angspeed = Math.random() * 0.01;
  let size = (1 - depth) * 10 + 5;
  let position = {
    x: Math.random() * (canvas.width - 60) + 30,
    y: atTop ? -size - 5 : Math.random() * canvas.height
  };

  // added for type of shape
  let typeChance = Math.random();
  let type;

  if(typeChance < 1) {
      type = "atom";
  }
  else if(typeChance < 0.6) {
      type = "hex";
  }
  else {
      type = "triangle";
  }

  //change numsides based on the shape type
  let numSides = 6;
  if(type === "triangle") {numSides = 3;}

  shapesArr.push({
    type: type,
    numSides: numSides,
    x: position.x,
    y: position.y,
    depth: depth,
    dir: dir,
    angle: angle,
    angspeed: angspeed
  });
}

window.requestAnimFrame = (function (callback) {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function animate() {
  const colors = getThemeColors();  

  if (Math.random() < spawnRate) spawnShape(true);

  // Clear
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.restore();

  drawBonds(colors);

  // Draw shapes
  for (var i = 0; i < shapesArr.length; i++) {
    let shape = shapesArr[i];
    drawShape(shape, colors);
    // making shape speed slower
    let speed = ((1 - shape.depth * shape.depth) / 3 + 0.05) * speedMultiplier;
    shape.x += speed * Math.cos(shape.dir);
    shape.y -= speed * Math.sin(shape.dir);

    shape.angle += shape.angspeed;

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

    const repelRadius = 200;  // how close before nudge kicks in
    const repelStrength = 0.8; // how hard the push is

    let mdx = shape.x - mouse.x;
    let mdy = shape.y - mouse.y;
    let mdist = Math.sqrt(mdx * mdx + mdy * mdy);

    if (mdist < repelRadius && mdist > 0) {
      let force = (1 - mdist / repelRadius) * repelStrength;
      shape.x += (mdx / mdist) * force;
      shape.y += (mdy / mdist) * force;
    }
  }

  // Draw gradient mask
  // let mask = context.createLinearGradient(0, canvas.height - 100, 0, canvas.height);
  let mask = context.createLinearGradient(0, 0, 0, canvas.height);
  mask.addColorStop(0, "rgba(255, 255, 255, 0)");
  mask.addColorStop(1, "rgba(255, 255, 255, 0)");
  //mask.addColorStop(1, "#8abdff");

  context.fillStyle = mask;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Request new frame
  requestAnimFrame(animate);
}

animate();