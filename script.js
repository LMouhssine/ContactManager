document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const contactList = document.getElementById('contact-list');
    const searchInput = document.getElementById('search');
    let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    let editingContactId = null;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput.value;
        const phone = phoneInput.value;
        const email = emailInput.value;

        if (editingContactId === null) {
            addContact(name, phone, email);
        } else {
            updateContact(editingContactId, name, phone, email);
        }

        contactForm.reset();
        editingContactId = null;
        displayContacts();
    });

    contactList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const id = e.target.closest('li').dataset.id;
            deleteContact(id);
        } else if (e.target.classList.contains('edit')) {
            const id = e.target.closest('li').dataset.id;
            editContact(id);
        }
    });

    searchInput.addEventListener('input', () => {
        displayContacts();
    });

    function addContact(name, phone, email) {
        const contact = {
            id: Date.now().toString(),
            name,
            phone,
            email
        };
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    function updateContact(id, name, phone, email) {
        const contact = contacts.find(contact => contact.id === id);
        contact.name = name;
        contact.phone = phone;
        contact.email = email;
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    function deleteContact(id) {
        contacts = contacts.filter(contact => contact.id !== id);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        displayContacts();
    }

    function editContact(id) {
        const contact = contacts.find(contact => contact.id === id);
        nameInput.value = contact.name;
        phoneInput.value = contact.phone;
        emailInput.value = contact.email;
        editingContactId = id;
    }

    function displayContacts() {
        const searchQuery = searchInput.value.toLowerCase();
        contactList.innerHTML = '';

        contacts
            .filter(contact => contact.name.toLowerCase().includes(searchQuery))
            .forEach(contact => {
                const li = document.createElement('li');
                li.dataset.id = contact.id;
                li.innerHTML = `
                    <span>${contact.name} - ${contact.phone} - ${contact.email}</span>
                    <div class="actions">
                        <button class="edit">Modifier</button>
                        <button class="delete">Supprimer</button>
                    </div>
                `;
                contactList.appendChild(li);
            });
    }

    displayContacts();
});
