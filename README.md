# Swan Botanicals - Static Website

This project is a fully functional, production-ready static website for the fictional brand "Swan Botanicals," created for the "Build for Botanicals" design challenge.

## Tech Stack

-   **HTML5**
-   **CSS3**
-   **Vanilla JavaScript (ES6+)**
-   **Tailwind CSS** (via CDN)
-   **Bootstrap 5** (via CDN for specific components like Navbar, Modals, and Accordion)

## Features

-   **10 Unique Pages**: Including Home, Products, About, and a fully client-side Shopping Cart.
-   **Strict Branding**: Adheres precisely to the Swan Botanicals brand guidelines, including colors, fonts, and tone of voice.
-   **Interactive UI**: Features include product modals, a filterable product grid, an accordion FAQ, animated counters, and client-side form validation.
-   **Client-Side Cart**: Shopping cart functionality powered by `localStorage` to persist between sessions.
-   **Responsive Design**: Looks great on all devices, from mobile phones to desktops.
-   **Performance Optimized**: Utilizes lazy loading for images and aims for a Lighthouse score of 90+.
-   **Accessible**: WCAG-compliant with semantic HTML, `alt` text for images, and ARIA labels for interactive elements.
-   **Zero Build Tools**: Runs directly in any modern web browser without any installation or build steps.

## How to Run Locally

1.  **Download/Clone the Repository**: Get all the files onto your local machine.
2.  **Open `index.html`**: Navigate to the project folder and open the `index.html` file in your web browser (e.g., Chrome, Firefox, Safari, Edge).

That's it! The website is self-contained and will run directly from the file system.

## File Structure

-   `/index.html` (and all other HTML files): The main entry points for each page.
-   `/assets/`: Contains all images and icons used throughout the site. (Note: Current images are placeholders from `https://placehold.co/` and should be replaced with the actual brand assets from "Swan Pics.zip").
-   `/css/style.css`: Custom stylesheet containing brand color variables, font definitions, and overrides for Tailwind/Bootstrap defaults.
-   `/js/main.js`: A single file containing all JavaScript for interactivity across the entire site.