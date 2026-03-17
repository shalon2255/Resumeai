import re

def extract_keywords(text):
    words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
    return set(words)


def keyword_analysis(resume_text, job_description):

    resume_keywords = extract_keywords(resume_text)
    job_keywords = extract_keywords(job_description)

    present = list(resume_keywords.intersection(job_keywords))
    missing = list(job_keywords.difference(resume_keywords))

    return present, missing