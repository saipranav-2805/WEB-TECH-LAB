// Current state
let currentPage = 1;
let currentFilters = {
    search: '',
    category: '',
    sort: '',
    order: ''
};
let totalPages = 1;
let allCategories = [];

// Display message function
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;

    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 3000);
}

// Show loading state
function showLoading() {
    const container = document.getElementById('booksContainer');
    container.innerHTML = '<p>Loading books...</p>';
}

// Update stats
function updateStats(total, page, limit) {
    const statsDiv = document.getElementById('stats');
    const start = ((page - 1) * limit) + 1;
    const end = Math.min(page * limit, total);

    if (total > 0) {
        statsDiv.innerHTML = `Showing ${start} - ${end} of ${total} books`;
    } else {
        statsDiv.innerHTML = 'No books found';
    }
}

// Load categories for dropdown
async function loadCategories() {
    try {
        const response = await fetch('/categories');
        allCategories = await response.json();

        const select = document.getElementById('categoryFilter');
        select.innerHTML = '<option value="">All Categories</option>';

        allCategories.sort().forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load all books with pagination
async function loadAllBooks(page = 1) {
    showLoading();
    currentPage = page;

    try {
        const response = await fetch(`/books?page=${page}&limit=6`);
        const data = await response.json();

        displayBooks(data.books);
        updateStats(data.total, data.page, data.limit);
        setupPagination(data.totalPages, data.page);

        currentFilters = { search: '', category: '', sort: '', order: '' };
    } catch (error) {
        console.error('Error loading books:', error);
        showMessage('Error loading books', 'error');
    }
}

// Search books by title
async function searchByTitle() {
    const searchTerm = document.getElementById('searchTitle').value.trim();

    if (!searchTerm) {
        showMessage('Please enter a search term', 'error');
        return;
    }

    showLoading();
    currentFilters.search = searchTerm;
    currentFilters.category = '';
    currentFilters.sort = '';
    currentFilters.order = '';

    try {
        const response = await fetch(`/books/search?title=${encodeURIComponent(searchTerm)}`);
        const books = await response.json();

        displayBooks(books);
        updateStats(books.length, 1, books.length);
        document.getElementById('pagination').innerHTML = '';

        if (books.length === 0) {
            showMessage('No books found matching your search', 'info');
        }
    } catch (error) {
        console.error('Error searching books:', error);
        showMessage('Error searching books', 'error');
    }
}

// Filter books by category
async function filterByCategory() {
    const category = document.getElementById('categoryFilter').value;

    if (!category) {
        loadAllBooks(1);
        return;
    }

    showLoading();
    currentFilters.category = category;
    currentFilters.search = '';
    currentFilters.sort = '';
    currentFilters.order = '';

    try {
        const response = await fetch(`/books/category/${encodeURIComponent(category)}`);
        const books = await response.json();

        displayBooks(books);
        updateStats(books.length, 1, books.length);
        document.getElementById('pagination').innerHTML = '';

        if (books.length === 0) {
            showMessage('No books found in this category', 'info');
        }
    } catch (error) {
        console.error('Error filtering books:', error);
        showMessage('Error filtering books', 'error');
    }
}

// Sort books
async function sortBooks() {
    const sortValue = document.getElementById('sortBy').value;

    if (!sortValue) {
        loadAllBooks(1);
        return;
    }

    let criteria, order;

    if (sortValue === 'price') {
        criteria = 'price';
        order = 'asc';
    } else if (sortValue === 'price-desc') {
        criteria = 'price';
        order = 'desc';
    } else if (sortValue === 'rating') {
        criteria = 'rating';
        order = 'desc';
    } else if (sortValue === 'rating-asc') {
        criteria = 'rating';
        order = 'asc';
    }

    showLoading();
    currentFilters.sort = criteria;
    currentFilters.order = order;
    currentFilters.search = '';
    currentFilters.category = '';

    try {
        const response = await fetch(`/books/sort/${criteria}?order=${order}`);
        const books = await response.json();

        displayBooks(books);
        updateStats(books.length, 1, books.length);
        document.getElementById('pagination').innerHTML = '';
    } catch (error) {
        console.error('Error sorting books:', error);
        showMessage('Error sorting books', 'error');
    }
}

// Load top rated books
async function loadTopRated() {
    showLoading();
    currentFilters = { search: '', category: '', sort: 'rating', order: 'desc' };

    try {
        const response = await fetch('/books/top');
        const books = await response.json();

        displayBooks(books);
        updateStats(books.length, 1, books.length);
        document.getElementById('pagination').innerHTML = '';

        showMessage('Showing top rated books (rating ≥ 4)', 'info');
    } catch (error) {
        console.error('Error loading top rated books:', error);
        showMessage('Error loading top rated books', 'error');
    }
}

// Display books in the container
function displayBooks(books) {
    const container = document.getElementById('booksContainer');

    if (!books || books.length === 0) {
        container.innerHTML = '<p>No books found.</p>';
        return;
    }

    container.innerHTML = books.map(book => {
        const stars = '★'.repeat(Math.floor(book.rating)) + '☆'.repeat(5 - Math.floor(book.rating));

        return `
        <div class="book-card">
            <h3>${escapeHtml(book.title)}</h3>
            <div class="author">by ${escapeHtml(book.author)}</div>
            <div class="category">${escapeHtml(book.category)}</div>
            <div class="price">₹${book.price}</div>
            <div class="book-details">
                <span class="rating">${stars} ${book.rating}</span>
                <span class="year">${book.year}</span>
            </div>
        </div>
    `}).join('');
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup pagination
function setupPagination(total, current) {
    totalPages = total;
    const paginationDiv = document.getElementById('pagination');

    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }

    let html = '<button onclick="changePage(1)" ' + (current === 1 ? 'disabled' : '') + '>⏮️ First</button>';
    html += '<button onclick="changePage(' + (current - 1) + ')" ' + (current === 1 ? 'disabled' : '') + '>◀️ Previous</button>';

    // Show page numbers
    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(totalPages, current + 2);

    for (let i = startPage; i <= endPage; i++) {
        html += '<button onclick="changePage(' + i + ')" ' + (i === current ? 'class="active"' : '') + '>' + i + '</button>';
    }

    html += '<button onclick="changePage(' + (current + 1) + ')" ' + (current === totalPages ? 'disabled' : '') + '>▶️ Next</button>';
    html += '<button onclick="changePage(' + totalPages + ')" ' + (current === totalPages ? 'disabled' : '') + '>⏭️ Last</button>';

    paginationDiv.innerHTML = html;
}

// Change page
function changePage(page) {
    if (page < 1 || page > totalPages || page === currentPage) {
        return;
    }

    loadAllBooks(page);
}

// Reset all filters
function resetFilters() {
    document.getElementById('searchTitle').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('sortBy').value = '';

    loadAllBooks(1);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadAllBooks(1);
});