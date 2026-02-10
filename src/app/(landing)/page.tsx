// Landing Page - EHS School - Newspaper Style Professional Design
import Link from "next/link";
import { getSchoolSettings } from "@/server/actions/settings";
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Calendar,
  Trophy,
  Star,
  ArrowRight,
  Quote,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";

// Force dynamic to get fresh school settings
export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const settingsResult = await getSchoolSettings();
  const settings = settingsResult.success ? settingsResult.data : null;

  const schoolName = settings?.school_name || "Eastern High School";
  const tagline = settings?.tagline || "Fight Against Ignorance";
  const logoUrl = settings?.logo_url || null;
  const phone = settings?.phone || "+92 41 1234567";
  const email = settings?.email || "info@ehs.edu.pk";
  const address = settings?.address || "Faisalabad, Punjab, Pakistan";
  const establishedYear = settings?.established_year || "1990";

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone size={14} /> {phone}
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <Mail size={14} /> {email}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block">Established {establishedYear}</span>
            <div className="flex items-center gap-2">
              <a href="#" className="hover:text-yellow-400 transition-colors"><Facebook size={16} /></a>
              <a href="#" className="hover:text-yellow-400 transition-colors"><Twitter size={16} /></a>
              <a href="#" className="hover:text-yellow-400 transition-colors"><Instagram size={16} /></a>
              <a href="#" className="hover:text-yellow-400 transition-colors"><Youtube size={16} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b-4 border-yellow-500 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo & School Name */}
            <div className="flex items-center gap-4">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt={schoolName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-800 to-blue-900 rounded-full flex items-center justify-center border-2 border-yellow-500 shadow-lg">
                  <span className="text-xl font-bold text-white">EHS</span>
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900 tracking-tight">
                  {schoolName}
                </h1>
                <p className="text-sm text-yellow-600 font-medium italic">{tagline}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink href="#home">Home</NavLink>
              <NavLink href="#about">About</NavLink>
              <NavLink href="#academics">Academics</NavLink>
              <NavLink href="#admissions">Admissions</NavLink>
              <NavLink href="#news">News</NavLink>
              <NavLink href="#contact">Contact</NavLink>
            </nav>

            {/* Login Button */}
            <Link
              href="/login"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white-900 px-6 py-2.5 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-md flex items-center gap-2"
            >
              Portal Login
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Newspaper Style */}
      <section id="home" className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-6">
                <Star size={16} className="text-yellow-400" />
                <span className="text-yellow-200 text-sm font-medium">Excellence in Education Since {establishedYear}</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Shaping Future
                <span className="block text-yellow-400">Leaders of Tomorrow</span>
              </h2>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                At {schoolName}, we believe in nurturing young minds with quality education, 
                strong moral values, and the skills needed to excel in the modern world.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="#admissions"
                  className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-8 py-3.5 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Apply for Admission
                  <ChevronRight size={20} />
                </Link>
                <Link
                  href="#about"
                  className="border-2 border-white/30 hover:border-white/50 text-white px-8 py-3.5 rounded-lg font-semibold transition-all hover:bg-white/10"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right - Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard icon={<Users size={32} />} value="2,500+" label="Students Enrolled" />
              <StatCard icon={<GraduationCap size={32} />} value="150+" label="Expert Teachers" />
              <StatCard icon={<Award size={32} />} value="98%" label="Pass Rate" />
              <StatCard icon={<Trophy size={32} />} value="50+" label="Years of Excellence" />
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Ticker */}
      <div className="bg-yellow-500 py-3 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
          <span className="bg-blue-900 text-white px-4 py-1 rounded font-bold text-sm whitespace-nowrap">
            LATEST NEWS
          </span>
          <div className="overflow-hidden flex-1">
            <div className="animate-marquee whitespace-nowrap text-blue-900 font-medium">
              📢 Admissions Open for 2026-2027 Session | 🏆 Our Students Excel in Board Exams | 📅 Annual Sports Day Coming Soon | 🎓 Scholarship Program Available for Deserving Students | 📚 New Science Lab Inaugurated
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <QuickLinkCard
              href="#admissions"
              icon={<BookOpen size={28} />}
              title="Admissions"
              description="Apply now for the new session"
              color="blue"
            />
            <QuickLinkCard
              href="#academics"
              icon={<GraduationCap size={28} />}
              title="Academics"
              description="Our curriculum & programs"
              color="yellow"
            />
            <QuickLinkCard
              href="/login"
              icon={<Users size={28} />}
              title="Student Portal"
              description="Access your dashboard"
              color="green"
            />
            <QuickLinkCard
              href="#contact"
              icon={<Phone size={28} />}
              title="Contact Us"
              description="Get in touch with us"
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* About Section - Newspaper Layout */}
      <section id="about" className="py-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">About Our School</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Story */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center relative">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={schoolName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-yellow-500">
                    <span className="text-4xl font-bold text-blue-900">EHS</span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                  <p className="text-blue-900 font-bold">{schoolName}</p>
                  <p className="text-sm text-gray-600">{tagline}</p>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Legacy of Excellence</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Established in {establishedYear}, {schoolName} has been at the forefront of educational excellence 
                  in Faisalabad. Our institution has consistently produced outstanding students who have excelled 
                  in academics, sports, and extracurricular activities.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We believe in holistic education that nurtures not just academic brilliance but also moral values, 
                  critical thinking, and leadership skills. Our state-of-the-art facilities, experienced faculty, 
                  and innovative teaching methods create an environment where students thrive.
                </p>
                <div className="flex gap-4 mt-6">
                  <div className="flex-1 text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-900">{parseInt(establishedYear) > 0 ? new Date().getFullYear() - parseInt(establishedYear) : 30}+</p>
                    <p className="text-sm text-gray-600">Years of Service</p>
                  </div>
                  <div className="flex-1 text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-3xl font-bold text-yellow-600">10,000+</p>
                    <p className="text-sm text-gray-600">Alumni Network</p>
                  </div>
                  <div className="flex-1 text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-3xl font-bold text-green-600">100%</p>
                    <p className="text-sm text-gray-600">Dedicated Staff</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Stories */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Star className="text-yellow-500" size={20} />
                  Our Vision
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  To be the leading educational institution that transforms young minds into 
                  responsible global citizens equipped with knowledge, values, and skills for success.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Trophy className="text-yellow-500" size={20} />
                  Our Mission
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  To provide quality education through innovative teaching methods, 
                  fostering creativity, critical thinking, and moral values in every student.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl shadow-lg p-6 text-white">
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Quote className="text-yellow-400" size={20} />
                  Principal&apos;s Message
                </h4>
                <p className="text-blue-100 text-sm leading-relaxed italic">
                  &quot;Education is not just about academics; it&apos;s about building character, 
                  fostering curiosity, and preparing students for life&apos;s challenges.&quot;
                </p>
                <p className="text-yellow-400 text-sm mt-3 font-medium">
                  - {settings?.principal_name || "The Principal"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academics Section */}
      <section id="academics" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Academic Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive education from primary to higher secondary levels 
              with a focus on academic excellence and personal development.
            </p>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <AcademicCard
              level="Primary Section"
              grades="Classes 1-5"
              description="Building strong foundations with interactive learning and creative activities."
              features={["English Medium", "Activity-Based Learning", "Art & Craft", "Physical Education"]}
              color="blue"
            />
            <AcademicCard
              level="Middle Section"
              grades="Classes 6-8"
              description="Developing critical thinking and preparing for higher education."
              features={["Science & Mathematics", "Computer Education", "Languages", "Sports Activities"]}
              color="yellow"
            />
            <AcademicCard
              level="Secondary Section"
              grades="Classes 9-10 (Matric)"
              description="Focused preparation for board examinations with expert guidance."
              features={["Science Groups", "Arts Groups", "Board Exam Prep", "Career Counseling"]}
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Admissions Section */}
      <section id="admissions" className="py-20 bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Admissions Open
                <span className="block text-yellow-400">2026-2027 Session</span>
              </h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Join our family of learners and embark on a journey of excellence. 
                We welcome students who are eager to learn, grow, and make a difference.
              </p>

              <div className="space-y-4 mb-8">
                <AdmissionStep number={1} title="Fill Application Form" description="Complete the online or offline application form" />
                <AdmissionStep number={2} title="Submit Documents" description="Submit required documents and photographs" />
                <AdmissionStep number={3} title="Admission Test" description="Appear for the entrance test (Class 2 onwards)" />
                <AdmissionStep number={4} title="Fee Submission" description="Pay admission fee and collect uniform" />
              </div>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-8 py-3.5 rounded-lg font-bold transition-all shadow-lg"
              >
                Apply Online Now
                <ArrowRight size={20} />
              </Link>
            </div>

            {/* Documents Required */}
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Required Documents</h3>
              <ul className="space-y-4">
                {[
                  "Birth Certificate (Original + Copy)",
                  "Previous School Leaving Certificate",
                  "Result Card of Last Class",
                  "4 Recent Passport Size Photographs",
                  "Parent's CNIC Copies",
                  "Medical Certificate (if applicable)",
                ].map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight size={14} className="text-green-600" />
                    </div>
                    <span className="text-gray-700">{doc}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-bold text-yellow-800 mb-2">📅 Important Dates</h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <p>Registration: January 15 - March 31, 2026</p>
                  <p>Entrance Test: April 10, 2026</p>
                  <p>Results: April 20, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Events Section */}
      <section id="news" className="py-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">News & Events</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <NewsCard
              date="Jan 15, 2026"
              category="Admissions"
              title="Admissions Open for New Session"
              excerpt="Registration for the 2026-2027 academic session is now open. Apply early to secure your seat."
              image="📚"
            />
            <NewsCard
              date="Dec 20, 2025"
              category="Achievement"
              title="Board Exam Excellence"
              excerpt="Our students achieved 98% pass rate in the recent board examinations with 15 students in top positions."
              image="🏆"
            />
            <NewsCard
              date="Nov 25, 2025"
              category="Event"
              title="Annual Sports Day"
              excerpt="The annual sports day was celebrated with great enthusiasm. Students showcased their athletic talents."
              image="⚽"
            />
          </div>

          {/* Upcoming Events */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <Calendar size={24} className="text-yellow-500" />
              Upcoming Events
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <EventItem date="Feb 5" title="Parents Meeting" time="10:00 AM" />
              <EventItem date="Feb 14" title="Science Exhibition" time="9:00 AM" />
              <EventItem date="Mar 1" title="Annual Function" time="5:00 PM" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Contact Us</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-blue-900 rounded-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-blue-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-blue-200 text-sm">{address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-blue-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-blue-200 text-sm">{phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-blue-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-blue-200 text-sm">{email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-blue-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Office Hours</h4>
                    <p className="text-blue-200 text-sm">Mon - Sat: 8:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-stone-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-blue-900 mb-6">Send us a Message</h3>
              <form className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="md:col-span-2 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all resize-none"
                />
                <button
                  type="submit"
                  className="md:col-span-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-900 px-8 py-3.5 rounded-lg font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-md"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={schoolName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500"
                  />
                ) : (
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-900">EHS</span>
                  </div>
                )}
                <div>
                  <h4 className="font-bold">{schoolName}</h4>
                  <p className="text-xs text-blue-300">{tagline}</p>
                </div>
              </div>
              <p className="text-blue-300 text-sm leading-relaxed">
                Nurturing young minds with quality education and strong moral values since {establishedYear}.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-yellow-400">Quick Links</h4>
              <ul className="space-y-2 text-sm text-blue-300">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#academics" className="hover:text-white transition-colors">Academics</a></li>
                <li><a href="#admissions" className="hover:text-white transition-colors">Admissions</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Portals */}
            <div>
              <h4 className="font-bold mb-4 text-yellow-400">Portals</h4>
              <ul className="space-y-2 text-sm text-blue-300">
                <li><Link href="/login" className="hover:text-white transition-colors">Admin Login</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Teacher Login</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Student Login</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Parent Login</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4 text-yellow-400">Contact</h4>
              <ul className="space-y-2 text-sm text-blue-300">
                <li className="flex items-center gap-2"><Phone size={14} /> {phone}</li>
                <li className="flex items-center gap-2"><Mail size={14} /> {email}</li>
                <li className="flex items-start gap-2"><MapPin size={14} className="mt-1 flex-shrink-0" /> {address}</li>
              </ul>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-8 h-8 bg-blue-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors">
                  <Facebook size={16} />
                </a>
                <a href="#" className="w-8 h-8 bg-blue-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors">
                  <Twitter size={16} />
                </a>
                <a href="#" className="w-8 h-8 bg-blue-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors">
                  <Instagram size={16} />
                </a>
                <a href="#" className="w-8 h-8 bg-blue-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-colors">
                  <Globe size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 pt-8 text-center text-blue-400 text-sm">
            <p>© {new Date().getFullYear()} {schoolName}. All rights reserved.</p>
            <p className="mt-1">Powered by EHS School Management System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Component: Navigation Link
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-gray-700 hover:text-blue-900 font-medium transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all" />
    </a>
  );
}

