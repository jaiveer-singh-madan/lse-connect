import { useState, useEffect } from "react";

const INTERESTS_ALL = ["Finance","Maths","Economics","Data Science","Career","Food","Affordable Living","Exam Prep","Internships","Philosophy","Politics","Law","Startups","Coding","Sports","Music","Mental Health","Sustainability"];

const DEPARTMENTS = ["Economics","Finance","Mathematics","Management","Law","International Relations","Social Policy","Government","Accounting","Philosophy","Statistics","International History"];

const USERS = [
  {id:1,name:"Priya Sharma",year:3,dept:"Finance",photo:"👩🏽‍💼",interests:["Finance","Career","Internships","Startups"],bio:"VP of LSE Finance Society. Interned at Goldman Sachs and Citadel. Happy to chat about IB/HF recruiting!",posts:["Just got my return offer from Citadel! Happy to help anyone prepping for quant interviews 🎉","Best affordable lunch near campus: Wraps at Fleet Street Kitchen, £4.50 and massive portions"]},
  {id:2,name:"James Chen",year:2,dept:"Economics",photo:"👨🏻‍🎓",interests:["Economics","Maths","Exam Prep","Food"],bio:"Second year BSc Econ. Scored 78 in EC102 last year. Love finding cheap eats around Holborn.",posts:["Exam tip: For EC210, focus on problem sets 4-8. They recycled 3 questions from those last year","Ramen at Bone Daddies after exams is a spiritual experience 🍜"]},
  {id:3,name:"Amara Okafor",year:1,dept:"Law",photo:"👩🏿‍⚖️",interests:["Law","Politics","Career","Mental Health"],bio:"First year LLB. Passionate about human rights law. Looking for mooting partners and study buddies!",posts:["Anyone else feel overwhelmed in first term? The academic mentors program is nice but I wish I could just pick someone to talk to"]},
  {id:4,name:"Seb Müller",year:3,dept:"Management",photo:"👨🏼‍💻",interests:["Startups","Coding","Data Science","Career"],bio:"Co-founded a fintech startup in year 2. YC applicant. Can help with startup ideas and tech career paths.",posts:["Free workshop: I'm running a no-code MVP session at LSE Generate next Thursday. DM me!","Pro tip: The 24hr study rooms in the library are underrated during Easter term"]},
  {id:5,name:"Fatima Al-Rashid",year:2,dept:"International Relations",photo:"👩🏽‍🔬",interests:["Politics","Philosophy","Sustainability","Food"],bio:"IR student with a minor in Environmental Policy. Organising LSE's first climate hackathon this spring.",posts:["Best coffee near campus that isn't Starbucks: Department of Coffee on Leather Lane. Trust me.","Looking for people interested in policy writing for the Beaver 📰"]},
  {id:6,name:"Tom Williams",year:3,dept:"Statistics",photo:"👨🏻‍🔬",interests:["Data Science","Maths","Coding","Finance"],bio:"Stats final year. Research assistant for Prof. Hansen. Heading to Jane Street after graduation.",posts:["If you're struggling with ST202, I've compiled notes that cover everything. DM me","Flatmates needed for a 4-bed in Zone 2, £680/month each — message me!"]},
  {id:7,name:"Yuki Tanaka",year:1,dept:"Economics",photo:"👩🏻‍🎓",interests:["Economics","Exam Prep","Affordable Living","Music"],bio:"First year from Tokyo. Trying to figure out London on a student budget. Piano player 🎹",posts:["Is there a guide to surviving LSE on a budget? Groceries alone are killing me 😭","Found a practice room with a piano in the basement of NAB — hidden gem!"]},
  {id:8,name:"Rahul Patel",year:2,dept:"Accounting",photo:"👨🏽‍💼",interests:["Finance","Career","Sports","Internships"],bio:"Training contract secured at Deloitte. Captain of LSE Cricket. Ask me about Big 4 apps!",posts:["Big 4 tip: Apply in September. By November most spots are gone. Start your apps NOW","Sunday cricket in Regent's Park — all skill levels welcome, DM to join 🏏"]},
  {id:9,name:"Elena Rossi",year:3,dept:"Philosophy",photo:"👩🏼‍🎨",interests:["Philosophy","Mental Health","Music","Sustainability"],bio:"Writing my dissertation on ethics of AI. Volunteer at LSE Nightline. Big believer in work-life balance.",posts:["Reminder: It's okay to not have an internship lined up. Your worth isn't your CV","Free meditation sessions every Wednesday at the Faith Centre — genuinely life-changing"]},
  {id:10,name:"David Kim",year:1,dept:"Mathematics",photo:"👨🏻‍🔬",interests:["Maths","Coding","Exam Prep","Data Science"],bio:"First year BSc Maths. Coming from a CS background. Building side projects and looking for collaborators.",posts:["Anyone want to start a competitive programming club? There's nothing like it at LSE currently","The vending machine coffee in OLD is actually decent for 60p. Hot take."]},
  {id:11,name:"Chloe Dubois",year:2,dept:"Government",photo:"👩🏼‍💼",interests:["Politics","Law","Career","Startups"],bio:"Aspiring policy consultant. Interned at UK Parliament last summer. LSE Women in Politics president.",posts:["Networking tip: Go to EVERY careers event in Michaelmas. That's how I got my Parliament internship","Anyone know good affordable formal wear shops? Have a conference next week"]},
  {id:12,name:"Marcus Johnson",year:3,dept:"International History",photo:"👨🏿‍🎓",interests:["Politics","Philosophy","Food","Sports"],bio:"Final year. Dissertation on post-colonial economics. Food blogger on the side. Arsenal fan.",posts:["Top 5 budget eats near LSE thread 🧵: 1. Tas Pide (£7 pide), 2. Bun House (£5 baos)...","The SAU bar quiz night is genuinely fun and barely anyone knows about it"]}
];

