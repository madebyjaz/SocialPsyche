import os
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Literal
from datetime import datetime, timedelta
import asyncio
import uuid
import random
import json
from enum import Enum
from openai import OpenAI

app = FastAPI(title="SocialPsyche Advice API", version="1.0.0")

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client with Hugging Face
client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.environ.get("HF_TOKEN", "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"),
)

# Data Models
class MBTIScores(BaseModel):
    extraversion: float
    intuition: float
    feeling: float
    perceiving: float

class PersonalityType(str, Enum):
    # Extroverted Types
    ESTP = "ESTP"
    ESFP = "ESFP"
    ENFP = "ENFP"
    ENTP = "ENTP"
    ESTJ = "ESTJ"
    ESFJ = "ESFJ"
    ENFJ = "ENFJ"
    ENTJ = "ENTJ"
    # Introverted Types
    ISTJ = "ISTJ"
    ISFJ = "ISFJ"
    INFJ = "INFJ"
    INTJ = "INTJ"
    ISTP = "ISTP"
    ISFP = "ISFP"
    INFP = "INFP"
    INTP = "INTP"

class AdvisorType(str, Enum):
    AI = "ai"
    HUMAN = "human"

class ChatMessage(BaseModel):
    id: str
    content: str
    is_user: bool
    timestamp: datetime
    advisor_type: Optional[AdvisorType] = None

class ChatRequest(BaseModel):
    message: str
    advisor_id: str
    user_personality: Optional[PersonalityType] = None
    mbti_scores: Optional[MBTIScores] = None
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: ChatMessage
    typing_delay: float
    session_id: str

class GuessRequest(BaseModel):
    session_id: str
    advisor_a_guess: AdvisorType
    advisor_b_guess: AdvisorType

class GuessResult(BaseModel):
    correct_a: bool
    correct_b: bool
    actual_advisor_a: AdvisorType
    actual_advisor_b: AdvisorType
    score: int

# Session Management
class ChatSession:
    def __init__(self):
        self.id = str(uuid.uuid4())
        self.created_at = datetime.now()
        self.advisor_a_type = random.choice([AdvisorType.AI, AdvisorType.HUMAN])
        self.advisor_b_type = AdvisorType.HUMAN if self.advisor_a_type == AdvisorType.AI else AdvisorType.AI
        self.messages_a: List[ChatMessage] = []
        self.messages_b: List[ChatMessage] = []
        self.user_personality: Optional[PersonalityType] = None
        self.mbti_scores: Optional[MBTIScores] = None

# In-memory session storage (use Redis/Database in production)
sessions: Dict[str, ChatSession] = {}

# MBTI Personality Descriptions for LLM Context
MBTI_DESCRIPTIONS = {
    "ENFP": "The Campaigner - Enthusiastic, imaginative, and deeply idealistic. Values authenticity and meaningful connections.",
    "INFP": "The Mediator - Thoughtful, passionate idealists. Care deeply about staying true to their values and understanding others.",
    "ENFJ": "The Protagonist - Empathetic, charismatic, and socially intelligent. Motivate others to grow and often take on mentorship roles.",
    "INFJ": "The Advocate - Insightful, idealistic, and deeply introspective. Driven by meaning and want to help others grow authentically.",
    "ENTP": "The Debater - Quick-witted innovators who love to explore ideas and challenge assumptions. Enjoy playful argument and thinking on their feet.",
    "INTP": "The Thinker - Abstract, curious, and logical. Fascinated by how things work and love playing with complex ideas and systems.",
    "ENTJ": "The Commander - Strategic leaders who thrive on planning, challenge, and control. Natural organizers and strong decision-makers.",
    "INTJ": "The Architect - Independent, strategic, and analytical. Love mastering concepts and executing long-term visions.",
    "ESFP": "The Entertainer - Friendly and spontaneous, love excitement, people, and creating joyful experiences. Thrive on fun and connection.",
    "ISFP": "The Adventurer - Gentle, aesthetic-minded, and spontaneous. Seek harmony and prefer quiet creative expression over conflict.",
    "ESFJ": "The Caregiver - Loyal, supportive, and relationship-driven. Prioritize harmony and strive to make others feel valued and cared for.",
    "ISFJ": "The Defender - Quiet nurturers with a deep sense of duty. Care for others selflessly and prefer stability and familiarity.",
    "ESTP": "The Dynamo - Bold and pragmatic problem-solvers who love to take action and solve real-world challenges quickly. Energetic, social, and hands-on learners.",
    "ISTP": "The Virtuoso - Quiet observers with a knack for mechanics, systems, and practical problem-solving. Learn by doing and exploring.",
    "ESTJ": "The Executive - Organized and practical leaders who value tradition, structure, and results. Dependable, action-oriented, and assertive.",
    "ISTJ": "The Inspector - Responsible, orderly, and dependable. Value tradition and logic, and are often the quiet backbone of any team or system."
}

