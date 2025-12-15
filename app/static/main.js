async function handleResponse(response) {
    const contentType = response.headers.get("content-type");

    let data = null;
    if (contentType && contentType.includes("application/json")) {
        data = await response.json();
    }

    if (response.ok) {
        return data;
    }

    // FastAPI / Pydantic (422)
    if (response.status === 422 && data?.detail) {
        const messages = data.detail.map(err => {
            const field = err.loc?.[1] || "field";
            return `${field}: ${err.msg}`;
        });

        throw new Error(messages.join("\n"));
    }

    // inne błędy API
    if (data?.detail) {
        throw new Error(data.detail);
    }

    throw new Error("Wystąpił nieznany błąd");
}

//const API = "/items";

async function loadItems() {
    try {
        const response = await fetch("/items/");
        const items = await handleResponse(response);

        const itemsList = document.getElementById("items-list");
        itemsList.innerHTML = "";

        if (items.length === 0) {
            const li = document.createElement("li");
            li.textContent = "Brak elementów";
            li.classList.add("empty");
            itemsList.appendChild(li);
            return;
        }

        items.forEach(item => {
            const li = document.createElement("li");

            const contentDiv = document.createElement("div");
            contentDiv.className = "item-content";

            const nameDiv = document.createElement("div");
            nameDiv.className = "item-name";
            nameDiv.textContent = item.name;

            const descDiv = document.createElement("div");
            descDiv.className = "item-description";
            descDiv.textContent = item.description || "";

            contentDiv.appendChild(nameDiv);
            contentDiv.appendChild(descDiv);

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete";
            deleteBtn.textContent = "Usuń";
            deleteBtn.onclick = () => deleteItem(item.id);

            li.appendChild(contentDiv);
            li.appendChild(deleteBtn);
            itemsList.appendChild(li);
        });

    } catch (err) {
        alert(err.message);
    }
}

document.getElementById("add-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("item-name");
    const descInput = document.getElementById("item-description");

    try {
        const response = await fetch("/items/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: nameInput.value.trim(),
                description: descInput.value.trim()
            })
        });

        await handleResponse(response);

        nameInput.value = "";
        descInput.value = "";
        loadItems();

    } catch (err) {
        alert(err.message);
    }
});

async function deleteItem(id) {
    try {
        const response = await fetch(`/items/${id}`, { method: "DELETE" });
        await handleResponse(response);
        loadItems();
    } catch (err) {
        alert(err.message);
    }
}


loadItems();