import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('GEMINI_API_KEY is not set. Fallback educational mock responses will be used.');
}

// -------------------------------------------------------------
// Helper for fallback responses when offline or testing without key
// -------------------------------------------------------------
function getFallbackAskResponse(question: string, level: string = 'High School') {
  const qLower = question.toLowerCase();
  if (qLower.includes('ocean') || qLower.includes('river')) {
    return {
      answer: "The Pacific Ocean is the largest and deepest ocean on Earth. Spanning more than 60 million square miles (155 million square km), it covers more than 30% of the Earth's surface—larger than all of the Earth's landmass combined! It is home to the Mariana Trench, the deepest point on Earth at approximately 36,000 feet (11,000 meters). The world's longest river system is traditionally considered the Nile (approx. 6,650 km), though the Amazon River has the greatest water discharge volume on Earth.",
      keyTakeaways: [
        "The Pacific Ocean covers over 30% of Earth's total surface area.",
        "It contains the Mariana Trench, the deepest location on our planet.",
        "The Pacific is larger in surface area than all global dry land combined.",
        "While the Nile is historically the longest river, the Amazon holds the greatest water volume."
      ],
      funFact: "Point Nemo in the South Pacific Ocean is the most remote oceanic point of inaccessibility—the nearest humans are often astronauts aboard the International Space Station!",
      suggestedFollowUps: [
        "What is the Pacific 'Ring of Fire'?",
        "How do ocean currents regulate Earth's climate?",
        "What is the difference between a sea, a gulf, and an ocean?",
        "Which is the second largest ocean?"
      ],
      academicLevel: level
    };
  }

  return {
    answer: `Here is a clear, smart explanation of "${question}": At the ${level} level, this concept centers on key governing principles. When broken down into its fundamental mechanics, it allows us to analyze how components interact, balance forces, or transform data systematically.`,
    keyTakeaways: [
      `Core principle addresses the fundamental mechanism of "${question}".`,
      "Practical application spans real-world systems, science, and everyday technologies.",
      "Clear definitions prevent common ambiguities in academic testing."
    ],
    funFact: "Did you know that understanding core mental models makes learning adjacent topics 40% faster?",
    suggestedFollowUps: [
      `Can you give me a real-world example of this?`,
      `How does this apply to modern science or industry?`,
      `What are the most common student mistakes with this topic?`
    ],
    academicLevel: level
  };
}