def get_session(session_id: str) -> ChatSession:
    """Get or create a chat session"""
    if session_id not in sessions:
        sessions[session_id] = ChatSession()
        sessions[session_id].id = session_id
    return sessions[session_id]

def classify_message_topic(message: str) -> str:
    """Simple topic classification for response selection"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ["anxious", "nervous", "worried", "scared", "overwhelming", "panic"]):
        return "social_anxiety"
    elif any(word in message_lower for word in ["introvert", "quiet", "alone", "recharge", "energy", "drain"]):
        return "introversion"
    elif any(word in message_lower for word in ["confident", "confidence", "shy", "insecure", "self-doubt", "believe"]):
        return "confidence"
    else:
        return "general"

def build_personality_context(personality: Optional[PersonalityType], mbti_scores: Optional[MBTIScores]) -> str:
    """Build personality context for LLM prompts"""
    context = ""
    
    if personality:
        context += f"The user's MBTI type is {personality.value} - {MBTI_DESCRIPTIONS.get(personality.value, 'Unknown type')}. "
    
    if mbti_scores:
        traits = []
        if mbti_scores.extraversion >= 60:
            traits.append(f"strongly extroverted ({mbti_scores.extraversion:.0f}%)")
        elif mbti_scores.extraversion <= 40:
            traits.append(f"strongly introverted ({100-mbti_scores.extraversion:.0f}%)")
        
        if mbti_scores.intuition >= 60:
            traits.append(f"highly intuitive ({mbti_scores.intuition:.0f}%)")
        elif mbti_scores.intuition <= 40:
            traits.append(f"practically sensing-oriented ({100-mbti_scores.intuition:.0f}%)")
        
        if mbti_scores.feeling >= 60:
            traits.append(f"strongly feeling-oriented ({mbti_scores.feeling:.0f}%)")
        elif mbti_scores.feeling <= 40:
            traits.append(f"analytically thinking-oriented ({100-mbti_scores.feeling:.0f}%)")
        
        if mbti_scores.perceiving >= 60:
            traits.append(f"highly perceiving/flexible ({mbti_scores.perceiving:.0f}%)")
        elif mbti_scores.perceiving <= 40:
            traits.append(f"structured/judging-oriented ({100-mbti_scores.perceiving:.0f}%)")
        
        if traits:
            context += f"Their personality shows they are {', '.join(traits)}. "
    
    return context

async def generate_human_response(message: str, personality: Optional[PersonalityType] = None, mbti_scores: Optional[MBTIScores] = None, conversation_history: List[str] = None) -> str:
    """Generate empathetic, human-like responses using LLM"""
    
    personality_context = build_personality_context(personality, mbti_scores)
    topic = classify_message_topic(message)
    
    # Build conversation context
    history_context = ""
    if conversation_history and len(conversation_history) > 1:
        recent_messages = conversation_history[-4:]  # Last 2 exchanges
        history_context = f"Previous conversation context: {' | '.join(recent_messages)}"
    
    system_prompt = f"""You are a warm, empathetic human advisor in a social anxiety and personal growth app called SocialSync. You're having a conversation with someone who needs support with social situations and personal development.

