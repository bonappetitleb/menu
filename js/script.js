/* ==========================================================
   BON APPETIT — Menu Script  (powered by KSS_ENGINE)
   ========================================================== */

/* ── 1. Restore saved theme immediately (no flash) ─────── */
(function () {
	const saved = localStorage.getItem('ba-theme');
	if (saved === 'dark') {
		document.body.classList.remove('light-mode');
		document.body.classList.add('dark-mode');
	}
})();

/* ── 2. Page meta & engine boot ────────────────────────── */
KSS_ENGINE.init({
	serviceId: '66d739691389bc24cc9d540b',
	type: 'menu',
	filterEmpty: true,
	fallbackPath: './data/menu.json',
	fallbackOnly: false,
});

/* ── 3. Error handling ─────────────────────────────────── */
KSS_ENGINE.error.subscribe(function (err) {
	if (!err) return;
	var overlay = document.getElementById('loader-overlay');
	if (overlay) {
		var text = overlay.querySelector('.loader-text');
		var spinner = overlay.querySelector('.loader-spinner');
		if (text) text.textContent = 'Failed to load menu. Please refresh.';
		if (spinner) spinner.style.display = 'none';
	}
});

/* ── 4. Build UI when data is ready ────────────────────── */
KSS_ENGINE.onReady(function (menuData) {
	const STORE = menuData.store;
	KSS_ENGINE.setupPageMeta(STORE);
	var subCategories = menuData.subCategories;

	buildHero(STORE);
	buildCategoryNav(subCategories);
	buildMenuSections(subCategories, STORE);
	buildMenuEnd(STORE);
	initFooter();
	initDarkModeToggle();

	/* Reveal content, then wire up scroll-dependant features */
	KSS_ENGINE.waitForImages().then(() => {
		hideLoader(STORE);
		initScrollSpy(subCategories);
		initRevealAnimations();
		initScrollTop();
		initInvoiceLink();
		initOrderBuilder(subCategories, STORE);
	});
});

/* ── DOM refs ──────────────────────────────────────────── */
var mainDOM = document.getElementById('main');
var menuHeaderDOM = document.getElementById('menu-header');
var categoryNav = document.getElementById('category-nav');
var appearPoint = window.innerHeight * 0.1;

/* ==========================================================
   BUILD FUNCTIONS
   ========================================================== */

/* ---------- Hero section ---------- */
function buildHero(STORE) {
	menuHeaderDOM.innerHTML =
		(STORE.storeLogo ? '<img src="' + STORE.storeLogo + '" id="main-img" alt="' + STORE.storeName + '" />' : '') +
		'<p>' +
		STORE.quote +
		'</p>' +
		'<span>' +
		(STORE.sm && STORE.sm.instagramUrl
			? '<a id="instagram-a" href="' + STORE.sm.instagramUrl + '" target="_blank" rel="noopener">' + instagramLogo + '</a>'
			: '') +
		STORE.storeName +
		(STORE.sm && STORE.sm.facebookUrl
			? '<a id="fb-a" href="' + STORE.sm.facebookUrl + '" target="_blank" rel="noopener">' + fbLogo + '</a>'
			: '') +
		'</span>';
}

/* ---------- Category nav pills ---------- */
function buildCategoryNav(subCategories) {
	subCategories.forEach(function (sub) {
		var pill = document.createElement('a');
		pill.className = 'nav-pill';
		pill.textContent = sub.label;
		pill.href = '#section-' + sub._id;
		categoryNav.appendChild(pill);
	});
}

/* ---------- Menu sections ---------- */
function buildMenuSections(subCategories, STORE) {
	subCategories.forEach(function (sub) {
		var section = document.createElement('section');
		section.id = 'section-' + sub._id;

		var bgImg = sub.bgImg || STORE.storeLogo;
		section.innerHTML =
			'<div class="title">' +
			'<div class="title-name">' +
			sub.label +
			'</div>' +
			(bgImg ? '<img src="' + bgImg + '" alt="" /><img src="' + bgImg + '" alt="" />' : '') +
			'</div>';

		sub.items.forEach(function (item) {
			var price = KSS_ENGINE.formatPrice(item.price, STORE.currency);
			var unit = KSS_ENGINE.formatUnit(item.unit);

			section.innerHTML +=
				'<div class="item"' +
				' data-item-name="' +
				item.label +
				'"' +
				' data-item-price="' +
				item.price +
				'"' +
				' data-item-cat="' +
				sub.label +
				'"' +
				' data-item-unit="' +
				(item.unit || '') +
				'">' +
				'<div class="item-name">' +
				item.label +
				'</div>' +
				'<div class="item-price">' +
				price +
				' ' +
				unit +
				'</div>' +
				'</div>';
		});

		mainDOM.appendChild(section);
	});
}

