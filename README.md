AI Resume Analyzer & Rewriter

An intelligent web application that analyzes resumes, calculates ATS (Applicant Tracking System) scores, and provides AI-powered suggestions to improve resume quality and job relevance.

🚀 Features
📄 Upload Resume (PDF/DOCX)
📊 ATS Score Calculation
🧠 AI-Based Resume Analysis
✍️ Resume Rewriting Suggestions
🎯 Job Description Matching
🔍 Keyword Extraction & Optimization Tips
👤 User-Friendly Dashboard
🛠️ Tech Stack
Backend: Python, Django
Frontend: HTML, CSS, JavaScript
Database: MySQL / SQLite
AI/NLP: TF-IDF, Basic NLP Techniques
Other Tools: Git, GitHub
📂 Project Structure
ai_resume/
│── analyzer/          # Core resume analysis logic
│── users/             # User authentication module
│── templates/         # HTML templates
│── static/            # CSS, JS files
│── media/             # Uploaded resumes
│── manage.py
│── db.sqlite3
⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/shalon2255/Resumeai.git
cd Resumeai
2. Create virtual environment
python -m venv venv
venv\Scripts\activate   # Windows
3. Install dependencies
pip install -r requirements.txt
4. Run migrations
python manage.py migrate
5. Start server
python manage.py runserver
6. Open in browser
http://127.0.0.1:8000/
🧠 How It Works
User uploads a resume
System extracts text from the document
TF-IDF and NLP techniques analyze content
Resume is compared with job description
ATS score is generated
AI suggests improvements for better ranking

🎯 Use Cases
Students improving resumes for internships
Job seekers optimizing ATS compatibility
Recruiters performing quick resume screening
📌 Future Enhancements
🔊 Text-to-Speech Resume Feedback
📈 Advanced NLP using Transformers
🌐 Multi-language Resume Support
☁️ Deployment on Cloud (AWS/Render)
🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

📄 License

This project is open-source and available under the MIT License.

👨‍💻 Author

Shalon Rodrigs

GitHub: https://github.com/shalon2255
