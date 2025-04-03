const mainDOM = document.getElementById("main");
const tableBodyDom = document.getElementById("table-body");
const tableFooterDom = document.getElementById("table-footer");
const nameInput = document.getElementById("name-input");
const phoneInput = document.getElementById("phone-input");
const dateInput = document.getElementById("date-input");
const discountInput = document.getElementById("discount-input");
const nameInvoice = document.getElementById("name-invoice");
const phoneInvoice = document.getElementById("phone-invoice");
const dateInvoice = document.getElementById("date-invoice");
const categories = [];
const cart = [];

const addFields = [null, null, null];

const ef1_name = document.getElementById("ef1-name");
const ef1_price = document.getElementById("ef1-price");
const ef1_qtt = document.getElementById("ef1-qtt");
const ef1_add = document.getElementById("ef1-add");
const ef1_remove = document.getElementById("ef1-remove");
const ef2_name = document.getElementById("ef2-name");
const ef2_price = document.getElementById("ef2-price");
const ef2_qtt = document.getElementById("ef2-qtt");
const ef2_add = document.getElementById("ef2-add");
const ef2_remove = document.getElementById("ef2-remove");
const ef3_name = document.getElementById("ef3-name");
const ef3_price = document.getElementById("ef3-price");
const ef3_qtt = document.getElementById("ef3-qtt");
const ef3_add = document.getElementById("ef3-add");
const ef3_remove = document.getElementById("ef3-remove");

if (MENU_DATA.store.storeLogo) {
  const link = document.createElement("link");
  link.rel = "shortcut icon";
  link.href = MENU_DATA.store.storeLogo;
  link.type = "image/x-icon";
  document.head.appendChild(link);
  const image = document.getElementById("invoice-image");
  if (image) {
    image.src = MENU_DATA.store.storeLogo;
  }
}

ef1_add.addEventListener("click", addExtraFields);
ef2_add.addEventListener("click", addExtraFields);
ef3_add.addEventListener("click", addExtraFields);
ef1_remove.addEventListener("click", removeExtraFields);
ef2_remove.addEventListener("click", removeExtraFields);
ef3_remove.addEventListener("click", removeExtraFields);

data.forEach((item) => {
  if (!categories.includes(item.category)) {
    categories.push(item.category);
  }
  cart.push({ ...item, count: 0 });
});

