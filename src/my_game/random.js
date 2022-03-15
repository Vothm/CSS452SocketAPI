function getRandomColor() {
  let color = [];
  color[0] = getRandomValue(0, 1);
  color[1] = getRandomValue(0, 1);
  color[2] = getRandomValue(0, 1);
  color[3] = 1;
  return color;
}

function getRandomNumberOfSquares() {
  return getRandomValue(10, 20);
}

function getRandomSquarePos() {
  return getRandomValue(-5, 5);
}

function getRandomSize() {
  return getRandomValue(1, 6);
}

function getRandomRotation() {
  return 180 * Math.random();
}

function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

export {
  getRandomColor,
  getRandomNumberOfSquares,
  getRandomSquarePos,
  getRandomRotation,
  getRandomSize,
  getRandomValue,
};
