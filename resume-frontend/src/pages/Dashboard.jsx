import BaseLayout from "../layout/BaseLayout";

function Dashboard(){

return(

<BaseLayout>

<h1>Resume Analysis Dashboard</h1>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:"20px",
marginTop:"30px"
}}>

<div style={cardStyle}>
<h3>ATS Score</h3>
<p style={scoreStyle}>72%</p>
</div>

<div style={cardStyle}>
<h3>Job Fit</h3>
<p style={scoreStyle}>83%</p>
</div>

<div style={cardStyle}>
<h3>Skill Match</h3>
<p style={scoreStyle}>60%</p>
</div>

<div style={cardStyle}>
<h3>Keyword Match</h3>
<p style={scoreStyle}>75%</p>
</div>

</div>

</BaseLayout>

);

}

const cardStyle = {
padding:"20px",
borderRadius:"10px",
background:"#f4f4f4",
textAlign:"center",
boxShadow:"0 2px 6px rgba(0,0,0,0.1)"
}

const scoreStyle = {
fontSize:"32px",
fontWeight:"bold",
marginTop:"10px"
}

export default Dashboard;