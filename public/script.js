// ===============================
// CLIENT-SIDE PRICE CALCULATION
// ===============================
function calculatePrice() {
  const seats = parseInt(document.getElementById("seats").value);

  // Client-side validation
  if (!seats || seats <= 0) {
    alert("Seats must be greater than 0");
    return;
  }

  const totalPrice = seats * 500;

  // Display price
  document.getElementById("price").innerText =
    "Total Price: ₹" + totalPrice;
}

// ===============================
// CREATE OPERATION (BOOK SEATS)
// ===============================
const form = document.getElementById("bookingForm");
const loadBookingsBtn = document.getElementById("loadBookingsBtn");
const bookingsList = document.getElementById("bookingsList");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent page refresh

  const customerName = document.getElementById("name").value.trim();
  const seats = parseInt(document.getElementById("seats").value);
  const travelDate = document.getElementById("travelDate").value;
  const source = document.getElementById("source").value.trim();
  const destination = document.getElementById("destination").value.trim();

  // Client-side validation
  if (!customerName || !seats || seats <= 0 || !travelDate || !source || !destination) {
    alert("Invalid input");
    return;
  }

  try {
    // Send data to backend (POST)
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ customerName, seats, travelDate, source, destination })
    });

    const data = await response.json();

    // Success message
    alert("Booking successful! Total Price: ₹" + data.totalPrice);

    // Reset UI
    document.getElementById("price").innerText = "";
    form.reset();

  } catch (error) {
    alert("Error booking seats");
    console.error(error);
  }
});

// ===============================
// GET / LIST BOOKINGS
// ===============================
loadBookingsBtn.addEventListener("click", loadBookings);

async function loadBookings() {
  try {
    const res = await fetch('/api/bookings');
    const bookings = await res.json();
    renderBookings(bookings);
  } catch (err) {
    console.error(err);
    bookingsList.innerHTML = '<p>Error loading bookings</p>';
  }
}

function renderBookings(bookings) {
  if (!bookings || bookings.length === 0) {
    bookingsList.innerHTML = '<p>No bookings yet</p>';
    return;
  }

  const rows = bookings.map(b => {
    const date = b.travelDate ? new Date(b.travelDate).toLocaleDateString() : '—';
    const dateAttr = b.travelDate ? b.travelDate.split('T')[0] : '';
    return `
      <div class="booking-item" data-id="${b._id}" data-travel-date="${dateAttr}" data-source="${escapeHtml(b.source)}" data-destination="${escapeHtml(b.destination)}">
        <div class="booking-info">
          <strong>${escapeHtml(b.customerName)}</strong>
          <div>Seats: ${b.seats} • Date: ${date}</div>
          <div>From: ${escapeHtml(b.source)} • To: ${escapeHtml(b.destination)}</div>
          <div class="price">Price: ₹${b.totalPrice}</div>
        </div>
        <div class="booking-actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;
  }).join('');

  bookingsList.innerHTML = rows;
}

// Delegate click events inside bookingsList (edit/save/cancel/delete)
bookingsList.addEventListener('click', async (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const item = btn.closest('.booking-item');
  if (!item) return;
  const id = item.dataset.id;

  if (btn.classList.contains('edit-btn')) {
    const travelDate = item.dataset.travelDate || '';
    const source = item.dataset.source || '';
    const destination = item.dataset.destination || '';
    showEditForm(id, travelDate, source, destination);
  } else if (btn.classList.contains('delete-btn')) {
    deleteBooking(id);
  } else if (btn.classList.contains('save-btn')) {
    saveEdit(id);
  } else if (btn.classList.contains('cancel-btn')) {
    loadBookings();
  }
});

function escapeHtml(text) {
  return text ? text.replace(/"/g, '&quot;').replace(/'/g, "&#39;") : '';
}

function showEditForm(id, travelDate, source, destination) {
  const el = document.querySelector(`.booking-item[data-id="${id}"]`);
  if (!el) return;

  // If an edit form already exists for this item, do nothing
  if (el.querySelector('.booking-edit')) return;

  const editHtml = `
    <div class="booking-edit">
      <label for="editDate-${id}">Date</label>
      <input type="date" id="editDate-${id}" value="${travelDate}">

      <label for="editSource-${id}">Source</label>
      <input type="text" id="editSource-${id}" value="${source}" placeholder="Source">

      <label for="editDestination-${id}">Destination</label>
      <input type="text" id="editDestination-${id}" value="${destination}" placeholder="Destination">

      <div class="edit-controls">
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
      </div>
    </div>
  `;

  el.insertAdjacentHTML('beforeend', editHtml);
}

async function saveEdit(id) {
  const travelDate = document.getElementById(`editDate-${id}`).value;
  const source = document.getElementById(`editSource-${id}`).value.trim();
  const destination = document.getElementById(`editDestination-${id}`).value.trim();

  if (!travelDate || !source || !destination) {
    alert('Date, source and destination are required');
    return;
  }

  try {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ travelDate, source, destination })
    });
    const data = await res.json();
    alert('Booking updated');
    loadBookings();
  } catch (err) {
    console.error(err);
    alert('Error updating booking');
  }
}

async function deleteBooking(id) {
  if (!confirm('Delete this booking?')) return;
  try {
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    loadBookings();
  } catch (err) {
    console.error(err);
    alert('Error deleting booking');
  }
}
