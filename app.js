const categories = [
  {
    name:"1. Website Health & Performance",
    checks:[
      ["Page loads correctly","Homepage and key pages load without obvious errors."],
      ["Page speed","Pages load within a reasonable time on desktop/mobile."],
      ["Broken links","Important internal links and navigation work."],
      ["Mobile display","Website is usable and readable on mobile devices."]
    ]
  },
  {
    name:"2. WordPress / Technical",
    checks:[
      ["WordPress version","Core software is current and supported."],
      ["Theme status","Theme is supported and compatible with the current setup."],
      ["Plugin status","Plugins are current, necessary and compatible."],
      ["PHP / server compatibility","Hosting environment supports the website requirements."]
    ]
  },
  {
    name:"3. Security & SSL",
    checks:[
      ["SSL certificate","HTTPS is active and certificate is valid."],
      ["Security configuration","Basic website security controls are in place."],
      ["Administrator access","Admin accounts and access are controlled appropriately."],
      ["Security updates","Core, theme and plugins are being maintained."]
    ]
  },
  {
    name:"4. SEO Fundamentals",
    checks:[
      ["Search indexing","Website can be indexed by search engines where appropriate."],
      ["Page titles / descriptions","Important pages have meaningful SEO metadata."],
      ["Headings","Pages use logical heading structure."],
      ["Sitemap / robots","Sitemap and crawl controls are appropriately configured."]
    ]
  },
  {
    name:"5. Ownership, Backup & Recovery",
    checks:[
      ["Domain ownership","Domain registration and control are understood."],
      ["Website ownership","Client knows who owns and controls the website."],
      ["Hosting access","Hosting account and credentials are documented."],
      ["Backups","Recent usable backups exist and restoration options are known."]
    ]
  },
  {
    name:"6. Recommendations & Future Readiness",
    checks:[
      ["Maintenance plan","There is a documented process for ongoing maintenance."],
      ["Content review","Important content is accurate and current."],
      ["Privacy / compliance","Relevant privacy, cookie and legal information is reviewed."],
      ["Improvement priorities","A practical improvement roadmap can be established."]
    ]
  }
];

function renderChecks(){
  const root=document.getElementById("checks");
  root.innerHTML="";
  categories.forEach((cat,ci)=>{
    const section=document.createElement("div");
    section.className="category";
    section.innerHTML=`<div class="category-header"><h3>${cat.name}</h3><span class="category-score" id="cat-${ci}">0%</span></div>`;
    cat.checks.forEach((check,ri)=>{
      const row=document.createElement("div");
      row.className="check-row";
      row.innerHTML=`
        <div><div class="check-name">${check[0]}</div><div class="check-help">${check[1]}</div></div>
        <select class="result" data-category="${ci}" data-check="${ri}">
          <option value="">Not assessed</option>
          <option value="pass">Pass</option>
          <option value="amber">Attention</option>
          <option value="fail">Fail</option>
        </select>
        <input class="evidence" placeholder="Evidence / notes">
      `;
      section.appendChild(row);
    });
    root.appendChild(section);
  });
}

function calculateAssessment(){
  const results=[...document.querySelectorAll(".result")];
  const assessed=results.filter(x=>x.value);
  if(!assessed.length){
    updateSummary(0,"NOT ASSESSED","Complete the checks below to generate an assessment summary.");
    return;
  }

  const points={pass:1,amber:.5,fail:0};
  const total=assessed.reduce((s,x)=>s+points[x.value],0);
  const score=Math.round(total/assessed.length*100);

  let status="RED", cls="status-red", label="ACTION REQUIRED";
  if(score>=85){status="GREEN";cls="status-green";label="GOOD"; }
  else if(score>=65){status="AMBER";cls="status-amber";label="ATTENTION";}

  updateSummary(score,label,`${assessed.length} of ${results.length} checks assessed. ${score}% of assessed checks are currently satisfactory or require only attention.`);

  categories.forEach((cat,ci)=>{
    const catResults=results.filter(x=>Number(x.dataset.category)===ci && x.value);
    const catScore=catResults.length ? Math.round(catResults.reduce((s,x)=>s+points[x.value],0)/catResults.length*100):0;
    document.getElementById(`cat-${ci}`).textContent=`${catScore}%`;
  });

  const report=document.getElementById("reportSummary");
  const fails=results.filter(x=>x.value==="fail").length;
  const amber=results.filter(x=>x.value==="amber").length;
  report.innerHTML=`
    <div class="report-grid">
      <div class="report-item"><strong>${score}%</strong><br>Overall assessment score</div>
      <div class="report-item"><strong>${fails}</strong><br>Items requiring action</div>
      <div class="report-item"><strong>${amber}</strong><br>Items requiring attention</div>
    </div>
    <p><strong>Recommended next step:</strong> Review all failed and attention items, confirm the evidence recorded, and create a prioritised website improvement plan.</p>
  `;
}

function updateSummary(score,label,text){
  document.getElementById("score").textContent=`${score}%`;
  document.getElementById("progressBar").style.width=`${score}%`;
  document.getElementById("scoreLabel").textContent=label;
  const badge=document.getElementById("overallStatus");
  badge.textContent=label;
  badge.className=`status-badge ${label==="GOOD"?"status-green":label==="ATTENTION"?"status-amber":label==="ACTION REQUIRED"?"status-red":"status-grey"}`;
  document.getElementById("summaryText").textContent=text;
}

function resetAssessment(){
  document.querySelectorAll(".result").forEach(x=>x.value="");
  document.querySelectorAll(".evidence").forEach(x=>x.value="");
  document.getElementById("assessmentDate").value=new Date().toISOString().slice(0,10);
  updateSummary(0,"NOT ASSESSED","Complete the checks below to generate an assessment summary.");
  document.getElementById("reportSummary").textContent="Complete the assessment to generate your summary.";
  categories.forEach((_,ci)=>document.getElementById(`cat-${ci}`).textContent="0%");
}

renderChecks();
document.getElementById("assessmentDate").value=new Date().toISOString().slice(0,10);
