const data = window.data;

function deleteData(id) {
  if (confirm("Yakin ingin hapus data ini?")) {
    fetch("/admin/" + id, { method: "DELETE" })
      .then((res) => res.text())
      .then((msg) => {
        alert(msg);
        location.reload();
      })
      .catch((err) => alert("Error: " + err));
  }
}

function updateData(id) {
  const item = data.find((d) => d.id == id);
  if (!item) {
    alert("Data tidak ditemukan!");
    return;
  }

  document.getElementById("edit-id").value = item.id;
  document.getElementById("edit-nama_gb").value = item.nama_gb;
  document.getElementById("edit-alamat_gb").value = item.alamat_gb;
  document.getElementById("edit-nomer_hp").value = item.nomer_hp;
  document.getElementById("edit-harga").value = item.harga;
  document.getElementById("edit-deskripsi").value = item.deskripsi;
  document.getElementById("edit-gambar").value = "";
  document.getElementById("edit-latitude").value = item.latitude;
  document.getElementById("edit-longitude").value = item.longitude;
  document.getElementById("edit-gendang").value = item.jm_gendang;
  document.getElementById("edit-suling").value = item.jm_suling;
  document.getElementById("edit-cemprang").value = item.jm_cemprang;
  document.getElementById("edit-reong").value = item.jm_reong;
  document.getElementById("edit-gong").value = item.jm_gong;
  document.getElementById("edit-petuq").value = item.jm_petuq;
  document.getElementById("edit-rencek").value = item.jm_rencek;
  document.getElementById("edit-map").value = item.map;
  document.getElementById("edit-fb").value = item.link_fb;
  document.getElementById("edit-ig").value = item.link_ig;

  const editModal = new bootstrap.Modal(document.getElementById("editModal"));
  editModal.show();
}

document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("edit-id").value;
  const form = document.getElementById("editForm");
  const formData = new FormData(form);

  fetch("/admin/" + id + "?_method=PUT", {
    method: "POST", // penting: masih POST
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      alert("Data berhasil diupdate!");
      location.reload();
    })
    .catch((err) => {
      alert("Gagal update data: " + err);
    });
});
