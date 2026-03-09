/* ==========================================================
   BON APPETIT — Menu Script
   ========================================================== */

/* ---------- Restore saved theme immediately (no flash) ---------- */
(function () {
	const saved = localStorage.getItem('ba-theme');
	if (saved === 'dark') {
		document.body.classList.remove('light-mode');
		document.body.classList.add('dark-mode');
	}
})();

/* ---------- DOM refs ---------- */
const mainDOM = document.getElementById('main');
const menuHeaderDOM = document.getElementById('menu-header');
const categoryNav = document.getElementById('category-nav');
const categories = sortedCategories.map((c) => c.label);

/* ---------- Page title & favicon ---------- */
document.title = MENU_DATA.store.storeName;

if (MENU_DATA.store.storeLogo) {
	const link = document.createElement('link');
	link.rel = 'shortcut icon';
	link.href = MENU_DATA.store.storeLogo;
	link.type = 'image/x-icon';
	document.head.appendChild(link);
}

/* ---------- Hero section ---------- */
menuHeaderDOM.innerHTML = `
  ${MENU_DATA.store.storeLogo ? `<img src="${MENU_DATA.store.storeLogo}" id="main-img" alt="${MENU_DATA.store.storeName}" />` : ''}
  <p>${MENU_DATA.store.quote}</p>
  <span>
    ${
		MENU_DATA.store.sm?.instagramUrl
			? `<a id="instagram-a" href="${MENU_DATA.store.sm.instagramUrl}" target="_blank" rel="noopener">${instagramLogo}</a>`
			: ''
	}
    ${MENU_DATA.store.storeName}
    ${MENU_DATA.store.sm?.facebookUrl ? `<a id="fb-a" href="${MENU_DATA.store.sm.facebookUrl}" target="_blank" rel="noopener">${fbLogo}</a>` : ''}
  </span>
`;

/* ---------- Build category nav pills ---------- */
categories.forEach((cat) => {
	const pill = document.createElement('a');
	pill.className = 'nav-pill';
	pill.textContent = cat;
	pill.href = '#section-' + cat.replace(/\s+/g, '-');
	categoryNav.appendChild(pill);
});

/* ---------- Build menu sections ---------- */
categories.forEach((category) => {
	const item0 = data.find((item) => item.category === category);
	const section = document.createElement('section');
	section.id = 'section-' + category.replace(/\s+/g, '-');

	section.innerHTML = `
		<div class="title">
			<div class="title-name">${category}</div>
			${item0?.categoryBg ? `<img src="${item0.categoryBg}" alt="" /><img src="${item0.categoryBg}" alt="" />` : ''}
		</div>
	`;

	const newItems = data.filter((item) => item.category === category);
	newItems.forEach((item) => {
		section.innerHTML += `
			<div class="item" data-item-name="${item.name}" data-item-price="${item.price}" data-item-cat="${item.category}" data-item-unit="${item.unit || ''}">
				<div class="item-name">${item.name}</div>
				<div class="item-price">${item.price}${MENU_DATA.store.currency || '$'} ${checkForUnit(item.unit)}</div>
			</div>
		`;
	});

	mainDOM.appendChild(section);
});

/* ---------- End-of-menu decorative section ---------- */
(function addMenuEnd() {
	const endSection = document.createElement('div');
	endSection.className = 'menu-end';
	const logo = MENU_DATA.store.storeLogo || '';
	const logoImg = logo ? `<img src="${logo}" alt="" />` : '';
	endSection.innerHTML = `
		<div class="menu-end-inner">
			<p class="menu-end-text">Bon Appétit!</p>
			<span class="menu-end-sub">${MENU_DATA.store.storeName}</span>
		</div>
	`;
	mainDOM.appendChild(endSection);
})();

function checkForUnit(unit) {
	if (!unit) return '';
	return `/${unit}`;
}

/* ---------- Active category pill on scroll ---------- */
(function initScrollSpy() {
	const pills = document.querySelectorAll('.nav-pill');
	const sections = categories.map((c) => document.getElementById('section-' + c.replace(/\s+/g, '-')));

	if (!pills.length || !sections.length) return;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					pills.forEach((p) => p.classList.remove('active'));
					const idx = sections.indexOf(entry.target);
					if (idx !== -1) {
						pills[idx].classList.add('active');
						pills[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
					}
				}
			});
		},
		{ rootMargin: '-30% 0px -60% 0px', threshold: 0 },
	);

	sections.forEach((s) => {
		if (s) observer.observe(s);
	});
})();

