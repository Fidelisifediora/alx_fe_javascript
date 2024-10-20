
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Populate categories in dropdown
function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes by selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.textContent = filteredQuotes.length > 0 ? filteredQuotes[0].text : 'No quotes found for this category';
}

// Export quotes to JSON
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';
    downloadLink.click();
}

// Import quotes from JSON
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        const importedQuotes = JSON.parse(e.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Initial setup
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
loadQuotes();
