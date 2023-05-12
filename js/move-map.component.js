/*these values are defined by the 3D space construction tools.*/
const mapInformation = [
  [-1, "#01", -1, "#02", -1],
  ["#03", "#04", "#05", "#06", "#07"],
  ["#08", -1, -1, -1, "#09"],
];
let currentPosition = [1, 1];
/**************************************************************/
const MAP_LENGTH = maxDimension(mapInformation);
const MAP_LENGTH_DIGIT = MAP_LENGTH.toString().length;

function maxDimension(array) {
  return array.reduce(
    (max, current) => Math.max(max, current.length),
    array.length
  );
}

// NUM=値 LEN=桁数
function zeroPadding(NUM, LEN) {
  return (Array(LEN).join("0") + NUM).slice(-LEN);
}

function makeAreaName(x, y){
  return "area" + zeroPadding(x, MAP_LENGTH_DIGIT) + zeroPadding(y, MAP_LENGTH_DIGIT);
}

function displayMiniMap(mapArray) {
  //prettier-ignore
  //document.getElementById("image-360").setAttribute("src", mapInformation[currentPosition[0]][currentPosition[1]]);
  for (let i = 0; i < mapArray.length; i++) {
    for (let j = 0; j < mapArray[i].length; j++) {
      let parentDiv = document.getElementById("miniMap");
      /**make area***********/
      let newElement = document.createElement("div");
      //prettier-ignore
      newElement.id = makeAreaName(i, j);
      newElement.style.top = 20 + i * 50 + "px";
      newElement.style.left = 20 + j * 50 + "px";
      newElement.classList.add("nothingArea");
      /*area drawing*********/
      if (i === currentPosition[0] && j === currentPosition[1])
        newElement.classList.add("currentArea");
      else if (mapArray[i][j] !== -1) newElement.classList.add("newArea");
      /**********************/
      parentDiv.appendChild(newElement);
    }
  }
}

/* global AFRAME, NAF */
AFRAME.registerComponent("move-on-map", {
  init: function () {
    this.toggleArrowClickableAtPosition();
  },
  events: {
    click: function (evt) {
      this.moveArea(this.el.getAttribute("id"));
      /*change data of arrows*/
      this.toggleArrowClickableAtPosition();
      //prettier-ignore
      document.getElementById("image-360").setAttribute("src", mapInformation[currentPosition[0]][currentPosition[1]]);
    },
  },
  //prettier-ignore
  toggleArrowClickableAtPosition: function () {
    /**If it is at the edge, remove the arrow pointing outside the map.*/
    if (currentPosition[0] === 0 || mapInformation[currentPosition[0] - 1][currentPosition[1]] === -1)
         document.getElementById("front-arrow").setAttribute("scale", "0 0 0");
    else document.getElementById("front-arrow").setAttribute("scale", "1 1 1");
    
    if (currentPosition[0] === mapInformation.length - 1 || mapInformation[currentPosition[0] + 1][currentPosition[1]] === -1)
         document.getElementById("back-arrow").setAttribute("scale", "0 0 0");
    else document.getElementById("back-arrow").setAttribute("scale", "1 1 1");
    
    if (currentPosition[1] === 0 || mapInformation[currentPosition[0]][currentPosition[1] - 1] === -1)
         document.getElementById("left-arrow").setAttribute("scale", "0 0 0");
    else document.getElementById("left-arrow").setAttribute("scale", "1 1 1");
    
    if (currentPosition[1] === mapInformation[currentPosition[0]].length - 1 || mapInformation[currentPosition[0]][currentPosition[1] + 1] === -1)
         document.getElementById("right-arrow").setAttribute("scale", "0 0 0");
    else document.getElementById("right-arrow").setAttribute("scale", "1 1 1");
  },
  moveArea: function (str) {
    /**change color: current -> visited */
    //prettier-ignore
    let currentDiv = document.getElementById(makeAreaName(...currentPosition));
    currentDiv.classList.add("visitedArea");
    /**move area */
    if (str === "front-arrow") currentPosition[0]--;
    else if (str === "back-arrow") currentPosition[0]++;
    else if (str === "left-arrow") currentPosition[1]--;
    else currentPosition[1]++;

    if (
      currentPosition[0] < 0 ||
      currentPosition[0] >= mapInformation.length ||
      currentPosition[1] < 0 ||
      currentPosition[1] >= mapInformation[currentPosition[0]].length
    )
      console.error("ERROR! You jumped off the map!\n");
    /**change color: new (or visited) -> current */
    //prettier-ignore
    currentDiv = document.getElementById(makeAreaName(...currentPosition));
    currentDiv.classList.remove("visitedArea");
    currentDiv.classList.add("currentArea");
  },
});
