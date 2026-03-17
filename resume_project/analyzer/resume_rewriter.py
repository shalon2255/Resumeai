import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


def rewrite_resume(text):
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    prompt = f"""
You are a professional resume writer.

Improve the resume by:
- stronger bullet points
- measurable impact
- ATS friendly wording
- better technical phrasing

Resume:
{text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content