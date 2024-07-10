# Tasker

## Overview
Tasker is a task management application designed to streamline your workflow and boost productivity. Built with Next.js 14 for the front-end and Go (Golang) for the back-end, Tasker provides a seamless and efficient user experience.

## Features
- **Authentication**: Secure login, registration, and password recovery.
- **Email Notifications**: Automatic email notification with a registration number upon account creation.
- **Kanban Boards**: Visual task management with draggable tasks.
  - Create, update, and delete tasks.
  - Drag and drop tasks to reorganize.
  - Remove entire boards.

## Installation

### Prerequisites
- Node.js
- Docker
- PostgreSQL (or any preferred database)

### Front-end Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tasker.git
   cd tasker/frontend

2. Install dependencies:
   
- npm install
- Create a .env file and add your environment variables:
- NEXT_PUBLIC_API_URL=http://localhost:3000
- Run the development server:
- npm run dev
- Back-end Setup
- Navigate to the back-end directory:
- cd tasker/backend
