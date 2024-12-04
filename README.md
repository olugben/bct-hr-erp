Technology Stack
Backend
Node.js with Express
Database: MongoDB or PostgreSQL
Frontend
React 
Styling: Tailwind CSS 
Setup and Installation
Backend Setup
Clone the backend repository:


git clone https://github.com/olugben/bct-hr-erp.git
cd bct-hr-erp
Install backend dependencies:

npm install
Configure environment variables in a .env set up your postgres credential and jwt_secret_key




DATABASE_URL=postgresql://username:password@localhost:5432/hr-erp # for PostgreSQL
JWT_SECRET=your_jwt_secret
Run the server:

npm run dev
Access the backend APIs at http://localhost:4000.

API documentation for the backend is available in the docs folder and can be viewed via:
https://www.postman.com/security-technologist-83244836/bct-int/collection/9ufovoc/bct-hr-erp?action=share&creator=15511363


