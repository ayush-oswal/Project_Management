# 🚀 Project Management Website

This project is a business-to-business (B2B) website tailored for project management. It facilitates two main user cases: administrators and employees. Administrators have the ability to manage clients, employees, and projects. Projects assigned to employees are displayed on their respective dashboards. The website is fully responsive and features a search functionality for projects. Additionally, users can add comments to track progress on projects. Administrators can set the status of projects to "Not Started" (red), "In Progress" (yellow), or "Completed" (green). On the dashboard, projects are organized according to their status.

## 🛠️ Tech Stack

- **Next.js**: A React framework for building server-side rendered and statically generated web applications.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **GraphQL**: A query language for APIs used to interact with the server and fetch data efficiently.
- **Zustand**: A simple and fast state management solution for React.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **Docker**: A platform for developing, shipping, and running applications in containers.

## ⚙️ Setup Guide

### Local Setup

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Set up environment variables by creating a `.env.local` file based on `.env.example` and filling in the required values.

4. Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

6. Type "Admin" on username and use password you put in .env file for admin login.

### Docker Setup

1. Make sure Docker is installed on your system.

2. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

3. Set up environment variables by creating a `.env.local` file based on `.env.example` and filling in the required values.

4. Build and run the Docker containers:

    ```bash
    docker-compose up --build
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

6. Type "Admin" on username and use password you put in .env file for admin login.
