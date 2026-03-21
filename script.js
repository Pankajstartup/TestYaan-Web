function searchTests() {
    let input = document.getElementById('testSearch').value.toLowerCase();
    let cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        let testName = card.querySelector('h3').innerText.toLowerCase();
        let labName = card.getAttribute('data-lab').toLowerCase();
        if (testName.includes(input) || labName.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function openBookingForm(testName, testPrice) {
    const modal = document.getElementById("orderModal");
    modal.style.display = "block";
    document.getElementById("modalTestName").value = `${testName} - ${testPrice}/-`;
}

function closeModal() {
    document.getElementById("orderModal").style.display = "none";
}

document.querySelectorAll('.book-btn').forEach(button => {
    button.onclick = function() {
        let card = this.closest('.card');
        let name = card.querySelector('h3').innerText;
        let price = card.querySelector('.price').innerText.replace('Price: ', '');
        openBookingForm(name, price);
    };
});

// Form Submit logic
document.getElementById('bookingForm').onsubmit = function(e) {
    e.preventDefault();
    let mobile = document.getElementById('pMobile').value;
    if (mobile.length !== 10) {
        alert("Pehle sahi Mobile Number daalein (10 digits)");
        return;
    }

    const scriptURL = 'https://script.google.com/macros/s/AKfycbz9pu_zCvrMqSocATaSYj435RvyKRPyt0YubeAaLjHPg8Svzy-kO9kmryFRgj6_5I4i/exec';
    const orderData = {
        name: document.getElementById('pName').value,
        mobile: mobile,
        email: document.getElementById('pEmail').value || "No Email", 
        age: document.getElementById('pAge').value,
        dob: document.getElementById('pDob').value,
        gender: document.getElementById('pGender').value,
        address: document.getElementById('pAddr').value,
        date: document.getElementById('pDate').value,
        time: document.getElementById('pTime').value,
        test: document.getElementById('modalTestName').value
    };

    const btn = document.querySelector('.stylish-confirm-btn');
    btn.innerText = "Processing Order...";
    btn.disabled = true;

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', 
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
    .then(() => {
        let myNumber = "918130484197"; 
        let message = `*New Lab Test Booking!*%0A%0A` +
            `*Patient Name:* ${orderData.name}%0A` +
            `*Mobile:* ${orderData.mobile}%0A` +
            `*Email:* ${orderData.email}%0A` + 
            `*Test Details:* ${orderData.test}%0A` +
            `*Address:* ${orderData.address}%0A` +
            `*Date:* ${orderData.date}%0A` +
            `*Time:* ${orderData.time}`;

        let whatsappURL = `https://wa.me/${myNumber}?text=${message}`;
        alert("Success! Booking saved. Opening WhatsApp...");
        closeModal();
        document.getElementById('bookingForm').reset();
        window.open(whatsappURL, '_blank');
    })
    .catch(error => alert("Error saving data."))
    .finally(() => {
        btn.innerHTML = 'Confirm Booking <i class="fas fa-arrow-right"></i>';
        btn.disabled = false;
    });
};

// --- SAHI FILTER LOGIC ---
function filterLabs(labName, element) {
    // Buttons active state
    let buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    let cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        let cardLab = card.getAttribute('data-lab');
        // Match logic (Sab ko lowercase mein compare karenge)
        if (labName.toLowerCase() === 'all labs' || cardLab === labName.toLowerCase()) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}