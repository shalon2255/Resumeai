from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes, authentication_classes  # ✅ add authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication  # ✅ add this
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
from .models import ResumeAnalysis


@api_view(['POST'])
@authentication_classes([TokenAuthentication])  # ✅ add
@permission_classes([IsAuthenticated])
def analyze_resume(request):
    resume_file = request.FILES.get("resume")
    job_description = request.data.get("job_description", "")

    if not resume_file:
        return Response({"error": "Resume file is required"}, status=400)

    try:
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
            resume_text, job_description, resume_skills, job_skills
        )

        ResumeAnalysis.objects.create(
            user=request.user,
            resume_name=resume_file.name,
            ats_score=round(similarity, 2),
            job_fit_score=job_fit_probability,
            matched_skills=matching_skills,
            missing_skills=missing_skills
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

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])  # ✅ add
@permission_classes([IsAuthenticated])
def rewrite_resume_ai(request):
    resume_file = request.FILES.get("resume")

    if not resume_file:
        return Response({"error": "Resume required"}, status=400)

    try:
        resume_text = extract_resume_text(resume_file)
        improved_resume = rewrite_resume(resume_text)

        return Response({
            "original_resume": resume_text,
            "improved_resume": improved_resume
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])  # ✅ add
@permission_classes([IsAuthenticated])
def get_history(request):
    try:
        analyses = ResumeAnalysis.objects.filter(user=request.user).order_by('-created_at')

        data = []
        for a in analyses:
            data.append({
                "resume_name": a.resume_name,
                "ats_score": a.ats_score,
                "job_fit_score": a.job_fit_score,
                "date": a.created_at
            })

        return Response(data)

    except Exception as e:
        return Response({"error": str(e)}, status=500)