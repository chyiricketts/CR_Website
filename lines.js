canvas = document.getElementById("shapes");
let context = canvas.getContext("2d");
let shapesArr = new Array();
let shapeInitialDensity = 0.04;
let spawnRate = 0.03;
var startShapes = 0;

window.onload = function () {
  resize();

  // Randomly spawn shapes
  startShapes = shapeInitialDensity * canvas.width;
  for (var i = 0; i < startShapes; i++) {
    spawnShape(false);
  }
};

window.onresize = resize;

// why does it have to resize every time?
function resize() {
  // Set up canvas
  // canvas.height = window.innerHeight * 0.8;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}



function drawShape(h) {

  if(h.type === "atom") {

    let radius = (1 - h.depth) * 3 + 2;

    context.beginPath();

    context.arc(
        h.x,
        h.y,
        radius,
        0,
        Math.PI * 2
    );

    context.fillStyle =
        "rgba(140,220,255,0.9)";

    context.shadowBlur = 15;

    context.shadowColor =
        "rgba(140,220,255,1)";

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
function drawBonds() {

    for(let i = 0; i < shapesArr.length; i++) {

        for(let j = i + 1; j < shapesArr.length; j++) {

            let a = shapesArr[i];
            let b = shapesArr[j];

            let dx = a.x - b.x;
            let dy = a.y - b.y;

            let dist = Math.sqrt(dx * dx + dy * dy);

            if(dist < 120) {

                let alpha =
                    (1 - dist / 120) * 0.2;

                context.beginPath();

                context.moveTo(a.x, a.y);
                context.lineTo(b.x, b.y);

                context.strokeStyle =
                    `rgba(120,200,255,${alpha})`;

                context.lineWidth = 1;

                context.shadowBlur = 8;

                context.shadowColor =
                    "rgba(120,200,255,0.8)";

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
  if (Math.random() < spawnRate) spawnShape(true);

  // Clear
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.restore();

  drawBonds();

  // Draw shapes
  for (var i = 0; i < shapesArr.length; i++) {
    let shape = shapesArr[i];
    drawShape(shape);
    // making shape speed slower
    //let speed = (1 - shape.depth * shape.depth) / 3 + 0.1;
    let speed = (1 - shape.depth) * 0.3 + 0.05;
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