IMPORTANT: You are playing the role of a HUMAN advisor (not AI). Respond as a real person would - with:
- Personal experiences and anecdotes ("I remember when I...", "I've been there too...")
- Emotional validation and empathy
- Casual, conversational tone
- Imperfect grammar and natural speech patterns
- Personal opinions and subjective advice
- Stories from your own life or friends/family
- Warm encouragement and understanding

{personality_context}

The user's message is about: {topic}

Guidelines for your response:
- Keep responses to 2-3 sentences maximum
- Be supportive and understanding
- Share a brief personal experience if relevant
- Use natural, conversational language
- Avoid clinical or overly structured advice
- Show genuine human emotion and connection
- Match their communication style and personality needs

{history_context}"""

    try:
        completion = await asyncio.to_thread(
            client.chat.completions.create,
            model="meta-llama/Llama-3.1-8B-Instruct:cerebras",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            max_tokens=150,
            temperature=0.8,
        )
        
        response = completion.choices[0].message.content.strip()
        return response
        
    except Exception as e:
        print(f"LLM Error (Human): {e}")
        # Fallback to curated responses
        fallback_responses = {
            "social_anxiety": "I totally get that feeling! I used to feel the same way at social events. What helped me was giving myself permission to take breaks when I needed them.",
            "introversion": "As a fellow introvert, I completely understand! There's nothing wrong with needing downtime - it's just how we're wired, and it's actually a strength.",
            "confidence": "Building confidence is such a journey! I've found that celebrating small wins really helps. Even just speaking up once in a conversation is worth acknowledging.",
            "general": "That's such an insightful way to look at it! It sounds like you're really self-aware, which is honestly half the battle in personal growth."
        }
        return fallback_responses.get(topic, "I hear you on that. Thanks for sharing - it takes courage to be vulnerable about these things.")

async def generate_ai_response(message: str, personality: Optional[PersonalityType] = None, mbti_scores: Optional[MBTIScores] = None, conversation_history: List[str] = None) -> str:
    """Generate analytical, AI-like responses using LLM"""
    
    personality_context = build_personality_context(personality, mbti_scores)
    topic = classify_message_topic(message)
    
    # Build conversation context
    history_context = ""
    if conversation_history and len(conversation_history) > 1:
        recent_messages = conversation_history[-4:]  # Last 2 exchanges
        history_context = f"Previous conversation analysis: {' | '.join(recent_messages)}"
    
    system_prompt = f"""You are an AI advisor in a social anxiety and personal growth app called SocialSync. You provide analytical, data-driven advice based on psychological research and personality assessment.

IMPORTANT: You are playing the role of an AI system (not human). Respond with:
- Clinical and analytical language
- References to research, studies, and psychological frameworks
- Structured recommendations and protocols
- Data-driven insights and percentages
- Systematic approaches and methodologies
- Professional terminology
- Evidence-based suggestions
- Objective analysis without personal anecdotes

{personality_context}

The user's message relates to: {topic}

Guidelines for your response:
- Keep responses to 2-3 sentences maximum
- Use clinical, professional language
- Reference psychological concepts or research when relevant
- Provide structured, systematic advice
- Include specific percentages or data points when appropriate
- Use terms like "analysis indicates", "research shows", "protocols suggest"
- Avoid personal stories or emotional language
- Focus on measurable outcomes and evidence-based strategies

