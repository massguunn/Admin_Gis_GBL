const map = L.map("map").setView([-8.52, 116.1], 10); // Bisa sesuaikan pusat peta

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

dataGB.forEach((item) => {
  if (item.latitude && item.longitude) {
    const marker = L.marker([item.latitude, item.longitude]).addTo(map);

    const popupContent = `
            <div class="card shadow-sm" style="width: 18rem;">
              <img src="${
                item.gambar
              }" class="card-img-top popup-card-img" alt="${item.nama_gb}">
              <div class="card-body">
                <h5 class="card-title">${item.nama_gb}</h5>
                <p class="card-text">${
                  item.deskripsi || "Tidak ada deskripsi."
                }</p>
                <p class="card-text"><small class="text-muted">Harga: Rp${
                  item.harga
                }</small></p>
              </div>
            </div>
          `;

    marker.bindPopup(popupContent);
  }
});