categories.forEach((category) => {
  const section = document.createElement("section");
  section.innerHTML += `
      <div class="title">  
        <div class="title-name">${category}</div>
      </div>
  `;
  const newItems = data.filter((item) => item.category === category);
  newItems.forEach((item) => {
    section.innerHTML += `
      <div class="item">
        <div class="item-name">${item.name}</div>
        <div class="item-price">${item.price}$ ${checkForUnit(item.unit)}</div>
        <div class="item-options">
          <span class="item-count">0</span> 
          <input type='number' class='input-nb'/>
          <button class="add">add</button>
        </div>
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

const buttons = mainDOM.querySelectorAll("button");
buttons.forEach((btn) => btn.addEventListener("click", target));

function target(e) {
  const btn = e.target;
  const count = btn.parentElement.querySelector(".item-count");
  const input = Number(btn.parentElement.querySelector(".input-nb").value);
  if (input < 0) return;
  const parent = btn.parentElement.parentElement;
  const title = parent.parentElement.querySelector(".title-name").textContent;
  const itemName = parent.querySelector(".item-name").textContent;
  if (btn.classList.contains("add")) add(itemName, input, title, count);
}

function add(itemName, input, title, count) {
  count.textContent = input;
  cart.find((item) => {
    return item.name == itemName && item.category == title;
  }).count = input;
  count.innerHTML = input;
}

const invoiceBtn = document.getElementById("invoice-btn");
invoiceBtn.addEventListener("click", printInvoice);

function printInvoice() {
  tableBodyDom.innerHTML = "";
  tableFooterDom.innerHTML = "";
  let TOTAL = 0;
  if (nameInput.value !== "") {
    nameInvoice.innerHTML = `Name: ${nameInput.value}`;
  } else {
    nameInvoice.innerHTML = ``;
  }
  if (phoneInput.value !== "") {
    phoneInvoice.innerHTML = `Phone: ${phoneInput.value}`;
  } else {
    phoneInvoice.innerHTML = ``;
  }
  if (dateInput.value !== "") {
    dateInvoice.innerHTML = `Date: ${formatDate(dateInput.value)}`;
  } else {
    dateInvoice.innerHTML = ``;
  }

  Object.keys(cart).forEach((item) => {
    if (cart[item].count !== 0) {
      TOTAL += cart[item].price * cart[item].count;
      tableBodyDom.innerHTML += `
        <tr>  
          <td>${cart[item].name}</td>
          <td>${cart[item].count}</td>
          <td>${cart[item].price}$</td>
          <td>${toDecimalNumber(cart[item].price * cart[item].count)}$</td>
        </tr>`;
    }
  });
  Object.keys(addFields).forEach((item) => {
    if (addFields[item] && addFields[item].count !== 0) {
      TOTAL += addFields[item].price * addFields[item].count;
      tableBodyDom.innerHTML += `
        <tr>  
          <td>${addFields[item].name}</td>
          <td>${addFields[item].count}</td>
          <td>${addFields[item].price}$</td>
          <td>${toDecimalNumber(
            addFields[item].price * addFields[item].count
          )}$</td>
        </tr>`;
    }
  });
  if (
    discountInput.value !== "" &&
    discountInput.value >= 0 &&
    discountInput.value <= 100
  ) {
    tableFooterDom.innerHTML = `
      <tr>
        <td colspan="3">Total</td>
        <td>${toDecimalNumber(TOTAL)}$</td>
      </tr>
      <tr>
        <td colspan="2">Discount</td>
        <td>${discountInput.value}%</td>
        <td>${toDecimalNumber(
          (TOTAL * Number(discountInput.value)) / 100
        )}$</td>
      </tr>
      <tr>
        <td colspan="3">Net Total</td>
        <td>${toDecimalNumber(
          TOTAL - (TOTAL * Number(discountInput.value)) / 100
        )}$</td>
      </tr> `;
  } else {
    tableFooterDom.innerHTML = `
      <tr>
        <td colspan="3">Total</td>
        <td>${toDecimalNumber(TOTAL)}$</td>
      </tr>`;
  }
}

function toDecimalNumber(num) {
  return num.toFixed(2).padEnd(num.toFixed(2).indexOf(".") + 3, "0");
}

function formatDate(dateInput) {
  const date = new Date(dateInput);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
}

function addExtraFields(e) {
  const id = e.target.id;
  const index = id.includes("1")
    ? 0
    : id.includes("2")
    ? 1
    : id.includes("3")
    ? 2
    : undefined;
  if (index === 0 && ef1_name.value && ef1_price.value && ef1_qtt.value) {
    addFields[index] = {
      name: ef1_name.value,
      category: "Extra Fields",
      price: Number(ef1_price.value),
      count: Number(ef1_qtt.value),
    };
  }
  if (index === 1 && ef2_name.value && ef2_price.value && ef2_qtt.value) {
    addFields[index] = {
      name: ef2_name.value,
      category: "Extra Fields",
      price: Number(ef2_price.value),
      count: Number(ef2_qtt.value),
    };
  }
  if (index === 2 && ef3_name.value && ef3_price.value && ef3_qtt.value) {
    addFields[index] = {
      name: ef3_name.value,
      category: "Extra Fields",
      price: Number(ef3_price.value),
      count: Number(ef3_qtt.value),
    };
  }
}

function removeExtraFields(e) {
  const id = e.target.id;
  const index = id.includes("1")
    ? 0
    : id.includes("2")
    ? 1
    : id.includes("3")
    ? 2
    : undefined;

  if (index === 0) {
    addFields[index] = null;
    ef1_name.value = null;
    ef1_price.value = null;
    ef1_qtt.value = null;
  }
  if (index === 1 && ef2_name.value && ef2_price.value && ef2_qtt.value) {
    addFields[index] = null;
    ef2_name.value = null;
    ef2_price.value = null;
    ef2_qtt.value = null;
  }
  if (index === 2 && ef3_name.value && ef3_price.value && ef3_qtt.value) {
    addFields[index] = null;
    ef3_name.value = null;
    ef3_price.value = null;
    ef3_qtt.value = null;
  }
}

async function callLogApi() {
  try {
    const payload = {
      uuid: localStorage.getItem("uuid"),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      deviceOrientation: screen.orientation?.type || "unknown",
      service: "67eecd81e6108b1d259e624d",

      platform: navigator.platform || "unknown",
      language: navigator.language || "unknown",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const response = await fetch(
      "https://main-server-u49f.onrender.com/api/v1/ks-solutions/logs",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const uuid = await response.text();
    localStorage.setItem("uuid", uuid);
  } catch {}
}

callLogApi();
