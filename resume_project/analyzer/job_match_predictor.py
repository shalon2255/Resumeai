from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def predict_job_fit(resume_text, job_description, resume_skills, job_skills):

    # Skill match score
    if len(job_skills) == 0:
        skill_score = 0
    else:
        skill_score = len(set(resume_skills) & set(job_skills)) / len(job_skills)

    # Text similarity score
    vectorizer = TfidfVectorizer()

    tfidf = vectorizer.fit_transform([resume_text, job_description])

    similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]

    # Keyword overlap
    resume_words = set(resume_text.lower().split())
    job_words = set(job_description.lower().split())

    keyword_score = len(resume_words & job_words) / max(len(job_words),1)

    # Weighted final score
    final_score = (
        skill_score * 0.4 +
        keyword_score * 0.3 +
        similarity * 0.3
    )

    probability = round(final_score * 100,2)

    # Classification
    if probability > 75:
        level = "Strong Match"
    elif probability > 50:
        level = "Moderate Match"
    else:
        level = "Low Match"

    return probability, level