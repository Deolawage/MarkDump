# MarkDump 

**A simple, modern online marketplace for discovering and listing products.**

MarkDump is a marketplace MVP built with vanilla HTML, CSS, and JavaScript. It allows users to browse products, explore product details, save items to a wishlist, manage a shopping cart, and list products for sale.

The application uses Afribase for product data and image storage, with GitHub Pages hosting the frontend.

🔗 **Live Website:** https://deolawage.github.io/MarkDump/

---

##  Overview

MarkDump aims to provide a simple and accessible marketplace experience with a clean interface and essential shopping functionality.

The project was built to practise frontend development, application architecture, asynchronous JavaScript, API integration, and deployment.

---

## Features

### Product Discovery
- Browse available products.
- View detailed product information.
- Search for products by name.
- Filter products by category.
- Display product images, prices, descriptions, and other details.

### Sell Products
- Open a dedicated product-listing modal.
- Enter product information, including name, description, price, category, location, and quantity.
- Select and preview product images.
- Remove selected images before submission.
- Upload product images to Afribase Storage.
- Save product information to the database.

### Shopping Cart
- Add products to the cart.
- Increase or decrease item quantities.
- Remove products from the cart.
- Store cart data in the browser using localStorage.

### Wishlist
- Save products to a wishlist.
- Remove products from the wishlist.
- Persist wishlist data using localStorage.

### User Interface
- Responsive layout.
- Product cards and detailed product views.
- Modal-based interactions.
- Product image previews.
- Category navigation and search.

---

##  Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and responsive layouts |
| JavaScript (ES6+) | Application logic and interactivity |
| Afribase | Product database and image storage |
| Git | Version control |
| GitHub | Source code hosting |
| GitHub Pages | Frontend deployment |
| localStorage | Cart and wishlist persistence |

---

## Project Structure

```text
MarkDump/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── Icons/
│   └── hero-products/
└── README.md



 Getting Started
Prerequisites
You need:
- A modern web browser.
- Git.
- A code editor, such as Visual Studio Code.
- An Afribase project configured for the application.
1. Clone the Repository
git clone git@github.com:Deolawage/MarkDump.git

Alternatively, clone using HTTPS:
git clone https://github.com/Deolawage/MarkDump.git

2. Navigate to the Project
cd MarkDump

3. Configure Afribase
Configure the Afribase connection values required by the application, including:
- Project API URL.
- Public API key.
- Storage URL.
- Storage bucket name.
Check the existing configuration in js/script.js and ensure the values match your Afribase project.
Security note: Only use credentials intended for public frontend access. Never expose secret or service-role keys in client-side JavaScript.
Configure database and storage permissions carefully before accepting public traffic.
4. Run the Application
Because MarkDump uses vanilla HTML, CSS, and JavaScript, you can serve it using a local development server.
For example, if Python is installed:
python3 -m http.server 8000

Open the following address in your browser:
http://localhost:8000

Ensure your Afribase configuration is correct before testing database operations and image uploads.
 Data and Storage
MarkDump uses Afribase to persist product information and store uploaded product images.
Product records include fields such as:
- Product ID
- Name
- Description
- Price
- Category
- Quantity
- Image URLs
- Seller information
- Location
- Status
- Creation timestamp
The shopping cart and wishlist are currently stored in the browser using localStorage.
This means cart and wishlist data are browser-specific rather than synchronized across devices or user accounts.
 Deployment
The frontend is deployed using GitHub Pages.
Live application:
https://deolawage.github.io/MarkDump/
The frontend and backend are hosted separately:
- Frontend: GitHub Pages
- Database and image storage: Afribase
Changes pushed to the configured GitHub Pages source branch can trigger a new deployment.
 Future Improvements
Potential improvements include:
- User registration and authentication.
- Seller profiles and product ownership.
- Product editing and deletion.
- Persistent, user-specific carts and wishlists.
- Checkout and payment integration.
- Order management.
- Improved form validation and error handling.
- Pagination and advanced product filtering.
- Better image optimization and upload limits.
- Stronger database access controls.
- Accessibility improvements.
- Automated testing.
These are potential future enhancements, not claims about currently implemented functionality.
Project Goals
MarkDump was built to explore and practise:
- Structuring a frontend application with JavaScript classes and modules of responsibility.
- Managing application state.
- Working with asynchronous operations.
- Integrating a frontend with a backend API.
- Uploading files to remote storage.
- Rendering dynamic content through DOM manipulation.
- Using Git and GitHub for version control.
- Deploying a static frontend.
 Author
Deolawage
GitHub: @Deolawage
📄 License
A license has not yet been specified for this project.

### One final step

Save the file and push it to GitHub:

```bash
git add README.md
git commit -m "docs: add project README"
git push origin main

