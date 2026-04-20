/* ==========================================================
   BON APPETIT — Invoice Script  (powered by KSS_ENGINE)
   ========================================================== */

var STORAGE_KEY = 'invoice_state_v2';

/* ── DOM refs ──────────────────────────────────────────── */
var mainDOM = document.getElementById('main');
var tableBodyDom = document.getElementById('table-body');
var tableFooterDom = document.getElementById('table-footer');

var nameInput = document.getElementById('name-input');
var phoneInput = document.getElementById('phone-input');
var dateInput = document.getElementById('date-input');
var thanksInput = document.getElementById('thanks-input');

var discountTypeEl = document.getElementById('discount-type');
var discountValueEl = document.getElementById('discount-value');

var nameInvoice = document.getElementById('name-invoice');
var phoneInvoice = document.getElementById('phone-invoice');
var dateInvoice = document.getElementById('date-invoice');
var thanksInvoice = document.getElementById('thanks-invoice');
var storeNameEl = document.getElementById('store-name');

var extraFieldsContainer = document.getElementById('extra-fields-container');
var addExtraFieldBtn = document.getElementById('add-extra-field');
var resetBtn = document.getElementById('reset-btn');

var confirmModal = document.getElementById('confirm-modal');
var confirmOk = document.getElementById('confirm-ok');
var confirmCancel = document.getElementById('confirm-cancel');

/* ── State ─────────────────────────────────────────────── */
var categories = [];
var cart = [];
var extraFields = [];

function initStoreInfo(STORE) {
	storeNameEl.textContent = STORE.storeName || '';
	document.getElementById('invoice-image').src = STORE.storeLogo || '';
}

/* ── Engine boot & data ────────────────────────────────── */
KSS_ENGINE.init({
	serviceId: '66d739691389bc24cc9d540b',
	logServiceId: '67eecd81e6108b1d259e624d',
	type: 'menu',
	filterEmpty: true,
	fallbackPath: './data/menu.json',
	fallbackOnly: false,
});

KSS_ENGINE.onReady(function (menuData) {
	const STORE = menuData.store;
	initStoreInfo(STORE);
	var subCategories = menuData.subCategories;

	/* Build flat cart from engine data */
	subCategories.forEach(function (sub) {
		categories.push(sub.label);
		sub.items.forEach(function (item) {
			cart.push({
				name: item.label,
				category: sub.label,
				price: item.price,
				unit: item.unit,
				count: 0,
			});
		});
	});

	/* Build menu sections */
	buildMenuSections(STORE);

	/* Restore saved state and render */
	loadState();
});

/* ==========================================================
   BUILD MENU SECTIONS
   ========================================================== */
function buildMenuSections(STORE) {
	categories.forEach(function (category) {
		var section = document.createElement('section');
		section.innerHTML = '<div class="title"><div class="title-name">' + category + '</div></div>';

		cart.filter(function (i) {
			return i.category === category;
		}).forEach(function (item) {
			section.innerHTML +=
				'<div class="item">' +
				'<div>' +
				'<div class="item-name">' +
				item.name +
				'</div>' +
				'<div class="item-price">' +
				KSS_ENGINE.formatPrice(item.price, STORE.currency) +
				' ' +
				KSS_ENGINE.formatUnit(item.unit) +
				'</div>' +
				'</div>' +
				'<div class="item-options">' +
				'<button class="minus">-</button>' +
				'<input class="input-nb num-input" placeholder="0" inputmode="decimal" name="' +
				item.name +
				' Quantity Input" />' +
				'<button class="plus">+</button>' +
				'</div>' +
				'</div>';
		});

		mainDOM.appendChild(section);
	});
}

/* ==========================================================
   NUMBER INPUT HELPERS
   ========================================================== */
function cleanLiveNumberInput(el) {
	var v = el.value;
	v = v.replace(/[^0-9.]/g, '');
	var firstDot = v.indexOf('.');
	if (firstDot !== -1) v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
	if (v.startsWith('.')) v = '0' + v;
	if (/^0\d/.test(v) && !v.startsWith('0.')) v = String(Number(v));
	el.value = v;
}