// Component: Stat Card
function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
      <div className="text-yellow-400 mb-3 flex justify-center">{icon}</div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-blue-200 text-sm">{label}</p>
    </div>
  );
}

// Component: Quick Link Card
function QuickLinkCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "yellow" | "green" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100",
    green: "bg-green-50 text-green-600 border-green-200 hover:bg-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
  };

  return (
    <a
      href={href}
      className={`p-6 rounded-xl border-2 transition-all group ${colorClasses[color]}`}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </a>
  );
}

// Component: Academic Card
function AcademicCard({
  level,
  grades,
  description,
  features,
  color,
}: {
  level: string;
  grades: string;
  description: string;
  features: string[];
  color: "blue" | "yellow" | "green";
}) {
  const colorClasses = {
    blue: "from-blue-600 to-blue-800",
    yellow: "from-yellow-500 to-yellow-600",
    green: "from-green-600 to-green-700",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className={`bg-gradient-to-r ${colorClasses[color]} p-6 text-white`}>
        <h3 className="text-xl font-bold mb-1">{level}</h3>
        <p className="text-white/80 text-sm">{grades}</p>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
              <ChevronRight size={14} className="text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Component: Admission Step
function AdmissionStep({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 text-blue-900 font-bold">
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-blue-200 text-sm">{description}</p>
      </div>
    </div>
  );
}

// Component: News Card
function NewsCard({
  date,
  category,
  title,
  excerpt,
  image,
}: {
  date: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-6xl">
        {image}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">{category}</span>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-sm text-gray-600">{excerpt}</p>
      </div>
    </div>
  );
}

// Component: Event Item
function EventItem({
  date,
  title,
  time,
}: {
  date: string;
  title: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg">
      <div className="text-center bg-yellow-500 text-blue-900 rounded-lg p-2 min-w-[60px]">
        <p className="text-lg font-bold">{date.split(" ")[0]}</p>
        <p className="text-xs">{date.split(" ")[1]}</p>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Clock size={12} /> {time}
        </p>
      </div>
    </div>
  );
}
