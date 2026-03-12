// --- 1. Fitur Greeting & Waktu (MVP) ---
function updateTime() {
    const now = new Date();
    
    // Format Waktu: HH:MM:SS
    const timeString = now.toLocaleTimeString('en-GB', { hour12: false });
    document.getElementById('time').textContent = timeString;

    // Format Tanggal (Contoh: Tuesday, January 27, 2026)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);

    // Salam Berdasarkan Waktu (MVP) [cite: 57]
    const hours = now.getHours();
    let greeting = "";
    if (hours < 12) greeting = "Good Morning";
    else if (hours < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";
    
    document.getElementById('greeting-text').textContent = greeting;
}

// Update jam setiap detik
setInterval(updateTime, 1000);
updateTime();


// --- 2. Fitur Focus Timer (MVP) ---
let timerInterval;
let timeLeft = 25 * 60; // 25 menit dalam detik [cite: 59]

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

startBtn.addEventListener('click', () => {
    if (timerInterval) return; // Mencegah multiple interval
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            alert("Time's up!");
        }
    }, 1000);
});

stopBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// --- 3. Fitur To-Do List (MVP) ---

// Ambil elemen dari HTML
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

// Ambil data dari Local Storage saat aplikasi pertama kali dimuat 
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Fungsi untuk menyimpan tasks ke Local Storage [cite: 68]
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fungsi untuk menampilkan daftar task ke layar (Render)
function renderTasks() {
    todoList.innerHTML = ''; // Kosongkan list sebelum render ulang
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        // Cek apakah task sudah selesai [cite: 65]
        const isDone = task.completed ? 'style="text-decoration: line-through;"' : '';
        
        li.innerHTML = `
            <span ${isDone}>${task.text}</span>
            <div>
                <button onclick="toggleTask(${index})">Done</button>
                <button onclick="deleteTask(${index})" style="background-color: #ff4d4d; color: white;">Delete</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// Fungsi menambah task baru [cite: 62]
addTodoBtn.addEventListener('click', () => {
    const taskText = todoInput.value.trim();
    if (taskText !== "") {
        tasks.push({ text: taskText, completed: false });
        todoInput.value = '';
        saveTasks();
        renderTasks();
    }
});

// Fungsi menandai task sebagai selesai [cite: 65]
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Fungsi menghapus task 
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Jalankan render pertama kali saat halaman dibuka
renderTasks();

// --- 4. Fitur Quick Links (MVP) ---

const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const addLinkBtn = document.getElementById('add-link-btn');
const linksContainer = document.getElementById('links-container');

// Ambil data links dari Local Storage
let quickLinks = JSON.parse(localStorage.getItem('quickLinks')) || [];

// Fungsi simpan ke Local Storage
function saveLinks() {
    localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
}

// Fungsi menampilkan links
function renderLinks() {
    linksContainer.innerHTML = '';
    
    quickLinks.forEach((link, index) => {
        const linkWrapper = document.createElement('div');
        linkWrapper.className = 'link-item';
        
        // Link utama
        const a = document.createElement('a');
        a.href = link.url.startsWith('http') ? link.url : `https://${link.url}`;
        a.textContent = link.name;
        a.target = "_blank";
        a.className = 'link-btn';
        
        // Tombol hapus link
        const delBtn = document.createElement('button');
        delBtn.textContent = '×';
        delBtn.onclick = () => deleteLink(index);
        
        linkWrapper.appendChild(a);
        linkWrapper.appendChild(delBtn);
        linksContainer.appendChild(linkWrapper);
    });
}

// Tambah link baru
addLinkBtn.addEventListener('click', () => {
    const name = linkNameInput.value.trim();
    const url = linkUrlInput.value.trim();
    
    if (name && url) {
        quickLinks.push({ name, url });
        linkNameInput.value = '';
        linkUrlInput.value = '';
        saveLinks();
        renderLinks();
    }
});

function deleteLink(index) {
    quickLinks.splice(index, 1);
    saveLinks();
    renderLinks();
}

// Jalankan saat pertama dimuat
renderLinks();

// --- TANTANGAN 1: Custom Name in Greeting ---
const userNameSpan = document.getElementById('user-name');

// Load nama dari Local Storage
userNameSpan.textContent = localStorage.getItem('username') || '[Your Name]';

// Simpan nama saat user selesai mengetik
userNameSpan.addEventListener('blur', () => {
    localStorage.setItem('username', userNameSpan.textContent);
});

// --- TANTANGAN 2: Prevent Duplicate Tasks ---
// Update fungsi add task yang sebelumnya
addTodoBtn.addEventListener('click', () => {
    const taskText = todoInput.value.trim();
    
    // Cek duplikat 
    const isDuplicate = tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase());
    
    if (isDuplicate) {
        alert("Task sudah ada!");
        return;
    }

    if (taskText !== "") {
        tasks.push({ text: taskText, completed: false });
        todoInput.value = '';
        saveTasks();
        renderTasks();
    }
});

// --- TANTANGAN 3: Light/Dark Mode ---
const darkModeBtn = document.getElementById('dark-mode-toggle');

// Cek preferensi sebelumnya
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    // Simpan ke Local Storage [cite: 33, 81]
    const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});