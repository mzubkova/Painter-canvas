const body = document.getElementsByTagName("body")[0];
const canvas = document.createElement("canvas");
const colorPicker = document.getElementById("color-picker");
const changeSize = document.getElementById("change-size");
const downloadCanvas = document.getElementById("download");
const saveCanvas = document.getElementById("save");
const ctx = canvas.getContext("2d");
let isMouseDown = false;
let linesArray = [];
let currentSize = 1;
let currentColor = "#194350";
let currentBg = "white";

const createCanvas = () => {
  canvas.id = "canvas";
  canvas.width = 500;
  canvas.height = 500;
  canvas.style.zIndex = 8;
  canvas.style.position = "fixed";
  canvas.style.border = "1px solid #194350";
  ctx.fillStyle = currentBg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
};

const getMousePosition = (canvas, evt) => {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
};

const store = (x, y, s, c) => {
  let line = {
    x: x,
    y: y,
    size: s,
    color: c,
  };
  linesArray.push(line);
};

const mouseDown = (canvas, evt) => {
  let mousePos = getMousePosition(canvas, evt);
  isMouseDown = true;
  let currentPosition = getMousePosition(canvas, evt);
  ctx.moveTo(currentPosition.x, currentPosition.y);
  ctx.beginPath();
  ctx.lineWidth = currentSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = currentColor;
};

const mouseMove = (canvas, evt) => {
  if (isMouseDown) {
    let currentPosition = getMousePosition(canvas, evt);
    ctx.lineTo(currentPosition.x, currentPosition.y);
    ctx.stroke();
    store(currentPosition.x, currentPosition.y, currentSize, currentColor);
  }
};

const mouseUp = () => {
  isMouseDown = false;
  store();
};

const save = () => {
  localStorage.removeItem("savedCanvas");
  localStorage.setItem("savedCanvas", JSON.stringify(linesArray));
  console.log("Saved canvas!", JSON.stringify(linesArray));
};

const load = () => {
  if (localStorage.getItem("savedCanvas") != null) {
    linesArray = JSON.parse(localStorage.savedCanvas);
    let lines = JSON.parse(localStorage.getItem("savedCanvas"));
    for (let i = 1; i < lines.length; i++) {
      ctx.beginPath();
      ctx.moveTo(linesArray[i - 1].x, linesArray[i - 1].y);
      ctx.lineWidth = linesArray[i].size;
      ctx.lineCap = "round";
      ctx.strokeStyle = linesArray[i].color;
      ctx.lineTo(linesArray[i].x, linesArray[i].y);
      ctx.stroke();
    }
    console.log("Canvas loaded.");
  } else {
    console.log("No canvas in memory!");
  }
};

const download = (link, filename) => {
  let code = "data:text/json;charset=utf-8";
  link.href = `${code},${encodeURIComponent(JSON.stringify(linesArray))}`;
  link.download = filename;
};

canvas.addEventListener("mousedown", function () {
  mouseDown(canvas, event);
});
canvas.addEventListener("mousemove", function () {
  mouseMove(canvas, event);
});
canvas.addEventListener("mouseup", mouseUp);

colorPicker.addEventListener("change", function () {
  currentColor = this.value;
});

changeSize.addEventListener("change", function () {
  currentSize = this.value;
  document.getElementById("showSize").innerHTML = this.value;
});

saveCanvas.addEventListener("click", save);
downloadCanvas.addEventListener(
  "click",
  function () {
    download(this, "picture.json");
  },
  false
);

createCanvas();

module.exports = { createCanvas };
