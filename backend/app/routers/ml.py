from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(tags=["Machine Learning & AI"])

# --- DATA SCHEMAS ---

class PlacementInput(BaseModel):
    cgpa: float
    attendance: float
    backlogs: int
    internships: int

class PlacementOutput(BaseModel):
    probability: float
    status: str
    recommendations: List[str]

class ChatInput(BaseModel):
    query: str

class ChatOutput(BaseModel):
    answer: str
    sources: List[str]


# --- MOCK ML CLASSIFIER LOGIC ---

@router.post("/ml/predict-placement", response_model=PlacementOutput)
def predict_placement(data: PlacementInput):
    if data.cgpa < 0 or data.cgpa > 10:
        raise HTTPException(status_code=400, detail="CGPA must be between 0 and 10")
    if data.attendance < 0 or data.attendance > 100:
        raise HTTPException(status_code=400, detail="Attendance must be between 0 and 100")
    
    # Simple rule-based classifier representing a trained Decision Tree model
    score = 0.0
    recs = []
    
    # CGPA weight
    if data.cgpa >= 8.5:
        score += 45
    elif data.cgpa >= 7.5:
        score += 35
    elif data.cgpa >= 6.5:
        score += 25
        recs.append("Strive to get CGPA above 7.5 to open eligibility for major companies like Wipro/HCL.")
    else:
        score += 10
        recs.append("Critical: CGPA is below standard cut-offs. Focus on clearing backlogs and improving sessionals.")

    # Attendance weight
    if data.attendance >= 85:
        score += 15
    elif data.attendance >= 75:
        score += 10
    else:
        score += 2
        recs.append("Alert: Attendance is below UPTAC/AKTU 75% limit. Attend lectures to prevent exam block.")

    # Internships weight
    if data.internships >= 2:
        score += 25
    elif data.internships == 1:
        score += 15
    else:
        score += 5
        recs.append("Action Required: Complete at least one summer industrial project to enhance your resume.")

    # Backlog penalty
    if data.backlogs == 0:
        score += 15
    else:
        score -= (data.backlogs * 15)
        recs.append(f"Clear active backlogs ({data.backlogs}) immediately to meet corporate screening rules.")

    # Bound probability
    prob = max(5.0, min(99.0, score))
    
    status = "HIGHLY_LIKELY" if prob >= 80 else "PROBABLE" if prob >= 60 else "UNLIKELY"

    if len(recs) == 0:
        recs.append("Maintain current academic records. Ready for placement drives!")

    return PlacementOutput(
        probability=round(prob, 2),
        status=status,
        recommendations=recs
    )


# --- PYTHON RAG CHATBOT DATABASE ---

BIT_FACTS = [
    {
        "title": "Attendance Requirement Policy",
        "content": "Under AKTU guidelines, students must maintain a minimum of 75% attendance in both lectures and practical sessions to be eligible to appear for the semester end examinations.",
        "tags": ["attendance", "75", "aktu", "shortage", "eligibility"]
    },
    {
        "title": "B.Tech Tuition Fees Structure",
        "content": "The annual tuition fee for B.Tech programs (CSE, ECE, ME, CE) is ₹82,500. Semester exam fees are ₹7,500, and hostel fees are ₹55,000.",
        "tags": ["fees", "tuition", "cost", "btech", "b.tech", "hostel"]
    },
    {
        "title": "Hostel Gates & Curfew Timings",
        "content": "Hostel gates close at 9:00 PM daily. Outings after 9:00 PM are forbidden without written HOD permission.",
        "tags": ["hostel", "timing", "gate", "curfew", "9 pm"]
    },
    {
        "title": "Placement Cell Highlights",
        "content": "BIT placement cell reports an 88% overall recruitment rate. The highest package is ₹12.0 LPA by Mobiloitte, with an average CTC of ₹3.8 LPA.",
        "tags": ["placement", "salary", "package", "recruiter", "highest", "lpa"]
    }
]

@router.post("/ml/ai-query", response_model=ChatOutput)
def query_ai_chatbot(data: ChatInput):
    query_lower = data.query.lower()
    matches = []
    
    for fact in BIT_FACTS:
        score = 0
        for tag in fact["tags"]:
            if tag in query_lower:
                score += 3
        if score > 0:
            matches.append((fact, score))
            
    if not matches:
        return ChatOutput(
            answer="[Processed by Python backend] I could not find a matching record in the Python knowledge base. Please view admissions or email director@bit.ac.in.",
            sources=[]
        )
        
    # Sort by score
    matches.sort(key=lambda x: x[1], reverse=True)
    best_fact = matches[0][0]
    
    return ChatOutput(
        answer=f"[Processed by Python FastAPI Backend] \n\n**{best_fact['title']}**:\n{best_fact['content']}",
        sources=[f"Python KB: {best_fact['title']}"]
    )
