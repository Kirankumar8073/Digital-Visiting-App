window.onload = () => showLoginScreen();

function showLoginScreen() {
    document.getElementById("app").innerHTML = `
        <div class="container">
            <h1>Digital Visiting Card</h1>
            <h2>Login</h2>
            <input type="text" id="loginName" placeholder="Enter name">
            <input type="password" id="loginPassword" placeholder="Enter password">
            
            <button onclick="login()">Login</button>
            <button class="linkBtn" onclick="showSignupScreen()">New User? Create Card</button>
            <button class="linkBtn" onclick="showAllUsersPage()">View All Users</button>
        </div>
    `;
}



function showSignupScreen() {
    document.getElementById("app").innerHTML = `
        <div class="container">
            <h2>Create Visiting Card</h2>
            <div class="input-group"><span>👤</span><input type="text" id="newName" placeholder="Enter your Name" required></div>
            <div class="input-group"><span>💼</span><input type="text" id="newDesignation" placeholder="Enter your Designation" required></div>
            <div class="input-group"><span>📧</span><input type="email" id="newEmail" placeholder="Enter Email" required></div>
            <div class="input-group"><span>📍</span><input type="text" id="newLocation" placeholder="Enter Location" required></div>
            <div class="input-group"><span>📞</span><input type="tel" id="newPhone" placeholder="Enter 10 Digit Phone Number" maxlength="10" required></div>
            <div class="input-group"><span>🌐</span><input type="url" id="newWebsite" placeholder="Website/Portfolio (Optional)"></div>
            <div class="input-group"><span>🔒</span><input type="password" id="newPassword" placeholder="Create Password" required></div>
            <button onclick="createCard()">Save & Login</button>
            <button class="linkBtn" onclick="showLoginScreen()">Back</button>
        </div>
    `;
}

function createCard() {
    const name = newName.value.trim();
    const designation = newDesignation.value.trim();
    const email = newEmail.value.trim();
    const location = newLocation.value.trim();
    const phone = newPhone.value.trim();
    const website = newWebsite.value.trim();
    const password = newPassword.value.trim();

    if (!name || !designation || !email || !location || !phone || !password) {
        alert("All fields except website are required!");
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Phone number must be 10 digits!");
        return;
    }

    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{5,}$/.test(password)) {
        alert("Password must have 1 uppercase and 1 special character!");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const newUser = {
        id: Date.now(),
        name,
        designation,
        email,
        location,
        phone,
        website,
        password,
        status: "Active"
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("User created successfully!");
    showLoginScreen();
}

function login() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const enteredName = loginName.value.trim();
    const enteredPassword = loginPassword.value.trim();

    const user = users.find(u => u.name === enteredName && u.password === enteredPassword);
    if (user) {
        user.status = "Active";
        localStorage.setItem("users", JSON.stringify(users));
        showCard(user);
    } else {
        alert("Incorrect credentials!");
    }
}
function showAllUsersPage() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    document.getElementById("app").innerHTML = `
        <div class="user-list-page">

            <h2>All Users</h2>

            <!-- DESKTOP TABLE VIEW -->
            <div class="table-container desktop-only">
                <table>
                    <thead>
                        <tr>
                            <th>Sl.No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Designation</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${
                            users.length
                                ? users.map((u, i) => `
                                    <tr>
                                        <td>${i + 1}</td>
                                        <td>${u.name}</td>
                                        <td>${u.email}</td>
                                        <td>${u.phone}</td>
                                        <td>${u.designation}</td>
                                        <td>${u.status}</td>
                                    </tr>
                                `).join("")
                                : `<tr><td colspan="6">No users found</td></tr>`
                        }
                    </tbody>
                </table>
            </div>

            <!-- MOBILE CARD VIEW -->
            <div class="mobile-card-list mobile-only">
                ${
                    users.length
                        ? users.map((u, i) => `
                            <div class="user-mobile-card">
                                <div class="top-row">
                                    <span class="order-id">#${i + 1}</span>
                                </div>

                                <p><strong>Name:</strong> ${u.name}</p>
                                <p><strong>Email:</strong> ${u.email}</p>
                                <p><strong>Phone:</strong> ${u.phone}</p>
                                <p><strong>Designation:</strong> ${u.designation}</p>
                                <p><strong>Status:</strong> 
                                    <span class="status-badge ${u.status.toLowerCase()}">${u.status}</span>
                                </p>
                            </div>
                        `).join("")
                        : `<p>No users found</p>`
                }
            </div>

            <button class="backBtnSmall" onclick="showLoginScreen()">Back</button>

        </div>
    `;
}


function showCard(user) {
    document.getElementById("app").innerHTML = `
        <div class="container">
            <h2>Your Digital Visiting Card</h2>
            <div class="cardBox">
                <p><span class="icon">👤</span> <strong>${user.name}</strong></p>
                <p><span class="icon">💼</span> ${user.designation}</p>
                <p><span class="icon">📧</span> ${user.email}</p>
                <p><span class="icon">📍</span> ${user.location}</p>
                <p><span class="icon">📞</span> ${user.phone}</p>
                ${user.website ? `<p><span class="icon">🌐</span> <a href="${user.website}" target="_blank">${user.website}</a></p>` : ""}
            </div>
            <button onclick="logout('${user.name}')">Logout</button>
        </div>
    `;
}

function logout(name) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.name === name);
    if (user) user.status = "Inactive";
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("app").innerHTML = `
        <div class="container thankyou">
            <h2>Thank You!</h2>
            <p>"Success is not final; failure is not fatal."</p>
            <button onclick="showLoginScreen()">Back to Login</button>
        </div>
    `;
}
