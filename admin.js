// Basit admin şifresi (istersen değiştir)
const ADMIN_PASSWORD = "derinmercanlove";

function login() {
    const pass = document.getElementById("password").value;
    const error = document.getElementById("error");

    if (pass === ADMIN_PASSWORD) {
        // Giriş başarılı → admin paneline gider
        window.location.href = "panel.html";
    } else {
        error.textContent = "Yanlış şifre!";
        error.style.color = "red";
    }
}
