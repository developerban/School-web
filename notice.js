import { auth, db } from "./firebase-config.js";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    orderBy,
    query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// DOM Elements
const noticeContainer = document.getElementById("noticeContainer");
let emptyState = document.getElementById("emptyState");
const loader = document.getElementById("loader");

// Admin Panel Elements
const adminLoginBtn = document.getElementById("adminLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminPanel = document.getElementById("adminPanel");
const uploadBtn = document.getElementById("uploadBtn");

// Modals
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const uploadModal = document.getElementById("uploadModal");
const closeUpload = document.getElementById("closeUpload");
const noticeForm = document.getElementById("noticeForm");
const noticeTitle = document.getElementById("noticeTitle");
const noticeCategory = document.getElementById("noticeCategory");
const noticeDescription = document.getElementById("noticeDescription");
const noticeId = document.getElementById("noticeId");

// Search & Filter
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

let notices = [];
let currentFilter = "all";
let isAdmin = false;

/*=========================================
        AUTH STATE LISTENER
=========================================*/
onAuthStateChanged(auth, (user) => {
    if (user) {
        isAdmin = true;
        if (adminLoginBtn) adminLoginBtn.classList.add("hidden");
        if (logoutBtn) logoutBtn.classList.remove("hidden");
        if (adminPanel) adminPanel.classList.remove("hidden");
    } else {
        isAdmin = false;
        if (adminLoginBtn) adminLoginBtn.classList.remove("hidden");
        if (logoutBtn) logoutBtn.classList.add("hidden");
        if (adminPanel) adminPanel.classList.add("hidden");
    }
    renderNotices();
});

/*=========================================
        LOGIN LOGIC
=========================================*/
if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", () => {
        if (loginModal) loginModal.style.display = "flex";
    });
}

if (closeLogin) {
    closeLogin.addEventListener("click", () => {
        if (loginModal) loginModal.style.display = "none";
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = loginEmail.value;
        const password = loginPassword.value;

        if (loader) loader.classList.remove("hidden");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (loginModal) loginModal.style.display = "none";
            loginForm.reset();
        } catch (error) {
            alert("Login failed: " + error.message);
        } finally {
            if (loader) loader.classList.add("hidden");
        }
    });
}

/*=========================================
        LOGOUT LOGIC
=========================================*/
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
        } catch (error) {
            alert("Error signing out: " + error.message);
        }
    });
}

/*=========================================
        UPLOAD MODAL LOGIC
=========================================*/
if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
        if (noticeForm) noticeForm.reset();
        if (noticeId) noticeId.value = "";
        if (uploadModal) uploadModal.style.display = "flex";
    });
}

if (closeUpload) {
    closeUpload.addEventListener("click", () => {
        if (uploadModal) uploadModal.style.display = "none";
    });
}

/*=========================================
        FIRESTORE LOGIC
=========================================*/
const noticesCollection = collection(db, "notices");
const q = query(noticesCollection, orderBy("timestamp", "desc"));

// Listen for real-time updates
if (loader) loader.classList.remove("hidden");
onSnapshot(q, (snapshot) => {
    notices = [];
    snapshot.forEach((doc) => {
        notices.push({ id: doc.id, ...doc.data() });
    });
    if (loader) loader.classList.add("hidden");
    renderNotices();
}, (error) => {
    console.error("Error fetching notices: ", error);
    if (loader) loader.classList.add("hidden");
});

// Add or Update Notice
if (noticeForm) {
    noticeForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = noticeTitle.value;
        const category = noticeCategory.value;
        const description = noticeDescription.value;
        const id = noticeId.value;

        if (loader) loader.classList.remove("hidden");
        if (uploadModal) uploadModal.style.display = "none";

        try {
            if (id) {
                // Update existing
                const noticeRef = doc(db, "notices", id);
                await updateDoc(noticeRef, {
                    Title: title,
                    Category: category,
                    Description: description
                });
            } else {
                // Add new
                const dateStr = new Date().toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'long', year: 'numeric'
                });
                await addDoc(noticesCollection, {
                    Title: title,
                    Category: category,
                    Description: description,
                    Date: dateStr,
                    timestamp: new Date().getTime() // For sorting
                });
            }
            noticeForm.reset();
        } catch (error) {
            alert("Error saving notice: " + error.message);
        } finally {
            if (loader) loader.classList.add("hidden");
        }
    });
}

