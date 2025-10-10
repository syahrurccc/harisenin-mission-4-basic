const qs = (el) => document.querySelector(el);

document.addEventListener('DOMContentLoaded', () => {

    const { lists, buttons } = selectQuery();

    loadUserProfile();
    loadTasks(lists);

    qs('#nameEditBtn').addEventListener('click', () => editName());
    qs('#positionEditBtn').addEventListener('click', () => editPosition());
    qs('#addTask').addEventListener('submit', (event) => addTask(event, lists));
    qs('#task-lists').addEventListener('click', (event) => deleteTask(event));
    qs('#delete-all-btn').addEventListener('click', () => deleteAllTasks());
    Object.entries(buttons).forEach(([type, el]) => {
        el.addEventListener('click', () => taskView(`${type}Tasks`, lists, buttons));
    });
    Object.entries(lists).forEach(([type, el]) =>{
        el.addEventListener('change', (e) => markAsDone(e, type, lists));
    });
    
    taskView('activeTasks', lists, buttons);
});

function selectQuery () {

    const lists = {
        active: qs('#activeTasksList'),
        overdue: qs('#overdueTasksList'),
        completed: qs('#completedTasksList')
    }

    const buttons = {
        active: qs('#activeTasksBtn'),
        overdue: qs('#overdueTasksBtn'),
        completed: qs('#completedTasksBtn')
    }
    
    return { lists, buttons };
}

function isOverdue (dueDate) {
    
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due < today;
}

function loadTasks (lists) {

    const tasksJSON = localStorage.getItem('tasks');

    if (tasksJSON) {
        const tasks = JSON.parse(tasksJSON);
        tasks.forEach(t => {
            const task = t.text
            const dueDate = t.dueDate
            const priority = t.priority
            const checked = t.completed
            const li = buildTaskList(task, dueDate, priority, checked);
            checked ? 
            lists.completed.append(li) 
            : isOverdue(dueDate) 
            ? lists.overdue.append(li) : lists.active.append(li);
        });
    }
}

function loadUserProfile () {
    
    const userProfileJSON = localStorage.getItem('userProfile');
    const userProfile = userProfileJSON ? JSON.parse(userProfileJSON) : [];
    qs('#nameForm').textContent = userProfile.name ? userProfile.name : 'David Heinemeier Hansson';
    qs('#positionForm').textContent = userProfile.position ? userProfile.position : 'Chief Executive Officer';
}

function taskView (view, lists, buttons) {

    lists.active.style.display = 'none';
    lists.overdue.style.display = 'none';
    lists.completed.style.display = 'none';

    qs(`#${view}List`).style.display = 'block';

    Object.entries(buttons).forEach(([_, btn]) => {
        if (btn.id === `${view}Btn`) {
            btn.classList = [
                'flex-1 px-4 py-1 rounded-full border-2 border-white bg-white', 
                'text-black font-bold hover:cursor-pointer text-center'
                ].join(' ');
        } else {
            btn.classList = [
                'flex-1 px-4 py-1 rounded-full border-2 border-white text-white',
                'font-bold hover:bg-white hover:text-black hover:cursor-pointer',
                'transition-colors duration-200 text-center'
                ].join(' ');
        }
    })
}

function buildTaskList (task, dueDate, priority, checked) {

    const d = new Date(dueDate);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    const displayDate = `${mm}/${dd}/${yyyy}`;

    const getPriorityClasses = (priority) => {
        if (priority === 'high')   return 'text-red-300 border-red-500';
        if (priority === 'medium') return 'text-amber-300 border-amber-500 bg-amber-500/10';
        return 'text-green-300 border-green-500 bg-green-500/10';
    };

    const li = document.createElement('li');
    li.dataset.date = dueDate;
    li.className = [
        'task group flex items-center justify-between gap-3',
        'rounded-xl bg-gray-700 px-4 py-3',
        'shadow-sm hover:shadow-lg transition-shadow'
        ].join(' ');

    li.innerHTML = `
        <div class="task-name flex items-center gap-3 min-w-0">
            <input type="checkbox"
            class="peer size-3 shrink-0 rounded-md border border-gray-500/50 bg-gray-800
                checked:bg-blue-600 checked:border-blue-600 hover:cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                ${checked ? 'checked' : ''} 
            />
            <span class="text-white text-base truncate peer-checked:text-white/50 peer-checked:line-through">
            ${task}
            </span>
        </div>

        <div class="task-details flex items-center gap-3 shrink-0">
            <span class="hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5
                            text-xs text-gray-300 bg-gray-700/60 border border-gray-600/40">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                    class="w-3.5 h-3.5 opacity-80">
                    <path d="M6 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 1 1 2 0v1zM3 8h14v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8z"/>
                </svg>
                ${displayDate}
            </span>

            <span class="priority-level inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getPriorityClasses(priority.toLowerCase())}">
                ${priority}
            </span>

            <button 
                class="delete-btn ml-1 p-1 rounded-full text-gray-400 hover:text-red-400 hover:cursor-pointer hover:bg-red-500/10 transition-colors duration-200"
                title="Delete task"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>
        `;

    return li;
}

