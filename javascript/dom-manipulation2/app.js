// TODO: Data validation – guest with blank field
// Todo: Reject duplicate names
// Todo: If users checked box we can change it to Confirmed
// Todo: Text area to discribe every intitation
// Todo: Add option to mark as not comming (select element not checkbox)
// Todo: Remove Confirmed when filtering

document.addEventListener('DOMContentLoaded', () => {
    "use strict";
	const form = document.getElementById('registrar');
	const input = form.querySelector('input');
	const mainDiv = document.querySelector('.main');
	const ul = document.getElementById('invitedList');

	const div = document.createElement('div');
	const filterLabel = document.createElement('label');
	const filterCheckbox = document.createElement('input');

	filterCheckbox.type = 'checkbox';
	filterLabel.textContent = "Hide those who haven't responded";
	div.appendChild(filterLabel);
	div.appendChild(filterCheckbox);
	mainDiv.insertBefore(div, ul);

	if (supportsLocalStorage()) {
		let invites = getInvites();
		invites.forEach( (invite) => {
			const text = invite.name;
			const selected = invite.confirmed;
			const li = createLI(text, selected);
			ul.appendChild(li);
		});
	}

	filterCheckbox.addEventListener('change', (e) => {
		const isChecked = e.target.checked;
		const lis = ul.children;
		if (isChecked) {
			for (let li of lis) {
				if (li.className === 'responded') {
					li.style.display = '';
				} else {
					li.style.display = 'none';
				}
			}
		} else {
			for (let li of lis) {
				li.style.display = '';
			}
		}
	});

	// Local Storage handling functions
	function supportsLocalStorage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch(e) {
            return false;
        }
    }

    function getInvites() {
		let invites = localStorage.getItem('invites');
		if (invites) {
			return JSON.parse(invites);
		} else {
			return [];
		}
    }

    function findInviteInLS(name) {
        const invites = getInvites();
        return invites.find( element => element['name'] === name );
    }

    function findInviteIndexInLS(name) {
        const invites = getInvites();
        return invites.findIndex(invite => invite['name'] === name);
    }

    // invites = {'name': 'JANUSZ', 'confirmed': true/false}

	function updateLS(invites) {
		localStorage.setItem('invites', JSON.stringify(invites));
	}

    function addInviteToLS(name, confirmed) {
        const invites = getInvites();
        if(name && !findInviteInLS(name)) {
            invites.push({
					'name': name,
					'confirmed': confirmed
				});
            updateLS(invites);
        }
    }

    function deleteInviteFromLS(name) {
        const invites = getInvites();
        const index = findInviteIndexInLS(name);
        if (name && index) {
        	invites.splice(index, 1);
        	updateLS(invites);
		}
    }

    function updateInviteInLS(name, old_name, confirmed) {
		const invites = getInvites();
		if (!old_name) {
			old_name = name;
		}
		let thisInvite = findInviteInLS(old_name);
		const index = findInviteIndexInLS(old_name);
		if (name && thisInvite) {
			thisInvite = {
				'name': name,
				'confirmed': confirmed
			};
			invites[index] = thisInvite;
			updateLS(invites);
		}
    }

    // === End local storage ===

	function createLI(text, checked=false) {
		function createElement(elementName, property, value) {
			const element = document.createElement(elementName);
			element[property] = value;
			return element;
		}

		function appendToLI(elementName, property, value) {
			const element = createElement(elementName, property, value);
			li.appendChild(element);
			return element;
		}

		const li = document.createElement('li');
		appendToLI('span', 'textContent', text);
		const label = appendToLI('label', 'textContent', 'Confirmed');
		const input = createElement('input', 'type', 'checkbox');
		input.checked = checked;
		label.appendChild(input);
		appendToLI('button', 'textContent', 'Edit');
		appendToLI('button', 'textContent', 'Remove');

        if (!checked) {
            li.className = '';
        } else {
            li.className = 'responded';
        }

		return li;
	}

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const text = input.value;
		input.value = '';

        for (let item of ul.children) {
            if (item.querySelector('span') === text) {
                return
			}
        }

        const li = createLI(text);
        ul.appendChild(li);
        addInviteToLS(text, false);
	});

	ul.addEventListener('change', (e) => {
		if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
			let name;
            try {
            	name = e.target.parentNode.previousElementSibling.textContent;
            } catch (exception) {
            	name = e.target.parentNode.previousSibling.value;
            }
            const status = e.target.checked;
            const li = e.target.parentNode.parentNode;

            if (!status) {
                li.className = '';
            } else {
                li.className = 'responded';
            }

            updateInviteInLS(name, name, status);
		}
	});

    var tempEditName;

	ul.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
			const button = e.target;
			const action = button.textContent;
			const li = button.parentNode;
			const ul = li.parentNode;
			const nameActions = {
				Remove: () => {
					ul.removeChild(li);
					deleteInviteFromLS(li.querySelector('span'));
				},
				Edit: () => {
					const span = li.firstElementChild;
					const input = document.createElement('input');
					const text = span.textContent;
                    tempEditName = text;
					input.type = 'text';
					input.value = text;
					li.insertBefore(input, span);
					li.removeChild(span);
					button.textContent = 'Save';
				},
				Save: () => {
					const input = li.firstElementChild;
					const span = document.createElement('span');
					span.textContent = input.value;
					li.insertBefore(span, input);
					li.removeChild(input);
					button.textContent = 'Edit';
                    const status = li.querySelector('input').checked;
                    updateInviteInLS(span.textContent, tempEditName, status);
				}
			};

			// select and run action in button's name
			nameActions[action]();
		}
	});
});