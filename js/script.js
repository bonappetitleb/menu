loader();
const mainDOM = document.getElementById("main");
const categories = [];

data.forEach((item) => {
  if (!categories.includes(item.category)) {
    categories.push(item.category);
  }
});

categories.forEach((category) => {
  const section = document.createElement("section");
  section.innerHTML += `
      <div class="title">  
        <div class="title-name">${category}</div>
        <img src="img/background.jpeg" />
        <img src="img/background.jpeg" />
      </div>
  `;
  const newItems = data.filter((item) => item.category === category);
  newItems.forEach((item) => {
    section.innerHTML += `
      <div class="item">
        <div class="item-name">${item.name}</div>
        <div class="item-price">${item.price}$ ${checkForUnit(item.unit)}</div>
      </div>
  `;
  });
  mainDOM.appendChild(section);
});

function checkForUnit(unit) {
  if (!unit) {
    return "";
  }
  return `/${unit}`;
}

// footer
let date = new Date().getFullYear();
let copy = document.getElementById("copy");
copy.innerHTML = `&copy; ${date}`;

//wp btn
const wpBtn = document.getElementById("wp-btn");
const appearPoint = window.innerHeight * 0.1;
window.addEventListener("scroll", () => {
  const scrollPosition = window.pageYOffset;
  if (scrollPosition >= appearPoint) {
    wpBtn.style.display = "flex";
  } else {
    wpBtn.style.display = "none";
  }
});

//dark light mode btn
const toggleBtn = document.getElementById("toggle-btn");
const sectionTitleImg1 = document.querySelectorAll(".header-img");
let handleClick = () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  if (document.body.classList.contains("dark-mode")) {
    toggleBtn.innerHTML = sunLogo;
  } else {
    toggleBtn.innerHTML = moonLogo;
  }
};

toggleBtn.addEventListener("click", handleClick);
toggleBtn.innerHTML = moonLogo;

function loader() {
  let loaded = false;
  const progressBar = document.getElementById("progress");
  const content = document.getElementById("content");
  window.onload = function () {
    loaded = true;
    progressBar.style.width = `100%`;
    setTimeout(() => {
      content.style.display = "block";
      progressBar.parentElement.style.display = "none";
    }, 150);
  };

  document.addEventListener("DOMContentLoaded", function () {
    let width = 20;
    progressBar.style.width = `${width}%`;
    let interval = setInterval(function () {
      if (loaded === true) return clearInterval(interval);
      width += 5;
      progressBar.style.width = width + "%";
      if (width >= 80) clearInterval(interval);
    }, 100);
    let SlowInterval = setInterval(function () {
      if (loaded === true) return clearInterval(SlowInterval);
      width += 1;
      progressBar.style.width = width + "%";
      if (width > 80 && width >= 98) clearInterval(SlowInterval);
    }, 500);
  });
}

const invoiceBtn = document.getElementById("main-img");
let clickCount = 0;
let clickTimeout;

invoiceBtn.addEventListener("click", () => {
  clickCount++;
  if (clickCount < 5) {
    clickTimeout = setTimeout(() => {
      clickCount = 0;
    }, 1000);
  } else {
    clearTimeout(clickTimeout);
    clickCount = 0;
    const url = "./invoice.html";
    window.location.href = url;
  }
});

async function callLogApi() {
  const now = new Date().getTime();
  const lastCall = localStorage.getItem("lastCall");
  if (lastCall) {
    const lastCallNb = Number(lastCall);
    if (now - lastCallNb < 1800000) {
      return;
    }
  }

  try {
    await fetch(
      "https://main-server-u49f.onrender.com/api/v1/ks-solutions/logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendLogData()),
      }
    );

    localStorage.setItem("lastCall", now.toString());
  } catch (error) {}
}

// Function to send log data to the server
function sendLogData() {
  let uuid = localStorage.getItem("uuid");

  if (!uuid) {
    uuid = generateUUID();
    localStorage.setItem("uuid", uuid);
  }

  const urlParams = new URLSearchParams(window.location.search);
  return {
    uuid,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    deviceOrientation: screen.orientation.type,
    utmParameters: {
      utm_source: urlParams.get("utm_source"),
      utm_medium: urlParams.get("utm_medium"),
      utm_campaign: urlParams.get("utm_campaign"),
    },
    service: "external menu",
    brand: "Bon appetit",
  };
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

callLogApi();