function addTask (event, lists) {

    event.preventDefault();

    const task = qs('#taskName').value;
    const dueDate = qs('#dueDate').value;
    const priority = qs('#priorityLevel').value;

    if (!task || !dueDate || !priority) return;
    
    const li = buildTaskList(task, dueDate, priority);
    
    isOverdue(dueDate) ? lists.overdue.append(li) : lists.active.append(li);
    
    saveTasks();

    qs('#addTask').reset();
}

function markAsDone (event, taskType, lists) {

    const taskEl = event.target.closest('li');
    if (!taskEl) return;
    const overdue = isOverdue(taskEl.dataset.date);
    const isCompleted = taskType === 'completed';

    // if element came from completed page check the due date before returning
    // else put tasks to completed when checked
    if (isCompleted && !overdue) {
        lists.active.append(taskEl);
    } else if (isCompleted && overdue) {
        lists.overdue.append(taskEl);
    } else {
        lists.completed.append(taskEl);
    }

    saveTasks();
}

function deleteTask (event) {

    const delBtn = event.target.closest('.delete-btn');
    if (!delBtn) return;
    const li = delBtn.closest('li');
    li.remove();
    saveTasks();
}

function deleteAllTasks () {

    const taskLists = qs('#task-lists');
    const tasks = taskLists.querySelectorAll('li');

    const confirmation = confirm('Are you sure? This action will delete all tasks including completed ones.');
    if (confirmation) {
        tasks.forEach(t => t.remove());
        saveTasks();
    } else {
        return;
    }
}

function saveTasks () {

    const { lists,_ } = selectQuery();

    const activeTasksArr = Array.from(lists.active.querySelectorAll('li'));
    const overdueTasksArr = Array.from(lists.overdue.querySelectorAll('li'));
    const completedTasksArr = Array.from(lists.completed.querySelectorAll('li'));
    const taskList = [...activeTasksArr, ...overdueTasksArr, ...completedTasksArr];

    const tasks = taskList.map(li => ({
        text: li.querySelector('.task-name span').textContent,
        completed: li.querySelector('.task-name input').checked,
        dueDate: li.dataset.date,
        priority: li.querySelector('.task-details .priority-level').textContent
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveProfile () {

    const profile = {
        name: qs('#nameForm').textContent,
        position: qs('#positionForm').textContent
    }
    localStorage.setItem('userProfile', JSON.stringify(profile));
}

function saveEditSVG () {

    const svgNS = 'http://www.w3.org/2000/svg';
    const saveEditSVG = document.createElementNS(svgNS, 'svg');
    saveEditSVG.setAttribute('xmlns', svgNS);
    saveEditSVG.setAttribute('fill', 'none');
    saveEditSVG.setAttribute('viewBox', '0 0 24 24');
    saveEditSVG.setAttribute('stroke-width', '1.5');
    saveEditSVG.setAttribute('stroke', 'white');
    saveEditSVG.setAttribute('class', 'inline w-5 h-5 hover:stroke-blue-400 hover:cursor-pointer');

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute(
    'd',
    'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
    );

    saveEditSVG.appendChild(path);
    return saveEditSVG;
}

function editName () {
    
    const nameEl = qs('#nameForm');
    const oldNameText = nameEl.textContent;
    const editBtn = qs('#nameEditBtn');

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.classList = [
        'inline px-2 rounded-full bg-gray-700 text-white placeholder-gray-400', 
        'focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1'
        ].join(' ');
    nameInput.value = oldNameText;
    const saveBtn = saveEditSVG().cloneNode(true);
    saveBtn.id = 'save-name-edit';

    nameEl.replaceWith(nameInput);
    editBtn.replaceWith(saveBtn);

    saveBtn.onclick = () => {
        nameEl.textContent = nameInput.value;
        nameInput.replaceWith(nameEl);
        saveBtn.replaceWith(editBtn);

        saveProfile();
        editBtn.onclick = () => editName(saveEditSVG);
    }
}

function editPosition () {

    const positionEl = qs('#positionForm');
    const oldPositionText = positionEl.textContent;
    const editBtn = qs('#positionEditBtn');

    const positionInput = document.createElement('input');
    positionInput.type = 'text';
    positionInput.classList = [
        'inline px-2 rounded-full bg-gray-700 text-white placeholder-gray-400', 
        'focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1'
        ].join(' ');
    positionInput.value = oldPositionText;
    const saveBtn = saveEditSVG().cloneNode(true);
    saveBtn.id = 'save-position-edit';

    positionEl.replaceWith(positionInput);
    editBtn.replaceWith(saveBtn);

    saveBtn.onclick = () => {
        positionEl.textContent = positionInput.value;
        positionInput.replaceWith(positionEl);
        saveBtn.replaceWith(editBtn);

        saveProfile();
        editBtn.onclick = () => editPosition(saveEditSVG);
    }
}



