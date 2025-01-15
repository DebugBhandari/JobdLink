# Jobd.Link
Jobd.Link is a personal project and passion project designed to streamline job searches, resume management, and job tracking. Built entirely by a single developer, this platform combines practicality and innovation to make job hunting easier and more organized.

### 🌟 Features
🆕 New Features
Add CV to Profile: Upload your CV directly to your profile for easy sharing.
Share CV Link: Generate and share a personalized CV link with potential employers.
Tailor CVs with Llama3.2: Customize your CVs using a locally hosted Llama3.2 AI model.
AI Playground: Explore the Llama3.2 chatbot/playground for assistance with CVs and more.
Improved UI: A sleek and intuitive user interface for better usability.
### ✅ Existing Features
Job Tracking: Keep track of your job applications and progress effortlessly.
Job Sharing: Share tracked jobs with friends and colleagues to expand opportunities.
AI Assistance: Although slightly nerfed due to limited resources, the AI provides helpful responses (with a slower response time).
You can find live server at https://jobd.link


🚀 Getting Started
### Prerequisites
Node.js
Docker (for Llama3.2 AI services)
MySql (for backend database)
Installation
Clone the repository:

bash
git clone https://github.com/debugbhandari/jobdlink.git
cd jobdlink
Install dependencies:

bash
npm install
Set up environment variables: Create a .env file in the root directory and add the following:

env
SECRET_KEY=your_secret_key
LINKEDIN_CLIENT_ID=get_it_from_linkedin
LINKEDIN_CLIENT_SECRET=get_it_from_linkedin
REACT_APP_NODE_ENV=node_env_for_react
NODE_ENV=node_env_for_express
PORT=your_port_of_choice_3000?
MYSQL_DATABASE=your_mysql_database
MYSQL_PORT=your_mysql_port_3306?
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_HOST=your_mysql_host_localhost?
LINKEDIN_REDIRECT_URI=http://localhost:3001/auth/linkedin/callback

Start the development server:

bash
npm run watch-server
cd jatfront
npm run start
Run Docker for AI Services: Ensure Docker is running, and start the Llama3.2 container:

bash
docker run -p 11434:11434 llama3.2:latest
Access the application: Open your browser and go to http://localhost:3000.

### 📚 Usage
Job Tracking
Add jobs to your dashboard and update their statuses as you progress through applications.
CV Management
Upload your CV and generate a shareable link for easy access.
Tailor your CVs using the AI-powered editor.
AI Features
Use the Llama3.2 chatbot/playground for job-related queries, CV suggestions, and more.
🛠 Technologies Used
Frontend: React, Material-UI
Backend: Node.js, Express.js
Database: MongoDB
AI: Llama3.2 (locally hosted using Docker)
Authentication: JSON Web Tokens (JWT)
🙌 Acknowledgements
This project is my hobby and passion. While it might not be a commercial-grade product, I’m proud of the features and the effort behind it. The AI might be slower and resources limited, but it works! 😊

📬 Feedback
I’d love to hear your thoughts or suggestions. Feel free to raise an issue or drop me a message!

📄 License
This project is licensed under the MIT License.

🌈 Contributing
Since this is a personal project, contributions are currently not open. However, feel free to fork and customize it for your own use!