// Delete Notice Function
window.deleteNotice = async (id) => {
    if (confirm("Are you sure you want to delete this notice?")) {
        if (loader) loader.classList.remove("hidden");
        try {
            await deleteDoc(doc(db, "notices", id));
        } catch (error) {
            alert("Error deleting notice: " + error.message);
        } finally {
            if (loader) loader.classList.add("hidden");
        }
    }
};

// Edit Notice Function
window.editNotice = (id) => {
    const notice = notices.find(n => n.id === id);
    if (notice) {
        if (noticeTitle) noticeTitle.value = notice.Title || "";
        if (noticeCategory) noticeCategory.value = notice.Category || "General";
        if (noticeDescription) noticeDescription.value = notice.Description || "";
        if (noticeId) noticeId.value = id;
        if (uploadModal) uploadModal.style.display = "flex";
    }
};

/*=========================================
        RENDER NOTICES
=========================================*/
function renderNotices() {
    if (!noticeContainer) return;

    noticeContainer.innerHTML = "";

    const search = searchInput?.value.toLowerCase() || "";

    let filtered = notices.filter(item => {
        const title = (item.Title || "").toLowerCase();
        const desc = (item.Description || "").toLowerCase();
        const category = (item.Category || "");

        const searchMatch = title.includes(search) || desc.includes(search);
        const categoryMatch = currentFilter === "all" || category === currentFilter;

        return searchMatch && categoryMatch;
    });

    if (filtered.length === 0) {
        if (emptyState) {
            emptyState.style.display = "block";
        } else {
            const emptyDiv = document.createElement("div");
            emptyDiv.id = "emptyState";
            emptyDiv.style.gridColumn = "1 / -1";
            emptyDiv.style.textAlign = "center";
            emptyDiv.style.padding = "3rem";
            emptyDiv.innerHTML = `
                <i class="fas fa-box-open" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3 style="color: #666;">No notices found</h3>
            `;
            noticeContainer.appendChild(emptyDiv);
            emptyState = emptyDiv;
        }
        return;
    }

    if (emptyState) {
        emptyState.style.display = "none";
    }

    filtered.forEach(item => {
        noticeContainer.appendChild(createCard(item));
    });
}

/*=========================================
        CREATE CARD
=========================================*/
function createCard(item) {
    const card = document.createElement("div");
    card.className = "notice-card";

    let image = "";
    if (item["Image Link"]) {
        image = `<img class="notice-image" src="${item["Image Link"]}" alt="${item["Title"]}">`;
    }

    let adminButtons = "";
    if (isAdmin) {
        adminButtons = `
            <div class="admin-actions" style="display: flex; gap: 0.5rem; margin-top: 1rem; border-top: 1px solid #eee; padding-top: 1rem;">
                <button onclick="editNotice('${item.id}')" style="background: #3498db; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer; flex: 1; font-family: inherit; font-size: 0.9rem;">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteNotice('${item.id}')" style="background: #e74c3c; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer; flex: 1; font-family: inherit; font-size: 0.9rem;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
    }

    card.innerHTML = `
        ${image}
        <div class="notice-content">
            <span class="notice-category">${item.Category || "Notice"}</span>
            <h2 class="notice-title">${item.Title || ""}</h2>
            <p class="notice-date">
                <i class="fas fa-calendar"></i>
                ${item.Date || ""}
            </p>
            <p class="notice-description">${item.Description || ""}</p>
            ${adminButtons}
        </div>
    `;

    return card;
}

/*=========================================
        SEARCH & FILTER
=========================================*/
if (searchInput) {
    searchInput.addEventListener("keyup", () => {
        renderNotices();
    });
}

if (filterButtons) {
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentFilter = button.dataset.filter;
            renderNotices();
        });
    });
}