/* ---------- Scroll-reveal animations for sections & items ---------- */
(function initRevealAnimations() {
	const sectionEls = mainDOM.querySelectorAll('section');

	const sectionObs = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('visible');

				// Stagger items inside this section
				const items = entry.target.querySelectorAll('.item');
				items.forEach((item, i) => {
					setTimeout(() => item.classList.add('visible'), 60 * i);
				});

				sectionObs.unobserve(entry.target);
			});
		},
		{ threshold: 0.08 },
	);

	sectionEls.forEach((s) => sectionObs.observe(s));
})();

/* ---------- Footer ---------- */
document.getElementById('copy').innerHTML = `&copy; ${new Date().getFullYear()}`;

/* ---------- WhatsApp button (scroll reveal) ---------- */
const appearPoint = window.innerHeight * 0.1;

/* ---------- Scroll-to-top button with progress ring ---------- */
(function initScrollTop() {
	const btn = document.getElementById('scroll-top-btn');
	const fill = btn.querySelector('.progress-ring__fill');
	const r = 19;
	const C = 2 * Math.PI * r; // circumference
	fill.style.strokeDasharray = C;
	fill.style.strokeDashoffset = C;

	function update() {
		const wpBtn = document.getElementById('wp-btn');
		const show = window.pageYOffset >= appearPoint;

		if (wpBtn) {
			wpBtn.style.display = show ? 'flex' : 'none';
		}

		// Show/hide scroll-top button at same point as WP button
		if (show) {
			btn.classList.add('show');
		} else {
			btn.classList.remove('show');
		}

		// Calculate progress
		const scrollable = document.documentElement.scrollHeight - window.innerHeight;
		const progress = scrollable > 0 ? Math.min(window.pageYOffset / scrollable, 1) : 0;
		fill.style.strokeDashoffset = C - progress * C;
	}

	window.addEventListener('scroll', update, { passive: true });
	update();

	btn.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});
})();

/* ---------- Dark / Light mode toggle ---------- */
const toggleBtn = document.getElementById('toggle-btn');

function applyThemeIcon() {
	if (document.body.classList.contains('dark-mode')) {
		toggleBtn.innerHTML = sunLogo;
	} else {
		toggleBtn.innerHTML = moonLogo;
	}
}

toggleBtn.addEventListener('click', () => {
	document.body.classList.toggle('dark-mode');
	document.body.classList.toggle('light-mode');
	const isDark = document.body.classList.contains('dark-mode');
	localStorage.setItem('ba-theme', isDark ? 'dark' : 'light');
	applyThemeIcon();
});

applyThemeIcon();

/* ---------- Loader overlay ---------- */
(function initLoader() {
	const overlay = document.getElementById('loader-overlay');
	const content = document.getElementById('content');

	window.addEventListener('load', () => {
		// small delay so the spinner doesn't flash
		setTimeout(() => {
			overlay.classList.add('hidden');
			content.style.opacity = '1';
			content.style.transition = 'opacity 0.45s ease';

			// Create WP button after load
			if (MENU_DATA.store.sm?.whatsappUrl) {
				const wpButton = document.createElement('div');
				wpButton.id = 'wp-btn';
				wpButton.innerHTML = `<a id="wp-a" href="${MENU_DATA.store.sm.whatsappUrl}" target="_blank" rel="noopener">${wpLogo}</a>`;
				content.appendChild(wpButton);
			}

			// Remove overlay from DOM after transition
			setTimeout(() => overlay.remove(), 550);
		}, 200);
	});
})();

/* ---------- Hidden invoice link (5 clicks on logo) ---------- */
const invoiceBtn = document.getElementById('main-img');
if (invoiceBtn) {
	let clickCount = 0;
	let clickTimeout;

	invoiceBtn.addEventListener('click', () => {
		clickCount++;
		if (clickCount < 5) {
			clearTimeout(clickTimeout);
			clickTimeout = setTimeout(() => {
				clickCount = 0;
			}, 1000);
		} else {
			clearTimeout(clickTimeout);
			clickCount = 0;
			window.location.href = './invoice.html';
		}
	});
}

/* ==========================================================
   ORDER BUILDER
   ========================================================== */