function getFallbackQuiz(topic: string, count: number = 3) {
  const tLower = topic.toLowerCase();
  if (tLower.includes('pythagor') || tLower.includes('triangle')) {
    return {
      title: "Mastering The Pythagoras Theorem",
      topic: "The Pythagoras Theorem",
      difficulty: "Intermediate",
      questions: [
        {
          id: 1,
          question: "In any right-angled triangle, what is the fundamental mathematical relationship between the hypotenuse (c) and the other two legs (a and b)?",
          options: [
            "a + b = c",
            "a² + b² = c²",
            "(a + b)² = c²",
            "a² - b² = c²"
          ],
          correctIndex: 1,
          explanation: "The Pythagorean theorem explicitly states that the square of the hypotenuse is equal to the sum of the squares of the other two perpendicular sides: a² + b² = c².",
          hint: "Think about squaring the areas formed on each side of the right triangle."
        },
        {
          id: 2,
          question: "A right triangle has legs of lengths a = 6 cm and b = 8 cm. What is the exact length of the hypotenuse c?",
          options: [
            "14 cm",
            "10 cm",
            "12 cm",
            "48 cm"
          ],
          correctIndex: 1,
          explanation: "Using a² + b² = c²: 6² + 8² = 36 + 64 = 100. Taking the square root of 100 gives c = 10 cm.",
          hint: "Calculate 6 squared plus 8 squared, then find the square root of the sum."
        },
        {
          id: 3,
          question: "Which of the following triples represents a valid Pythagorean triple (where all sides are positive integers)?",
          options: [
            "3, 4, 6",
            "5, 12, 13",
            "4, 5, 6",
            "7, 10, 12"
          ],
          correctIndex: 1,
          explanation: "5² + 12² = 25 + 144 = 169 = 13². Hence, (5, 12, 13) is a canonical integer Pythagorean triple.",
          hint: "Check which pair's squared sum equals the square of the largest number."
        },
        {
          id: 4,
          question: "If the hypotenuse of a right isosceles triangle is 10 units, what is the length of each leg?",
          options: [
            "5 units",
            "5√2 units (~7.07)",
            "10√2 units",
            "7 units"
          ],
          correctIndex: 1,
          explanation: "For an isosceles right triangle, a = b. Thus a² + a² = c² -> 2a² = 100 -> a² = 50 -> a = √50 = 5√2.",
          hint: "Since both legs are equal, 2a² = c²."
        }
      ].slice(0, count)
    };
  }

  return {
    title: `Quiz: ${topic}`,
    topic,
    difficulty: "General",
    questions: [
      {
        id: 1,
        question: `What is the primary foundation of ${topic}?`,
        options: [
          `The core underlying scientific/logical framework of ${topic}`,
          "An arbitrary historical convention with no modern use",
          "A theorem solely used in non-computational art",
          "A completely unverified hypothesis"
        ],
        correctIndex: 0,
        explanation: `${topic} builds on structured foundational principles that enable rigorous problem-solving.`,
        hint: "Consider how fundamental principles build system understanding."
      },
      {
        id: 2,
        question: `How is ${topic} typically evaluated or verified?`,
        options: [
          "Through empirical evidence, formal proofs, or reproducible tests",
          "By guessing without measurements",
          "It cannot ever be tested",
          "By counting letters in the name"
        ],
        correctIndex: 0,
        explanation: "Academic disciplines rely on reproducible proofs, tests, and observational data.",
        hint: "Think about the scientific method."
      },
      {
        id: 3,
        question: `Which best describes a common pitfall when learning ${topic}?`,
        options: [
          "Confusing superficial memorization with conceptual understanding",
          "Studying too regularly with practice questions",
          "Asking questions when stuck",
          "Reading documentation and examples"
        ],
        correctIndex: 0,
        explanation: "Rote memorization often fails when students face slightly modified problem variations.",
        hint: "Think about deep understanding versus quick memorization."
      }
    ].slice(0, count)
  };
}