function finalizeNumber(el) {
	var v = el.value;
	if (!v || v === '.' || v === '0.') {
		el.value = '';
		return 0;
	}
	var n = parseFloat(v);
	if (isNaN(n) || n < 0) {
		el.value = '';
		return 0;
	}
	el.value = n.toFixed(2);
	return n;
}

function updateNumberModel(el, n) {
	if (el.id === 'discount-value') {
		discountValueEl.value = n ? n.toFixed(2) : '';
		return;
	}

	if (el.classList.contains('input-nb')) {
		var itemEl = el.closest('.item');
		var secEl = el.closest('section');
		var name = itemEl.querySelector('.item-name').textContent;
		var cat = secEl.querySelector('.title-name').textContent;
		var c = cart.find(function (x) {
			return x.name === name && x.category === cat;
		});
		if (c) c.count = n;
		return;
	}

	if (el.classList.contains('extra-price') || el.classList.contains('extra-qty')) {
		var row = el.closest('.extra-row');
		var ef = extraFields.find(function (x) {
			return x.id === row.dataset.id;
		});
		if (ef) {
			if (el.classList.contains('extra-price')) ef.price = n;
			if (el.classList.contains('extra-qty')) ef.count = n;
		}
	}
}

/* ── Global live input handler ── */
document.addEventListener('input', function (e) {
	if (!e.target.classList.contains('num-input')) return;
	cleanLiveNumberInput(e.target);
});

discountTypeEl.addEventListener('change', function () {
	if (discountTypeEl.value === 'percent') {
		var v = parseFloat(discountValueEl.value);
		if (v > 100) discountValueEl.value = '';
	}
	saveState();
	printInvoice();
});

/* ── Global blur handler ── */
document.addEventListener(
	'blur',
	function (e) {
		if (!e.target.classList.contains('num-input')) return;
		var n = finalizeNumber(e.target);
		if (e.target.id === 'discount-value' && discountTypeEl.value === 'percent' && n > 100) {
			n = 100;
			e.target.value = '100.00';
		}
		updateNumberModel(e.target, n);
		saveState();
		printInvoice();
	},
	true,
);

/* ==========================================================
   DISCOUNT
   ========================================================== */
function calculateDiscount(total) {
	var type = discountTypeEl.value;
	var raw = parseFloat(discountValueEl.value || 0);
	if (!raw) return { net: total, discountAmount: 0, display: '' };

	if (type === 'percent') {
		var p = Math.min(100, Math.max(0, raw));
		var d = (total * p) / 100;
		return { net: total - d, discountAmount: d, display: p + '%' };
	}

	var usd = Math.max(0, raw);
	var dd = Math.min(total, usd);
	return { net: total - dd, discountAmount: dd, display: usd + '$' };
}

/* ==========================================================
   SAVE / LOAD
   ========================================================== */
