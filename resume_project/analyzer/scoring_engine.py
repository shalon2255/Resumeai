def score_breakdown(resume_skills, job_skills, similarity_score):

    if len(job_skills) == 0:
        skill_match = 0
    else:
        skill_match = (len(set(resume_skills) & set(job_skills)) / len(job_skills)) * 100

    keyword_match = similarity_score

    return {
        "skill_match": round(skill_match,2),
        "keyword_match": round(keyword_match,2),
        "similarity_score": round(similarity_score,2)
    }