function getFallbackLearningPath(subject: string) {
  const sLower = subject.toLowerCase();
  if (sLower.includes('sql') || sLower.includes('database')) {
    return {
      title: "Complete SQL Mastery Roadmap: Zero to Database Architect",
      subject: "Structured Query Language (SQL)",
      totalWeeks: 8,
      prerequisites: ["Basic computer literacy", "Understanding of tabular data (spreadsheets)"],
      careerOutcomes: ["Data Analyst", "Backend Engineer", "Data Engineer", "Business Intelligence Specialist"],
      phases: [
        {
          phaseNumber: 1,
          title: "SQL Foundations & Data Retrieval",
          duration: "Weeks 1-2 (4-6 hrs/week)",
          level: "Beginner",
          objectives: [
            "Understand relational database models and tables",
            "Master SELECT, FROM, WHERE, and basic filtering",
            "Sort and deduplicate rows using ORDER BY and DISTINCT"
          ],
          keyTopics: [
            "Relational Model: Tables, Rows, Primary Keys & Foreign Keys",
            "SELECT syntax, Aliasing (AS), Column selection",
            "Comparison operators: =, !=, <, >, BETWEEN, IN, LIKE, IS NULL",
            "Logical operators: AND, OR, NOT",
            "Sorting and limiting: ORDER BY ASC/DESC, LIMIT / OFFSET"
          ],
          practiceProject: "Global University Enrollment Database: Querying courses, instructors, and student grade records.",
          exercises: [
            "Find all students enrolled after 2024 with GPA > 3.5",
            "List top 5 most expensive courses ordered alphabetically by department",
            "Filter products whose names start with 'Pro' and price is between $50 and $200"
          ],
          resourceSuggestions: [
            "PostgreSQL Tutorial / SQLite interactive sandbox",
            "SQLBolt interactive lessons 1-8"
          ]
        },
        {
          phaseNumber: 2,
          title: "Data Aggregation & Grouping",
          duration: "Weeks 3-4 (5-7 hrs/week)",
          level: "Intermediate",
          objectives: [
            "Calculate business metrics across datasets",
            "Master GROUP BY and HAVING clauses",
            "Work with Date, Time, and String functions"
          ],
          keyTopics: [
            "Aggregate functions: COUNT(), SUM(), AVG(), MIN(), MAX()",
            "Grouping data: GROUP BY on single and multiple dimensions",
            "Filtering aggregated records with HAVING vs WHERE",
            "String transformations: CONCAT, SUBSTRING, UPPER, LOWER",
            "Date manipulation: DATE_TRUNC, EXTRACT, INTERVAL"
          ],
          practiceProject: "E-Commerce Sales Analytics: Generating monthly revenue reports, average customer spend, and order summaries.",
          exercises: [
            "Calculate total revenue per product category for year 2025",
            "Find all departments where average employee salary exceeds $85,000",
            "Count orders placed on weekends grouped by customer country"
          ],
          resourceSuggestions: [
            "LeetCode Easy SQL Problem Set",
            "Mode Analytics SQL Tutorial for Data Analysis"
          ]
        },
        {
          phaseNumber: 3,
          title: "Multi-Table Relationships & Joins",
          duration: "Weeks 5-6 (6-8 hrs/week)",
          level: "Intermediate-Advanced",
          objectives: [
            "Connect disparate relational tables with precision",
            "Understand INNER, LEFT, RIGHT, and FULL OUTER JOINs",
            "Write correlated and scalar Subqueries and CTEs (Common Table Expressions)"
          ],
          keyTopics: [
            "INNER JOIN vs LEFT JOIN vs RIGHT JOIN mechanics",
            "Self Joins (Hierarchical reporting, employee-manager tables)",
            "CROSS JOIN and FULL OUTER JOIN edge cases",
            "Subqueries: IN, EXISTS, ANY/ALL, Correlated Subqueries",
            "CTEs (WITH clause) for readable, modular SQL logic"
          ],
          practiceProject: "Streaming Media Platform Analytics: User watch history, subscription churn, and content catalog cross-joins.",
          exercises: [
            "Find all customers who registered but have never placed an order (LEFT JOIN where null)",
            "Write a CTE to rank songs by streams and join with artist genres",
            "Calculate retention rate comparing Month 1 vs Month 2 active streamers"
          ],
          resourceSuggestions: [
            "Use The Index, Luke! - Relational design guides",
            "HackerRank SQL Medium Track"
          ]
        },
        {
          phaseNumber: 4,
          title: "Window Functions, Indexing & Optimization",
          duration: "Weeks 7-8 (6-8 hrs/week)",
          level: "Advanced",
          objectives: [
            "Master analytical Window Functions (OVER, PARTITION BY)",
            "Understand Query Execution Plans (EXPLAIN ANALYZE)",
            "Design B-Tree indexes for high-throughput production queries"
          ],
          keyTopics: [
            "Window functions: ROW_NUMBER(), RANK(), DENSE_RANK()",
            "Running totals and moving averages: SUM() OVER (PARTITION BY ... ORDER BY ...)",
            "LAG() and LEAD() for period-over-period delta calculations",
            "Indexes: B-Tree, Composite indexes, Cardinality, Index scans vs Seq scans",
            "Database transactions: ACID properties, BEGIN, COMMIT, ROLLBACK"
          ],
          practiceProject: "Financial Portfolio Tracking Engine: Rolling 30-day volatility, month-over-month profit jumps, and indexed transaction lookups.",
          exercises: [
            "Calculate month-over-month revenue growth percentage using LAG()",
            "Assign top 3 salesmen per region using DENSE_RANK()",
            "Analyze an EXPLAIN output and eliminate a slow sequential scan with a composite index"
          ],
          resourceSuggestions: [
            "PostgreSQL Official Documentation on Window Functions",
            "Database Internals by Alex Petrov"
          ]
        }
      ],
      tipsForSuccess: [
        "Write queries by hand instead of relying solely on drag-and-drop ORMs.",
        "Always inspect the row counts before and after every JOIN to catch accidental cartesian products.",
        "Use CTEs (WITH clauses) to make multi-step logic clean and self-documenting."
      ]
    };
  }

  return {
    title: `Comprehensive Learning Path: ${subject}`,
    subject,
    totalWeeks: 6,
    prerequisites: ["Curiosity", "Basic study schedule (4-5 hrs/week)"],
    careerOutcomes: [`Specialist in ${subject}`, "Practical project builder", "Academic top performer"],
    phases: [
      {
        phaseNumber: 1,
        title: "Foundations & Core Terminology",
        duration: "Weeks 1-2",
        level: "Beginner",
        objectives: ["Grasp fundamental concepts", "Set up environment and tools"],
        keyTopics: ["Core axioms and terminology", "Basic mental models", "Hello World / First exercise"],
        practiceProject: `Basic ${subject} Starter Project`,
        exercises: ["Complete 3 introductory problem sets", "Summarize core principles"],
        resourceSuggestions: ["Beginner-friendly cheat sheets", "Interactive code sandbox"]
      },
      {
        phaseNumber: 2,
        title: "Intermediate Application & Problem Solving",
        duration: "Weeks 3-4",
        level: "Intermediate",
        objectives: ["Apply concepts to multi-step challenges", "Analyze trade-offs"],
        keyTopics: ["Standard patterns", "Edge cases & debugging", "Best practices"],
        practiceProject: `Interactive ${subject} Application`,
        exercises: ["Build a portfolio component", "Refactor basic prototype"],
        resourceSuggestions: ["Case study breakdowns", "Open-source repositories"]
      },
      {
        phaseNumber: 3,
        title: "Advanced Mastery & Portfolio Delivery",
        duration: "Weeks 5-6",
        level: "Advanced",
        objectives: ["Performance optimization", "Production readiness"],
        keyTopics: ["Optimization techniques", "System architecture", "Independent capstone project"],
        practiceProject: `Comprehensive ${subject} Capstone Showcase`,
        exercises: ["Benchmark latency / accuracy", "Deploy live demo"],
        resourceSuggestions: ["Research papers", "Industry benchmarks"]
      }
    ],
    tipsForSuccess: [
      "Consistent 30-minute daily practice beats 4-hour weekend cramming.",
      "Build real micro-projects to anchor abstract concepts.",
      "Teach what you learn to another person or write quick summaries."
    ]
  };
}

