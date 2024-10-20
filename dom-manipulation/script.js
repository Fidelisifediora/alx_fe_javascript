let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.textContent = `${quotes[randomIndex].text} - ${quotes[randomIndex].category}`;
    } else {
        quoteDisplay.textContent = 'No quotes available.';
    }
}

// Function to create the add quote form
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteButton">Add Quote</button>
        <select id="categoryFilter" onchange="filterQuotes()">
            <option value="all">All Categories</option>
        </select>
    `;
    document.body.appendChild(formContainer);
    populateCategories(); // Populate categories when form is created

    // Add event listener for adding a quote
    document.getElementById('addQuoteButton').addEventListener('click', addQuote);
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes(); // Save to local storage
        showRandomQuote(); // Update the display
        populateCategories(); // Update categories dropdown
        clearInputFields(); // Clear input fields
        postQuoteToServer(newQuote); // Post the new quote to the server
    } else {
        alert('Please fill in both fields.');
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Clear input fields after adding a quote
function clearInputFields() {
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
}

// Function to populate categories in the dropdown menu
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    // Clear existing options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Populate unique categories
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore last selected category from local storage
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
    }
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.textContent = filteredQuotes.length > 0 ? `${filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text} - ${filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].category}` : 'No quotes available for this category.';

    // Save the last selected category to local storage
    localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Event listener for showing a new random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Replace with actual API if needed
        const serverQuotes = await response.json();
        return serverQuotes.map(quote => ({
            text: quote.title,
            category: 'Server'
        }));
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
    }
}

// Post a new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: quote.text,
                body: quote.category,
                userId: 1
            })
        });
        const data = await response.json();
        console.log('Quote posted to server:', data);
    } catch (error) {
        console.error('Error posting quote to server:', error);
    }
}

// Sync quotes with the server
async function syncQuotes() {
    try {
        const serverQuotes = await fetchQuotesFromServer();
        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

        // Simple conflict resolution: Server data takes precedence
        const mergedQuotes = [...new Set([...localQuotes, ...serverQuotes])];
        localStorage.setItem('quotes', JSON.stringify(mergedQuotes));

        notifyUser('Quotes synced with server. Any conflicts have been resolved.');
    } catch (error) {
        console.error('Error syncing quotes with server:', error);
    }
}

// Function to notify the user
function notifyUser(message) {
    const notificationElement = document.createElement('div');
    notificationElement.textContent = message;
    notificationElement.style.color = 'green';
    notificationElement.style.position = 'fixed';
    notificationElement.style.bottom = '10px';
    notificationElement.style.right = '10px';
    notificationElement.style.backgroundColor = 'white';
    notificationElement.style.padding = '10px';
    notificationElement.style.border = '1px solid green';
    document.body.appendChild(notificationElement);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notificationElement.remove();
    }, 3000);
}

// Periodically sync with server every 30 seconds
setInterval(syncQuotes, 30000); // 30,000 ms = 30 seconds

// Initialize the application
createAddQuoteForm();
showRandomQuote();

 
