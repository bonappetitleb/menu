loader();
const mainDOM = document.getElementById('main');
const menuHeaderDOM = document.getElementById('menu-header');
const categories = sortedCategories.map((c) => c.label);

document.title = MENU_DATA.store.storeName;

if (MENU_DATA.store.storeLogo) {
	const link = document.createElement('link');
	link.rel = 'shortcut icon';
	link.href = MENU_DATA.store.storeLogo;
	link.type = 'image/x-icon';
	document.head.appendChild(link);
}

menuHeaderDOM.innerHTML = `
  ${MENU_DATA.store.storeLogo ? `<img src="${MENU_DATA.store.storeLogo}" id="main-img" />` : ''}
  <p>${MENU_DATA.store.quote}</p>
  <span>
    ${
		MENU_DATA.store.sm?.instagramUrl
			? `
      <a
      id="instagram-a"
      href="${MENU_DATA.store.sm?.instagramUrl}"
      target="_blank">${instagramLogo}</a>
      `
			: ''
	}
    ${MENU_DATA.store.storeName}
    ${
		MENU_DATA.store.sm?.facebookUrl
			? `<a
      id="fb-a"
      href="${MENU_DATA.store.sm?.facebookUrl}"
      target="_blank">${fbLogo}</a>`
			: ''
	}
  </span>
`;

categories.forEach((category) => {
	const item0 = data.find((item) => item.category === category);
	const section = document.createElement('section');
	section.innerHTML += `
      <div class="title">  
        <div class="title-name">${category}</div>
        ${item0?.categoryBg ? `<img src="${item0.categoryBg}" /><img src="${item0.categoryBg}" />` : ''}
      </div>
  `;
	const newItems = data.filter((item) => item.category === category);
	newItems.forEach((item) => {
		section.innerHTML += `
      <div class="item">
        <div class="item-name">${item.name}</div>
        <div class="item-price">${item.price}${MENU_DATA.store.currency || '$'} ${checkForUnit(item.unit)}</div>
      </div>
  `;
	});
	mainDOM.appendChild(section);
});

function checkForUnit(unit) {
	if (!unit) {
		return '';
	}
	return `/${unit}`;
}

// footer
let date = new Date().getFullYear();
let copy = document.getElementById('copy');
copy.innerHTML = `&copy; ${date}`;

//wp btn
const appearPoint = window.innerHeight * 0.1;
window.addEventListener('scroll', () => {
	const wpBtn = document.getElementById('wp-btn');
	if (wpBtn) {
		const scrollPosition = window.pageYOffset;
		if (scrollPosition >= appearPoint) {
			wpBtn.style.display = 'flex';
		} else {
			wpBtn.style.display = 'none';
		}
	}
});

//dark light mode btn
const toggleBtn = document.getElementById('toggle-btn');
const sectionTitleImg1 = document.querySelectorAll('.header-img');
let handleClick = () => {
	document.body.classList.toggle('dark-mode');
	document.body.classList.toggle('light-mode');
	if (document.body.classList.contains('dark-mode')) {
		toggleBtn.innerHTML = sunLogo;
	} else {
		toggleBtn.innerHTML = moonLogo;
	}
};

toggleBtn.addEventListener('click', handleClick);
toggleBtn.innerHTML = moonLogo;

function loader() {
	let loaded = false;
	const progressBar = document.getElementById('progress');
	const content = document.getElementById('content');
	window.onload = function () {
		loaded = true;
		progressBar.style.width = `100%`;
		setTimeout(() => {
			content.style.display = 'block';
			const wpButton = document.createElement('div');
			wpButton.innerHTML = MENU_DATA.store.sm?.whatsappUrl
				? `
        <a
          id="wp-a"
          href="${MENU_DATA.store.sm.whatsappUrl}"
          target="_blank">${wpLogo}</a>
      `
				: '';
			wpButton.id = MENU_DATA.store.sm?.whatsappUrl ? 'wp-btn' : '';
			content.appendChild(wpButton);

			progressBar.parentElement.style.display = 'none';
		}, 150);
	};

	document.addEventListener('DOMContentLoaded', function () {
		let width = 20;
		progressBar.style.width = `${width}%`;
		let interval = setInterval(function () {
			if (loaded === true) return clearInterval(interval);
			width += 5;
			progressBar.style.width = width + '%';
			if (width >= 80) clearInterval(interval);
		}, 100);
		let SlowInterval = setInterval(function () {
			if (loaded === true) return clearInterval(SlowInterval);
			width += 1;
			progressBar.style.width = width + '%';
			if (width > 80 && width >= 98) clearInterval(SlowInterval);
		}, 500);
	});
}

const invoiceBtn = document.getElementById('main-img');
let clickCount = 0;
let clickTimeout;

invoiceBtn.addEventListener('click', () => {
	clickCount++;
	if (clickCount < 5) {
		clickTimeout = setTimeout(() => {
			clickCount = 0;
		}, 1000);
	} else {
		clearTimeout(clickTimeout);
		clickCount = 0;
		const url = './invoice.html';
		window.location.href = url;
	}
});

async function callLogApi() {
	try {
		const params = new URLSearchParams(window.location.search);
		const queryParams = {};
		for (const [key, value] of params.entries()) {
			queryParams[key] = value;
		}

		const payload = {
			uuid: localStorage.getItem('uuid'),
			screenWidth: window.screen.width,
			screenHeight: window.screen.height,
			deviceOrientation: screen.orientation?.type || 'unknown',
			service: MENU_DATA.store.menuId,

			platform: navigator.platform || 'unknown',
			language: navigator.language || 'unknown',
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			queryParams,
			locationHref: location.href,
		};

		const response = await fetch('https://main-server-u49f.onrender.com/api/v1/ks-solutions/logs', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		const uuid = await response.text();
		localStorage.setItem('uuid', uuid);
	} catch {}
}

callLogApi();
