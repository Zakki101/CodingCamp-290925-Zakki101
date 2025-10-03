let todos = [];
    let sortAsc = true;
    
    // Function format yyyy/mm/dd to dd/mm/yyyy
    function formatDate(dateStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
    }

    // Render Todo List
    function renderTodos() {
        const list = document.getElementById('todo-list');
        list.innerHTML = '';
        // Function if no task found
        if (todos.length === 0) {
            list.innerHTML = `<tr><td colspan="4" class="text-center py-4 pt-5 text-black">No Task Found</td></tr>`;
            return;
        }
        todos.forEach((todo, idx) => {
            const tr = document.createElement('tr');
            tr.className = "border-b";
            tr.innerHTML = `
                <td class="py-2 px-2">${todo.title}</td>
                <td class="py-2 px-2">${formatDate(todo.due)}</td>
                <td class="py-2 px-2">
                    <span>${todo.done ? 'Done' : 'Not Done'}</span>
                </td>
                <td class="py-2 px-2">
                    <div class="flex gap-2">
                        <button class="status-button bg-blue-700 font-bold text-white px-3 py-1 rounded" data-idx="${idx}">${todo.done ? 'UnMark' : 'Mark as Done'}</button>
                        <button class="edit-button bg-yellow-600 font-bold text-white px-3 py-1 rounded" data-idx="${idx}">Edit</button>
                        <button class="delete-button bg-red-700 font-bold text-white px-3 py-1 rounded" data-idx="${idx}">Delete</button>
                    </div>
                </td>
            `;
            list.appendChild(tr);
        });
    }

    // Listener add Button
    document.getElementById('todo-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('todo-input').value;
        const due = document.getElementById('due-date').value;
        todos.push({ title, due, done: false });
        renderTodos();
        this.reset();
    });

    // Listener Button Delete All
    document.getElementById('delete-all').addEventListener('click', function() {
        todos = [];
        filteredTodos = null;
        renderTodos();
    });

    // Listener Sort Button
    document.getElementById('sort').addEventListener('click', function() {
        sortAsc = !sortAsc;
        document.getElementById('sort-arrow').innerHTML = sortAsc
            ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>`;
        todos.sort((a, b) => sortAsc ? a.due.localeCompare(b.due) : b.due.localeCompare(a.due));
        renderTodos();
    });

    // Event listener filter button:
    const filterBtn = document.getElementById('filter-dropdown-btn');
    const filterDropdown = document.getElementById('filter-dropdown');

    // Toggle dropdown when button click
    filterBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event from bubbling to document
        filterDropdown.classList.toggle('hidden');
    });

    // Hide dropdown if clicked outside
    document.addEventListener('click', function(e) {
    if (!filterDropdown.contains(e.target) && !filterBtn.contains(e.target)) {
        filterDropdown.classList.add('hidden');
    }
    });

    // Filter logic: apply filter when button clicked
    document.getElementById('apply-filter').addEventListener('click', function() {
        const status = document.getElementById('filter-status').value;
        const date = document.getElementById('filter-date').value;
        const title = document.getElementById('filter-title').value.toLowerCase();
        let filtered = todos;

        // Status filter
        if (status === "done") {
            filtered = filtered.filter(todo => todo.done);
        } else if (status === "notdone") {
            filtered = filtered.filter(todo => !todo.done);
        }
        // Date filter
        if (date) {
            filtered = filtered.filter(todo => todo.due === date);
        }
        // Title filter
        if (title) {
            filtered = filtered.filter(todo => todo.title.toLowerCase().includes(title));
        }

        // Render filtered todos
        const list = document.getElementById('todo-list');
        list.innerHTML = '';
        // Function if no task found
        if (filtered.length === 0) {
            list.innerHTML = `<tr><td colspan="4" class="text-center py-4 pt-5 text-black">No Task Found</td></tr>`;
            filterDropdown.classList.add('hidden');
            return;
        }
        filtered.forEach((todo, idx) => {
            const tr = document.createElement('tr');
            tr.className = "border-b";
            tr.innerHTML = `
                <td class="py-2 px-2">${todo.title}</td>
                <td class="py-2 px-2">${formatDate(todo.due)}</td>
                <td class="py-2 px-2">
                    <span class="ml-2">${todo.done ? 'Done' : 'Not Done'}</span>
                </td>
                <td class="py-2 px-2">
                    <div class="flex gap-2">
                        <button class="status-button bg-blue-700 font-bold text-white px-3 py-1 rounded" data-idx="${idx}">${todo.done ? 'UnMark' : 'Mark as Done'}</button>
                        <button class="edit-button bg-yellow-600 font-bold text-white px-3 py-1 rounded" data-idx="${idx}">Edit</button>
                        <button class="delete-button bg-red-700 font-bold text-white px-3 py-1 rounded" data-idx="${idx}">Delete</button>
                    </div>
                </td>
            `;
            list.appendChild(tr);
        });
        // Hide dropdown after applying filter
        filterDropdown.classList.add('hidden');
    });

    // Listener action button in list
    document.getElementById('todo-list').addEventListener('click', function(e) {
        // Delete button
        if (e.target.classList.contains('delete-button')) {
            const idx = e.target.getAttribute('data-idx');
            todos.splice(idx, 1);
            renderTodos();
        }
        // Edit button
        if (e.target.classList.contains('edit-button')) {
            const idx = e.target.getAttribute('data-idx');
            const todo = todos[idx];
            document.getElementById('todo-input').value = todo.title;
            document.getElementById('due-date').value = todo.due;
            todos.splice(idx, 1);
            renderTodos();
        }
        // Status button
        if (e.target.classList.contains('status-button')) {
            const idx = e.target.getAttribute('data-idx');
            todos[idx].done = !todos[idx].done;
            renderTodos();
        }
    });

    renderTodos();