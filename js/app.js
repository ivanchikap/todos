// Todo manager
// 1. создать задачу
//      а. обработка формы
//          - проверить данные перед добавлением (валидация)
//      б. добавить задачу в массив
//      в. добавить данные в таблицу
//      г. очистить форму
// 2. удалить задачу
//      а. подтверждение
//      б. удаление данных из таблицы
//      в. удаление данных из массива 
// 3. редактировать задачу 
//      а. взять данные из массива
//      б. поместить в форму 
//      в. обработать форму на редактирование
//          - валидация
//      г. обновить данные в массиве
//      д. обновить данные в таблице
//      е. очистить форму

    
const todosStorage = {
    todos: []
};

// UI Elements
const formCol = document.querySelector('.form-col');
const form = document.forms['addTodoForm'];
const table = document.querySelector('.table tbody');
const title = form.elements['title'];
const text = form.elements['text'];
const btn = document.querySelector('.btn');

// event handling
form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!title.value || !text.value) return alertMessage('alert-danger', 'Введите title и text');

    // если есть аттр data-task-id
    // вызываем функцию editTaskStorage
    // очистка формы и удалить аттр data-task-id
    if (btn.innerHTML === 'Save') {
        editTaskStorage(form.dataset.taskId, title.value, text.value);
        alertMessage('alert-info', 'Задача изминена успешно');
        form.reset();
        btn.innerHTML = 'Add task';
        return;
    }

    addNewTodoToStorage(title.value, text.value);
    alertMessage('alert-info', 'Задача добавлена успешно');
    form.reset();
});

table.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-todo')) {
        const id = event.target.closest('[data-id]').dataset.id;
        deleteTodoFromStorage(id);
        alertMessage('alert-info', 'Задача удалена успешно');
        return;
    }

    if (event.target.classList.contains('edit-todo')) {
        const id = event.target.closest('[data-id]').dataset.id;
        setFormtoEdit(id);
        return;
    }
});


// alert messages
/**
 * 
 * @param {String} className 
 * @param {String} message 
 */
function alertMessage(className, message) {
    removeAlert();

    const template = alertTemplate(className, message);
    formCol.insertAdjacentHTML('afterbegin', template);

    setTimeout(removeAlert, 2000);
}

function removeAlert() {
    const currentAlert = document.querySelector('.alert');
    if (currentAlert) formCol.removeChild(currentAlert);
}

   
/**
* generateId - создает произвольную строку 
* @returns {string} - новый id
*/
function generateId() {
    const uniqueValues = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    let id = '';

    for (let char of uniqueValues) {
        let index = Math.floor(Math.random() * uniqueValues.length);
        id += uniqueValues[index];
    }
 
    return id;
 }


/**
* addNewTodoToStorage - добавляет новый todo в storage а потом в view
* @param {String} title 
* @param {String} text
* @returns {[]} todo
*/
function addNewTodoToStorage(title, text) {
    if (!title) return console.log('Please provide todo title');
    if (!text) return console.log('Please provide todo text');

    const newTodo = {title, text, id: generateId()};
    todosStorage.todos.push(newTodo);

    // Добавим в разметку
    addNewTodoToView(newTodo);

    return todosStorage.todos;
 }

 /**
* 
* @param {String} id 
* @returns {[]} todo
*/
function deleteTodoFromStorage(id) {
    const checkIdRes = checkId(id);
    if (checkIdRes.error) return console.log(checkIdRes.msg);
    
    let removedTask;

    for (let i = 0; i < todosStorage.todos.length; i++) {
        if (todosStorage.todos[i].id === id) {
            removedTask = todosStorage.todos.splice(i, 1);
            break;
        }
    }

    // удаляем с разметки
    deleteTodoFromView(id);
    
    return removedTask;
 }

/**
 * 
 * @param {String} id 
 */
function checkId(id) {
    if (!id) return { error: true, msg: 'Передайте id.' };

    const idIsPresent = todosStorage.todos.some((todo) => todo.id === id );
    if (!idIsPresent) return { error: true, msg: 'Задачи с таким id несуществуе' };

    return { error: false, msg: '' };
}

// View functions

/**
 * 
 * @param {String} id 
 */
function deleteTodoFromView(id) {
    const target = document.querySelector(`[data-id="${id}"]`);
    target.parentElement.removeChild(target);
}

/**
 * 
 * @param {*} task 
 */
function addNewTodoToView(todo) {
    const template = todoTemplate(todo);
    table.insertAdjacentHTML('afterbegin', template);
}

function editTodoInView(id, todo) {
    for (let tr of table.children) {
        if (tr.dataset.id === id) {
            tr.innerHTML = todoTemplate(todo);
        }
    }
}

/**
 * 
 * @param {*} todo 
 * todo {
 *  id: string;
 *  title: string;
 *  text: string;
 * }
 */
function todoTemplate(todo) {
    return `
        <tr data-id="${todo.id}"> 
            <td>${todo.title}</td>
            <td>${todo.text}</td>
            <td>
                <i class="fas fa-trash remove-todo"></i>
                <i class="fas fa-edit edit-todo"></i>
            </td>
        </tr>
    `;
}

/**
 * 
 * @param {String} className 
 * @param {String} message 
 */
function alertTemplate(className, message) {
    return `
        <div class="alert ${className}">${message}</div>
    `;
}

addNewTodoToStorage('My title 1', 'My text 1');


// Make editing work

/**
 * 
 * @param {String} id 
 * @param {String} title 
 * @param {String} text 
 */
function editTaskStorage(id, title, text) {
    if (id && text && title) {
        for (let task of todosStorage.todos) {
            if (task.id === id) {
                task.title = title;
                task.text = text;
                const editedTodo = {title, text, id};
                editTodoInView(id, editedTodo);
                break;
            } else {
                console.log(`Задачи с таким id = ${id} нету`);
            }
        }
    } else {
        alertMessage('alert-danger', 'Введите title и text');
    }

    return todosStorage.todos;
}

/**
 *
 * @param id
 * @return {*}
 */
function setFormtoEdit(id) {
    const checkIdRes = checkId(id);
    if (checkIdRes.error) return console.log(checkIdRes.msg);
    for (let i = 0; i < todosStorage.todos.length; i++) {
        if (todosStorage.todos[i].id === id) {
            title.value = todosStorage.todos[i].title;
            text.value = todosStorage.todos[i].text;
            btn.innerHTML = 'Save';
            form.dataset.taskId = id;
            break;
        }
    }
    return "edited";
}