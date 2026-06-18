import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Custom Hook for Scroll Intersection
const useIntersection = (ref) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isIntersecting;
};

// Animated Scroll Container
const AnimatedSection = ({ children, className = '', delay = '', ...props }) => {
  const ref = useRef(null);
  const isIntersecting = useIntersection(ref);

  return (
    <div
      ref={ref}
      className={`scroll-fade-in ${isIntersecting ? 'scroll-active' : ''} ${className} ${delay}`}
      {...props}
    >
      {children}
    </div>
  );
};

const Landing = () => {
  const [isDark, setIsDark] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [cardHovered, setCardHovered] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [textFade, setTextFade] = useState(true);

  const words = ['Career', 'Future', 'Job', 'Path'];

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextFade(false);
      setTimeout(() => {
        setWordIdx((prev) => (prev + 1) % words.length);
        setTextFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    const dark = document.documentElement.classList.toggle('dark');
    setIsDark(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    toast.success(dark ? 'Dark theme enabled!' : 'Light theme enabled!');
  };

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Normalize coordinates to -1 to 1 and calculate tilt angles
    const rotateX = -(y / (rect.height / 2)) * 12; // max 12 degrees
    const rotateY = (x / (rect.width / 2)) * 12;  // max 12 degrees
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleCardMouseLeave = () => {
    setCardHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="font-sans transition-colors duration-300 bg-[#F5F0EB] dark:bg-[#0F0F12] text-gray-900 dark:text-gray-100 min-h-screen relative overflow-hidden">
      
      {/* Background Glowing Blobs */}
      <div className="absolute top-[-100px] left-[-50px] w-96 h-96 bg-purple-400/20 dark:bg-purple-900/10 rounded-full filter blur-[100px] animate-blob pointer-events-none" />
      <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] bg-orange-400/15 dark:bg-amber-900/10 rounded-full filter blur-[120px] animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[450px] h-[450px] bg-purple-300/15 dark:bg-fuchsia-950/10 rounded-full filter blur-[110px] animate-blob animation-delay-4000 pointer-events-none" />

      {/* Floating 3D Elements */}
      <div className="absolute top-1/4 left-10 animate-float-3d-slow hidden xl:block select-none pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
        <div className="bg-white/90 dark:bg-zinc-900/90 px-4 py-2.5 rounded-2xl shadow-lg border border-white/20 dark:border-zinc-800/80 flex items-center gap-2 transform rotate-12" style={{ transform: 'perspective(1000px) rotateX(10deg) rotateY(-15deg) translateZ(30px)' }}>
          <span className="text-lg">🎨</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Designer</span>
        </div>
      </div>
      <div className="absolute top-[45%] right-16 animate-float-3d-medium hidden xl:block select-none pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
        <div className="bg-white/90 dark:bg-zinc-900/90 px-4 py-2.5 rounded-2xl shadow-lg border border-white/20 dark:border-zinc-800/80 flex items-center gap-2 transform -rotate-6" style={{ transform: 'perspective(1000px) rotateX(-12deg) rotateY(10deg) translateZ(40px)' }}>
          <span className="text-lg">💻</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Developer</span>
        </div>
      </div>
      <div className="absolute bottom-28 left-[22%] animate-float-3d-fast hidden xl:block select-none pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
        <div className="bg-white/90 dark:bg-zinc-900/90 px-4 py-2.5 rounded-2xl shadow-lg border border-white/20 dark:border-zinc-800/80 flex items-center gap-2 transform rotate-6" style={{ transform: 'perspective(1000px) rotateX(8deg) rotateY(12deg) translateZ(25px)' }}>
          <span className="text-lg">📊</span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Product Manager</span>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 py-3 sm:px-8 sm:py-4 bg-transparent relative z-10">
        <div className="flex items-center gap-1.5 sm:gap-2 select-none">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-[#5B2D8E]/20" style={{ backgroundColor: '#5B2D8E' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">JobParking</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/register?role=recruiter" className="text-gray-500 dark:text-gray-400 hover:text-[#5B2D8E] dark:hover:text-purple-400 font-medium transition duration-200">For Recruiters</Link>
          <a href="#about" className="text-gray-500 dark:text-gray-400 hover:text-[#5B2D8E] dark:hover:text-purple-400 font-medium transition duration-200">About</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={toggleDarkMode} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-zinc-800/50" title="Toggle dark mode">
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <Link to="/login" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold transition">
            Sign In
          </Link>
          <Link to="/register"
            className="text-white px-3 py-1.5 text-xs sm:px-5 sm:py-2.5 sm:text-base rounded-full font-semibold transition shadow-md shadow-[#5B2D8E]/20 hover:shadow-lg hover:shadow-[#5B2D8E]/30 active:scale-95 transform duration-150"
            style={{ backgroundColor: '#5B2D8E' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="px-4 pt-8 pb-16 sm:px-8 sm:pt-12 sm:pb-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
        {/* Left */}
        <div className="flex-1 animate-fade-in-up w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 shadow-sm border border-purple-100 dark:border-purple-900/30"
            style={{ backgroundColor: isDark ? 'rgba(91, 45, 142, 0.2)' : '#EDE8F5', color: isDark ? '#C084FC' : '#5B2D8E' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            #1 Job Platform for Professionals
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 animate-3d-text-intro">
            Find Your Dream{' '}
            <span
              className={`inline-block transition-all duration-300 transform text-[#5B2D8E] dark:text-[#C084FC] ${
                textFade ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
              }`}
            >
              {words[wordIdx]}
            </span>
            <br />Opportunity
          </h1>

          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
            Connect with top employers, discover amazing opportunities, and
            take the next step in your professional journey with JobParking.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
            <Link to="/register?role=candidate"
              className="flex items-center justify-center gap-2 text-white px-6 py-3.5 rounded-full font-semibold transition hover:opacity-95 shadow-md shadow-[#5B2D8E]/25 hover:shadow-lg active:scale-95 transform duration-150 cursor-pointer w-full sm:w-auto text-center"
              style={{ backgroundColor: '#5B2D8E' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              I'm a Candidate →
            </Link>
            <Link to="/register?role=recruiter"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold border-2 transition bg-transparent hover:bg-gray-200/30 dark:hover:bg-zinc-800/30 active:scale-95 transform duration-150 cursor-pointer w-full sm:w-auto text-center"
              style={{ borderColor: '#5B2D8E', color: isDark ? '#C084FC' : '#5B2D8E' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              I'm a Recruiter
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="flex -space-x-2.5">
              {['A','B','C','D'].map((l, i) => (
                <div key={i} className="w-9.5 h-9.5 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: ['#9B6BB5','#C4A0D4','#7A4FA0','#B08EC0'][i] }}>
                  {l}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Trusted by 100K+ users</span>
          </div>
        </div>

        {/* Right — Job Cards */}
        <div className="flex-1 flex justify-center relative select-none" style={{ perspective: '1200px' }}>
          
          {/* Glowing Shadow Background Layer (moving behind the card) */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-[#5B2D8E]/20 to-[#C4A0D4]/30 rounded-3xl blur-3xl transition-transform duration-500 pointer-events-none"
            style={{
              transform: cardHovered
                ? `translate3d(${-tilt.y * 1.5}px, ${tilt.x * 1.5}px, -20px) scale(0.95)`
                : 'translate3d(0, 0, -30px) scale(0.9)',
            }}
          />

          <div
            onMouseMove={handleCardMouseMove}
            onMouseEnter={() => setCardHovered(true)}
            onMouseLeave={handleCardMouseLeave}
            className="hero-3d-card bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md relative border border-white/20 dark:border-zinc-800/80 shadow-[0_20px_50px_rgba(91,45,142,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] cursor-default transition-all duration-300"
            style={{
              transform: cardHovered
                ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.04, 1.04, 1.04)`
                : 'rotateX(8deg) rotateY(-14deg) rotateZ(1deg)',
              transformStyle: 'preserve-3d',
              animation: cardHovered ? 'none' : 'float3D 6s ease-in-out infinite',
              transition: cardHovered ? 'transform 0.05s ease-out, shadow 0.3s ease' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), shadow 0.8s ease',
            }}
          >
            {/* Header / Brand layer with translateZ */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800/80 mb-2" style={{ transform: 'translateZ(35px)' }}>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Live Positions</span>
              </div>
              <span className="text-[10px] bg-purple-100 dark:bg-purple-950/60 text-[#5B2D8E] dark:text-purple-300 px-2.5 py-0.5 rounded-full font-bold">
                50+ Matches
              </span>
            </div>

            {/* Content list with moderate translateZ */}
            <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
              {[
                { title: 'Senior Product Designer', company: 'Figma', salary: '$120K - $180K' },
                { title: 'Full Stack Developer',     company: 'Stripe', salary: '$140K - $200K' },
                { title: 'Marketing Manager',        company: 'Notion', salary: '$90K - $130K' },
              ].map((job, i) => (
                <div key={i} className={`flex items-center justify-between py-4 group cursor-pointer ${i < 2 ? 'border-b border-gray-100 dark:border-zinc-800/50' : ''}`} style={{ transform: 'translateZ(10px)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#EDE8F5] dark:bg-zinc-800 border border-transparent group-hover:border-purple-300 dark:group-hover:border-purple-800 transition duration-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#C084FC' : '#5B2D8E'} strokeWidth="1.5">
                        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm group-hover:text-[#5B2D8E] dark:group-hover:text-purple-400 transition">{job.title}</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs">{job.company}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#C4732A] dark:text-[#E2893B]">{job.salary}</span>
                </div>
              ))}
            </div>

            {/* Application sent toast with HIGH translateZ and shadow */}
            <div 
              className="hero-3d-card-toast absolute bottom-2 right-2 sm:-bottom-5 sm:-right-4 bg-white dark:bg-zinc-800 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.5)] px-4 py-2.5 flex items-center gap-3 border border-gray-100 dark:border-zinc-700/50 transition duration-300 hover:scale-105"
              style={{
                transform: 'translateZ(50px)',
              }}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">Application Sent!</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Just now</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <AnimatedSection className="py-8 sm:py-12 border-t border-b border-gray-200 dark:border-zinc-800 bg-[#F5F0EB] dark:bg-[#0F0F12]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          {[
            { value: '50K+',  label: 'Active Jobs' },
            { value: '10K+',  label: 'Companies' },
            { value: '100K+', label: 'Job Seekers' },
            { value: '95%',   label: 'Success Rate' },
          ].map((stat, i) => (
            <div key={i} className="hover:-translate-y-1.5 transition transform duration-300">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#5B2D8E] dark:text-[#C084FC]">{stat.value}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium text-sm sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* WHY CHOOSE US */}
      <AnimatedSection id="about" className="py-12 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Why Choose <span className="text-[#5B2D8E] dark:text-[#C084FC]">JobParking</span>?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg max-w-2xl mx-auto">
            Everything you need to accelerate your career or find the perfect talent for your team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
              title: 'Smart Matching',
              desc: 'AI-powered job matching connects you with the perfect opportunities based on your skills and preferences.',
            },
            {
              icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
              title: 'Verified Employers',
              desc: 'All employers are verified to ensure you\'re applying to legitimate, trustworthy companies.',
            },
            {
              icon: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
              title: 'Career Growth',
              desc: 'Track your applications, get insights, and accelerate your career journey with our tools.',
            },
            {
              icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
              title: 'Premium Support',
              desc: 'Get dedicated support from our team to help you navigate your job search successfully.',
            },
          ].map((feature, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm hover:shadow-xl dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.4)] transition-all duration-300 hover-lift-3d">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-[#EDE8F5] dark:bg-purple-950/40">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#C084FC' : '#5B2D8E'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* TESTIMONIALS */}
      <AnimatedSection className="py-12 sm:py-20 px-4 sm:px-8 bg-[#EDE8F5] dark:bg-[#1A1225] border-t border-b border-purple-100 dark:border-purple-950/20">
        <div className="max-w-5xl mx-auto text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Loved by <span className="text-[#C4772A] dark:text-[#E2893B]">Professionals</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto text-sm sm:text-base">See what our users have to say about their experience with JobParking.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { name: 'Priya Sharma',   role: 'Software Engineer',    text: 'Found my dream job within 2 weeks! The matching algorithm is incredibly accurate.' },
            { name: 'Rahul Mehta',    role: 'Product Manager',      text: 'The platform is so intuitive. I got 5 interview calls in just 3 days of signing up.' },
            { name: 'Sneha Patil',    role: 'UX Designer',          text: 'JobParking helped me transition from a small startup to a top MNC seamlessly.' },
          ].map((t, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9.5 h-9.5 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                  style={{ backgroundColor: '#5B2D8E' }}>
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{t.name}</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="py-12 sm:py-20 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto rounded-3xl p-6 sm:p-12 text-center text-white bg-gradient-to-r from-[#5B2D8E] to-[#7C3AED] dark:from-[#3B1D5E] dark:to-[#5B2D8E] shadow-xl dark:shadow-[0_20px_50px_rgba(91,45,142,0.25)] relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 relative z-10">Ready to Start Your Journey?</h2>
          <p className="text-purple-200 dark:text-purple-300 mb-8 text-base sm:text-lg relative z-10">
            Join thousands of professionals who have found their dream jobs through JobParking.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 relative z-10 w-full sm:w-auto">
            <Link to="/register"
              className="bg-white hover:bg-gray-100 text-[#5B2D8E] font-bold px-8 py-3.5 rounded-full transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transform duration-150 cursor-pointer w-full sm:w-auto text-center justify-center flex items-center">
              Get Started Free →
            </Link>
            <a href="#about"
              className="border-2 border-white text-white hover:bg-white hover:text-[#5B2D8E] font-bold px-8 py-3.5 rounded-full transition transform hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto text-center justify-center flex items-center">
              Learn More
            </a>
          </div>
        </div>
      </AnimatedSection>

      {/* FOOTER */}
      <AnimatedSection className="px-4 sm:px-8 pt-12 sm:pt-16 pb-6 border-t border-gray-200 dark:border-zinc-800 bg-[#F5F0EB] dark:bg-[#0F0F12]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#5B2D8E' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">JobParking</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">Connecting talent with opportunity. Your dream career starts here.</p>
          </div>
          {[
            { heading: 'For Candidates', links: ['Browse Jobs', 'Companies', 'Salary Guide'] },
            { heading: 'For Recruiters', links: ['Post a Job', 'Pricing', 'Resources'] },
            { heading: 'Company',        links: ['About Us', 'Contact', 'Privacy Policy'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-gray-500 dark:text-gray-400 text-sm hover:text-[#5B2D8E] dark:hover:text-purple-400 transition duration-200">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-zinc-800 pt-6 text-center text-gray-400 dark:text-gray-500 text-sm font-medium">
          © 2026 JobParking. All rights reserved.
        </div>
      </AnimatedSection>

    </div>
  );
};

export default Landing;