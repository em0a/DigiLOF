// This logic.js file will be included in all pages as needed.

// Load and display the last item submitted on the homepage
function displayLastItem() {
    const logData = JSON.parse(localStorage.getItem('scannedItems')) || [];
    if (logData.length > 0) {
        const lastItem = logData[logData.length - 1];
        document.getElementById('lastItem').innerHTML = `Last Submitted Item: ${lastItem.name} (Submitted at: ${lastItem.timestamp})`;
    } else {
        document.getElementById('lastItem').innerHTML = 'No items submitted yet.';
    }
}

// Display items in the view page
function displayItems() {
    const itemsList = document.getElementById('itemsList');
    const logData = JSON.parse(localStorage.getItem('scannedItems')) || [];

    if (logData.length === 0) {
        itemsList.innerHTML = '<p>No items found.</p>';
    } else {
        logData.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.innerHTML = `
                <strong>${item.name}</strong> - <img src="${item.photo}" alt="${item.name}" style="width: 100px; height: auto;"> 
                (Scanned at: ${item.timestamp})
                <button onclick="editItem(${index})">Edit</button>
                <button onclick="deleteItem(${index})">Delete</button>
            `;
            itemsList.appendChild(itemDiv);
        });
    }
}

// Edit an item (on the view page or submit item page)
function editItem(index) {
    const logData = JSON.parse(localStorage.getItem('scannedItems')) || [];
    const item = logData[index];
    // Fill in the existing item details for editing
    document.getElementById('itemName').value = item.name;
    document.getElementById('saveItemButton').onclick = function () {
        item.name = document.getElementById('itemName').value;
        logData[index] = item;
        localStorage.setItem('scannedItems', JSON.stringify(logData));
        alert('Item updated!');
        window.location.href = 'view_items.html';  // Go back to the view items page
    };
}

// Delete an item
function deleteItem(index) {
    let logData = JSON.parse(localStorage.getItem('scannedItems')) || [];
    logData.splice(index, 1);  // Remove the item at the specified index
    localStorage.setItem('scannedItems', JSON.stringify(logData)); // Save updated data
    window.location.reload(); // Reload the page to reflect the changes
}

// Call display functions on respective pages
if (document.getElementById('lastItem')) {
    displayLastItem();
}

if (document.getElementById('itemsList')) {
    displayItems();
}
