const container = document.querySelector(".container");
const resetbtn = document.querySelector(".resetbtn");
const startbtn = document.querySelector(".startbtn");
const instructbtn = document.querySelector(".instrbtn");

startbtn.classList.add("isDisabled");
let sound = new Howl({
  src: ["zig-zag.mp3"],
});
let end = new Howl({
  src: ["bubbles.mp3"],
});
sound.volume(0.2);

let src;
let dest;
let flag = 0;
let running = false;
let blocked = new Set();
let unsettled = new Set();
let settled = new Set();
let neighbours = new Set();
let weights = [];
weights[0] = 0;
resetbtn.addEventListener("click", reset);
startbtn.addEventListener("click", start);

for (let i = 1; i <= 4500; i++) {
  weights[i] = Infinity;
}

for (let i = 1; i <= 4500; i++) {
  let div = document.createElement("div");
  div.classList.add(`a${i.toString()}`);
  container.appendChild(div);

  div.addEventListener("click", () => {
    //adding a click listener to each element just to identify the source and destination node --- refactor
    if (flag === 0) {
      src = Number(div.className.slice(1));
      div.style.backgroundColor = "#ffd500";
      // div.style.setProperty("background-color", "#ffd500", "important");
      flag++;
    } else if (flag === 1) {
      dest = Number(div.className.slice(1));
      div.style.backgroundColor = "#ffd500";
      flag++;
      startbtn.classList.remove("isDisabled");
    } else {
      if (!running) {
        div.style.backgroundColor = "#8d0801";
        blocked.add(Number(div.className.slice(1))); //adding the walls to a list
      }
    }
  });

  div.addEventListener("mouseover", (event) => {
    //adding listener to create walls when left mouse button is clicked
    if (!running) {
      if (flag === 2) {
        //walls will be added only when src and destination are assigned
        if (
          div.className !== `a${src}` &&
          div.className !== `a${dest}` &&
          event.buttons === 1
        ) {
          //make sure src and dest are not walls
          div.style.backgroundColor = "#8d0801";
          blocked.add(Number(div.className.slice(1))); //adding the walls to a list
        }
      }
    }
  });
  container.appendChild(div);
}

function start() {
  running = true;
  resetbtn.classList.add("isDisabled"); //disable the resetbutton
  container.classList.add("isDisabledClear");
  startbtn.classList.add("isDisabled");
  weights[src] = 0;
  unsettled.add(src);
  let hey = setInterval(task, 300); //using setInterval to slow down the algo

  function task() {
    if (settled.has(dest)) {
      clearInterval(hey); //to stop the execution of setInterval which in turn stops the execution of task
      showpath(dest); //call show path as soon as shortest path to dest is finalised
      document.querySelector(`.a${dest.toString()}`).style.backgroundColor =
        "#ffd500"; //just for show!
      resetbtn.classList.remove("isDisabled"); //enable the resetbutton again
      container.classList.remove("isDisabledClear");
      running = false;
    } else {
      for (let element of unsettled) {
        //relax the neighbours of element in unsettled and add them in neighbours
        if (
          !blocked.has(element + 100) &&
          element + 100 <= 4500 &&
          !settled.has(element + 100)
        ) {
          neighbours.add(element + 100);
          if (weights[element + 100] > weights[element] + 1) {
            weights[element + 100] = weights[element] + 1;
          }
        }
        if (
          !blocked.has(element - 100) &&
          element - 100 > 0 &&
          !settled.has(element - 100)
        ) {
          neighbours.add(element - 100);
          if (weights[element - 100] > weights[element] + 1) {
            weights[element - 100] = weights[element] + 1;
          }
        }
        if (
          !blocked.has(element + 1) &&
          element % 100 !== 0 &&
          element + 1 <= 4500 &&
          !settled.has(element + 1)
        ) {
          neighbours.add(element + 1);
          if (weights[element + 1] > weights[element] + 1) {
            weights[element + 1] = weights[element] + 1;
          }
        }
        if (
          !blocked.has(element - 1) &&
          (element - 1) % 100 !== 0 &&
          element - 1 > 0 &&
          !settled.has(element - 1)
        ) {
          neighbours.add(element - 1);
          if (weights[element - 1] > weights[element] + 1) {
            weights[element - 1] = weights[element] + 1;
          }
        }
      }
      sound.play();
      for (let item of unsettled) {
        settled.add(item);
        document.querySelector(`.a${item.toString()}`).style.backgroundColor =
          "#ef233c";
        document.querySelector(`.a${item.toString()}`).style.borderColor =
          "#fed5d9";
      }
      document.querySelector(`.a${src.toString()}`).style.backgroundColor =
        "#ffd500";
      unsettled.clear();
      if (neighbours.size == 0) {
        alert("no shortest parth");
        clearInterval(hey);
        running = false;
        resetbtn.classList.remove("isDisabled");
        container.classList.remove("isDisabledClear");
        return;
      }
      for (let item of neighbours) {
        unsettled.add(item);
        document.querySelector(`.a${item.toString()}`).style.backgroundColor =
          "#d90429";
      }
      neighbours.clear();
    }
  }
}
function showpath(dest) {
  console.log("show path called");
  document.querySelector(`.a${dest.toString()}`).style.backgroundColor =
    "#fdfcdc";
  document.querySelector(`.a${dest.toString()}`).style.borderColor = "#fdfcdc";
  if (dest === src) {
    end.play();
    document.querySelector(`.a${src.toString()}`).style.backgroundColor =
      "#ffd500";
    return;
  }
  if (
    dest + 100 <= 4500 &&
    settled.has(dest + 100) &&
    weights[dest + 100] === weights[dest] - 1
  ) {
    showpath(dest + 100);
  } else if (
    dest - 100 > 0 &&
    settled.has(dest - 100) &&
    weights[dest - 100] === weights[dest] - 1
  ) {
    showpath(dest - 100);
  } else if (
    dest % 100 !== 0 &&
    dest + 1 <= 4500 &&
    settled.has(dest + 1) &&
    weights[dest + 1] === weights[dest] - 1
  ) {
    showpath(dest + 1);
  } else if (
    (dest - 1) % 100 !== 0 &&
    dest - 1 > 0 &&
    settled.has(dest - 1) &&
    weights[dest - 1] === weights[dest] - 1
  ) {
    showpath(dest - 1);
  }
}

function reset() {
  for (let i = 1; i <= 4500; i++) {
    weights[i] = Infinity;
  }
  flag = 0;
  for (let i = 1; i <= 4500; i++) {
    document.querySelector(`.a${i.toString()}`).style.backgroundColor = "white";
    document.querySelector(`.a${i.toString()}`).style.borderColor = "#8d0801";
  }
  settled.clear();
  unsettled.clear();
  blocked.clear();
  neighbours.clear();
}
