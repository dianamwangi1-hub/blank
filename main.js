// Get DOM elements
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const itemInput = document.getElementById("itemInput");
const itemPrice = document.getElementById("itemPrice");
const list = document.getElementById("shoppingList");
const totalDisplay = document.getElementById("total");

// Shopping list array
let shoppingList = [];

// Load from localStorage if available
const savedList = localStorage.getItem("shoppingList");
if (savedList) {
  shoppingList = JSON.parse(savedList);
}
displayList();

// Function to render the list
function displayList() {
  list.innerHTML = "";

  shoppingList.forEach((item, index) => {
    // Create item box (NO <li>)
    const box = document.createElement("div");
    box.className = "item-box";

    // Item text
    const textSpan = document.createElement("div");
    textSpan.textContent = `${item.name} - KSh ${item.price}`;
    textSpan.className = "item-text";

    if (item.purchased) {
      textSpan.style.textDecoration = "line-through";
    }

    // Checkbox
    const checkboxContainer = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.purchased;

    const label = document.createElement("label");
    label.textContent = "Purchased";
    label.style.marginLeft = "5px";

    checkbox.addEventListener("change", () => {
      shoppingList[index].purchased = checkbox.checked;
      localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
      renderList();
    });

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    // Save button
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.style.display = "none";

    // Edit functionality
    editBtn.addEventListener("click", () => {
      itemInput.value = item.name;
      itemPrice.value = item.price;

      addBtn.style.display = "none";
      saveBtn.style.display = "inline-block";
      saveBtn.dataset.index = index;
    });

    // Save functionality
    saveBtn.addEventListener("click", () => {
      const name = itemInput.value.trim();
      const price = parseFloat(itemPrice.value);
      const i = saveBtn.dataset.index;

      if (!name || isNaN(price)) return;

      shoppingList[i].name = name;
      shoppingList[i].price = price;

      localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
      displayList();

      itemInput.value = "";
      itemPrice.value = "";
      addBtn.style.display = "inline-block";
      saveBtn.style.display = "none";
    });

    // Append elements into box
    box.appendChild(textSpan);
    box.appendChild(checkboxContainer);
    box.appendChild(editBtn);
    box.appendChild(saveBtn);
    list.appendChild(box);
  });

  // Update total
  const total = shoppingList
    .filter(item => !item.purchased)
    .reduce((acc, item) => acc + item.price, 0);

  totalDisplay.textContent = `KSh ${total}`;

  // Show/hide clear button
  clearBtn.style.display = shoppingList.length ? "inline-block" : "none";
}

// Add button
addBtn.addEventListener("click", () => {
  const name = itemInput.value.trim();
  const price = parseFloat(itemPrice.value);

  if (!name || isNaN(price)) return;

  shoppingList.push({ name, price, purchased: false });
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));

  displayList();

  itemInput.value = "";
  itemPrice.value = "";
});

// Clear button
clearBtn.addEventListener("click", () => {
  shoppingList = [];
  localStorage.removeItem("shoppingList");
  displayList();
});