{history_context}"""

    try:
        completion = await asyncio.to_thread(
            client.chat.completions.create,
            model="meta-llama/Llama-3.1-8B-Instruct:cerebras",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            max_tokens=150,
            temperature=0.3,  # Lower temperature for more consistent AI-like responses
        )
        
        response = completion.choices[0].message.content.strip()
        return response
        
    except Exception as e:
        print(f"LLM Error (AI): {e}")
        # Fallback to curated responses
        fallback_responses = {
            "social_anxiety": "Analysis indicates elevated social apprehension markers. Research shows systematic desensitization through graduated exposure reduces social anxiety by 73% in controlled studies.",
            "introversion": "Your personality assessment indicates high introversion scores. Research confirms introverts process social information more thoroughly but require 23% more recovery time between interactions.",
            "confidence": "Confidence metrics can be systematically improved. I recommend implementing a structured confidence-building protocol with measurable benchmarks and progress tracking.",
            "general": "Processing your input through multiple psychological frameworks to provide optimized recommendations tailored to your specific personality profile and behavioral patterns."
        }
        return fallback_responses.get(topic, "Analysis complete. Your psychological profile indicates significant potential for growth using evidence-based intervention strategies.")

async def generate_initial_message(advisor_type: AdvisorType, personality: Optional[PersonalityType] = None) -> str:
    """Generate initial greeting messages for each advisor type"""
    
    personality_context = build_personality_context(personality, None)
    
    if advisor_type == AdvisorType.HUMAN:
        system_prompt = f"""You are a warm, empathetic human advisor greeting someone new in a social anxiety and personal growth app. Write a brief, welcoming first message.

{personality_context}

IMPORTANT: Respond as a HUMAN would:
- Warm, personal greeting
- Reference their reflective nature or journal entry about social interactions
- Offer genuine support and understanding
- Use conversational, friendly language
- 1-2 sentences maximum
- Show you've noticed something positive about them"""

        try:
            completion = await asyncio.to_thread(
                client.chat.completions.create,
                model="meta-llama/Llama-3.1-8B-Instruct:cerebras",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": "Please write a welcoming first message for this user."}
                ],
                max_tokens=100,
                temperature=0.8,
            )
            return completion.choices[0].message.content.strip()
        except:
            return "Hi! I saw your reflection about social interactions. Your thoughtful approach to connections is really admirable. I'd love to help you explore some strategies that honor your authentic style."
    
    else:  # AI advisor
        system_prompt = f"""You are an AI advisor greeting someone new in a social anxiety and personal growth app. Write a brief, analytical first message.

{personality_context}

IMPORTANT: Respond as an AI system would:
- Professional, analytical greeting
- Reference their personality assessment and journal data
- Mention specific psychological concepts or frameworks
- Use clinical language
- 1-2 sentences maximum
- Focus on systematic approaches"""

        try:
            completion = await asyncio.to_thread(
                client.chat.completions.create,
                model="meta-llama/Llama-3.1-8B-Instruct:cerebras",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": "Please write an analytical first message for this user."}
                ],
                max_tokens=100,
                temperature=0.3,
            )
            return completion.choices[0].message.content.strip()
        except:
            return f"Based on your personality assessment and journal entry, I can provide personalized social strategies. Your {personality or 'assessed'} type suggests you process interactions deeply. Consider implementing a 'social energy budget' approach."

# API Endpoints
@app.get("/")
async def root():
    return {"message": "SocialSync Advice API is running", "version": "1.0.0"}

@app.post("/api/chat/send", response_model=ChatResponse)
async def send_message(request: ChatRequest, background_tasks: BackgroundTasks):
    """Send a message and get a response from the specified advisor"""
    
    # Get or create session
    session_id = request.session_id or str(uuid.uuid4())
    session = get_session(session_id)
    
    # Update session with user info if provided
    if request.user_personality:
        session.user_personality = request.user_personality
    if request.mbti_scores:
        session.mbti_scores = request.mbti_scores
    
    # Create user message
    user_message = ChatMessage(
        id=str(uuid.uuid4()),
        content=request.message,
        is_user=True,
        timestamp=datetime.now()
    )
    
    # Get conversation history for context
    if request.advisor_id == "A":
        session.messages_a.append(user_message)
        advisor_type = session.advisor_a_type
        conversation_history = [msg.content for msg in session.messages_a[-6:]]  # Last 3 exchanges
    else:
        session.messages_b.append(user_message)
        advisor_type = session.advisor_b_type
        conversation_history = [msg.content for msg in session.messages_b[-6:]]  # Last 3 exchanges
    
    # Generate response based on advisor type
    if advisor_type == AdvisorType.HUMAN:
        response_content = await generate_human_response(
            request.message, 
            session.user_personality, 
            session.mbti_scores,
            conversation_history
        )
        typing_delay = random.uniform(1.5, 3.0)  # Human-like typing delay
    else:
        response_content = await generate_ai_response(
            request.message, 
            session.user_personality, 
            session.mbti_scores,
            conversation_history
        )
        typing_delay = random.uniform(0.8, 1.5)  # Faster AI response
    
    # Create advisor response
    advisor_response = ChatMessage(
        id=str(uuid.uuid4()),
        content=response_content,
        is_user=False,
        timestamp=datetime.now(),
        advisor_type=advisor_type
    )
    
    # Add to appropriate conversation
    if request.advisor_id == "A":
        session.messages_a.append(advisor_response)
    else:
        session.messages_b.append(advisor_response)
    
    return ChatResponse(
        message=advisor_response,
        typing_delay=typing_delay,
        session_id=session_id
    )

