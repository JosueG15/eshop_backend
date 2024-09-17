# E-Commerce Backend

This is the backend API for a full-featured e-commerce platform with functionalities like product management, user authentication, and order processing. This backend powers the frontend for both iOS and Android applications.

## Purpose

The main purpose of this backend is to provide RESTful APIs for an e-commerce application. The backend is built to handle user authentication, product management, and order processing. It connects with a cloud-based database and serves as the central hub for managing data.

### Key Features

- **Full-featured shopping cart:** Users can add/remove products to/from their cart and proceed to checkout.
- **Top products carousel:** A carousel that displays top-rated products on the homepage.
- **Product pagination:** Pagination for navigating through multiple products.
- **Product search feature:** Search functionality to filter products based on name, category, etc.
- **User profile with orders:** Allows users to view and manage their personal profile and order history.
- **Admin product management:** Admins can create, update, and delete products.
- **Admin user management:** Admins can manage user accounts, including updating user information and deleting accounts.
- **Admin order details page:** Admins can view detailed information about user orders.
- **Changing order states:** Allows admins to update order status (e.g., shipped, delivered, etc.).
- **Checkout process:** Handles the entire checkout process, including shipping, payment method, and order review.
- **Using a cloud-based database:** All data is stored in a cloud-based database to ensure scalability and accessibility.

And much more...

---

## Setup Instructions

Follow these steps to get the backend running on your local machine:

### Prerequisites

- **Node.js** and **npm** installed on your machine.
- **MongoDB Cloud (MongoDB Atlas)** for storing your application data.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/JosueG15/eshop_backend
   cd eshop_backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   - Copy the `.env.example` file and rename it to `.env`.

     ```bash
     cp .env.example .env
     ```

   - Update the values in `.env` file according to your configuration. It should contain keys such as:

     ```plaintext
     API_PORT=5000
     API_DATABASE_URL=mongodb+srv://<your-mongo-db-url>
     ```

4. **Run the application**:

   - **Development mode**:

     ```bash
     npm run dev
     ```

   - **Production mode**:

     ```bash
     npm start
     ```

5. **API Documentation**:

   The API documentation will be available at <`http://localhost:8000/api/docs`> once the server is up and running.

---

## How to Contribute

1. **Fork the repository**.
2. **Create a branch** for your feature or bug fix.
3. **Commit your changes** and create a pull request for review.
4. We’ll review your code and merge it into the main project if everything looks good.

---

## License

This project is licensed under the **MIT License**. Feel free to use and modify it as needed.
