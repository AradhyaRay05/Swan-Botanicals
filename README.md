# Swan Botanicals

A fully functional, production-ready static website for **Swan Botanicals**, a premium botanical skincare brand. Created for the "Build for Botanicals" design challenge.

🌐 **Live Demo**: [swan-botanicals-website.vercel.app](https://swan-botanicals-website.vercel.app)

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid
- **Vanilla JavaScript (ES6+)** - No frameworks needed
- **Bootstrap 5.3.3** (via CDN) - Responsive grid, components, utilities
- **Google Fonts** - Playfair Display, Lora, Open Sans

## Features

### Pages (14 Total)
- **Home** - Hero section, featured products, brand story, testimonials
- **Products** - Filterable product grid with category filters
- **About Us** - Brand story and mission
- **Our Promise** - Quality commitment
- **Sustainability** - Environmental initiatives
- **Ingredients** - Natural ingredients showcase
- **Contact** - Contact form with validation
- **FAQ** - Accordion-style frequently asked questions
- **Cart** - Full shopping cart with quantity controls
- **Login** - User authentication (Login/Sign Up tabs)
- **Account** - User settings and preferences
- **Shipping & Returns** - Shipping policy details
- **Privacy Policy** - Data privacy information
- **Terms of Service** - Legal terms

### Core Functionality
- **Client-Side Cart**: Powered by `localStorage` with:
  - Add/remove products
  - Quantity increment/decrement buttons
  - Real-time price calculations
  - Shipping threshold (Free shipping above ₹500)
  - Order summary with subtotal, shipping, and total
- **Product Filtering**: Filter products by category with smooth animations
- **Form Validation**: Client-side validation for contact and newsletter forms
- **Responsive Design**: Mobile-first approach, works on all devices
- **User Authentication UI**: Login and signup forms with social login options

### Design System
- **Brand Colors**:
  - Forest Canopy: `#2A4D3A`
  - Warm Ivory: `#F8F4E3`
  - Serene Mint: `#D9F8F0`
  - Rich Umber: `#4E3C2F`
  - Golden Sand: `#EFD6AC`
  - Sage Green: `#A2B089`
- **Typography**:
  - Headings: Playfair Display
  - Subheadings: Lora
  - Body: Open Sans
- **Currency**: Indian Rupees (₹)

## How to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/swan-botanicals.git
   cd swan-botanicals
   ```

2. **Open in Browser**:
   Simply open `index.html` in your web browser. No build tools or dependencies required!

3. **Or use Live Server** (VS Code):
   - Install the "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

## Deployment

Deployed on **Vercel**. To deploy your own:

```bash
npm i -g vercel
vercel --prod
```

## File Structure

```
Swan-Botanicals/
├── index.html              # Homepage
├── products.html           # Product catalog
├── about.html              # About us page
├── cart.html               # Shopping cart
├── contact.html            # Contact form
├── faq.html                # FAQ accordion
├── our-promise.html        # Brand promise
├── sustainability.html     # Sustainability info
├── ingredients.html        # Ingredients showcase
├── login.html              # Login/Signup page
├── account.html            # Account settings
├── shipping.html           # Shipping policy
├── privacy.html            # Privacy policy
├── terms.html              # Terms of service
├── css/
│   └── style.css           # Custom styles & brand variables
├── js/
│   └── main.js             # All JavaScript functionality
├── assets/
│   ├── logo.svg            # Brand logo
│   ├── hero-background.jpg # Hero image
│   └── SAN_*.jpg           # Product images
└── vercel.json             # Vercel configuration
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project was created for the "Build for Botanicals" hackathon challenge.
