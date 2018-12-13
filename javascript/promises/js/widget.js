function getJSON(url) {
    return new Promise( (resolve, reject) => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = handleResponse;
        request.onerror = (error) => reject(error);
        request.open('GET', url);
        request.send();

        function handleResponse() {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    const employees = JSON.parse(request.responseText);
                    addEmployeesToPage(employees);
                    resolve(employees);
                }
                else {
                    reject(this.status);
                }

            }
        }
    });
}

function generateListItems(employees) {
    let statusHTML = '';
    employees.forEach( (e) => {
        if (e.inoffice) {
            statusHTML += '<li class="in">';
        } else {
            statusHTML += '<li class="out">';
        }
        statusHTML += e.name + "</li>";
    });

    return statusHTML
}

function generateUnorderedList(listItems) {
    return '<ul class="bulleted">' + listItems + '</ul>';
}

function addEmployeesToPage(unorderedList) {
    document.getElementById('employeeList').innerHTML = unorderedList;
}

getJSON('data/employees.json')
    .then(generateListItems)
    .then(generateUnorderedList)
    .then(addEmployeesToPage)
    .catch( (e) => console.log(e) );

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