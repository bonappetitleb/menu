const STORAGE_KEY = 'invoice_state_v2';

/* DOM REFS */
const mainDOM = document.getElementById('main');
const tableBodyDom = document.getElementById('table-body');
const tableFooterDom = document.getElementById('table-footer');

const nameInput = document.getElementById('name-input');
const phoneInput = document.getElementById('phone-input');
const dateInput = document.getElementById('date-input');

const discountTypeEl = document.getElementById('discount-type');
const discountValueEl = document.getElementById('discount-value');

const nameInvoice = document.getElementById('name-invoice');
const phoneInvoice = document.getElementById('phone-invoice');
const dateInvoice = document.getElementById('date-invoice');
const storeNameEl = document.getElementById('store-name');

const extraFieldsContainer = document.getElementById('extra-fields-container');
const addExtraFieldBtn = document.getElementById('add-extra-field');
const resetBtn = document.getElementById('reset-btn');

const confirmModal = document.getElementById('confirm-modal');
const confirmOk = document.getElementById('confirm-ok');
const confirmCancel = document.getElementById('confirm-cancel');

/* STATE */
const categories = [];
const cart = [];
let extraFields = [];

/*****************************************************
 * STORE INFO
 *****************************************************/
(function initStoreInfo() {
	try {
		if (MENU_DATA?.store) {
			storeNameEl.textContent = MENU_DATA.store.storeName || '';
			document.getElementById('invoice-image').src = MENU_DATA.store.storeLogo || '';
		}
	} catch {}
})();

/*****************************************************
 * BUILD MENU
 *****************************************************/
data.forEach((item) => {
	if (!categories.includes(item.category)) categories.push(item.category);
	cart.push({ ...item, count: 0 });
});

categories.forEach((category) => {
	const section = document.createElement('section');
	section.innerHTML = `
		<div class="title"><div class="title-name">${category}</div></div>
	`;

	data.filter((i) => i.category === category).forEach((item) => {
		section.innerHTML += `
			<div class="item">
				<div>
					<div class="item-name">${item.name}</div>
					<div class="item-price">${item.price}$ ${item.unit ? '/' + item.unit : ''}</div>
				</div>

				<div class="item-options">
					<button class="minus">-</button>
					<input class="input-nb num-input" placeholder="0" inputmode="decimal" name="${item.name} Quantity Input" />
					<button class="plus">+</button>
				</div>
			</div>
		`;
	});

	mainDOM.appendChild(section);
});

/*****************************************************
 * UNIVERSAL NUMBER INPUT SANITIZER (LIVE)
 *****************************************************/
function cleanLiveNumberInput(el) {
	let v = el.value;

	// Remove invalid chars
	v = v.replace(/[^0-9.]/g, '');

	// Only first dot allowed
	const firstDot = v.indexOf('.');
	if (firstDot !== -1) {
		v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, '');
	}

	// ".5" → "0.5"
	if (v.startsWith('.')) v = '0' + v;

	// "00" → "0"
	if (/^0\d/.test(v) && !v.startsWith('0.')) {
		v = String(Number(v));
	}

	el.value = v;
}

/*****************************************************
 * FINALIZE INPUT ON BLUR (FORMAT TO 2 DECIMALS)
 *****************************************************/
function finalizeNumber(el) {
	let v = el.value;

	if (!v || v === '.' || v === '0.') {
		el.value = '';
		return 0;
	}

	let n = parseFloat(v);
	if (isNaN(n) || n < 0) {
		el.value = '';
		return 0;
	}

	el.value = n.toFixed(2);
	return n;
}

/*****************************************************
 * UPDATE MODEL WHEN NUMBER CHANGES
 *****************************************************/
function updateNumberModel(el, n) {
	/* DISCOUNT */
	if (el.id === 'discount-value') {
		discountValueEl.value = n ? n.toFixed(2) : '';
		return;
	}

	/* MENU ITEMS */
	if (el.classList.contains('input-nb')) {
		const itemEl = el.closest('.item');
		const secEl = el.closest('section');

		const name = itemEl.querySelector('.item-name').textContent;
		const cat = secEl.querySelector('.title-name').textContent;

		const c = cart.find((x) => x.name === name && x.category === cat);
		c.count = n;

		return;
	}

	/* EXTRA FIELDS */
	if (el.classList.contains('extra-price') || el.classList.contains('extra-qty')) {
		const row = el.closest('.extra-row');
		const ef = extraFields.find((x) => x.id === row.dataset.id);

		if (el.classList.contains('extra-price')) ef.price = n;
		if (el.classList.contains('extra-qty')) ef.count = n;
		return;
	}
}

/*****************************************************
 * GLOBAL LIVE INPUT HANDLER
 *****************************************************/
document.addEventListener('input', (e) => {
	if (!e.target.classList.contains('num-input')) return;
	cleanLiveNumberInput(e.target);
});

