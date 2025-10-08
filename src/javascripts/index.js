document.addEventListener('DOMContentLoaded', () => {

    const userProfileJSON = localStorage.getItem('userProfile');
    const activeTasksJSON = localStorage.getItem('activeTasks');
    const completedTasksJSON = localStorage.getItem('completedTasks');
    const activeTasksList = document.querySelector('#activeTasksList');
    const overdueTasksList = document.querySelector('#overdueTasksList');
    const completedTasksList = document.querySelector('#completedTasksList');

    if (userProfileJSON) {
        const userProfile = JSON.parse(userProfileJSON);
    }
    
    document.querySelector('#nameForm').textContent = userProfileJSON ? userProfile.Name : 'David Heinemeier Hansson (DHH)';
    document.querySelector('#positionForm').textContent = userProfileJSON ? userProfile.Position : 'Chief Executive Officer';
    document.querySelector('#avatar').src = userProfileJSON ? userProfile.profileSource : '../img/profile.jpg';

    if (activeTasksJSON) {
        const tasks = JSON.parse(activeTasksJSON);
        tasks.forEach(t => {
            const task = t.text
            const dueDate = t.dueDate
            const priority = t.priority
            const checked = t.completed
            const li = buildTaskList(task, dueDate, priority, checked);
            isOverdue(dueDate) ? overdueTasksList.append(li) : activeTasksList.append(li);
        });
    }

    if (completedTasksJSON) {
        const tasks = JSON.parse(completedTasksJSON);
        tasks.forEach(t => {
            const task = t.text
            const dueDate = t.dueDate
            const priority = t.priority
            const checked = t.completed
            const li = buildTaskList(task, dueDate, priority, checked);
            completedTasksList.append(li);
        });
    }

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

    document.querySelector('#nameEditBtn').addEventListener('click', () => editName(saveEditSVG));
    document.querySelector('#positionEditBtn').addEventListener('click', () => editPosition(saveEditSVG));
    document.querySelector('#profileEditBtn').addEventListener('click', () => editProfile(saveEditSVG));
    document.querySelector('#addTask').addEventListener('submit', addTask);
    document.querySelector('#activeTasksBtn').addEventListener('click', () => taskView('activeTasks'));
    document.querySelector('#overdueTasksBtn').addEventListener('click', () => taskView('overdueTasks'));
    document.querySelector('#completedTasksBtn').addEventListener('click', () => taskView('completedTasks'));
    document.querySelector('#activeTasksList').addEventListener('change', (event) => {
        const taskEl = event.target.closest('li');
        if (!taskEl) return;
        completedTasksList.prepend(taskEl);
        saveTasks('completedTasks', completedTasksList);
    })
    document.querySelector('#completedTasksList').addEventListener('change', (event) => {
        const taskEl = event.target.closest('li');
        if (!taskEl) return;
        activeTasksList.prepend(li);
        saveTasks('activeTasks', activeTasksList);
    })

    taskView('activeTasks');
});

function isOverdue (dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due < today;
}

function saveTasks (taskType, taskList) {

    const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
        text: li.querySelector('.task-name span').textContent,
        completed: li.querySelector('.task-name input').checked,
        dueDate: li.dataset.date,
        priority: li.querySelector('.task-details .priority-level').textContent
    }));
    localStorage.setItem(`${taskType}`, JSON.stringify(tasks));
}

function saveProfile () {

    const profile = {
        img: document.querySelector('#avatar').src,
        name: document.querySelector('#nameForm').textContent,
        Position: document.querySelector('#positionForm').textContent
    }
    localStorage.setItem('userProfile', JSON.stringify(profile));
}

function editName (saveEditSVG) {
    
    const nameEl = document.querySelector('#nameForm');
    const oldNameText = nameEl.textContent;
    const editBtn = document.querySelector('#nameEditBtn');

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.classList = [
        'inline px-2 rounded-full bg-gray-700 text-white placeholder-gray-400', 
        'focus:outline-none focus:ring-2 focus:ring-blue-500'
        ].join(' ');
    nameInput.value = oldNameText;

    nameEl.replaceWith(nameInput);
    saveEditSVG.setAttribute('id', 'saveNameEdit');
    editBtn.replaceWith(saveEditSVG);
    const saveEditBtn = document.querySelector('#saveNameEdit');

    saveEditBtn.onclick = () => {
        nameEl.textContent = nameInput.value;
        nameInput.replaceWith(nameEl);

        saveEditBtn.replaceWith(editBtn);
        editBtn.onclick = () => editName(saveEditSVG);
    }
}

function editPosition (saveEditSVG) {

}

function editProfile (saveEditSVG) {

}

function addTask (event) {

    event.preventDefault();

    const task = document.querySelector('#taskName').value;
    const dueDate = document.querySelector('#dueDate').value;
    const priority = document.querySelector('#priorityLevel').value;

    if (!task || !dueDate || !priority) return;
    if (isOverdue(dueDate)) return;

    const li = buildTaskList(task, dueDate, priority);
    
    const activeTasksList = document.querySelector('#activeTasksList');
    activeTasksList.append(li);
    // saveTasks('activeTask', activeTasksList);
    
    document.querySelector('#addTask').reset();
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
            class="peer size-4 shrink-0 rounded-md border border-gray-500/50 bg-gray-800
                checked:bg-blue-600 checked:border-blue-600 hover:cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                ${checked ? 'checked' : ''} 
            />
            <span class="text-white text-lg truncate peer-checked:text-white/50 peer-checked:line-through">
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

    li.querySelector('.delete-btn').addEventListener('click', () => li.remove());
    return li;
}

function taskView (view) {

    document.querySelector('#activeTasksList').style.display = 'none';
    document.querySelector('#overdueTasksList').style.display = 'none';
    document.querySelector('#completedTasksList').style.display = 'none';

    document.querySelector(`#${view}List`).style.display = 'block';

    const buttons = document.querySelectorAll('#viewTasksBtn button');

    buttons.forEach((btn) => {
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