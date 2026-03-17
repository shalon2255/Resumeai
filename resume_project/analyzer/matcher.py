def match_skills(resume_skills, job_skills):

    resume_set = set(resume_skills)
    job_set = set(job_skills)

    matching = resume_set.intersection(job_set)
    missing = job_set.difference(resume_set)

    if len(job_set) == 0:
        score = 0
    else:
        score = (len(matching) / len(job_set)) * 100

    return {
        "matching_skills": list(matching),
        "missing_skills": list(missing),
        "score": round(score, 2)
    }