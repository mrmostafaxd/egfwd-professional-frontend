/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Comments should be present at the beginning of each procedure and class.
 * Great to have comments before crucial code sections within the procedure.
*/

/**
 * Define Global Variables
 * 
*/
const ACTIVE_CLASS = "your-active-class"; // class to be added to active sections
const ACTIVE_LINK = "your-active-link"; // class to be added to active menu links

const linkList = document.getElementById("navbar__list");
const sections = document.querySelectorAll("section");

/**
 * End Global Variables
 * Begin Main Functions
 * 
*/

// function to build the navigation menu
function navBuild() {
    // create a document fragment to append menu links to (reduce reflows)
    const frag = document.createDocumentFragment();
    // loop through all sections on the page
    for (const el of sections) {
        // grab the "data-nav" attribute and the "id" attribute
        const data_nav = el.getAttribute("data-nav");
        const id = el.getAttribute("id");

        // create an li element (section button) and link element
        const navItem = document.createElement("li");
        const navItemLink = document.createElement("a");
        
        // set the href of the link to the id of the section and the text content
        navItemLink.href = `#${id}`;
        navItemLink.textContent = `${data_nav}`;
        // add to it it's class
        navItemLink.classList.add("menu__link");

        // append the link to the list item then append the <li> to the fragment
        navItem.appendChild(navItemLink);
        frag.appendChild(navItem);

        // add a click event listener to the link to smoothly scroll to the corresponding section
        navItemLink.addEventListener("click", function (event) {
            event.preventDefault();
            el.scrollIntoView({ behavior: "smooth"});
        })
    }

    // // append the document fragment to the unordered list element
    linkList.appendChild(frag);
}

// call the navBuild function to build the menu
navBuild();

/**
 * End Main Functions
 * Begin Events
 * 
*/

// grab all menu links on the page
const links = document.querySelectorAll("a.menu__link");
// create an IntersectionObserver to watch for when section
//     are near the top of the viewport
const observer = new IntersectionObserver(
    function (entries) {
        // remove the active class from the the section
        entries[0].target.classList.remove(ACTIVE_CLASS);
        // if the target is on screen
        if (entries[0].isIntersecting) {
            // add the active class
            entries[0].target.classList.add(ACTIVE_CLASS);
            // add to the active section link an active class to highlight it
            links.forEach(function (link) {
                if (link.textContent === entries[0].target.getAttribute("data-nav")) {
                    link.classList.add(ACTIVE_LINK);
                } else {
                    link.classList.remove(ACTIVE_LINK);
                }
            })
        } else {
            // remove it 
            entries[0].target.classList.remove(ACTIVE_CLASS);
        }   
    },
    {
        threshold: 0.3
    }
);

// enable the intersection observer when scrolling
window.addEventListener("scroll", function (event) {
    sections.forEach( function (section) {
        observer.observe(section);
    })
})

