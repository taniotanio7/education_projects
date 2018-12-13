const requestWorkers = new XMLHttpRequest();
requestWorkers.onreadystatechange = function () {
    if (requestWorkers.readyState === 4) {
        const employees = JSON.parse(requestWorkers.responseText);
        let statusHTML = '<ul class="bulleted">';
        employees.forEach( (e) => {
            if (e.inoffice) {
                statusHTML += '<li class="in">';
            } else {
                statusHTML += '<li class="out">';
            }
            statusHTML += e.name + "</li>";
        });
        statusHTML += '</ul>';
        document.getElementById('employeeList').innerHTML = statusHTML;
    }
};
requestWorkers.open('GET', 'data/employees.json');
requestWorkers.send();

const requestRooms = new XMLHttpRequest();
requestRooms.onreadystatechange = function () {
    if (requestRooms.readyState === 4) {
        const rooms = JSON.parse(requestRooms.responseText);
        let statusHTML = '<ul class="rooms">';
        rooms.forEach( (e) => {
            if (e.available) {
                statusHTML += '<li class="empty">';
            } else {
                statusHTML += '<li class="full">';
            }
            statusHTML += e.room + "</li>";
        });
        statusHTML += '</ul>';
        document.querySelector('#roomList').innerHTML = statusHTML;
    }
};
requestRooms.open('GET', 'data/rooms.json');
requestRooms.send();