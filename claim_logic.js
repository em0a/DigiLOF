document.addEventListener('DOMContentLoaded', function () {
    // Fetch items from localStorage
    let logData = JSON.parse(localStorage.getItem('scannedItems')) || [];

    // Function to render the items
    function renderItems(items) {
        const itemsList = document.getElementById('itemsList');
        itemsList.innerHTML = ''; // Clear current list

        const userName = document.getElementById('userName').value.trim();

        // If no name is entered, display a message and disable the buttons
        if (!userName) {
            itemsList.innerHTML = '<p>Please enter your name to claim items or search.</p>';
            disableClaimButton();
            return;
        }

        // Enable Claim Button and Search Bar if a name is entered
        enableClaimButton();

        if (items.length === 0) {
            itemsList.innerHTML = '<p>No items available.</p>';
        } else {
            items.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';
                itemDiv.innerHTML = `
                    <img src="${item.photo}" alt="${item.name}">
                    <div class="item-details">
                        <strong>Item Name:</strong> 
                        <span id="item-name-${index}" class="item-name">${item.name}</span> 
                        <br>
                        <strong>Submitted by:</strong> 
                        <span>${item.submittedBy}</span>
                        <br>
                        <strong>Timestamp:</strong> 
                        <span>${item.timestamp}</span>
                        <br>
                        <button id="claimBtn-${index}" onclick="claimItem(${index})" >Claim Item</button>
                    </div>
                `;
                itemsList.appendChild(itemDiv);
            });
        }
    }

    // Disable the Claim Button if no name is entered
    function disableClaimButton() {
        const claimButtons = document.querySelectorAll('button');
        claimButtons.forEach(button => {
            button.disabled = true;
        });
    }

    // Enable the Claim Button if a name is entered
    function enableClaimButton() {
        const claimButtons = document.querySelectorAll('button');
        claimButtons.forEach(button => {
            button.disabled = false;
        });
    }

    // Function for filtering items by name
    function filterItems() {
        const searchTerm = document.getElementById('searchBox').value.toLowerCase();
        const filteredItems = logData.filter(item => item.name.toLowerCase().includes(searchTerm));
        renderItems(filteredItems); // Render the filtered items
    }

    // Enable/disable Claim Item button and Search Bar when a name is entered
    document.getElementById('userName').addEventListener('input', function () {
        const userName = this.value.trim();
        const claimButtons = document.querySelectorAll('button');
        const searchBox = document.getElementById('searchBox');

        // Enable/Disable Claim Item buttons and Search bar based on user name input
        claimButtons.forEach(button => {
            if (userName.length > 0) {
                button.disabled = false; // Enable button when name is entered
            } else {
                button.disabled = true;  // Disable button if no name entered
            }
        });

        // Enable search bar when name is entered
        if (userName.length > 0) {
            searchBox.disabled = false;  // Enable the search bar when name is entered
        } else {
            searchBox.disabled = true;  // Disable the search bar if no name entered
        }
    });

    // Claim an item
    window.claimItem = function(index) {
        const userName = document.getElementById('userName').value.trim();

        if (!userName) {
            alert('Please enter your name before claiming an item.');
            return;
        }

        // Log to confirm the function is triggered
        console.log(`Claiming item at index: ${index}`);

        // Ensure the item exists
        if (logData[index]) {
            console.log('Item to claim:', logData[index]);

            // Remove the claimed item from the list
            const claimedItem = logData.splice(index, 1)[0]; // Remove the item from the array
            localStorage.setItem('scannedItems', JSON.stringify(logData)); // Update localStorage

            console.log('Claimed Item:', claimedItem);

            alert(`You claimed the item: ${claimedItem.name}`);
            renderItems(logData); // Re-render the updated list of items
        } else {
            console.error('Item not found!');
        }
    };

    // Initial render of all items
    renderItems(logData);

    // Attach the search functionality
    document.getElementById('searchBox').addEventListener('input', filterItems);
});
