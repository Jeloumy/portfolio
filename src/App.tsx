import './index.css'
import { useState } from 'react'

import CustomCursor from './components/CustomCursor'
import EmberParticles from './components/EmberParticles'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Journey from './components/Journey'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Creative from './components/Creative'
import Contact from './components/Contact'
import IntroReveal from './components/IntroReveal'

export default function App() {
  const [introPlayed] = useState(false)

  return (
    <>
      {!introPlayed && <IntroReveal />}
      <CustomCursor />
      <EmberParticles />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Journey />
        <Skills />
        <Projects />
        <Creative />
        <Contact />
      </main>
    </>
  )
}
