function ResultCard({data}){

return(

<div className="result-card">

<h2>ATS Score</h2>

<h1>{data.score}%</h1>

<hr/>

<h3>Matching Skills</h3>

<ul>
{data.matching_skills.map((skill,i)=>(
<li key={i}>{skill}</li>
))}
</ul>

<h3>Missing Skills</h3>

<ul>
{data.missing_skills.map((skill,i)=>(
<li key={i}>{skill}</li>
))}
</ul>

<h3>Learning Suggestions</h3>

<ul>
{data.skill_suggestions.map((item,i)=>(
<li key={i}>{item}</li>
))}
</ul>

<h3>Resume Improvements</h3>

<ul>
{data.resume_suggestions.map((item,i)=>(
<li key={i}>{item}</li>
))}
</ul>

</div>

);

}

export default ResultCard;