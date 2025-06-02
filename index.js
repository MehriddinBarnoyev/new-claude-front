const API_URL = 'https://new-claude-back.onrender.com/tasks';

async function loadTasks() {
  try {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    const list = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');

    list.innerHTML = '';

    if (tasks.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    } else {
      emptyState.classList.add('hidden');
    }

    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = 'group bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all duration-200 border border-gray-200 hover:border-gray-300 animate-slide-in';
      li.style.animationDelay = `${index * 0.1}s`;

      li.innerHTML = `
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3 flex-1">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span class="text-gray-700 font-medium">${task.text}</span>
              </div>
              <button 
                onclick="deleteTask(${task.id})" 
                class="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
                title="Vazifani o'chirish"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          `;

      list.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

async function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) {
    // Custom alert with better styling
    showNotification("Maydon bo'sh bo'lishi mumkin emas", 'error');
    return;
  }

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    input.value = '';
    loadTasks();
    showNotification("Vazifa muvaffaqiyatli qo'shildi!", 'success');
  } catch (error) {
    console.error('Error adding task:', error);
    showNotification("Xatolik yuz berdi", 'error');
  }
}

async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadTasks();
    showNotification("Vazifa o'chirildi", 'success');
  } catch (error) {
    console.error('Error deleting task:', error);
    showNotification("Xatolik yuz berdi", 'error');
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 translate-x-full ${type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);

  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Enhanced input handling
document.getElementById('taskInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Load tasks on page load
loadTasks();
