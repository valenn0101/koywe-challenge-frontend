# How to Run the Application

## Frontend Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create environment file**
   Copy the `.env.example` file to `.env.local` and update the variables as needed:

   ```bash
   cp .env.example .env.local
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:3030

## Backend Integration

For complete functionality, this frontend application needs to connect to a backend API. We recommend using the following backend repository:

[Koywe Challenge Backend](https://github.com/valenn0101/koywe-challenge)

### Backend Setup Instructions

1. **Clone the backend repository**

   ```bash
   git clone https://github.com/valenn0101/koywe-challenge.git
   cd koywe-challenge
   ```

2. **Follow the backend documentation**

3. **Update frontend environment variables**
   After setting up the backend, make sure to update your frontend `.env.local` file with the correct backend API URL.