discountTypeEl.addEventListener('change', () => {
	// Reset the value if switching to percent with an invalid value
	if (discountTypeEl.value === 'percent') {
		const v = parseFloat(discountValueEl.value);
		if (v > 100) {
			discountValueEl.value = '';
		}
	}

	saveState();
	printInvoice();
});

/*****************************************************
 * GLOBAL BLUR HANDLER
 *****************************************************/
document.addEventListener(
	'blur',
	(e) => {
		if (!e.target.classList.contains('num-input')) return;

		let n = finalizeNumber(e.target);

		// LIMIT PERCENT DISCOUNT
		if (e.target.id === 'discount-value' && discountTypeEl.value === 'percent') {
			if (n > 100) {
				n = 100;
				e.target.value = '100.00';
			}
		}

		updateNumberModel(e.target, n);
		saveState();
		printInvoice();
	},
	true,
);

/*****************************************************
 * DISCOUNT LOGIC
 *****************************************************/
function calculateDiscount(total) {
	const type = discountTypeEl.value;
	const raw = parseFloat(discountValueEl.value || 0);

	if (!raw) return { net: total, discountAmount: 0, display: '' };

	if (type === 'percent') {
		const p = Math.min(100, Math.max(0, raw));
		const d = (total * p) / 100;
		return { net: total - d, discountAmount: d, display: p + '%' };
	}

	const usd = Math.max(0, raw);
	const d = Math.min(total, usd);
	return { net: total - d, discountAmount: d, display: usd + '$' };
}

/*****************************************************
 * SAVE / LOAD
 *****************************************************/
