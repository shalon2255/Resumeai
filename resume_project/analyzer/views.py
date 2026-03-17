from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .resume_parser import extract_resume_text
from .skill_extractor import extract_skills
from .matcher import match_skills
from .ats_score import calculate_ats_score
from .keyword_analyzer import keyword_analysis
from .suggestion_engine import suggest_learning, resume_improvement_suggestions
from .scoring_engine import score_breakdown

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .resume_rewriter import rewrite_resume
from .job_match_predictor import predict_job_fit
@api_view(['POST'])
def analyze_resume(request):

    resume_file = request.FILES.get("resume")
    job_description = request.data.get("job_description", "")

    if not resume_file:
        return Response({"error": "Resume file is required"}, status=400)

  
    resume_text = extract_resume_text(resume_file)


    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)


    matching_skills = list(set(resume_skills) & set(job_skills))
    missing_skills = list(set(job_skills) - set(resume_skills))


    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([resume_text, job_description])

    similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0] * 100


    keyword_present, keyword_missing = keyword_analysis(resume_text, job_description)

 
    skill_suggestions = suggest_learning(missing_skills)

   
    resume_suggestions = resume_improvement_suggestions(resume_text)


    breakdown = score_breakdown(resume_skills, job_skills, similarity)


    job_fit_probability, job_fit_level = predict_job_fit(
        resume_text,
        job_description,
        resume_skills,
        job_skills
    )

    return Response({

        "resume_skills": resume_skills,
        "job_skills": job_skills,

        "matching_skills": matching_skills,
        "missing_skills": missing_skills,

        "score": round(similarity, 2),

        "keyword_present": keyword_present[:20],
        "keyword_missing": keyword_missing[:20],

        "skill_suggestions": skill_suggestions,

        "resume_suggestions": resume_suggestions,

        "score_breakdown": breakdown,

        "job_fit_prediction": {
            "probability": job_fit_probability,
            "level": job_fit_level
        }
    })
    


@api_view(['POST'])
def rewrite_resume_ai(request):

    resume_file = request.FILES.get("resume")

    if not resume_file:
        return Response({"error":"Resume required"},status=400)

    resume_text = extract_resume_text(resume_file)

    improved_resume = rewrite_resume(resume_text)

    return Response({
        "original_resume": resume_text,
        "improved_resume": improved_resume
    })    