// -------------------------------------------------------------
// POST /api/ask
// -------------------------------------------------------------
app.post('/api/ask', async (req, res) => {
  try {
    const { question, academicLevel = 'High School' } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required.' });
    }

    if (!ai) {
      return res.json(getFallbackAskResponse(question, academicLevel));
    }

    const systemPrompt = `You are EduGenie, an expert, enthusiastic, and concise AI educational assistant.
The student is at the "${academicLevel}" academic level.
Answer the user's question clearly, smartly, and accurately without fluff.
Return a structured JSON object matching this schema:
{
  "answer": "A clear, engaging, and smart answer suitable for the student's academic level (2 to 4 paragraphs). Use markdown for formatting equations or bolding key terms.",
  "keyTakeaways": ["3 to 4 concise bullet points summarizing essential facts"],
  "funFact": "A surprising, delightful educational fact related to the topic",
  "suggestedFollowUps": ["3 to 4 insightful follow-up questions the student can ask next"],
  "academicLevel": "${academicLevel}"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Student Question: "${question}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            funFact: { type: Type.STRING },
            suggestedFollowUps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            academicLevel: { type: Type.STRING },
          },
          required: ['answer', 'keyTakeaways', 'funFact', 'suggestedFollowUps'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/ask:', err);
    // Graceful fallback if Gemini call fails
    return res.json(getFallbackAskResponse(req.body.question || 'Concept', req.body.academicLevel || 'High School'));
  }
});

// -------------------------------------------------------------
// POST /api/simplify
// -------------------------------------------------------------
app.post('/api/simplify', async (req, res) => {
  try {
    const { concept, targetLevel = 'ELI5' } = req.body;
    if (!concept || typeof concept !== 'string') {
      return res.status(400).json({ error: 'Concept is required.' });
    }

    if (!ai) {
      return res.json({
        title: `Simplifying: ${concept}`,
        targetLevel,
        coreAnalogy: `Imagine ${concept} like a bustling kitchen where every chef has one specific job.`,
        explanation: `When we look at ${concept} through a simplified lens, it breaks down into three simple steps: input, transformation, and output. You don't need complex jargon to understand how it behaves in practice.`,
        visualFormulaOrExample: `Step 1: Initiation -> Step 2: Reaction -> Step 3: Balanced State`,
        commonMisconceptions: [
          `People often think ${concept} is all-or-nothing, but it usually operates continuously.`,
          "It is frequently confused with related secondary effects."
        ],
        quickCheckQuestion: {
          question: `What is the easiest way to remember how ${concept} works?`,
          answer: "By remembering the kitchen analogy of specialized teamwork!"
        }
      });
    }

    const systemPrompt = `You are EduGenie's Concept Simplifier.
Your goal is to take complex academic, scientific, mathematical, or technical concepts and explain them with crystalline clarity at the target level: "${targetLevel}".
Levels include:
- 'ELI5' (Explain Like I'm 5): Use playful, vivid, everyday metaphors (toys, pizza, playground, pets).
- 'High School': Accessible, foundational, intuitive, real-world examples with proper terminology introduced gently.
- 'University Undergrad': Rigorous, precise, mathematically or mechanically grounded, explaining why it matters.
- 'Analogy-First': Focus 80% on an unforgettable creative real-world analogy.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Please explain this concept simply: "${concept}" for level "${targetLevel}".`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            targetLevel: { type: Type.STRING },
            coreAnalogy: { type: Type.STRING, description: 'An unforgettable creative real-world metaphor' },
            explanation: { type: Type.STRING, description: 'Step-by-step simplified explanation' },
            visualFormulaOrExample: { type: Type.STRING, description: 'A clean textual diagram or formula breakdown' },
            commonMisconceptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            quickCheckQuestion: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ['question', 'answer']
            }
          },
          required: ['title', 'targetLevel', 'coreAnalogy', 'explanation', 'commonMisconceptions', 'quickCheckQuestion'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/simplify:', err);
    return res.status(500).json({ error: 'Failed to simplify concept.' });
  }
});

