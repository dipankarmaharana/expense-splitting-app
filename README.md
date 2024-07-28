# Expense Splitting Application

This is a backend service for a Expense Splitting Application built with Node.js and Express. The application allows users to add expenses and split them based on three different methods: exact amounts, percentages, and equal splits. It also provides functionality for managing user details, validating inputs, and generating downloadable balance sheets.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Future Improvements](#future-improvements)
- [Contributor](#contributor)

## Features

- User Management: Add and retrieve user details.
- Expense Management: Add expenses with different split methods (Equal, Exact, Percentage).
- Balance Sheet: Generate and download balance sheets as CSV.
- Input Validation: Ensure data integrity.
- Error Handling: Graceful error responses.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for a managed database instance

### Steps

1. **Clone the repository**

   ```sh
   git clone https://github.com/dipankarmaharana/expense-splitting-app.git
   cd expense-splitting-app
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory of your project and add the following environment variables:

   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/yourdbname?retryWrites=true&w=majority
   ```

4. **Start the server**

   ```sh
   npm start
   ```

   The server should now be running on `http://localhost:5000`.

## Usage

You can use tools like [Postman](https://www.postman.com/) or `curl` to interact with the API endpoints. Below are some examples of how to use the endpoints.

## API Endpoints

### User Endpoints

- **Create User**

  - **Endpoint**: `POST /api/users`
  - **Description**: Create a new user.
  - **Request Body**:

    ```json
    {
      "email": "user1@example.com",
      "name": "User One",
      "mobile": "1234567890"
    }
    ```

  - **Response**:

    ```json
    {
      "_id": "60c72b2f4f1a4e3d88b67e47",
      "email": "user1@example.com",
      "name": "User One",
      "mobile": "1234567890",
      "__v": 0
    }
    ```

- **Retrieve User Details**

  - **Endpoint**: `GET /api/users/:id`
  - **Description**: Retrieve details of a specific user.
  - **Response**:

    ```json
    {
      "_id": "60c72b2f4f1a4e3d88b67e47",
      "email": "user1@example.com",
      "name": "User One",
      "mobile": "1234567890",
      "__v": 0
    }
    ```

### Expense Endpoints

- **Add Expense**

  - **Endpoint**: `POST /api/expenses`
  - **Description**: Add a new expense.
  - **Request Body**:

    ```json
    {
      "description": "Dinner",
      "amount": 3000,
      "paidBy": "60c72b2f4f1a4e3d88b67e47",
      "splitMethod": "Equal",
      "participants": [
        { "user": "60c72b2f4f1a4e3d88b67e47", "share": 1000 },
        { "user": "60c72b3e4f1a4e3d88b67e48", "share": 1000 },
        { "user": "60c72b4f4f1a4e3d88b67e49", "share": 1000 }
      ]
    }
    ```

  - **Response**:

    ```json
    {
      "_id": "60c72b5f4f1a4e3d88b67e50",
      "description": "Dinner",
      "amount": 3000,
      "paidBy": "60c72b2f4f1a4e3d88b67e47",
      "splitMethod": "Equal",
      "participants": [
        { "user": "60c72b2f4f1a4e3d88b67e47", "share": 1000 },
        { "user": "60c72b3e4f1a4e3d88b67e48", "share": 1000 },
        { "user": "60c72b4f4f1a4e3d88b67e49", "share": 1000 }
      ],
      "date": "2021-06-13T00:00:00.000Z",
      "__v": 0
    }
    ```

- **Retrieve Individual User Expenses**

  - **Endpoint**: `GET /api/expenses/user/:userId`
  - **Description**: Retrieve expenses for a specific user.
  - **Response**:

    ```json
    [
      {
        "_id": "60c72b5f4f1a4e3d88b67e50",
        "description": "Dinner",
        "amount": 3000,
        "paidBy": {
          "_id": "60c72b2f4f1a4e3d88b67e47",
          "name": "User One"
        },
        "splitMethod": "Equal",
        "participants": [
          { "user": { "_id": "60c72b2f4f1a4e3d88b67e47", "name": "User One" }, "share": 1000 },
          { "user": { "_id": "60c72b3e4f1a4e3d88b67e48", "name": "User Two" }, "share": 1000 },
          { "user": { "_id": "60c72b4f4f1a4e3d88b67e49", "name": "User Three" }, "share": 1000 }
        ],
        "date": "2021-06-13T00:00:00.000Z"
      }
    ]
    ```

- **Retrieve Overall Expenses**

  - **Endpoint**: `GET /api/expenses`
  - **Description**: Retrieve all expenses.
  - **Response**:

    ```json
    [
      {
        "_id": "60c72b5f4f1a4e3d88b67e50",
        "description": "Dinner",
        "amount": 3000,
        "paidBy": {
          "_id": "60c72b2f4f1a4e3d88b67e47",
          "name": "User One"
        },
        "splitMethod": "Equal",
        "participants": [
          { "user": { "_id": "60c72b2f4f1a4e3d88b67e47", "name": "User One" }, "share": 1000 },
          { "user": { "_id": "60c72b3e4f1a4e3d88b67e48", "name": "User Two" }, "share": 1000 },
          { "user": { "_id": "60c72b4f4f1a4e3d88b67e49", "name": "User Three" }, "share": 1000 }
        ],
        "date": "2021-06-13T00:00:00.000Z"
      }
    ]
    ```

- **Download Balance Sheet**

  - **Endpoint**: `GET /api/expenses/download`
  - **Description**: Download a balance sheet as a CSV file.
  - **Response**: This will prompt a download of a CSV file named `balance_sheet.csv`.

## Error Handling

The API returns appropriate error messages for invalid inputs or server errors. Examples of possible error responses include:

- **400 Bad Request**: Returned when required fields are missing or invalid.
  
  ```json
  {
    "error": "User validation failed: email: Path `email` is required., name: Path `name` is required., mobile: Path `mobile` is required."
  }
  ```

- **500 Internal Server Error**: Returned when there is an unexpected server error.
  
  ```json
  {
    "error": "Internal Server Error"
  }
  ```

## Future Improvements

- **User Authentication and Authorization**: Implement user authentication and authorization for added security.
- **Performance Optimization**: Optimize performance for handling large datasets.
- **Unit and Integration Tests**: Add comprehensive unit and integration tests.
- **Advanced Features**: Add features like recurring expenses, notifications, and more.

## Contributor

Dipankar Maharana
