skills_db = [
    "python","django","flask","sql","mysql","postgresql",
    "html","css","javascript","react","node","angular",
    "machine learning","data science","pandas","numpy",
    "git","github","docker","kubernetes","aws","azure",
    "rest api","fastapi"
]

def extract_skills(text):

    text = text.lower()
    detected = []

    for skill in skills_db:
        if skill in text:
            detected.append(skill)

    return detected