/* ---------- End-of-menu decorative section ---------- */
function buildMenuEnd(STORE) {
	var endSection = document.createElement('div');
	endSection.className = 'menu-end';
	endSection.innerHTML =
		'<div class="menu-end-inner">' +
		'<p class="menu-end-text">Bon App\u00e9tit!</p>' +
		'<span class="menu-end-sub">' +
		STORE.storeName +
		'</span>' +
		'</div>';
	mainDOM.appendChild(endSection);
}

/* ==========================================================
   INTERACTIVE FEATURES
   ========================================================== */

/* ---------- Active category pill on scroll ---------- */
function initScrollSpy(subCategories) {
	var pills = document.querySelectorAll('.nav-pill');
	var sections = subCategories.map(function (sub) {
		return document.getElementById('section-' + sub._id);
	});

	if (!pills.length || !sections.length) return;

	var observer = new IntersectionObserver(
		function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				pills.forEach(function (p) {
					p.classList.remove('active');
				});
				var idx = sections.indexOf(entry.target);
				if (idx !== -1) {
					pills[idx].classList.add('active');
					pills[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
				}
			});
		},
		{ rootMargin: '-30% 0px -60% 0px', threshold: 0 },
	);

	sections.forEach(function (s) {
		if (s) observer.observe(s);
	});
}

/* ---------- Scroll-reveal animations ---------- */
function initRevealAnimations() {
	var sectionEls = mainDOM.querySelectorAll('section');

	var sectionObs = new IntersectionObserver(
		function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('visible');

				var items = entry.target.querySelectorAll('.item');
				items.forEach(function (item, i) {
					setTimeout(function () {
						item.classList.add('visible');
					}, 60 * i);
				});

				sectionObs.unobserve(entry.target);
			});
		},
		{ threshold: 0.08 },
	);

	sectionEls.forEach(function (s) {
		sectionObs.observe(s);
	});
}

/* ---------- Footer ---------- */
function initFooter() {
	var copy = document.getElementById('copy');
	if (copy) copy.innerHTML = '&copy; ' + new Date().getFullYear();
}

/* ---------- Scroll-to-top button with progress ring ---------- */
function initScrollTop() {
	var btn = document.getElementById('scroll-top-btn');
	var fill = btn.querySelector('.progress-ring__fill');
	var r = 19;
	var C = 2 * Math.PI * r;
	fill.style.strokeDasharray = C;
	fill.style.strokeDashoffset = C;

	function update() {
		var wpBtn = document.getElementById('wp-btn');
		var show = window.pageYOffset >= appearPoint;

		if (wpBtn) wpBtn.style.display = show ? 'flex' : 'none';
		btn.classList.toggle('show', show);

		var scrollable = document.documentElement.scrollHeight - window.innerHeight;
		var progress = scrollable > 0 ? Math.min(window.pageYOffset / scrollable, 1) : 0;
		fill.style.strokeDashoffset = C - progress * C;
	}

	window.addEventListener('scroll', update, { passive: true });
	update();

	btn.addEventListener('click', function () {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});
}

