# **Pizzy Pizzeria Website**
## **Project Overview**
The **Pizzzy** is a customer order management platform built using **Node.js**, **Express.js**, and **EJS** templating. The application serves as the front-end and back-end for a pizza delivery system where users can view their orders, including order details such as the date, time, total price, and order status.
This project leverages dynamic server-side rendering with EJS to ensure a seamless and responsive user experience. The backend communicates with a **MySQL database** to manage orders and store details persistently.
## **Features**
### General Features:
- **Dynamic Order Management**: Users can view a list of their pizza orders with essential details.
- **EJS Templating**: Dynamic HTML rendering with reusable components (header, footer, etc.).
- **Order Date & Time Formatting**: Timestamps are dynamically formatted using JavaScript on the server.
- **Responsive Design**: A mobile-friendly interface with images and order summaries.

### Admin-Side Features (Optional/Future Implementation):
- Ability to update order statuses (e.g., Pending, Completed).
- Add or remove menu items dynamically (future enhancement).
- Daily summary of orders.

## **Technologies Used**
- **Backend Technologies**:
    - [Node.js](https://nodejs.org/): JavaScript runtime for server-side logic.
    - [Express.js](https://expressjs.com/): Framework for routing and middleware.
    - [Express-Validator](https://express-validator.github.io/docs/): Validates and sanitizes input.
    - [Body-Parser](https://www.npmjs.com/package/body-parser): Handles form submissions and JSON payloads.

- **Frontend Technologies**:
    - [EJS (Embedded JavaScript Templates)](https://ejs.co/): Dynamic template rendering for the website content.
    - HTML/CSS for layout and styling (with optional support for Bootstrap or other frameworks).
    - **Image assets**: Includes pizza slider images to enhance the user interface.

- **Database**:
    - [MySQL](https://www.mysql.com/): Stores and fetches orders and data reliably.

- **Development Tools**:
    - [Browser-Sync](https://browsersync.io/): Automatically deploys changes to the browser for live development.
    - [LiveReload](https://github.com/napcs/node-livereload): Refreshes the browser upon code changes for better development speed.

## **Project Workflow**
### User Flow:
1. A user visits the homepage:
    - Dynamically rendered "Your Orders" section is displayed, listing each order.
    - Each order includes:
        - Order date and time formatted as `YYYY-MM-DD HH:MM`.
        - Total price of the order.
        - Current status of the order (e.g., `Pending`, `Completed`).

    - If no orders exist, a message appears: "No orders yet."

2. Users can view detailed order history.

### Backend Flow:
1. The application uses **Express.js** to handle all backend server logic and routing.
2. Data is fetched from a **MySQL database** using the `mysql` Node.js library.
3. Specific routes control order-related operations:
    - Get a list of orders (`/orders`): Fetch orders from the database.
    - Render order details (`/orders/:id`): Display details for a specific order (future enhancement).

4. Middleware such as `body-parser` handles incoming requests, and related validations ensure secure and proper operation.

### Frontend Flow:
1. **EJS Templating**:
    - The orders and their related data (order date, time, price, and status) are formatted and inserted into the HTML templates dynamically.
    - A layout template is used for base components such as the header, footer, and navigation bar.

2. **Images**:
    - Images such as pizza slides are integrated as part of the UI for aesthetics.

3. **Styling**:
    - Responsive design components that adjust for mobile, tablet, and desktop environments.
