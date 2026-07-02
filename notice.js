const noticeContainer = document.getElementById("noticeContainer");
const loadingSection = document.getElementById("loadingSection");
const emptyState = document.getElementById("emptyState");

let notices = [
    {
        "Title": "Welcome to Our School",
        "Category": "General",
        "Description": "This is a temporary notice. Firebase integration will replace this later.",
        "Date": "01 July 2026",
        "Image Link": ""
    },
    {
        "Title": "Annual Examination",
        "Category": "Exam",
        "Description": "This is a sample notice.",
        "Date": "10 July 2026",
        "Image Link": ""
    }
];
let currentFilter = "all";

/*=========================================
        RENDER
=========================================*/

function renderNotices(){

    noticeContainer.innerHTML="";

    const search =
    document
    .getElementById("searchInput")
    .value
    .toLowerCase();

    let filtered = notices.filter(item=>{

        const title =
        (item["Title"] || "").toLowerCase();

        const desc =
        (item["Description"] || "").toLowerCase();

        const category =
        (item["Category"] || "");

        const searchMatch =
        title.includes(search) ||
        desc.includes(search);

        const categoryMatch =
        currentFilter==="all" ||
        category===currentFilter;

        return searchMatch && categoryMatch;

    });

    if(filtered.length===0){

        emptyState.style.display="block";

        return;

    }

    emptyState.style.display="none";

    filtered.forEach(item=>{

        noticeContainer.appendChild(createCard(item));

    });

}

/*=========================================
        CREATE CARD
=========================================*/

function createCard(item){

    const card=document.createElement("div");

    card.className="notice-card";

    let image="";

    if(item["Image Link"]){

        image=
        `<img
        class="notice-image"
        src="${item["Image Link"]}"
        alt="${item["Title"]}">`;

    }

    card.innerHTML=`

        ${image}

        <div class="notice-content">

            <span class="notice-category">

                ${item["Category"] || "Notice"}

            </span>

            <h2 class="notice-title">

                ${item["Title"]}

            </h2>

            <p class="notice-date">

                <i class="fas fa-calendar"></i>

                ${item["Date"]}

            </p>

            <p class="notice-description">

                ${item["Description"]}

            </p>

            <a href="#"

            class="notice-read">

            Read More

            <i class="fas fa-arrow-right"></i>

            </a>

        </div>

    `;

    return card;

}

/*=========================================
        SEARCH
=========================================*/

const searchInput =
document.getElementById("searchInput");

searchInput.addEventListener("keyup",()=>{

    renderNotices();

});

/*=========================================
        FILTER BUTTONS
=========================================*/

document
.querySelectorAll(".filter-btn")
.forEach(button=>{

button.addEventListener("click",()=>{

document
.querySelectorAll(".filter-btn")
.forEach(btn=>btn.classList.remove("active"));

button.classList.add("active");

currentFilter=
button.dataset.filter;

renderNotices();

});

});

/*=========================================
        INITIAL LOAD
=========================================*/

// Hide loading section as we use static data for now
loadingSection.style.display = "none";
renderNotices();