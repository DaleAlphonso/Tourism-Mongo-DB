
const loadBooks = () => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://localhost:3000/user", false);
    xhttp.send();

    const users = JSON.parse(xhttp.responseText);

    for (let user of users) {
        const x = `
            <div class="col-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${user.fn}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${user.pn}</h6>

                        <div>Email: ${user.email}</div>
                        <div>Age: ${user.age}</div>
                        <div>Address: ${user.addr}</div>

                        <hr>

                        <button type="button" class="btn btn-danger">Delete</button>
                        <button types="button" class="btn btn-primary" data-toggle="modal" 
                            data-target="#editBookModal" onClick="setEditModal(${user.pn})">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        `

        document.getElementById('users').innerHTML = document.getElementById('users').innerHTML + x;
    }
}

loadBooks();