function saveState() {
	var s = {
		name: nameInput.value,
		phone: phoneInput.value,
		date: dateInput.value,
		thanks: thanksInput.value,
		discountType: discountTypeEl.value,
		discountValue: discountValueEl.value,
		cart: cart,
		extraFields: extraFields,
	};
	sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function loadState() {
	var raw = sessionStorage.getItem(STORAGE_KEY);
	if (!raw) {
		printInvoice();
		return;
	}

	try {
		var s = JSON.parse(raw);
		nameInput.value = s.name || '';
		phoneInput.value = s.phone || '';
		dateInput.value = s.date || '';
		discountTypeEl.value = s.discountType || 'usd';
		thanksInput.value = s.thanks || 'Thank you for choosing us';
		discountValueEl.value = s.discountValue || '';

		if (Array.isArray(s.cart)) {
			s.cart.forEach(function (saved) {
				var c = cart.find(function (x) {
					return x.name === saved.name && x.category === saved.category;
				});
				if (c) c.count = saved.count;
			});
		}

		extraFields = s.extraFields || [];
		renderExtraFields();
		updateMenuDomCounts();
	} catch (_) {}

	printInvoice();
}

function updateMenuDomCounts() {
	cart.forEach(function (item) {
		document.querySelectorAll('section').forEach(function (sec) {
			if (!sec.querySelector('.title-name') || sec.querySelector('.title-name').textContent !== item.category) return;
			sec.querySelectorAll('.item').forEach(function (el) {
				if (el.querySelector('.item-name').textContent !== item.name) return;
				el.querySelector('.input-nb').value = item.count ? item.count.toFixed(2) : '';
			});
		});
	});
}

/* ==========================================================
   EXTRA FIELDS
   ========================================================== */
function generateId() {
	return 'id_' + Math.random().toString(16).slice(2);
}

function renderExtraFields() {
	extraFieldsContainer.innerHTML = '';
	extraFields.forEach(function (ef) {
		var row = document.createElement('div');
		row.className = 'extra-row';
		row.dataset.id = ef.id;

		row.innerHTML =
			'<div class="extra-row-inputs">' +
			'<div class="form-floating extra-floating">' +
			'<input type="text" name="extra-name" class="form-control extra-name" placeholder="Name" autocomplete="off" value="' +
			ef.name +
			'" id="name-input-' +
			ef.id +
			'"/>' +
			'<label for="name-input-' +
			ef.id +
			'">Name</label>' +
			'</div>' +
			'<div class="form-floating extra-floating">' +
			'<input type="text" name="extra-price" class="form-control extra-price num-input" placeholder="Price" autocomplete="off" inputmode="decimal" value="' +
			(ef.price || '') +
			'" id="price-input-' +
			ef.id +
			'"/>' +
			'<label for="price-input-' +
			ef.id +
			'">Price</label>' +
			'</div>' +
			'<div class="form-floating extra-floating">' +
			'<input type="text" name="extra-qty" class="form-control extra-qty num-input" placeholder="Qty" autocomplete="off" inputmode="decimal" value="' +
			(ef.count || '') +
			'" id="quantity-input-' +
			ef.id +
			'"/>' +
			'<label for="quantity-input-' +
			ef.id +
			'">Qty</label>' +
			'</div>' +
			'</div>' +
			'<button class="extra-remove btn-cs">X</button>';

		extraFieldsContainer.appendChild(row);
	});
}

/* ── Extra fields live update ── */
extraFieldsContainer.addEventListener('input', function (e) {
	var row = e.target.closest('.extra-row');
	if (!row) return;
	var ef = extraFields.find(function (x) {
		return x.id === row.dataset.id;
	});
	if (!ef) return;

	if (e.target.classList.contains('extra-name')) {
		ef.name = e.target.value;
		saveState();
		printInvoice();
		return;
	}

	if (e.target.classList.contains('num-input')) {
		cleanLiveNumberInput(e.target);
		var n = parseFloat(e.target.value);
		if (isNaN(n)) n = 0;
		if (e.target.classList.contains('extra-price')) ef.price = n;
		if (e.target.classList.contains('extra-qty')) ef.count = n;
		saveState();
		printInvoice();
	}
});

extraFieldsContainer.addEventListener('click', function (e) {
	if (!e.target.classList.contains('extra-remove')) return;
	var id = e.target.closest('.extra-row').dataset.id;
	extraFields = extraFields.filter(function (x) {
		return x.id !== id;
	});
	renderExtraFields();
	saveState();
	printInvoice();
});

addExtraFieldBtn.addEventListener('click', function () {
	extraFields.push({ id: generateId(), name: '', price: 0, count: 0 });
	renderExtraFields();
	saveState();
});

/* ==========================================================
   MENU BUTTONS (+/-)
   ========================================================== */
mainDOM.addEventListener('click', function (e) {
	if (!e.target.classList.contains('plus') && !e.target.classList.contains('minus')) return;

	var itemEl = e.target.closest('.item');
	var secEl = e.target.closest('section');
	var name = itemEl.querySelector('.item-name').textContent;
	var cat = secEl.querySelector('.title-name').textContent;
	var c = cart.find(function (x) {
		return x.name === name && x.category === cat;
	});

	var v = c.count || 0;
	if (e.target.classList.contains('plus')) v += 1;
	if (e.target.classList.contains('minus')) v = Math.max(0, v - 1);
	c.count = v;

	itemEl.querySelector('.input-nb').value = v ? v.toFixed(2) : '';
	saveState();
	printInvoice();
});

/* ==========================================================
   GENERAL INPUTS
   ========================================================== */
[nameInput, phoneInput, dateInput, thanksInput].forEach(function (el) {
	el.addEventListener('input', function () {
		saveState();
		printInvoice();
	});
});

/* ==========================================================
   PRINT INVOICE
   ========================================================== */
function printInvoice() {
	tableBodyDom.innerHTML = '';
	tableFooterDom.innerHTML = '';
	var total = 0;

	nameInvoice.textContent = nameInput.value ? 'Name: ' + nameInput.value : '';
	phoneInvoice.textContent = phoneInput.value ? 'Phone: ' + phoneInput.value : '';
	dateInvoice.textContent = dateInput.value ? 'Date: ' + formatDate(dateInput.value) : '';
	thanksInvoice.textContent = thanksInput.value || '';

	cart.forEach(function (c) {
		if (!c.count) return;
		var line = c.count * c.price;
		total += line;
		tableBodyDom.innerHTML +=
			'<tr>' +
			'<td>' +
			c.name +
			'</td>' +
			'<td>' +
			c.count.toFixed(2) +
			'</td>' +
			'<td>' +
			KSS_ENGINE.formatPrice(c.price, STORE.currency) +
			'</td>' +
			'<td>' +
			KSS_ENGINE.formatPrice(line, STORE.currency) +
			'</td>' +
			'</tr>';
	});

	extraFields.forEach(function (ef) {
		if (!ef.name || !ef.count) return;
		var line = ef.price * ef.count;
		total += line;
		tableBodyDom.innerHTML +=
			'<tr>' +
			'<td>' +
			ef.name +
			'</td>' +
			'<td>' +
			ef.count.toFixed(2) +
			'</td>' +
			'<td>' +
			KSS_ENGINE.formatPrice(ef.price, STORE.currency) +
			'</td>' +
			'<td>' +
			KSS_ENGINE.formatPrice(line, STORE.currency) +
			'</td>' +
			'</tr>';
	});

	var d = calculateDiscount(total);
	var footer = '<tr><td colspan="3">Total</td><td>' + total.toFixed(2) + '$</td></tr>';

	if (d.discountAmount > 0) {
		footer +=
			'<tr><td colspan="2">Discount</td><td>' +
			d.display +
			'</td><td>' +
			d.discountAmount.toFixed(2) +
			'$</td></tr>' +
			'<tr><td colspan="3">Net Total</td><td>' +
			d.net.toFixed(2) +
			'$</td></tr>';
	}

	tableFooterDom.innerHTML = footer;
}

/* ==========================================================
   RESET
   ========================================================== */
resetBtn.addEventListener('click', function () {
	confirmModal.classList.remove('hidden');
});
confirmCancel.addEventListener('click', function () {
	confirmModal.classList.add('hidden');
});

confirmOk.addEventListener('click', function () {
	confirmModal.classList.add('hidden');
	sessionStorage.removeItem(STORAGE_KEY);

	nameInput.value = '';
	phoneInput.value = '';
	dateInput.value = '';
	thanksInput.value = 'Thank you for choosing us';
	discountTypeEl.value = 'usd';
	discountValueEl.value = '';

	cart.forEach(function (c) {
		c.count = 0;
	});
	extraFields = [];

	updateMenuDomCounts();
	renderExtraFields();
	printInvoice();
});

/* ==========================================================
   HELPERS
   ========================================================== */
function formatDate(iso) {
	var d = new Date(iso);
	return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
}