const FEED_POSTS = USERS.flatMap(u=>u.posts.map((p,i)=>({id:`${u.id}-${i}`,user:u,text:p,likes:Math.floor(Math.random()*40)+3,comments:Math.floor(Math.random()*12)+1,time:["2h ago","5h ago","1d ago","2d ago","3d ago","4d ago","1w ago"][Math.floor(Math.random()*7)]})));

const MY_PROFILE = {name:"You",year:2,dept:"Economics",interests:["Finance","Maths","Career","Food"],photo:"🧑‍🎓"};

const Badge = ({children,active,onClick})=>(
  <button onClick={onClick} style={{padding:"4px 12px",borderRadius:20,border:active?"2px solid #D50032":"1px solid #ccc",background:active?"#FFF0F3":"#fff",color:active?"#D50032":"#555",fontSize:13,cursor:"pointer",fontWeight:active?600:400,transition:"all 0.2s"}}>{children}</button>
);

const Tab = ({active,children,onClick,icon})=>(
  <button onClick={onClick} style={{padding:"10px 20px",background:"none",border:"none",borderBottom:active?"3px solid #D50032":"3px solid transparent",color:active?"#D50032":"#666",fontWeight:active?700:500,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",gap:6,transition:"all 0.2s"}}>{icon}{children}</button>
);

export default function App(){
  const [tab,setTab]=useState("discover");
  const [filterInterests,setFI]=useState([]);
  const [filterYear,setFY]=useState(null);
  const [selectedUser,setSU]=useState(null);
  const [connections,setConn]=useState({});
  const [msgOpen,setMsgOpen]=useState(null);
  const [msgText,setMsgText]=useState("");
  const [sentMsgs,setSentMsgs]=useState({});
  const [searchQ,setSearchQ]=useState("");
  const [showOnboard,setShowOnboard]=useState(true);
  const [feedFilter,setFF]=useState("All");
  const [likedPosts,setLP]=useState({});
  const [newPost,setNP]=useState("");
  const [myPosts,setMyPosts]=useState([]);
  const [showNotif,setSN]=useState(false);

  const toggleInterest=(i)=>setFI(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);

  const filtered=USERS.filter(u=>{
    if(filterYear&&u.year!==filterYear)return false;
    if(filterInterests.length&&!filterInterests.some(i=>u.interests.includes(i)))return false;
    if(searchQ){const q=searchQ.toLowerCase();return u.name.toLowerCase().includes(q)||u.dept.toLowerCase().includes(q)||u.interests.some(i=>i.toLowerCase().includes(q));}
    return true;
  });

  const allFeed=[...myPosts,...FEED_POSTS].sort(()=>0.5-Math.random());
  const feedFiltered=feedFilter==="All"?allFeed:allFeed.filter(p=>p.user.interests?.includes(feedFilter)||p.tags?.includes(feedFilter));

  if(showOnboard)return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1a0a0e 0%,#2d0a16 30%,#0d0d0d 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',system-ui,sans-serif",padding:20}}>
      <div style={{maxWidth:520,width:"100%",textAlign:"center"}}>
        <div style={{marginBottom:32}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:48,height:48,borderRadius:12,background:"linear-gradient(135deg,#D50032,#ff4d6d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:"#fff",fontWeight:800}}>L</div>
            <span style={{fontSize:28,fontWeight:800,color:"#fff",letterSpacing:"-0.5px"}}>LSE Connect</span>
          </div>
          <p style={{color:"#ff8fa3",fontSize:14,margin:0,letterSpacing:"2px",textTransform:"uppercase",fontWeight:600}}>Your Campus. Your Network.</p>
        </div>
        <div style={{background:"rgba(255,255,255,0.05)",backdropFilter:"blur(20px)",borderRadius:24,padding:"40px 36px",border:"1px solid rgba(213,0,50,0.2)"}}>
          <h2 style={{color:"#fff",margin:"0 0 8px",fontSize:22}}>Welcome to the LSE Network</h2>
          <p style={{color:"#aaa",margin:"0 0 28px",fontSize:14,lineHeight:1.6}}>Connect with fellow students by interest, year, and department. Get advice, find mentors, share recommendations — all within LSE.</p>
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:16,padding:20,marginBottom:24,textAlign:"left"}}>
            <p style={{color:"#ccc",fontSize:13,margin:"0 0 12px",fontWeight:600}}>YOUR PROFILE PREVIEW</p>
            <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:16}}>
              <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#D50032,#ff4d6d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🧑‍🎓</div>
              <div>
                <p style={{color:"#fff",margin:0,fontWeight:700,fontSize:16}}>2nd Year · Economics</p>
                <p style={{color:"#aaa",margin:0,fontSize:13}}>BSc Economics</p>
              </div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {MY_PROFILE.interests.map(i=><span key={i} style={{padding:"4px 12px",borderRadius:20,background:"rgba(213,0,50,0.15)",color:"#ff6b81",fontSize:12,fontWeight:600}}>{i}</span>)}
            </div>
          </div>
          <button onClick={()=>setShowOnboard(false)} style={{width:"100%",padding:"14px 0",borderRadius:14,border:"none",background:"linear-gradient(135deg,#D50032,#ff1a4d)",color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",letterSpacing:"0.3px",boxShadow:"0 4px 24px rgba(213,0,50,0.4)",transition:"transform 0.15s"}} onMouseOver={e=>e.target.style.transform="scale(1.02)"} onMouseOut={e=>e.target.style.transform="scale(1)"}>Enter LSE Connect →</button>
          <p style={{color:"#666",fontSize:11,marginTop:16}}>Prototype Demo · LSE LIFE Presentation</p>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#f5f5f7",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      {/* NAV */}
      <nav style={{background:"#fff",borderBottom:"1px solid #eee",padding:"0 24px",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:34,height:34,borderRadius:8,background:"linear-gradient(135deg,#D50032,#ff4d6d)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:16}}>L</div>
            <span style={{fontWeight:800,fontSize:18,color:"#1a1a1a"}}>LSE Connect</span>
          </div>
          <div style={{display:"flex",gap:0}}>
            <Tab active={tab==="discover"} onClick={()=>setTab("discover")} icon="🔍">Discover</Tab>
            <Tab active={tab==="feed"} onClick={()=>setTab("feed")} icon="📢">Feed</Tab>
            <Tab active={tab==="connections"} onClick={()=>setTab("connections")} icon="🤝">My Network</Tab>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setSN(!showNotif)} style={{position:"relative",background:"none",border:"none",fontSize:20,cursor:"pointer",padding:4}}>🔔{Object.keys(connections).length>0&&<span style={{position:"absolute",top:-2,right:-2,width:16,height:16,borderRadius:8,background:"#D50032",color:"#fff",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{Object.keys(connections).length}</span>}</button>
            <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#D50032,#ff4d6d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🧑‍🎓</div>
          </div>
        </div>
      </nav>

      {showNotif&&<div style={{position:"fixed",top:60,right:24,width:320,background:"#fff",borderRadius:16,boxShadow:"0 8px 40px rgba(0,0,0,0.15)",zIndex:200,padding:20,border:"1px solid #eee"}}>
        <h3 style={{margin:"0 0 12px",fontSize:15}}>Notifications</h3>
        {Object.keys(connections).length===0?<p style={{color:"#999",fontSize:13}}>No notifications yet</p>:
        Object.entries(connections).map(([id,s])=>{const u=USERS.find(x=>x.id===+id);return u?<div key={id} style={{padding:"10px 0",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:24}}>{u.photo}</span>
          <div><p style={{margin:0,fontSize:13,fontWeight:600}}>{u.name}</p><p style={{margin:0,fontSize:12,color:s==="accepted"?"#22c55e":"#D50032"}}>{s==="accepted"?"Accepted your connection!":"Request pending"}</p></div>
        </div>:null;})}
      </div>}

      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 24px"}}>

      {/* DISCOVER */}
      {tab==="discover"&&<div>
        <div style={{marginBottom:20}}>
          <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search by name, department, or interest..." style={{width:"100%",padding:"12px 20px",borderRadius:14,border:"1px solid #ddd",fontSize:14,outline:"none",boxSizing:"border-box",background:"#fff"}} />
        </div>
        <div style={{background:"#fff",borderRadius:16,padding:20,marginBottom:20,border:"1px solid #eee"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{margin:0,fontWeight:700,fontSize:14,color:"#333"}}>Filter by Interest</p>
            {filterInterests.length>0&&<button onClick={()=>setFI([])} style={{background:"none",border:"none",color:"#D50032",cursor:"pointer",fontSize:12,fontWeight:600}}>Clear all</button>}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{INTERESTS_ALL.map(i=><Badge key={i} active={filterInterests.includes(i)} onClick={()=>toggleInterest(i)}>{i}</Badge>)}</div>
          <div style={{marginTop:14,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13,fontWeight:600,color:"#333"}}>Year:</span>
            {[1,2,3].map(y=><Badge key={y} active={filterYear===y} onClick={()=>setFY(filterYear===y?null:y)}>Year {y}</Badge>)}
          </div>
        </div>
        <p style={{fontSize:13,color:"#888",marginBottom:12}}>{filtered.length} student{filtered.length!==1?"s":""} found</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300,1fr))",gap:16}}>
          {filtered.map(u=>(
            <div key={u.id} style={{background:"#fff",borderRadius:18,padding:24,border:"1px solid #eee",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.03)"}} onClick={()=>setSU(u)} onMouseOver={e=>{e.currentTarget.style.boxShadow="0 4px 20px rgba(213,0,50,0.1)";e.currentTarget.style.borderColor="#f0c0c8"}} onMouseOut={e=>{e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.03)";e.currentTarget.style.borderColor="#eee"}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                <div style={{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#FFF0F3,#ffe0e6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{u.photo}</div>
                <div>
                  <p style={{margin:0,fontWeight:700,fontSize:15}}>{u.name}</p>
                  <p style={{margin:0,color:"#888",fontSize:12}}>Year {u.year} · {u.dept}</p>
                </div>
              </div>
              <p style={{fontSize:13,color:"#555",lineHeight:1.5,margin:"0 0 14px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{u.bio}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {u.interests.map(i=><span key={i} style={{padding:"3px 10px",borderRadius:20,background:MY_PROFILE.interests.includes(i)?"#FFF0F3":"#f5f5f5",color:MY_PROFILE.interests.includes(i)?"#D50032":"#777",fontSize:11,fontWeight:600,border:MY_PROFILE.interests.includes(i)?"1px solid #ffcdd2":"1px solid #e8e8e8"}}>{i}{MY_PROFILE.interests.includes(i)?" ✦":""}</span>)}
              </div>
              <div style={{display:"flex",gap:8,marginTop:16}}>
                <button onClick={e=>{e.stopPropagation();setConn(p=>({...p,[u.id]:p[u.id]||"pending"}));setTimeout(()=>setConn(p=>({...p,[u.id]:"accepted"})),2000)}} disabled={connections[u.id]} style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",background:connections[u.id]==="accepted"?"#22c55e":connections[u.id]==="pending"?"#f5f5f5":"linear-gradient(135deg,#D50032,#ff1a4d)",color:connections[u.id]?"#333":"#fff",fontSize:12,fontWeight:700,cursor:connections[u.id]?"default":"pointer",transition:"all 0.2s"}}>{connections[u.id]==="accepted"?"✓ Connected":connections[u.id]==="pending"?"⏳ Pending":"Connect"}</button>
                <button onClick={e=>{e.stopPropagation();setMsgOpen(u.id);setMsgText("")}} style={{flex:1,padding:"9px 0",borderRadius:10,border:"1px solid #ddd",background:"#fff",color:"#333",fontSize:12,fontWeight:600,cursor:"pointer"}}>💬 Message</button>
              </div>
            </div>
          ))}
        </div>
      </div>}

      {/* FEED */}
      {tab==="feed"&&<div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{background:"#fff",borderRadius:16,padding:20,marginBottom:16,border:"1px solid #eee"}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#D50032,#ff4d6d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🧑‍🎓</div>
            <div style={{flex:1}}>
              <textarea value={newPost} onChange={e=>setNP(e.target.value)} placeholder="Share advice, recommendations, or a question..." rows={3} style={{width:"100%",border:"1px solid #eee",borderRadius:12,padding:12,fontSize:14,resize:"none",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                <div style={{display:"flex",gap:8}}>
                  {["🍽️ Food","💼 Career","📚 Study","💡 Tips"].map(t=><button key={t} style={{padding:"4px 10px",borderRadius:8,border:"1px solid #eee",background:"#fafafa",fontSize:11,cursor:"pointer"}}>{t}</button>)}
                </div>
                <button onClick={()=>{if(newPost.trim()){setMyPosts(p=>[{id:`me-${Date.now()}`,user:MY_PROFILE,text:newPost,likes:0,comments:0,time:"Just now",isMe:true},...p]);setNP("")}}} style={{padding:"8px 20px",borderRadius:10,border:"none",background:newPost.trim()?"linear-gradient(135deg,#D50032,#ff1a4d)":"#eee",color:newPost.trim()?"#fff":"#999",fontWeight:700,fontSize:13,cursor:newPost.trim()?"pointer":"default"}}>Post</button>
              </div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
          {["All","Food","Career","Internships","Exam Prep","Affordable Living","Startups"].map(f=><Badge key={f} active={feedFilter===f} onClick={()=>setFF(f)}>{f}</Badge>)}
        </div>
        {feedFiltered.slice(0,15).map(p=>(
          <div key={p.id} style={{background:"#fff",borderRadius:16,padding:20,marginBottom:12,border:"1px solid #eee"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:p.isMe?"linear-gradient(135deg,#D50032,#ff4d6d)":"linear-gradient(135deg,#FFF0F3,#ffe0e6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{p.user.photo}</div>
              <div>
                <p style={{margin:0,fontWeight:700,fontSize:13}}>{p.isMe?"You":p.user.name}</p>
                <p style={{margin:0,color:"#999",fontSize:11}}>Year {p.user.year} · {p.user.dept} · {p.time}</p>
              </div>
            </div>
            <p style={{margin:"0 0 14px",fontSize:14,lineHeight:1.6,color:"#333"}}>{p.text}</p>
            <div style={{display:"flex",gap:16,borderTop:"1px solid #f5f5f5",paddingTop:12}}>
              <button onClick={()=>setLP(pr=>({...pr,[p.id]:!pr[p.id]}))} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:likedPosts[p.id]?"#D50032":"#888",fontWeight:likedPosts[p.id]?700:400,display:"flex",alignItems:"center",gap:4}}>{likedPosts[p.id]?"❤️":"🤍"} {p.likes+(likedPosts[p.id]?1:0)}</button>
              <button style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#888",display:"flex",alignItems:"center",gap:4}}>💬 {p.comments}</button>
              <button style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"#888"}}>🔖 Save</button>
            </div>
          </div>
        ))}
      </div>}

      {/* CONNECTIONS */}
      {tab==="connections"&&<div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{background:"#fff",borderRadius:16,padding:28,marginBottom:20,border:"1px solid #eee",textAlign:"center"}}>
          <div style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#D50032,#ff4d6d)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 16px"}}>🧑‍🎓</div>
          <h2 style={{margin:"0 0 4px",fontSize:20}}>Your Network</h2>
          <p style={{color:"#888",margin:0,fontSize:13}}>{Object.values(connections).filter(v=>v==="accepted").length} connections · {Object.values(connections).filter(v=>v==="pending").length} pending</p>
        </div>
        {Object.keys(connections).length===0?
          <div style={{textAlign:"center",padding:40,color:"#999"}}>
            <p style={{fontSize:40,margin:"0 0 12px"}}>🌐</p>
            <p style={{fontWeight:600,fontSize:15}}>Start building your LSE network</p>
            <p style={{fontSize:13}}>Head to Discover to find students with shared interests</p>
            <button onClick={()=>setTab("discover")} style={{marginTop:12,padding:"10px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#D50032,#ff1a4d)",color:"#fff",fontWeight:700,cursor:"pointer"}}>Discover Students</button>
          </div>:
          Object.entries(connections).map(([id,status])=>{const u=USERS.find(x=>x.id===+id);return u?(
            <div key={id} style={{background:"#fff",borderRadius:14,padding:16,marginBottom:10,border:"1px solid #eee",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#FFF0F3,#ffe0e6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{u.photo}</div>
                <div><p style={{margin:0,fontWeight:700,fontSize:14}}>{u.name}</p><p style={{margin:0,fontSize:12,color:"#888"}}>Year {u.year} · {u.dept}</p></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:11,fontWeight:600,color:status==="accepted"?"#22c55e":"#f59e0b",padding:"4px 10px",background:status==="accepted"?"#f0fdf4":"#fffbeb",borderRadius:8}}>{status==="accepted"?"Connected":"Pending"}</span>
                {sentMsgs[u.id]&&<span style={{fontSize:11,color:"#888"}}>💬 Sent</span>}
                <button onClick={()=>{setMsgOpen(u.id);setMsgText("")}} style={{padding:"6px 14px",borderRadius:8,border:"1px solid #ddd",background:"#fff",fontSize:12,cursor:"pointer",fontWeight:600}}>Message</button>
              </div>
            </div>
          ):null;})
        }
      </div>}
      </div>

      {/* PROFILE MODAL */}
      {selectedUser&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setSU(null)}>
        <div style={{background:"#fff",borderRadius:24,maxWidth:480,width:"100%",maxHeight:"85vh",overflow:"auto",padding:32}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              <div style={{width:64,height:64,borderRadius:18,background:"linear-gradient(135deg,#FFF0F3,#ffe0e6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34}}>{selectedUser.photo}</div>
              <div><h2 style={{margin:"0 0 2px",fontSize:20}}>{selectedUser.name}</h2><p style={{margin:0,color:"#888",fontSize:13}}>Year {selectedUser.year} · {selectedUser.dept}</p></div>
            </div>
            <button onClick={()=>setSU(null)} style={{background:"#f5f5f5",border:"none",borderRadius:10,width:32,height:32,fontSize:16,cursor:"pointer"}}>✕</button>
          </div>
          <p style={{fontSize:14,lineHeight:1.6,color:"#444",margin:"20px 0"}}>{selectedUser.bio}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
            {selectedUser.interests.map(i=><span key={i} style={{padding:"5px 14px",borderRadius:20,background:MY_PROFILE.interests.includes(i)?"#FFF0F3":"#f5f5f5",color:MY_PROFILE.interests.includes(i)?"#D50032":"#666",fontSize:12,fontWeight:600,border:MY_PROFILE.interests.includes(i)?"1px solid #ffcdd2":"1px solid #e8e8e8"}}>{i}{MY_PROFILE.interests.includes(i)?" ✦":""}</span>)}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:20,padding:"10px 14px",background:"#FFF0F3",borderRadius:12}}>
            <span style={{fontSize:16}}>✦</span>
            <span style={{fontSize:13,color:"#D50032",fontWeight:600}}>{selectedUser.interests.filter(i=>MY_PROFILE.interests.includes(i)).length} shared interest{selectedUser.interests.filter(i=>MY_PROFILE.interests.includes(i)).length!==1?"s":""} with you</span>
          </div>
          <h3 style={{fontSize:14,fontWeight:700,margin:"0 0 12px",color:"#333"}}>Recent Posts</h3>
          {selectedUser.posts.map((p,i)=><div key={i} style={{padding:14,background:"#fafafa",borderRadius:12,marginBottom:8,fontSize:13,lineHeight:1.5,color:"#444"}}>{p}</div>)}
          <div style={{display:"flex",gap:10,marginTop:20}}>
            <button onClick={()=>{setConn(p=>({...p,[selectedUser.id]:p[selectedUser.id]||"pending"}));setTimeout(()=>setConn(p=>({...p,[selectedUser.id]:"accepted"})),2000)}} disabled={connections[selectedUser.id]} style={{flex:1,padding:"12px 0",borderRadius:12,border:"none",background:connections[selectedUser.id]==="accepted"?"#22c55e":connections[selectedUser.id]==="pending"?"#f5f5f5":"linear-gradient(135deg,#D50032,#ff1a4d)",color:connections[selectedUser.id]?"#333":"#fff",fontWeight:700,cursor:connections[selectedUser.id]?"default":"pointer"}}>{connections[selectedUser.id]==="accepted"?"✓ Connected":connections[selectedUser.id]==="pending"?"⏳ Pending":"🤝 Connect"}</button>
            <button onClick={()=>{setMsgOpen(selectedUser.id);setMsgText("")}} style={{flex:1,padding:"12px 0",borderRadius:12,border:"1px solid #ddd",background:"#fff",fontWeight:700,cursor:"pointer"}}>💬 Message</button>
          </div>
        </div>
      </div>}

      {/* MESSAGE MODAL */}
      {msgOpen&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setMsgOpen(null)}>
        <div style={{background:"#fff",borderRadius:20,maxWidth:440,width:"100%",padding:28}} onClick={e=>e.stopPropagation()}>
          {sentMsgs[msgOpen]?<div style={{textAlign:"center",padding:20}}>
            <p style={{fontSize:40,margin:"0 0 12px"}}>✅</p>
            <h3 style={{margin:"0 0 8px"}}>Message Sent!</h3>
            <p style={{color:"#888",fontSize:13,margin:"0 0 16px"}}>Your message to {USERS.find(u=>u.id===msgOpen)?.name} has been delivered.</p>
            <button onClick={()=>setMsgOpen(null)} style={{padding:"10px 28px",borderRadius:10,border:"none",background:"#D50032",color:"#fff",fontWeight:700,cursor:"pointer"}}>Done</button>
          </div>:<>
            <h3 style={{margin:"0 0 4px",fontSize:17}}>Message {USERS.find(u=>u.id===msgOpen)?.name}</h3>
            <p style={{color:"#888",margin:"0 0 16px",fontSize:12}}>Introduce yourself and mention shared interests</p>
            <textarea value={msgText} onChange={e=>setMsgText(e.target.value)} placeholder={`Hi ${USERS.find(u=>u.id===msgOpen)?.name?.split(" ")[0]}, I noticed we both share an interest in...`} rows={5} style={{width:"100%",border:"1px solid #eee",borderRadius:12,padding:14,fontSize:14,resize:"none",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}} autoFocus/>
            <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
              {["Asking about career advice","Study tips request","Food rec question","General intro"].map(t=><button key={t} onClick={()=>setMsgText(t==="Asking about career advice"?`Hi ${USERS.find(u=>u.id===msgOpen)?.name?.split(" ")[0]}, I saw you have experience in ${USERS.find(u=>u.id===msgOpen)?.interests[0]}. I'd love to pick your brain about career paths — would you be open to a quick chat?`:t==="Study tips request"?`Hey ${USERS.find(u=>u.id===msgOpen)?.name?.split(" ")[0]}! I'm in ${MY_PROFILE.dept} and saw your posts about exam prep. Any tips for someone in Year ${MY_PROFILE.year}?`:t==="Food rec question"?`Hi ${USERS.find(u=>u.id===msgOpen)?.name?.split(" ")[0]}! Loved your food recommendations. Any other hidden gems around campus you'd suggest?`:`Hey ${USERS.find(u=>u.id===msgOpen)?.name?.split(" ")[0]}! I'm a Year ${MY_PROFILE.year} ${MY_PROFILE.dept} student. Noticed we share some interests — would be great to connect!`)} style={{padding:"4px 10px",borderRadius:8,border:"1px solid #eee",background:"#fafafa",fontSize:11,cursor:"pointer",color:"#555"}}>{t}</button>)}
            </div>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button onClick={()=>setMsgOpen(null)} style={{flex:1,padding:"11px 0",borderRadius:10,border:"1px solid #ddd",background:"#fff",fontWeight:600,cursor:"pointer"}}>Cancel</button>
              <button onClick={()=>{if(msgText.trim()){setSentMsgs(p=>({...p,[msgOpen]:msgText}));setConn(p=>({...p,[msgOpen]:p[msgOpen]||"pending"}));setTimeout(()=>setConn(p=>({...p,[msgOpen]:"accepted"})),2000)}}} disabled={!msgText.trim()} style={{flex:1,padding:"11px 0",borderRadius:10,border:"none",background:msgText.trim()?"linear-gradient(135deg,#D50032,#ff1a4d)":"#eee",color:msgText.trim()?"#fff":"#999",fontWeight:700,cursor:msgText.trim()?"pointer":"default"}}>Send Message</button>
            </div>
          </>}
        </div>
      </div>}
    </div>
  );
}