import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Heart, Sparkles, User, Battery, Brain, Users, Zap, Clock } from 'lucide-react';

interface LandingScreenProps {
  setCurrentScreen: (screen: string) => void;
}

export function LandingScreen({ setCurrentScreen }: LandingScreenProps) {
  const faqData = [
    {
      id: "difference",
      icon: <Users className="w-5 h-5" />,
      question: "What is the difference between an introvert and an extrovert?",
      answer: "The primary difference between an introvert and an extrovert lies in how they gain energy and where they focus their attention. Introverts tend to recharge by spending time alone, while extroverts gain energy from social interaction and being around others. Extroverts are often seen as outgoing and enjoy social gatherings, while introverts may prefer quieter activities and smaller groups."
    },
    {
      id: "how-to-know",
      icon: <Brain className="w-5 h-5" />,
      question: "How do I know if I'm an introvert or extrovert?",
      answer: "To figure out if you're an introvert or extrovert, consider what energizes you. Introverts typically recharge by spending time alone, while extroverts gain energy from social interaction. Observe your preferences in social situations and how you feel afterward. Do you prefer quiet, solitary activities or lively gatherings? Do you feel drained or energized after spending time with others? Answering these questions can help you understand your orientation."
    },
    {
      id: "ambivert",
      icon: <Battery className="w-5 h-5" />,
      question: "Can someone be both? (What is an ambivert?)",
      answer: "Yes, someone can be both an introvert and an extrovert. This personality type is called an ambivert. Ambiverts possess a balance of both introverted and extroverted traits, allowing them to adapt their behavior depending on the situation. They might enjoy the energy of social gatherings but also need time alone to recharge."
    },
    {
      id: "shy-vs-introvert",
      icon: <User className="w-5 h-5" />,
      question: "Is introversion the same as being shy or socially anxious?",
      answer: "No, introversion is not the same as being shy or socially anxious, though they are sometimes confused. Introversion is a personality trait characterized by a preference for solitary activities and a tendency to find social interaction draining, while shyness is an emotion or feeling of discomfort in social situations. Social anxiety is a mental health condition characterized by a persistent fear of being judged or scrutinized by others."
    },
    {
      id: "dislike-people",
      icon: <Heart className="w-5 h-5" />,
      question: "Do introverts dislike people?",
      answer: "Introversion is a personality trait characterized by a preference for solitary activities and a tendency to gain energy from being alone, while misanthropy is a dislike or hatred of humanity. These are distinct concepts, and someone can be an introvert without being a misanthrope. So no, introverts do not inherently hate people. While they may need more alone time to recharge and prefer deep, meaningful conversations over superficial interactions, they generally enjoy spending time with people and building relationships, just in a different way than extroverts."
    },
    {
      id: "journaling-change",
      icon: <Sparkles className="w-5 h-5" />,
      question: "Does journaling make you less introverted?",
      answer: "Neither journaling nor habit tracking is likely to fundamentally change whether you are an introvert or an extrovert, as these are considered deeply rooted personality traits. Introverts often process their thoughts deeply internally. Journaling provides a safe space for introverts to process these thoughts and emotions, reducing internal clutter and allowing for greater self-understanding. This increased self-awareness can lead to more confident and effective communication when interacting with others. While these methods won't change your innate personality, journaling and habit tracking can be powerful tools to enhance self-understanding, manage social interactions more effectively, and improve overall well-being as an introvert."
    },
    {
      id: "social-exhaustion",
      icon: <Zap className="w-5 h-5" />,
      question: "How do introverts/extroverts experience social exhaustion?",
      answer: "Introverts, who gain energy from solitude, experience exhaustion when overstimulated by social interactions, often needing time alone to recharge. Extroverts, who gain energy from social interaction, may experience social exhaustion when deprived of it or feeling pressured to perform socially, leading to feelings of depletion and pressure to 'be on'."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header Section */}
      <div className="text-center space-y-8 mb-12">
        {/* Logo */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-white/30 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-lg border border-white/20">
            <Heart className="w-12 h-12 text-[#B486AB] fill-current" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-white/70" />
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-4xl text-white drop-shadow-sm tracking-tight">
            SocialPsyche
          </h1>
          <div className="w-16 h-1 bg-white/40 rounded-full mx-auto"></div>
        </div>

        {/* Tagline */}
        <p className="text-lg text-white/90 leading-relaxed">
          <em>Grow—socially & emotionally. </em>
        </p>

        {/* Description */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg space-y-4 text-white/80 leading-relaxed max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-white"><strong> <em>Discover yourself. Reflect deeply. Grow socially—with a little help from AI.</em></strong></h2>
          <p>
            SocialPsyche is a personality-driven journaling app designed to help introverts, extroverts, and everyone in between thrive in their social lives. Start by taking a quick, thoughtful quiz to uncover your unique social personality type. Then, dive into guided journaling prompts tailored to your type—whether you're a thinking introvert or an expressive extrovert.
          </p>
          <p>
            After each entry, receive two personalized pieces of advice: one from a real human perspective, and one generated by AI. Compare, reflect, and choose what resonates most with you.
          </p>
          <p>
            Whether you're looking to connect more confidently, reflect more deeply, or simply understand yourself better, SocialPsyche helps you tune into your inner world and grow in the outer one. <br />
          </p>
        </div>
        
        {/* CTA Button */}
        <Button
          onClick={() => setCurrentScreen('quiz')}
          className="w-full bg-white/90 hover:bg-white text-[#B486AB] shadow-lg border-0 rounded-2xl py-6 transition-all duration-300 hover:scale-105"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Start the Quiz
          </span>
        </Button>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg space-y-4 text-white/80 leading-relaxed max-w-3xl w-full text-center">
          <h2 className="text-xl font-semibold text-white"> <strong>💖 Why SocialPsyche?</strong></h2>
          <p>
            We’ve lived in the digital age for a while, but now we’re stepping into a new one—an era of AI.
            Today, most of what we do happens online, including how we meet people. The idea of connecting with hundreds of new faces a day—right from our fingertips—is incredible.
          </p>
          <p>
            But for some, it’s terrifying. And often, they don’t even know why.
          </p>
          <p>
            It wasn’t until my first year of undergrad that I realized I wasn’t just “shy.” I realized that I have an introverted personality and struggle with social anxiety—those moments of overwhelming nervousness or spiraling thoughts after awkward interactions. I used to think that I was unusually shy; that something was wrong with me. I didn’t even know what anxiety truly was, or what introversion and extroversion actually meant.
          </p>
          <p>
            That’s why I created SocialPsyche.
          </p>
          <p>
            This app is for anyone curious about their social personality—whether you’re an introvert, extrovert, or somewhere in between. It’s also a space for reflection. Sometimes we want to talk to someone, but we’re afraid of bothering others—so we hold it in. With SocialPsyche, you can share those thoughts privately, and chat with two completely different voices: one rooted in human empathy, and one powered by AI.
          </p>
          <p>
            Whether you prefer warmth or logic, your reflections stay just with you.
          </p>
          <p>
            By combining the insight of personality psychology with the supportive guidance of both human connection and artificial intelligence, SocialPsyche gives you a safe space to reflect, learn, and grow—socially and emotionally.
          </p>
          <p className="italic text-white/90">
            This isn’t about fixing who you are. <br />
            It’s about <strong>understanding</strong> who you are— <br />
            and discovering how to <strong> thrive </strong> because of it.
          </p>
        </div>
      </div>


      {/* FAQ Section */}
      <div className="space-y-4">
        <h2 className="text-white text-center mb-6">Frequently Asked Questions</h2>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-white/20">
                <AccordionTrigger className="px-6 py-4 text-white/90 hover:text-white hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3 text-left">
                    <div className="text-white/70">
                      {faq.icon}
                    </div>
                    <span className="text-sm leading-relaxed">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-white/80 text-sm leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="flex justify-center gap-2 pt-8">
        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
      </div>
    </div>
  );
}