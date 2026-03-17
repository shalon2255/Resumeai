COURSE_SUGGESTIONS = {
    "docker": "Learn Docker Fundamentals",
    "aws": "AWS Cloud Practitioner Certification",
    "react": "Advanced React Development",
    "django": "Django REST Framework Mastery",
    "machine learning": "Machine Learning with Python",
}


def suggest_learning(missing_skills):

    suggestions = []

    for skill in missing_skills:
        if skill in COURSE_SUGGESTIONS:
            suggestions.append(COURSE_SUGGESTIONS[skill])
        else:
            suggestions.append(f"Study {skill}")

    return suggestions


def resume_improvement_suggestions(resume_text):

    suggestions = []

    if "project" not in resume_text.lower():
        suggestions.append("Add project experience section")

    if "%" not in resume_text:
        suggestions.append("Add measurable achievements with numbers")

    if len(resume_text.split()) < 300:
        suggestions.append("Resume content is short, expand experience details")

    return suggestions