/* ---------- Dark / Light mode toggle ---------- */
function initDarkModeToggle() {
	var toggleBtn = document.getElementById('toggle-btn');

	function applyIcon() {
		toggleBtn.innerHTML = document.body.classList.contains('dark-mode') ? sunLogo : moonLogo;
	}

	toggleBtn.addEventListener('click', function () {
		document.body.classList.toggle('dark-mode');
		document.body.classList.toggle('light-mode');
		localStorage.setItem('ba-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
		applyIcon();
	});

	applyIcon();
}

/* ---------- Loader overlay ---------- */
function hideLoader(STORE) {
	var overlay = document.getElementById('loader-overlay');
	var content = document.getElementById('content');

	overlay.classList.add('hidden');
	content.style.opacity = '1';
	content.style.transition = 'opacity 0.45s ease';

	/* Create WP button */
	if (STORE.sm && STORE.sm.whatsappUrl) {
		var wpButton = document.createElement('div');
		wpButton.id = 'wp-btn';
		wpButton.innerHTML = '<a id="wp-a" href="' + STORE.sm.whatsappUrl + '" target="_blank" rel="noopener">' + wpLogo + '</a>';
		content.appendChild(wpButton);
	}

	setTimeout(function () {
		overlay.remove();
	}, 550);
}

/* ---------- Hidden invoice link (5 taps on logo) ---------- */
function initInvoiceLink() {
	var logoEl = document.getElementById('main-img');
	if (!logoEl) return;

	var clicks = 0;
	var timer;

	logoEl.addEventListener('click', function () {
		clicks++;
		if (clicks < 5) {
			clearTimeout(timer);
			timer = setTimeout(function () {
				clicks = 0;
			}, 1000);
		} else {
			clearTimeout(timer);
			clicks = 0;
			window.location.href = './invoice.html';
		}
	});
}

/* ==========================================================
   ORDER BUILDER
   ========================================================== */
function initOrderBuilder(subCategories, STORE) {
	var currency = STORE.currency || '$';
	var CART_KEY = 'ba-cart';
	var cart = {};

	/* Build a lookup from engine data */
	var dataLookup = {};
	subCategories.forEach(function (sub) {
		sub.items.forEach(function (item) {
			dataLookup[item.label + '|' + sub.label] = {
				name: item.label,
				category: sub.label,
				price: item.price,
				unit: item.unit,
			};
		});
	});

	/* Restore cart from sessionStorage */
	try {
		var saved = JSON.parse(sessionStorage.getItem(CART_KEY));
		if (saved && typeof saved === 'object') {
			Object.keys(saved).forEach(function (key) {
				var entry = saved[key];
				var live = dataLookup[key];
				if (!live) return;
				cart[key] = {
					name: live.name,
					category: live.category,
					price: live.price,
					unit: live.unit,
					qty: entry.qty,
				};
			});
		}
	} catch (_) {}

	function saveCart() {
		try {
			sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
		} catch (_) {}
	}

	/* DOM refs */
	var fab = document.getElementById('order-fab');
	var badge = document.getElementById('order-fab-badge');
	var panel = document.getElementById('order-panel');
	var backdrop = document.getElementById('order-backdrop');
	var panelBody = document.getElementById('order-panel-body');
	var panelClose = document.getElementById('order-panel-close');
	var totalEl = document.getElementById('order-total-value');
	var confirmBtn = document.getElementById('order-confirm-btn');
	var clearBtn = document.getElementById('order-clear-btn');

	/* Qty popup refs */
	var popup = document.getElementById('qty-popup');
	var popTitle = document.getElementById('qty-popup-title');
	var popPrice = document.getElementById('qty-popup-price');
	var popInput = document.getElementById('qty-pop-input');
	var popMinus = document.getElementById('qty-pop-minus');
	var popPlus = document.getElementById('qty-pop-plus');
	var popCancel = document.getElementById('qty-pop-cancel');
	var popRemove = document.getElementById('qty-pop-remove');
	var popAdd = document.getElementById('qty-pop-add');

	var activeKey = null;

	updateBadge();
	highlightItems();

	/* Show fab on scroll */
	window.addEventListener(
		'scroll',
		function () {
			fab.classList.toggle('show', window.pageYOffset >= appearPoint);
		},
		{ passive: true },
	);

	/* ── Tap menu item → open qty popup ── */
	mainDOM.addEventListener('click', function (e) {
		var itemEl = e.target.closest('.item');
		if (!itemEl) return;

		var name = itemEl.dataset.itemName;
		var cat = itemEl.dataset.itemCat;
		var price = parseFloat(itemEl.dataset.itemPrice);
		var unit = itemEl.dataset.itemUnit;
		var key = name + '|' + cat;

		activeKey = key;
		popTitle.textContent = name;
		popPrice.textContent = price.toFixed(2) + currency + (unit ? ' / ' + unit : '');

		var existing = cart[key];
		if (existing) {
			popInput.value = existing.qty;
			popRemove.classList.remove('hidden');
			popAdd.textContent = 'Update';
		} else {
			popInput.value = '1';
			popRemove.classList.add('hidden');
			popAdd.textContent = 'Add to Order';
		}

		popup._itemData = { name: name, category: cat, price: price, unit: unit };
		popup.classList.remove('hidden');
		requestAnimationFrame(function () {
			popup.classList.add('visible');
		});
		history.pushState({ overlay: 'qty-popup' }, '');
	});

	function closePopup(fromPopstate) {
		if (!popup.classList.contains('visible')) return;
		popup.classList.remove('visible');
		setTimeout(function () {
			popup.classList.add('hidden');
		}, 250);
		activeKey = null;
		if (!fromPopstate && history.state && history.state.overlay === 'qty-popup') history.back();
	}

	popCancel.addEventListener('click', function () {
		closePopup();
	});
	popup.addEventListener('click', function (e) {
		if (e.target === popup) closePopup();
	});

	popMinus.addEventListener('click', function () {
		var v = parseFloat(popInput.value) || 0;
		popInput.value = Math.max(0, +(v - 0.5).toFixed(2));
	});

	popPlus.addEventListener('click', function () {
		var v = parseFloat(popInput.value) || 0;
		popInput.value = +(v + 0.5).toFixed(2);
	});

	popAdd.addEventListener('click', function () {
		var qty = parseFloat(popInput.value) || 0;
		if (qty <= 0) {
			delete cart[activeKey];
		} else {
			var d = popup._itemData;
			cart[activeKey] = { name: d.name, category: d.category, price: d.price, unit: d.unit, qty: qty };
		}
		saveCart();
		updateBadge();
		highlightItems();
		closePopup();
	});

	popRemove.addEventListener('click', function () {
		delete cart[activeKey];
		saveCart();
		updateBadge();
		highlightItems();
		closePopup();
	});

	function updateBadge() {
		var count = Object.values(cart).reduce(function (s, c) {
			return s + c.qty;
		}, 0);
		if (count > 0) {
			badge.textContent = count % 1 === 0 ? count : count.toFixed(1);
			badge.classList.remove('hidden');
		} else {
			badge.classList.add('hidden');
		}
	}

	function highlightItems() {
		document.querySelectorAll('.item[data-item-name]').forEach(function (el) {
			var key = el.dataset.itemName + '|' + el.dataset.itemCat;
			el.classList.toggle('in-cart', !!(cart[key] && cart[key].qty > 0));
		});
	}

	/* ── Panel open / close ── */
	fab.addEventListener('click', openPanel);
	panelClose.addEventListener('click', function () {
		closePanel();
	});
	backdrop.addEventListener('click', function () {
		closePanel();
	});

	function openPanel() {
		renderPanel();
		panel.classList.remove('hidden');
		backdrop.classList.remove('hidden');
		requestAnimationFrame(function () {
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
		setTimeout(function () {
			panel.classList.add('hidden');
			backdrop.classList.add('hidden');
		}, 350);
		if (!fromPopstate && history.state && history.state.overlay === 'order-panel') history.back();
	}

	window.addEventListener('popstate', function () {
		if (popup.classList.contains('visible')) closePopup(true);
		else if (panel.classList.contains('visible')) closePanel(true);
	});

	function renderPanel() {
		var items = Object.values(cart).filter(function (c) {
			return c.qty > 0;
		});
		var total = 0;

		if (!items.length) {
			panelBody.innerHTML = '<p class="order-empty">Tap any item on the menu to add it to your order.</p>';
			totalEl.textContent = '0' + currency;
			confirmBtn.disabled = true;
			clearBtn.classList.add('hidden');
			return;
		}

		clearBtn.classList.remove('hidden');
		var html = '';
		Object.keys(cart).forEach(function (key) {
			var c = cart[key];
			if (c.qty <= 0) return;
			var line = c.price * c.qty;
			total += line;
			var qtyLabel = c.qty % 1 === 0 ? c.qty : c.qty.toFixed(1);
			html +=
				'<div class="order-line">' +
				'<span class="order-line-name">' +
				c.name +
				'</span>' +
				'<span class="order-line-qty">x' +
				qtyLabel +
				'</span>' +
				'<span class="order-line-price">' +
				line.toFixed(2) +
				currency +
				'</span>' +
				'<button class="order-line-remove" data-key="' +
				key +
				'" aria-label="Remove">&times;</button>' +
				'</div>';
		});

		panelBody.innerHTML = html;
		totalEl.textContent = total.toFixed(2) + currency;
		confirmBtn.disabled = false;
	}

	panelBody.addEventListener('click', function (e) {
		var btn = e.target.closest('.order-line-remove');
		if (!btn) return;
		delete cart[btn.dataset.key];
		saveCart();
		updateBadge();
		highlightItems();
		renderPanel();
	});

	clearBtn.addEventListener('click', function () {
		Object.keys(cart).forEach(function (k) {
			delete cart[k];
		});
		saveCart();
		updateBadge();
		highlightItems();
		renderPanel();
	});

	/* ── Confirm → WhatsApp ── */
	confirmBtn.addEventListener('click', function () {
		var items = Object.values(cart).filter(function (c) {
			return c.qty > 0;
		});
		if (!items.length) return;

		var msg = "Hi, I'd like to order the following please:\n\n";
		items.forEach(function (c) {
			var qtyLabel = c.qty % 1 === 0 ? c.qty : c.qty.toFixed(1);
			var unitLabel = c.unit ? ' ' + c.unit : '';
			msg += '\u2022 ' + c.name + '  x' + qtyLabel + unitLabel + '\n';
		});
		msg += '\nThank you!';

		var wpUrl = STORE.sm && STORE.sm.whatsappUrl;
		if (!wpUrl) {
			alert('WhatsApp is not configured for this store.');
			return;
		}

		var phone = '';
		try {
			phone = new URL(wpUrl).searchParams.get('phone') || '';
		} catch (_) {}

		var waLink = 'https://api.whatsapp.com/send/?phone=' + encodeURIComponent(phone) + '&text=' + encodeURIComponent(msg);
		window.open(waLink, '_blank');
		closePanel();
	});
}
