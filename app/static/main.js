const API = "/items";

async function loadItems() {
    try {
      const response = await fetch('/items/');
      if (!response.ok) throw new Error('Błąd ładowania');
  
      const items = await response.json();
  
      const itemsList = document.getElementById('items-list');
      itemsList.innerHTML = '';
  
      if (items.length === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.textContent = 'Brak elementów';
        emptyLi.classList.add('empty');
        itemsList.appendChild(emptyLi);
        return;
      }
  
      items.forEach(item => {
        const li = document.createElement('li');
  
        // kontener na nazwę i opis
        const contentDiv = document.createElement('div');
        contentDiv.className = 'item-content';
  
        const nameDiv = document.createElement('div');
        nameDiv.className = 'item-name';
        nameDiv.textContent = item.name;
  
        const descDiv = document.createElement('div');
        descDiv.className = 'item-description';
        descDiv.textContent = item.description || '';
  
        contentDiv.appendChild(nameDiv);
        contentDiv.appendChild(descDiv);
  
        // przycisk usuń
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';
        deleteBtn.textContent = 'Usuń';
        deleteBtn.addEventListener('click', () => deleteItem(item.id));
  
        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
  
        itemsList.appendChild(li);
      });
  
    } catch (error) {
      console.error(error);
    }
  }
  


  document.getElementById('add-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('item-name');
    const descInput = document.getElementById('item-description');

    const newItem = {
        name: nameInput.value.trim(),
        description: descInput.value.trim()
    };

    if (!newItem.name) {
        alert('Nazwa jest wymagana');
        return;
    }

    try {
        const response = await fetch('/items/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });

        if (!response.ok) throw new Error('Błąd dodawania itemu');

        // Wyczyść formularz po dodaniu
        nameInput.value = '';
        descInput.value = '';

        // Załaduj ponownie listę
        loadItems();

    } catch (error) {
        console.error(error);
        alert('Coś poszło nie tak przy dodawaniu');
    }
});


async function deleteItem(id){
    await fetch(`${API}/${id}`, {method: "DELETE"});
    loadItems();
}

loadItems();