function saveState() {
	const s = {
		name: nameInput.value,
		phone: phoneInput.value,
		date: dateInput.value,
		discountType: discountTypeEl.value,
		discountValue: discountValueEl.value,
		cart,
		extraFields,
	};
	sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function loadState() {
	const raw = sessionStorage.getItem(STORAGE_KEY);
	if (!raw) return printInvoice();

	try {
		const s = JSON.parse(raw);

		nameInput.value = s.name ?? '';
		phoneInput.value = s.phone ?? '';
		dateInput.value = s.date ?? '';
		discountTypeEl.value = s.discountType ?? 'usd';
		discountValueEl.value = s.discountValue ?? '';

		if (Array.isArray(s.cart)) {
			s.cart.forEach((saved) => {
				const c = cart.find((x) => x.name === saved.name && x.category === saved.category);
				if (c) c.count = saved.count;
			});
		}

		extraFields = s.extraFields ?? [];
		renderExtraFields();
		updateMenuDomCounts();
	} catch {}

	printInvoice();
}

function updateMenuDomCounts() {
	cart.forEach((item) => {
		document.querySelectorAll('section').forEach((sec) => {
			if (sec.querySelector('.title-name')?.textContent !== item.category) return;

			sec.querySelectorAll('.item').forEach((el) => {
				if (el.querySelector('.item-name').textContent !== item.name) return;

				el.querySelector('.input-nb').value = item.count ? item.count.toFixed(2) : '';
			});
		});
	});
}

/*****************************************************
 * EXTRA FIELDS
 *****************************************************/
function generateId() {
	return 'id_' + Math.random().toString(16).slice(2);
}

function renderExtraFields() {
	extraFieldsContainer.innerHTML = '';

	extraFields.forEach((ef) => {
		const row = document.createElement('div');
		row.className = 'extra-row';
		row.dataset.id = ef.id;

		row.innerHTML = `
			<div class="extra-row-inputs">
				<div class="form-floating extra-floating">
					<input type="text" name="extra-name" class="form-control extra-name" placeholder="Name" autocomplete="off" value="${ef.name}" id="name-input-${
			ef.id
		}"/>
					<label for="name-input-${ef.id}">Name</label>
				</div>

				<div class="form-floating extra-floating">
					<input type="text" name="extra-price" class="form-control extra-price num-input" placeholder="Price" autocomplete="off" inputmode="decimal" value="${
						ef.price || ''
					}" id="price-input-${ef.id}"/>
					<label for="price-input-${ef.id}">Price</label>
				</div>

				<div class="form-floating extra-floating">
					<input type="text" name="extra-qty" class="form-control extra-qty num-input" placeholder="Qty" autocomplete="off" inputmode="decimal" value="${
						ef.count || ''
					}" id="quantity-input-${ef.id}"/>
					<label for="quantity-input-${ef.id}">Qty</label>
				</div>
			</div>

			<button class="extra-remove btn-cs">X</button>
		`;

		extraFieldsContainer.appendChild(row);
	});
}

/*****************************************************
 * EXTRA FIELDS – LIVE UPDATE
 *****************************************************/
extraFieldsContainer.addEventListener('input', (e) => {
	const row = e.target.closest('.extra-row');
	if (!row) return;

	const id = row.dataset.id;
	const ef = extraFields.find((x) => x.id === id);
	if (!ef) return;

	// Name field
	if (e.target.classList.contains('extra-name')) {
		ef.name = e.target.value;
		saveState();
		printInvoice();
		return;
	}

	// Price or Qty fields
	if (e.target.classList.contains('num-input')) {
		const liveValue = e.target.value;
		cleanLiveNumberInput(e.target); // format while typing

		let n = parseFloat(e.target.value);
		if (isNaN(n)) n = 0;

		if (e.target.classList.contains('extra-price')) ef.price = n;
		if (e.target.classList.contains('extra-qty')) ef.count = n;

		saveState();
		printInvoice();
	}
});

extraFieldsContainer.addEventListener('click', (e) => {
	if (!e.target.classList.contains('extra-remove')) return;

	const id = e.target.closest('.extra-row').dataset.id;
	extraFields = extraFields.filter((x) => x.id !== id);

	renderExtraFields();
	saveState();
	printInvoice();
});

addExtraFieldBtn.addEventListener('click', () => {
	extraFields.push({ id: generateId(), name: '', price: 0, count: 0 });
	renderExtraFields();
	saveState();
});

/*****************************************************
 * MENU BUTTONS
 *****************************************************/
mainDOM.addEventListener('click', (e) => {
	if (!e.target.classList.contains('plus') && !e.target.classList.contains('minus')) return;

	const itemEl = e.target.closest('.item');
	const secEl = e.target.closest('section');

	const name = itemEl.querySelector('.item-name').textContent;
	const cat = secEl.querySelector('.title-name').textContent;

	const c = cart.find((x) => x.name === name && x.category === cat);

	let v = c.count || 0;
	if (e.target.classList.contains('plus')) v += 1;
	if (e.target.classList.contains('minus')) v = Math.max(0, v - 1);

	c.count = v;

	itemEl.querySelector('.input-nb').value = v ? v.toFixed(2) : '';

	saveState();
	printInvoice();
});

/*****************************************************
 * GENERAL INPUTS
 *****************************************************/
[nameInput, phoneInput, dateInput].forEach((el) => {
	el.addEventListener('input', () => {
		saveState();
		printInvoice();
	});
});

/*****************************************************
 * PRINT INVOICE
 *****************************************************/
function printInvoice() {
	tableBodyDom.innerHTML = '';
	tableFooterDom.innerHTML = '';

	let total = 0;

	nameInvoice.textContent = nameInput.value ? 'Name: ' + nameInput.value : '';
	phoneInvoice.textContent = phoneInput.value ? 'Phone: ' + phoneInput.value : '';
	dateInvoice.textContent = dateInput.value ? 'Date: ' + formatDate(dateInput.value) : '';

	cart.forEach((c) => {
		if (!c.count) return;

		const line = c.count * c.price;
		total += line;

		tableBodyDom.innerHTML += `
			<tr>
				<td>${c.name}</td>
				<td>${c.count.toFixed(2)}</td>
				<td>${c.price.toFixed(2)}$</td>
				<td>${line.toFixed(2)}$</td>
			</tr>
		`;
	});

	extraFields.forEach((ef) => {
		if (!ef.name || !ef.count) return;

		const line = ef.price * ef.count;
		total += line;

		tableBodyDom.innerHTML += `
			<tr>
				<td>${ef.name}</td>
				<td>${ef.count.toFixed(2)}</td>
				<td>${ef.price.toFixed(2)}$</td>
				<td>${line.toFixed(2)}$</td>
			</tr>
		`;
	});

	const d = calculateDiscount(total);

	let footer = `
		<tr><td colspan="3">Total</td><td>${total.toFixed(2)}$</td></tr>
	`;

	if (d.discountAmount > 0) {
		footer += `
			<tr>
				<td colspan="2">Discount</td>
				<td>${d.display}</td>
				<td>${d.discountAmount.toFixed(2)}$</td>
			</tr>
			<tr>
				<td colspan="3">Net Total</td>
				<td>${d.net.toFixed(2)}$</td>
			</tr>
		`;
	}

	tableFooterDom.innerHTML = footer;
}

/*****************************************************
 * RESET
 *****************************************************/
resetBtn.addEventListener('click', () => {
	confirmModal.classList.remove('hidden');
});

confirmCancel.addEventListener('click', () => {
	confirmModal.classList.add('hidden');
});

confirmOk.addEventListener('click', () => {
	confirmModal.classList.add('hidden');
	sessionStorage.removeItem(STORAGE_KEY);

	nameInput.value = '';
	phoneInput.value = '';
	dateInput.value = '';

	discountTypeEl.value = 'usd';
	discountValueEl.value = '';

	cart.forEach((c) => (c.count = 0));
	extraFields = [];

	updateMenuDomCounts();
	renderExtraFields();
	printInvoice();
});

/*****************************************************
 * INIT
 *****************************************************/
loadState();

/*****************************************************
 * DATE FORMAT HELP
 *****************************************************/
function formatDate(iso) {
	const d = new Date(iso);
	return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/*****************************************************
 * LOGGING
 *****************************************************/
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
			service: '67eecd81e6108b1d259e624d',

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
