// Поиск элементов на странице
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const stickerPool = document.getElementById('stickerPool');
const board = document.getElementById('board');
const clearStickersBtn = document.getElementById('clearStickersBtn');
const clearBoardBtn = document.getElementById('clearBoardBtn');

let draggedSticker = null;

// Функция создания стикера
function createSticker() {
    const text = taskInput.value.trim();

    if (text === '') {
        alert('Введите текст для стикера!');
        return;
    }

    // Создание элементов стикера
    const sticker = document.createElement('div');
    sticker.classList.add('sticker');
    sticker.setAttribute('draggable', 'true');
    sticker.id = 'sticker-' + Date.now();

    const span = document.createElement('span');
    span.textContent = text;
    span.classList.add('sticker-text');

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('sticker-actions');

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editBtn.classList.add('edit-sticker-btn');
    editBtn.title = 'Редактировать';

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    deleteBtn.classList.add('delete-sticker-btn');
    deleteBtn.title = 'Удалить';

    // Иерархия элементов
    actionsDiv.append(editBtn);
    actionsDiv.append(deleteBtn);
    sticker.append(span);
    sticker.append(actionsDiv);

    stickerPool.append(sticker);

    // Логика действий со стикером
    deleteBtn.addEventListener('click', function () {
        sticker.remove();
    });

    editBtn.addEventListener('click', function () {
        toggleEdit(sticker, span, editBtn);
    });

    sticker.addEventListener('dragstart', function (event) {
        draggedSticker = sticker;
        event.dataTransfer.setData('text/plain', sticker.id);
    });

    taskInput.value = '';
    taskInput.focus();
}

// Функция редактирования текста
function toggleEdit(sticker, span, editBtn) {
    const isEditing = sticker.classList.contains('editing');

    if (!isEditing) {
        sticker.classList.add('editing');
        sticker.setAttribute('draggable', 'false');

        const currentText = span.textContent;
        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        textarea.classList.add('edit-input');

        span.replaceWith(textarea);
        textarea.focus();

        editBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        editBtn.classList.add('active-check');

        // Сохранение по Enter
        textarea.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                toggleEdit(sticker, span, editBtn);
            }
        });
    } else {
        const textarea = sticker.querySelector('.edit-input');
        if (textarea) {
            const newText = textarea.value.trim();
            span.textContent = newText !== '' ? newText : 'Пустая заметка';
            textarea.replaceWith(span);
        }

        sticker.classList.remove('editing');
        sticker.setAttribute('draggable', 'true');
        editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        editBtn.classList.remove('active-check');
    }
}

// Логика Drag & Drop
[stickerPool, board].forEach(function (zone) {
    zone.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    zone.addEventListener('drop', function (event) {
        event.preventDefault();
        if (!draggedSticker) return;

        if (zone === board) {
            const rect = board.getBoundingClientRect();
            let x = event.clientX - rect.left - 100;
            let y = event.clientY - rect.top - 20;

            x = Math.max(0, Math.min(x, rect.width - 220));
            y = Math.max(0, Math.min(y, rect.height - 80));

            draggedSticker.style.position = 'absolute';
            draggedSticker.style.left = x + 'px';
            draggedSticker.style.top = y + 'px';

            board.append(draggedSticker);
        } else {
            draggedSticker.style.position = 'static';
            stickerPool.append(draggedSticker);
        }

        draggedSticker = null;
    });
});

// Логика очистки списков
clearStickersBtn.addEventListener('click', function () {
    stickerPool.innerHTML = '';
});

clearBoardBtn.addEventListener('click', function () {
    board.innerHTML = '';
});

addBtn.addEventListener('click', createSticker);

// Создание стикера через Enter
taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        createSticker();
    }
});