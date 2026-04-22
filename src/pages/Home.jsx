// src/pages/Home.jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, MapPin, Brain, Layers, Award } from 'lucide-react'
import { AnimatedPage } from '../components/shared/AnimatedPage'
import { PageWrapper } from '../components/layout/PageWrapper'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const features = [
  { icon: <Layers size={24} />, title: 'Election Timeline', desc: 'From announcement to result — every stage explained with rich detail.', to: '/timeline', color: '#FF9933' },
  { icon: <MapPin size={24} />, title: 'Voter Journey', desc: 'Step-by-step walkthrough of how you register, find your booth, and vote.', to: '/voter-journey', color: '#1a56db' },
  { icon: <Brain size={24} />, title: 'AI Quiz', desc: 'Test your election knowledge with AI-powered adaptive questions.', to: '/quiz', color: '#0ea5e9' },
  { icon: <BookOpen size={24} />, title: 'Glossary', desc: '55+ election terms explained in simple, jargon-free language.', to: '/glossary', color: '#138808' },
  { icon: <Award size={24} />, title: 'Dashboard', desc: 'Track your learning progress, quiz scores, and civic readiness.', to: '/dashboard', color: '#7c3aed' },
]

const stats = [
  { value: '96 Cr+', label: 'Registered Voters' },
  { value: '543', label: 'Lok Sabha Seats' },
  { value: '10.5 Lakh+', label: 'Polling Stations' },
  { value: '55+', label: 'Glossary Terms' },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Home() {
  return (
    <AnimatedPage>
      <PageWrapper wide>
        {/* Hero */}
        <section className="relative text-center py-16 md:py-24">
          {/* Background glow */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-blue-600/10 blur-3xl" />
            <div className="absolute top-1/3 left-1/4 size-48 rounded-full bg-orange-500/8 blur-3xl" />
            <div className="absolute top-1/3 right-1/4 size-48 rounded-full bg-green-500/8 blur-3xl" />
          </div>

          {/* Tricolor top stripe */}
          <div className="flex justify-center mb-8">
            <div className="flex h-1 w-40 rounded-full overflow-hidden">
              <div className="flex-1 bg-[#FF9933]" />
              <div className="flex-1 bg-white/80" />
              <div className="flex-1 bg-[#138808]" />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-white/70 mb-6">
              <span className="size-2 bg-green-400 rounded-full animate-pulse" />
              India's #1 Election Education Platform
            </div>

            <h1 className="font-display font-extrabold text-5xl md:text-7xl text-white leading-tight mb-6">
              Understand Your{' '}
              <span className="text-gradient">Vote</span>
              <br />Like Never Before
            </h1>

            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              ElectoIQ is your interactive guide to India's democratic process — from voter registration to counting day — powered by Gemini AI.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" as={Link} to="/timeline" iconRight={<ArrowRight size={18} />}>
                <Link to="/timeline" className="flex items-center gap-2">
                  Explore Timeline <ArrowRight size={18} />
                </Link>
              </Button>
              <Link to="/quiz">
                <Button size="lg" variant="outline">Take the Quiz</Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Stats */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={itemVariants}>
              <Card className="text-center py-6">
                <p className="font-display font-extrabold text-3xl text-gradient mb-1">{s.value}</p>
                <p className="text-white/50 text-sm">{s.label}</p>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        {/* Feature cards */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0ea5e9] mb-2">What's Inside</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white">Everything a Voter Needs</h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={itemVariants}>
                <Link to={f.to}>
                  <Card hover glow className="h-full group">
                    <div
                      className="size-12 rounded-xl flex items-center justify-center mb-4 text-white transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${f.color}25`, color: f.color }}
                    >
                      {f.icon}
                    </div>
                    <h3 className="font-display font-bold text-lg text-white mb-2">{f.title}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{f.desc}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium" style={{ color: f.color }}>
                      Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center glass rounded-3xl p-12 border border-blue-500/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600/10 to-transparent" />
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Ready to Become an{' '}
            <span className="text-gradient">Informed Voter</span>?
          </h2>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Start your journey through India's election process and discover how your single vote shapes the future of 1.4 billion people.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/timeline">
              <Button size="lg" iconRight={<ArrowRight size={18} />}>Start Learning</Button>
            </Link>
            <Link to="/voter-journey">
              <Button size="lg" variant="outline">My Voter Journey</Button>
            </Link>
          </div>
        </motion.section>
      </PageWrapper>
    </AnimatedPage>
  )
}