// -------------------------------------------------------------
// POST /api/quiz
// -------------------------------------------------------------
app.post('/api/quiz', async (req, res) => {
  try {
    const { topic, difficulty = 'Intermediate', questionCount = 4, sourceText = '' } = req.body;
    if (!topic && !sourceText) {
      return res.status(400).json({ error: 'Topic or source text is required.' });
    }

    const count = Math.min(Math.max(parseInt(questionCount, 10) || 4, 2), 10);

    if (!ai) {
      return res.json(getFallbackQuiz(topic || 'Study Passage', count));
    }

    const systemPrompt = `You are EduGenie's Quiz Generator.
Generate an engaging, educational multiple-choice quiz of exactly ${count} questions on the topic "${topic}".
Difficulty: "${difficulty}".
${sourceText ? `Base the questions primarily on the following source material:\n"""${sourceText}"""` : ''}

Rules:
1. Each question must have exactly 4 plausible options.
2. Only 1 option is correct (correctIndex 0, 1, 2, or 3).
3. Provide a clear, educational explanation for why the answer is correct and why other options are incorrect.
4. Provide a helpful hint that guides thinking without giving the answer away directly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate a ${count}-question ${difficulty} quiz about: ${topic || 'the provided text'}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            topic: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  hint: { type: Type.STRING },
                },
                required: ['id', 'question', 'options', 'correctIndex', 'explanation', 'hint'],
              },
            },
          },
          required: ['title', 'topic', 'difficulty', 'questions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/quiz:', err);
    return res.json(getFallbackQuiz(req.body.topic || 'General Science', 3));
  }
});

// -------------------------------------------------------------
// POST /api/learning-path
// -------------------------------------------------------------
app.post('/api/learning-path', async (req, res) => {
  try {
    const { subject, currentLevel = 'Beginner', targetGoal = 'Mastery & Job Readiness' } = req.body;
    if (!subject || typeof subject !== 'string') {
      return res.status(400).json({ error: 'Subject is required.' });
    }

    if (!ai) {
      return res.json(getFallbackLearningPath(subject));
    }

    const systemPrompt = `You are EduGenie's Curriculum & Learning Path Architect.
Create a structured, step-by-step educational roadmap for a learner studying "${subject}".
Current Level: "${currentLevel}".
Target Goal: "${targetGoal}".

Generate 3 to 4 sequential phases (from foundational to advanced), each with realistic timelines, clear objectives, key topics, a tangible hands-on practice project, practical exercises, and top resource suggestions.
Make it inspiring, highly actionable, and pedagogically sound.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate a structured learning path for: "${subject}" starting from level "${currentLevel}" with goal "${targetGoal}".`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            totalWeeks: { type: Type.INTEGER },
            prerequisites: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            careerOutcomes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  level: { type: Type.STRING },
                  objectives: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  keyTopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  practiceProject: { type: Type.STRING },
                  exercises: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  resourceSuggestions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['phaseNumber', 'title', 'duration', 'level', 'objectives', 'keyTopics', 'practiceProject', 'exercises', 'resourceSuggestions'],
              },
            },
            tipsForSuccess: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['title', 'subject', 'totalWeeks', 'prerequisites', 'careerOutcomes', 'phases', 'tipsForSuccess'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/learning-path:', err);
    return res.json(getFallbackLearningPath(req.body.subject || 'Computer Science'));
  }
});

// -------------------------------------------------------------
// POST /api/summarize
// -------------------------------------------------------------
app.post('/api/summarize', async (req, res) => {
  try {
    const { text, style = 'bullet_points' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text passage is required.' });
    }

    if (!ai) {
      return res.json({
        summary: "This passage outlines key foundational concepts, historical evolution, and modern applications. By synthesizing the core arguments, we see that systematic methodologies produce more robust long-term outcomes than disjointed heuristics.",
        keyPoints: [
          "Core premise emphasizes structured conceptual understanding.",
          "Practical experiments validate theoretical claims.",
          "Future outlook suggests continued growth and cross-disciplinary impact."
        ],
        definitions: [
          { term: "Methodology", definition: "A system of methods used in a particular area of study or activity." },
          { term: "Heuristic", definition: "A practical approach or mental shortcut not guaranteed to be optimal or perfect, but sufficient for immediate goals." }
        ],
        potentialExamQuestions: [
          "What is the primary difference between systematic methodology and heuristic shortcuts?",
          "How did empirical testing influence the final conclusion?"
        ],
        originalWordCount: text.split(/\s+/).filter(Boolean).length,
        summaryWordCount: 42
      });
    }

    const systemPrompt = `You are EduGenie's Study Passage Summarizer.
Analyze the provided educational text and produce a high-yield summary tailored for students.
Format Style: "${style}" (e.g. bullet_points, executive, tldr, or study_guide).
Extract core key points, essential vocabulary/definitions, and potential exam questions.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Please summarize this educational text:\n"""${text}"""`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            definitions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
                required: ['term', 'definition'],
              },
            },
            potentialExamQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            originalWordCount: { type: Type.INTEGER },
            summaryWordCount: { type: Type.INTEGER },
          },
          required: ['summary', 'keyPoints', 'definitions', 'potentialExamQuestions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/summarize:', err);
    return res.status(500).json({ error: 'Failed to summarize passage.' });
  }
});

// -------------------------------------------------------------
// GET /api/health
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'EduGenie',
    engine: 'Google Gemini 3.8 Flash',
    serverType: 'Express + Vite Fullstack',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// Setup Vite in Dev or Serve Static in Production
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`EduGenie server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start EduGenie server:', err);
  process.exit(1);
});
