const data = [
  {
    name: "Sambousik",
    category: "Starters",
    unit: "Dozen",
    price: 4,
  },
  {
    name: "Kabkoub Lahme",
    category: "Starters",
    unit: "Dozen",
    price: 5,
  },
  {
    name: "Kabkoub Labniyeh",
    category: "Starters",
    unit: "Dozen",
    price: 3,
  },
  {
    name: "Kabkoub bel jeben",
    category: "Starters",
    unit: "Dozen",
    price: 5,
  },
  {
    name: "Re2a2at Jebne",
    category: "Starters",
    unit: "Dozen",
    price: 4,
  },
  {
    name: "Re2a2at Sojo2",
    category: "Starters",
    unit: "Dozen",
    price: 4,
  },
  {
    name: "Re2a2at Fajita",
    category: "Starters",
    unit: "Dozen",
    price: 5,
  },
  {
    name: "Pizza",
    category: "Starters",
    unit: "Dozen",
    price: 5,
  },
  {
    name: "Hot Dog",
    category: "Starters",
    unit: "Dozen",
    price: 5,
  },
  {
    name: "Lahem 3ajin",
    category: "Starters",
    unit: "Dozen",
    price: 4,
  },
  {
    name: "Spring Rolls",
    category: "Starters",
    unit: "Dozen",
    price: 3,
  },
  {
    name: "Ftayer Keshek",
    category: "Starters",
    unit: "Dozen",
    price: 3,
  },
  {
    name: "Ftayer Sbenegh",
    category: "Starters",
    unit: "Dozen",
    price: 3,
  },
  {
    name: "Crabe Salade",
    category: "Salade",
    unit: "4 Pers",
    price: 15,
  },
  {
    name: "Greek Salade",
    category: "Salade",
    unit: "4 Pers",
    price: 15,
  },
  {
    name: "Pasta Salade",
    category: "Salade",
    unit: "4 Pers",
    price: 15,
  },
  {
    name: "Tabbouleh",
    category: "Salade",
    unit: "4 Pers",
    price: 10,
  },
  {
    name: "Fattoush",
    category: "Salade",
    unit: "4 Pers",
    price: 10,
  },
  {
    name: "Kebbe Mamdoude",
    category: "Kebbe",
    unit: "kg",
    price: 8,
  },
  {
    name: "Kebbe Ma3 Basal w Loz",
    category: "Kebbe",
    unit: "kg",
    price: 9,
  },
  {
    name: "Eres kebbe Shahem",
    category: "Kebbe",
    unit: "pc",
    price: 2.5,
  },
  {
    name: "Eres kebbe Lahem",
    category: "Kebbe",
    unit: "pc",
    price: 3,
  },
  {
    name: "Salsa Harra",
    category: "Kebbe",
    unit: "kg",
    price: 3,
  },
  {
    name: "Wara2 3enab Zet",
    category: "Main Dishes",
    unit: "kg",
    price: 5,
  },
  {
    name: "Wara2 3enab Lahme",
    category: "Main Dishes",
    unit: "kg",
    price: 8,
  },
  {
    name: "Kroket",
    category: "Main Dishes",
    unit: "kg",
    price: 8,
  },
  {
    name: "Bajaxy",
    category: "Main Dishes",
    unit: "kg",
    price: 11,
  },
  {
    name: "Crispy",
    category: "Main Dishes",
    unit: "kg",
    price: 8,
  },
  {
    name: "Escalope",
    category: "Main Dishes",
    unit: "kg",
    price: 9,
  },
  {
    name: "Fajita",
    category: "Main Dishes",
    unit: "kg",
    price: 8,
  },
  {
    name: "Mahshe Sele2",
    category: "Main Dishes",
    unit: "kg",
    price: 4,
  },
  {
    name: "Mahshe Malfouf",
    category: "Main Dishes",
    unit: "kg",
    price: 7,
  },
  {
    name: "Shishbarak",
    category: "Main Dishes",
    unit: "100 pc",
    price: 4,
  },
  {
    name: "Shishbarak Kbir",
    category: "Main Dishes",
    unit: "100 pc",
    price: 4.5,
  },
  {
    name: "Gateau",
    category: "Dessert",
    unit: "unit",
    price: 6,
  },
  {
    name: "Gateau Ananas",
    category: "Dessert",
    unit: "unit",
    price: 8,
  },
  {
    name: "Petit Four",
    category: "Dessert",
    unit: "kg",
    price: 6,
  },
  {
    name: "Ka3k L 3arous",
    category: "Dessert",
    unit: "kg",
    price: 5,
  },
  {
    name: "3waymet",
    category: "Dessert",
    unit: "kg",
    price: 5,
  },
  {
    name: "Ma3moul Joz",
    category: "Dessert",
    unit: "kg",
    price: 8,
  },
  {
    name: "Ma3moul Tamer",
    category: "Dessert",
    unit: "kg",
    price: 6,
  },
  {
    name: "Ma3moul Festok",
    category: "Dessert",
    unit: "kg",
    price: 10,
  },
  {
    name: "Ma3kroun Sekar",
    category: "Dessert",
    unit: "kg",
    price: 4,
  },
  {
    name: "Ma3kroun B Joz",
    category: "Dessert",
    unit: "kg",
    price: 6,
  },
  {
    name: "Tuna Pizza",
    category: "Lent",
    unit: "Dozen",
    price: 4,
  },
  {
    name: "Ftayer Thon",
    category: "Lent",
    unit: "Dozen",
    price: 3,
  },
  {
    name: "Ftayer Sbenegh",
    category: "Lent",
    unit: "Dozen",
    price: 3,
  },
  {
    name: "Spring Rolls",
    category: "Lent",
    unit: "Dozen",
    price: 3,
  },
  {
    name: "Kebbet Rahib",
    category: "Lent",
    unit: "kg",
    price: 3,
  },
  {
    name: "Mahshe Sele2",
    category: "Lent",
    unit: "kg",
    price: 4,
  },
  {
    name: "Mahshe Malfouf",
    category: "Lent",
    unit: "kg",
    price: 5,
  },
  {
    name: "Wara2 3enab Zet",
    category: "Lent",
    unit: "kg",
    price: 5,
  },
  {
    name: "Samke Harra",
    category: "Lent",
    unit: "kg",
    price: 9,
  },
  {
    name: "Fish Fingers",
    category: "Lent",
    unit: "kg",
    price: 8,
  },
  {
    name: "Fish Escalope",
    category: "Lent",
    unit: "kg",
    price: 9,
  },
  {
    name: "Kebbet Hemmos",
    category: "Lent",
    unit: "kg",
    price: 5,
  },
  {
    name: "Kebbet Samak",
    category: "Lent",
    unit: "kg",
    price: 9,
  },
  {
    name: "Ma3kroun B Sekar",
    category: "Lent",
    unit: "kg",
    price: 4,
  },
  {
    name: "Ma3kroun B Joz",
    category: "Lent",
    unit: "kg",
    price: 6,
  },
  {
    name: "3waymet",
    category: "Lent",
    unit: "kg",
    price: 5,
  },
  {
    name: "Gateau Syeme",
    category: "Lent",
    unit: "unit",
    price: 6,
  },
  {
    name: "Fried/Cooked",
    category: "Cooking Options",
    unit: "unit",
    price: 0.5,
  },
];

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
        <div class="item-price">${item.price}$ /${item.unit}</div>
      </div>
  `;
  });
  mainDOM.appendChild(section);
});

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
    toggleBtn.innerHTML = `<i class="fas fa-sun"></i>`;
  } else {
    toggleBtn.innerHTML = `<i class="fas fa-moon"></i>`;
  }
};

toggleBtn.addEventListener("click", handleClick);
