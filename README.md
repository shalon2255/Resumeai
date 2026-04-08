# 🤖 AI Resume Analyzer & Rewriter

An intelligent full-stack web application that analyzes resumes, calculates ATS (Applicant Tracking System) scores, and provides AI-powered suggestions to improve resume quality and job relevance.

---

## 🚀 Features

* 📄 Upload Resume (PDF/DOCX)
* 📊 ATS Score Calculation
* 🧠 AI-Based Resume Analysis
* ✍️ Resume Rewriting Suggestions
* 🎯 Job Description Matching
* 🔍 Keyword Extraction & Optimization Tips
* 👤 User Authentication (Login/Register)
* 📱 Responsive UI (React Frontend)

---

## 🛠️ Tech Stack

**Frontend:** React, HTML, CSS, JavaScript
**Backend:** Python, Django
**Database:** SQLite / MySQL
**AI/NLP:** TF-IDF, Basic NLP Techniques
**Tools:** Git, GitHub

---

## 📂 Project Structure

```
ai_resume/
│── resume_project/        # Django Backend
│── resume-frontend/       # React Frontend
│── analyzer/              # Resume analysis logic
│── users/                 # Authentication module
│── templates/             # Django templates (if used)
│── static/                # Static files
│── media/                 # Uploaded resumes
│── manage.py
│── db.sqlite3
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone the Repository

```
git clone https://github.com/shalon2255/Resumeai.git
cd Resumeai
```

---

## 🖥️ Backend Setup (Django)

### 2. Create Virtual Environment

```
python -m venv venv
venv\Scripts\activate   # Windows
```

### 3. Install Dependencies

```
pip install -r requirements.txt
```

### 4. Run Migrations

```
python manage.py migrate
```

### 5. Start Backend Server

```
python manage.py runserver
```

Backend runs on:

```
http://127.0.0.1:8000/
```

---

## ⚛️ Frontend Setup (React)

### 6. Go to Frontend Folder

```
cd resume-frontend
```

### 7. Install Dependencies

```
npm install
```

### 8. Start React App

```
npm start
```

Frontend runs on:

```
http://localhost:3000/
```

---

## 🔗 Connecting Frontend & Backend

Ensure API calls from React point to Django backend:

Example:

```
http://127.0.0.1:8000/api/analyze/
```

---

## 🧠 How It Works

1. User uploads a resume
2. System extracts text from the file
3. NLP techniques (TF-IDF) analyze content
4. Resume is compared with job description
5. ATS score is calculated
6. AI suggests improvements

---

## 🎯 Use Cases

* Students improving resumes for internships
* Job seekers optimizing ATS compatibility
* Recruiters performing quick resume screening

---

## 📌 Future Enhancements

* 🔊 Text-to-Speech Resume Feedback
* 📈 Advanced NLP (Transformers / AI Models)
* 🌐 Multi-language Resume Support
* ☁️ Cloud Deployment (AWS / Render / Vercel)

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repository and submit a pull request.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Shalon Rodrigs**
GitHub: https://github.com/shalon2255

---
