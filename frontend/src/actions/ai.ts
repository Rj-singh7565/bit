"use server";

interface KnowledgeDoc {
  id: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
}

const BIT_KNOWLEDGE_BASE: KnowledgeDoc[] = [
  {
    id: "rules-1",
    category: "Rules & Policies",
    title: "Attendance Requirement Policy",
    content: "Under AKTU guidelines, students must maintain a minimum of 75% attendance in both lectures and practical sessions to be eligible to appear for the semester end examinations. Shortage below 75% requires medical verification or director approval.",
    tags: ["attendance", "75", "aktu", "shortage", "eligibility", "exam"]
  },
  {
    id: "rules-2",
    category: "Rules & Policies",
    title: "Hostel Timings & Curfew",
    content: "Hostel gates are closed at 9:00 PM daily. Students returning after 9:00 PM must submit a written explanation from their HOD or parents. Night outing is strictly prohibited without warden approval.",
    tags: ["hostel", "timing", "gate", "curfew", "9 pm", "outing"]
  },
  {
    id: "rules-3",
    category: "Rules & Policies",
    title: "College Uniform and Dress Code",
    content: "Students must wear the prescribed official BIT uniform on Mondays, Wednesdays, and during official events or campus placement drives. Casual wear is permitted on other days, subject to formal styling guidelines.",
    tags: ["uniform", "dress", "monday", "wednesday", "formal", "clothes"]
  },
  {
    id: "fees-1",
    category: "Fees",
    title: "B.Tech Tuition Fees Structure",
    content: "The annual tuition fee for B.Tech programs (CSE, AIML, DS, ECE, ME, CE) is ₹82,500. Admission registration fees are ₹5,000, and semester exam fees are ₹7,500. Dues must be cleared before exam registration starts.",
    tags: ["fees", "tuition", "cost", "btech", "b.tech", "amount", "money"]
  },
  {
    id: "fees-2",
    category: "Fees",
    title: "Hostel and Mess Fees",
    content: "Hostel fees (including double occupancy room and 4-meals mess service) is ₹55,000 per academic year. Security deposit (refundable) is ₹5,000.",
    tags: ["hostel", "mess", "food", "fees", "rent", "cost"]
  },
  {
    id: "fees-3",
    category: "Fees",
    title: "Transport/Bus Fees",
    content: "BIT Gorakhpur offers air-cooled transport buses covering Gorakhpur city, GIDA, and Sahjanwa routes. The annual bus fee is ₹12,000, payable at the start of the session.",
    tags: ["bus", "transport", "route", "fees", "travel"]
  },
  {
    id: "placements-1",
    category: "Placements",
    title: "BIT Placement Record & Highlights",
    content: "BIT boasts an average placement rate of 88% for engineering graduates. In the last batch, the highest package offered was ₹12.0 LPA by Mobiloitte, with an average package of ₹3.8 LPA. Top recruiters include TCS, Wipro, HCL, Cognizant, and Mobiloitte.",
    tags: ["placement", "salary", "recruiters", "package", "lpa", "highest", "average", "tcs", "wipro"]
  },
  {
    id: "departments-1",
    category: "Departments",
    title: "Computer Science Engineering (CSE)",
    content: "The Department of Computer Science & Engineering offers B.Tech in CSE, CSE-AIML, and CSE-DS. Headed by Prof. Arvind Kumar. Labs are equipped with high-speed internet, AI accelerators, and cloud development workspaces.",
    tags: ["cse", "computer science", "aiml", "data science", "arvind kumar", "labs"]
  },
  {
    id: "departments-2",
    category: "Departments",
    title: "Electronics & Communication Engineering (ECE)",
    content: "The ECE Department provides advanced labs in VLSI design, Embedded Systems, and IoT. Headed by Dr. S.C. Gupta, focusing on core hardware placement and research publications.",
    tags: ["ece", "electronics", "hardware", "vlsi", "gupta"]
  },
  {
    id: "library-1",
    category: "Library",
    title: "Digital Library Rules & Borrowing Limits",
    content: "The central digital library houses over 25,000 books and online journals. Students can check out up to 3 books at a time for a period of 14 days. Late returns attract a fine of ₹5 per day.",
    tags: ["library", "books", "issue", "days", "fine", "late", "return"]
  },
  {
    id: "calendar-1",
    category: "Academic Calendar",
    title: "Academic Calendar Odd Semester 2026",
    content: "Classes for B.Tech & Polytechnic begin on August 10, 2026. Internal Sessional exams are scheduled for Oct 12-16. AKTU Odd Semester examinations commence on December 15, 2026.",
    tags: ["calendar", "date", "exams", "sessional", "classes start", "december"]
  }
];

export async function askAiChatbot(query: string): Promise<{ answer: string; sources: string[] }> {
  if (!query || query.trim().length === 0) {
    return {
      answer: "Hello! I am the BIT AI Academic Assistant. How can I help you today? You can ask me about fees, curfew rules, placements, library books, or department heads.",
      sources: []
    };
  }

  // Attempt to contact Python FastAPI backend
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // 1-second timeout

    const response = await fetch("http://127.0.0.1:8000/api/ml/ai-query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        answer: data.answer,
        sources: data.sources
      };
    }
  } catch (err) {
    // Fall back silently to JS database
    console.log("FastAPI backend offline, utilizing local JS keyword search fallback.");
  }

  const normalizedQuery = query.toLowerCase();
  
  // Keyword scoring
  const matches = BIT_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    // Check tags
    doc.tags.forEach(tag => {
      if (normalizedQuery.includes(tag)) score += 3;
    });
    // Check title matches
    doc.title.toLowerCase().split(" ").forEach(word => {
      if (word.length > 3 && normalizedQuery.includes(word)) score += 2;
    });
    // Check content matches
    doc.content.toLowerCase().split(" ").forEach(word => {
      if (word.length > 4 && normalizedQuery.includes(word)) score += 1;
    });
    
    return { doc, score };
  })
  .filter(match => match.score > 0)
  .sort((a, b) => b.score - a.score);

  if (matches.length === 0) {
    return {
      answer: "I couldn't find a specific notice or rule matching your query in my local database. However, Buddha Institute of Technology (BIT) Gorakhpur offers B.Tech programs under AKTU. You may contact the Administrative Office at info@bit.ac.in or view the Admissions desk.",
      sources: []
    };
  }

  // Combine top matched documents
  const bestMatches = matches.slice(0, 2);
  const answerIntro = `Based on the official Buddha Institute of Technology guidelines and notices: \n\n`;
  const answerBody = bestMatches.map(m => `**${m.doc.title}**:\n${m.doc.content}`).join("\n\n");
  const sources = bestMatches.map(m => `${m.doc.category}: ${m.doc.title}`);

  return {
    answer: answerIntro + answerBody,
    sources
  };
}