(function initOrderBuilder() {
	const currency = MENU_DATA.store.currency || '$';
	const CART_KEY = 'ba-cart';
	const cart = {}; // { "name|cat": { name, price, unit, category, qty } }

	/* Build a lookup from data.js for syncing */
	const dataLookup = {};
	data.forEach((d) => {
		dataLookup[d.name + '|' + d.category] = d;
	});

	/* Restore cart from sessionStorage */
	try {
		const saved = JSON.parse(sessionStorage.getItem(CART_KEY));
		if (saved && typeof saved === 'object') {
			Object.keys(saved).forEach((key) => {
				const entry = saved[key];
				const live = dataLookup[key];
				// Skip items that no longer exist in the data
				if (!live) return;
				// Sync name, price, unit from latest data.js
				cart[key] = {
					name: live.name,
					category: live.category,
					price: live.price,
					unit: live.unit,
					qty: entry.qty,
				};
			});
		}
	} catch {
		/* ignore parse errors */
	}

	function saveCart() {
		try {
			sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
		} catch {
			/* quota errors etc. */
		}
	}

	/* DOM refs */
	const fab = document.getElementById('order-fab');
	const badge = document.getElementById('order-fab-badge');
	const panel = document.getElementById('order-panel');
	const backdrop = document.getElementById('order-backdrop');
	const panelBody = document.getElementById('order-panel-body');
	const panelClose = document.getElementById('order-panel-close');
	const totalEl = document.getElementById('order-total-value');
	const confirmBtn = document.getElementById('order-confirm-btn');
	const clearBtn = document.getElementById('order-clear-btn');

	/* Qty popup refs */
	const popup = document.getElementById('qty-popup');
	const popTitle = document.getElementById('qty-popup-title');
	const popPrice = document.getElementById('qty-popup-price');
	const popInput = document.getElementById('qty-pop-input');
	const popMinus = document.getElementById('qty-pop-minus');
	const popPlus = document.getElementById('qty-pop-plus');
	const popCancel = document.getElementById('qty-pop-cancel');
	const popRemove = document.getElementById('qty-pop-remove');
	const popAdd = document.getElementById('qty-pop-add');

	let activeKey = null;

	/* Restore UI from session cart */
	updateBadge();
	highlightItems();

	/* Show fab when scrolled (same timing as scroll-top) */
	window.addEventListener(
		'scroll',
		() => {
			if (window.pageYOffset >= appearPoint) {
				fab.classList.add('show');
			} else {
				fab.classList.remove('show');
			}
		},
		{ passive: true },
	);

	/* ---- Tap on menu item → open qty popup ---- */
	mainDOM.addEventListener('click', (e) => {
		const itemEl = e.target.closest('.item');
		if (!itemEl) return;

		const name = itemEl.dataset.itemName;
		const cat = itemEl.dataset.itemCat;
		const price = parseFloat(itemEl.dataset.itemPrice);
		const unit = itemEl.dataset.itemUnit;
		const key = name + '|' + cat;

		activeKey = key;

		popTitle.textContent = name;
		popPrice.textContent = price.toFixed(2) + currency + (unit ? ' / ' + unit : '');

		// If already in cart, show current qty and Remove button
		const existing = cart[key];
		if (existing) {
			popInput.value = existing.qty;
			popRemove.classList.remove('hidden');
			popAdd.textContent = 'Update';
		} else {
			popInput.value = '1';
			popRemove.classList.add('hidden');
			popAdd.textContent = 'Add to Order';
		}

		// Store item info for the add action
		popup._itemData = { name, category: cat, price, unit };

		popup.classList.remove('hidden');
		requestAnimationFrame(() => popup.classList.add('visible'));
		history.pushState({ overlay: 'qty-popup' }, '');
	});

	function closePopup(fromPopstate) {
		if (!popup.classList.contains('visible')) return;
		popup.classList.remove('visible');
		setTimeout(() => popup.classList.add('hidden'), 250);
		activeKey = null;
		if (!fromPopstate && history.state?.overlay === 'qty-popup') history.back();
	}

	popCancel.addEventListener('click', () => closePopup());
	popup.addEventListener('click', (e) => {
		if (e.target === popup) closePopup();
	});

	popMinus.addEventListener('click', () => {
		let v = parseFloat(popInput.value) || 0;
		v = Math.max(0, +(v - 0.5).toFixed(2));
		popInput.value = v;
	});

	popPlus.addEventListener('click', () => {
		let v = parseFloat(popInput.value) || 0;
		v = +(v + 0.5).toFixed(2);
		popInput.value = v;
	});

	popAdd.addEventListener('click', () => {
		const qty = parseFloat(popInput.value) || 0;
		if (qty <= 0) {
			delete cart[activeKey];
		} else {
			const d = popup._itemData;
			cart[activeKey] = { name: d.name, category: d.category, price: d.price, unit: d.unit, qty };
		}
		saveCart();
		updateBadge();
		highlightItems();
		closePopup();
	});

	popRemove.addEventListener('click', () => {
		delete cart[activeKey];
		saveCart();
		updateBadge();
		highlightItems();
		closePopup();
	});

	function updateBadge() {
		const count = Object.values(cart).reduce((s, c) => s + c.qty, 0);
		if (count > 0) {
			badge.textContent = count % 1 === 0 ? count : count.toFixed(1);
			badge.classList.remove('hidden');
		} else {
			badge.classList.add('hidden');
		}
	}

	function highlightItems() {
		document.querySelectorAll('.item[data-item-name]').forEach((el) => {
			const key = el.dataset.itemName + '|' + el.dataset.itemCat;
			if (cart[key] && cart[key].qty > 0) {
				el.classList.add('in-cart');
			} else {
				el.classList.remove('in-cart');
			}
		});
	}

	/* ---- Open / close panel ---- */
	fab.addEventListener('click', openPanel);
	panelClose.addEventListener('click', () => closePanel());
	backdrop.addEventListener('click', () => closePanel());

	function openPanel() {
		renderPanel();
		panel.classList.remove('hidden');
		backdrop.classList.remove('hidden');
		requestAnimationFrame(() => {
			panel.classList.add('visible');
			backdrop.classList.add('visible');
		});
		document.body.style.overflow = 'hidden';
		history.pushState({ overlay: 'order-panel' }, '');
	}

	function closePanel(fromPopstate) {
		if (!panel.classList.contains('visible')) return;
		panel.classList.remove('visible');
		backdrop.classList.remove('visible');
		document.body.style.overflow = '';
		setTimeout(() => {
			panel.classList.add('hidden');
			backdrop.classList.add('hidden');
		}, 350);
		if (!fromPopstate && history.state?.overlay === 'order-panel') history.back();
	}

	/* ---- Back button (popstate) handling ---- */
	window.addEventListener('popstate', (e) => {
		if (popup.classList.contains('visible')) {
			closePopup(true);
		} else if (panel.classList.contains('visible')) {
			closePanel(true);
		}
	});

	function renderPanel() {
		const items = Object.values(cart).filter((c) => c.qty > 0);
		let total = 0;

		if (!items.length) {
			panelBody.innerHTML = '<p class="order-empty">Tap any item on the menu to add it to your order.</p>';
			totalEl.textContent = '0' + currency;
			confirmBtn.disabled = true;
			clearBtn.classList.add('hidden');
			return;
		}

		clearBtn.classList.remove('hidden');

		let html = '';
		const keys = Object.keys(cart);
		keys.forEach((key) => {
			const c = cart[key];
			if (c.qty <= 0) return;
			const line = c.price * c.qty;
			total += line;
			const qtyLabel = c.qty % 1 === 0 ? c.qty : c.qty.toFixed(1);
			html += `
				<div class="order-line">
					<span class="order-line-name">${c.name}</span>
					<span class="order-line-qty">x${qtyLabel}</span>
					<span class="order-line-price">${line.toFixed(2)}${currency}</span>
					<button class="order-line-remove" data-key="${key}" aria-label="Remove">&times;</button>
				</div>`;
		});

		panelBody.innerHTML = html;
		totalEl.textContent = total.toFixed(2) + currency;
		confirmBtn.disabled = false;
	}

	/* ---- Remove item from cart panel ---- */
	panelBody.addEventListener('click', (e) => {
		const btn = e.target.closest('.order-line-remove');
		if (!btn) return;
		const key = btn.dataset.key;
		delete cart[key];
		saveCart();
		updateBadge();
		highlightItems();
		renderPanel();
	});

	/* ---- Clear entire cart ---- */
	clearBtn.addEventListener('click', () => {
		Object.keys(cart).forEach((k) => delete cart[k]);
		saveCart();
		updateBadge();
		highlightItems();
		renderPanel();
	});

	/* ---- Confirm → Send via WhatsApp ---- */
	confirmBtn.addEventListener('click', () => {
		const items = Object.values(cart).filter((c) => c.qty > 0);
		if (!items.length) return;

		let msg = `Hi, I'd like to order the following please:\n\n`;

		items.forEach((c) => {
			const qtyLabel = c.qty % 1 === 0 ? c.qty : c.qty.toFixed(1);
			const unitLabel = c.unit ? ' ' + c.unit : '';
			msg += `• ${c.name}  x${qtyLabel}${unitLabel}\n`;
		});

		msg += `\nThank you!`;

		// Build WhatsApp link
		const wpUrl = MENU_DATA.store.sm?.whatsappUrl;
		if (!wpUrl) {
			alert('WhatsApp is not configured for this store.');
			return;
		}

		// Extract phone number from the existing WP URL
		let phone = '';
		try {
			const u = new URL(wpUrl);
			phone = u.searchParams.get('phone') || '';
		} catch {
			phone = '';
		}

		const waLink = `https://api.whatsapp.com/send/?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(msg)}`;
		window.open(waLink, '_blank');

		closePanel();
	});
})();

/* ---------- Analytics ---------- */
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
