document.addEventListener('DOMContentLoaded', () => {

    const userProfileJSON = localStorage.getItem('userProfile');
    const tasksJSON = localStorage.getItem('tasks');

    if (userProfileJSON) {
        const userProfile = JSON.parse(userProfileJSON);
    }

    document.querySelector('#nameForm').textContent = userProfileJSON ? userProfile.Name : 'John Doe';
    document.querySelector('#positionForm').textContent = userProfileJSON ? userProfile.Position : 'Cleaning Service';
    document.querySelector('#avatar').src = userProfileJSON ? userProfile.profileSource : 'https://i.pravatar.cc/128';

    if (tasksJSON) {
        const tasks = JSON.parse(tasksJSON);
        tasks.forEach(task => {
            
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
    document.querySelector('#addTask').addEventListener('click', () => addTask());

});

function editName (saveEditSVG) {
    
    const nameEl = document.querySelector('#nameForm');
    const oldNameText = nameEl.textContent;
    const editBtn = document.querySelector('#nameEditBtn');

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.classList = 'inline px-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500';
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

function editPosition () {

}

function editProfile () {

}

function addTask () {

}