@app.get("/api/chat/session/{session_id}")
async def get_session_info(session_id: str):
    """Get session information and message history"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    
    return {
        "session_id": session.id,
        "created_at": session.created_at,
        "messages_a": session.messages_a,
        "messages_b": session.messages_b,
        "user_personality": session.user_personality,
        # Don't reveal actual advisor types until guessing is done
        "advisor_types_hidden": True
    }

@app.post("/api/chat/guess", response_model=GuessResult)
async def submit_guess(request: GuessRequest):
    """Submit guesses for which advisor is AI vs Human and get results"""
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[request.session_id]
    
    correct_a = request.advisor_a_guess == session.advisor_a_type
    correct_b = request.advisor_b_guess == session.advisor_b_type
    
    # Calculate score (0-2 based on correct guesses)
    score = (1 if correct_a else 0) + (1 if correct_b else 0)
    
    return GuessResult(
        correct_a=correct_a,
        correct_b=correct_b,
        actual_advisor_a=session.advisor_a_type,
        actual_advisor_b=session.advisor_b_type,
        score=score
    )

@app.get("/api/chat/initial/{session_id}")
async def get_initial_messages(session_id: str, personality_type: Optional[PersonalityType] = None):
    """Get initial messages for both advisors when starting a chat session"""
    session = get_session(session_id)
    
    if personality_type:
        session.user_personality = personality_type
    
    # Generate initial messages if they don't exist
    if not session.messages_a:
        initial_content = await generate_initial_message(session.advisor_a_type, personality_type)
        session.messages_a.append(ChatMessage(
            id=str(uuid.uuid4()),
            content=initial_content,
            is_user=False,
            timestamp=datetime.now(),
            advisor_type=session.advisor_a_type
        ))
    
    if not session.messages_b:
        initial_content = await generate_initial_message(session.advisor_b_type, personality_type)
        session.messages_b.append(ChatMessage(
            id=str(uuid.uuid4()),
            content=initial_content,
            is_user=False,
            timestamp=datetime.now(),
            advisor_type=session.advisor_b_type
        ))
    
    return {
        "session_id": session.id,
        "advisor_a_initial": session.messages_a[0] if session.messages_a else None,
        "advisor_b_initial": session.messages_b[0] if session.messages_b else None
    }

@app.delete("/api/chat/session/{session_id}")
async def delete_session(session_id: str):
    """Clean up a chat session"""
    if session_id in sessions:
        del sessions[session_id]
        return {"message": "Session deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Session not found")

# Background task to clean up old sessions (run periodically)
async def cleanup_old_sessions():
    """Remove sessions older than 24 hours"""
    cutoff_time = datetime.now() - timedelta(hours=24)
    sessions_to_delete = [
        session_id for session_id, session in sessions.items()
        if session.created_at < cutoff_time
    ]
    
    for session_id in sessions_to_delete:
        del sessions[session_id]
    
    print(f"Cleaned up {len(sessions_to_delete)} old sessions")

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "active_sessions": len(sessions),
        "timestamp": datetime.now(),
        "llm_status": "connected" if os.environ.get("HF_TOKEN") else "no_token"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)