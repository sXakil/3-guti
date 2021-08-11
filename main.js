document.addEventListener("DOMContentLoaded", function () {
  const board = document.getElementById("Board");
  const lines = document.querySelectorAll(".canWin");
  const blueGuti = document.querySelectorAll(".blueGuti");
  const redGuti = document.querySelectorAll(".redGuti");
  const points = document.querySelectorAll(".points");
  const guti = document.querySelectorAll(".guti");
  const centerPoint = document.getElementById("Center");
  const turn = document.getElementById("turn");
  let activeSide = "blueGuti";

  const Center = [512, 512],
    LeftMiddle = [68, 512],
    BottomLeft = [68, 956],
    BottomCenter = [512, 956],
    BottomRight = [956, 956],
    RightMiddle = [956, 512],
    TopRight = [956, 68],
    TopCenter = [512, 68],
    TopLeft = [68, 68];

  const neighbors = {
    LeftMiddle: {
      TopLeft,
      BottomLeft,
    },
    BottomLeft: {
      LeftMiddle,
      BottomCenter,
    },
    BottomCenter: {
      BottomLeft,
      BottomRight,
    },
    BottomRight: {
      BottomCenter,
      RightMiddle,
    },
    RightMiddle: {
      BottomRight,
      TopRight,
    },
    TopRight: {
      RightMiddle,
      TopCenter,
    },
    TopCenter: {
      TopRight,
      TopLeft,
    },
    TopLeft: {
      TopCenter,
      LeftMiddle,
    },
  };

  const point = board.createSVGPoint();

  function checkWin() {
    let flag = false;
    for (let idx = 0; idx < lines.length; idx++) {
      for (let i = 0; i < blueGuti.length; i++) {
        point.x = +blueGuti[i].getAttribute("cx");
        point.y = +blueGuti[i].getAttribute("cy");
        if (lines[idx].isPointInStroke(point)) {
          flag = true;
        } else {
          flag = false;
          break;
        }
      }
      if (flag) {
        lines[idx].style.stroke = "#3333ff";
        turn.innerText = "Blue Won!";
        turn.style.color = "blue";
        break;
      }
      for (let i = 0; i < redGuti.length; i++) {
        point.x = +redGuti[i].getAttribute("cx");
        point.y = +redGuti[i].getAttribute("cy");
        if (lines[idx].isPointInStroke(point)) {
          flag = true;
        } else {
          flag = false;
          break;
        }
      }
      if (flag) {
        lines[idx].style.stroke = "#ff3333";
        turn.innerText = "Red Won!";
        turn.style.color = "red";
        break;
      }
    }
    if (flag) {
      activeSide = "";
      turn.style.fontWeight = "bold";
    }
    return flag;
  }
  for (let idx = 0; idx < points.length; idx++) {
    points[idx].addEventListener("click", function () {
      if (!this.classList.contains("active")) {
        return;
      }
      const posX = this.getAttribute("cx");
      const posY = this.getAttribute("cy");

      for (let i = 0; i < guti.length; i++) {
        if (guti[i].classList.contains("selected")) {
          guti[i].setAttribute("cx", posX);
          guti[i].setAttribute("cy", posY);
          guti[i].classList.remove("selected");
          for (let j = 0; j < points.length; j++) {
            points[j].classList.remove("active");
          }
          if (checkWin()) return;
          if (activeSide === "redGuti") {
            activeSide = "blueGuti";
            turn.innerText = "Blue's Turn";
            turn.style.color = "blue";
          } else {
            activeSide = "redGuti";
            turn.innerText = "Red's Turn";
            turn.style.color = "red";
          }
        }
      }
    });
  }

  for (let idx = 0; idx < guti.length; idx++) {
    guti[idx].addEventListener("click", function () {
      highlighNeighborPoints(guti[idx]);
    });
  }

  function highlighNeighborPoints(node = null) {
    if (!node.classList.contains(activeSide)) {
      return;
    }
    for (let i = 0; i < points.length; i++) {
      points[i].classList.remove("active");
    }
    for (let i = 0; i < guti.length; i++) {
      guti[i].classList.remove("selected");
    }
    node.classList.toggle("selected");
    centerPoint.classList.toggle("active");
    for (let i = 0; i < points.length; i++) {
      const pCX = points[i].getAttribute("cx");
      const gCX = node.getAttribute("cx");
      const pCY = points[i].getAttribute("cy");
      const gCY = node.getAttribute("cy");
      if (gCX == Center[0] && gCY == Center[1]) {
        for (let j = 0; j < points.length; j++) {
          points[j].classList.add("active");
        }
      } else if (pCX === gCX && pCY === gCY) {
        const clickedPoint = points[i].id;
        for (let j = 0; j < points.length; j++) {
          if (neighbors[clickedPoint][points[j].id]) {
            points[j].classList.add("active");
          }
        }
      }
    }
    if (!node.classList.contains("selected")) {
      for (let i = 0; i < points.length; i++) {
        points[i].classList.remove("active");
      }
    }
  }
});
