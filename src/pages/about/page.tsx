import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import { Link } from 'react-router-dom';

export default function About() {
  const faqs = [
    {
      question: 'How does BloodLink work?',
      answer: 'BloodLink connects blood donors with blood banks across Nigeria through our real-time platform. Donors can find nearby blood banks, check availability, and schedule donations. Blood banks can manage their inventory and connect with donors instantly.'
    },
    {
      question: 'Is BloodLink free to use?',
      answer: 'Yes, BloodLink is completely free for donors. Blood banks pay a small fee for premium features like advanced analytics and priority listing, but basic services remain free for all users.'
    },
    {
      question: 'How do you ensure blood safety?',
      answer: 'All blood banks on our platform are verified and licensed by Nigerian health authorities. We work only with certified medical facilities that follow strict safety protocols and testing procedures.'
    },
    {
      question: 'Can I donate blood if I have medical conditions?',
      answer: 'Eligibility depends on your specific condition. Our platform provides general guidelines, but final eligibility is always determined by qualified medical professionals at the blood bank during screening.'
    },
    {
      question: 'How often can I donate blood?',
      answer: 'Generally, healthy adults can donate whole blood every 56 days (8 weeks). However, this may vary based on your health status and the type of donation. Always consult with medical professionals.'
    },
    {
      question: 'What happens to my donated blood?',
      answer: 'Your donated blood is tested, processed, and stored by certified blood banks. It may be used for emergency surgeries, cancer treatments, chronic illnesses, or other medical procedures that save lives.'
    }
  ];

  return (
    <div className="min-h-screen page-transition">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
          <div className="absolute inset-0 opacity-40">
            <div className="floating-element absolute top-10 left-10 w-40 h-40 bg-pink-200/40 rounded-full blur-2xl" />
            <div className="floating-element absolute bottom-20 right-20 w-32 h-32 bg-purple-200/40 rounded-full blur-2xl" />
            <div className="floating-element absolute top-1/2 left-1/3 w-24 h-24 bg-blue-200/40 rounded-full blur-2xl" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-gray-900 mb-8 leading-tight">
            About <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"> BloodLink</span>
          </h1>
          <p className="text-lg sm:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Connecting hearts, saving lives across Nigeria through innovative blood donation technology.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
                Our <span className="gradient-text">Mission</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
                BloodLink was founded with a simple yet powerful mission: to bridge the gap between blood donors and those in need across Nigeria. We believe that technology can save lives by making blood donation more accessible, efficient, and transparent.
              </p>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Our platform connects verified blood banks with willing donors, ensuring that life-saving blood is available when and where it's needed most. We're committed to building a healthier Nigeria, one donation at a time.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-[3rem] blur-3xl animate-pulse-slow" />
              <Card variant="glass" className="relative overflow-hidden shadow-2xl">
                <img 
                  src="https://readdy.ai/api/search-image?query=Nigerian%20healthcare%20mission%20with%20diverse%20medical%20professionals%20and%20volunteers%20working%20together%2C%20modern%20medical%20facility%20with%20pink%20accent%20colors%2C%20people%20helping%20each%20other%2C%20community%20healthcare%20in%20Nigeria%2C%20bright%20welcoming%20atmosphere%2C%20professional%20medical%20environment&width=600&height=400&seq=mission-ng&orientation=landscape"
                  alt="Our Mission"
                  className="w-full h-72 sm:h-80 object-cover rounded-2xl"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 bg-gradient-to-r from-gray-50/50 to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <Card variant="glass" className="overflow-hidden shadow-2xl">
                <img 
                  src="https://readdy.ai/api/search-image?query=Futuristic%20Nigerian%20healthcare%20vision%20with%20advanced%20medical%20technology%2C%20digital%20health%20networks%20connecting%20Nigerian%20cities%2C%20modern%20blood%20donation%20centers%2C%20innovative%20medical%20solutions%2C%20bright%20future%20of%20healthcare%20in%20Nigeria%20with%20pink%20technology%20accents&width=600&height=400&seq=vision-ng&orientation=landscape"
                  alt="Our Vision"
                  className="w-full h-72 sm:h-80 object-cover rounded-2xl"
                />
              </Card>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
                Our <span className="gradient-text">Vision</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
                We envision a Nigeria where no life is lost due to blood shortage. Our goal is to create the most comprehensive and reliable blood donation network in West Africa, leveraging cutting-edge technology to ensure blood availability 24/7.
              </p>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                By 2030, we aim to have connected every major blood bank in Nigeria, facilitated over 1 million blood donations, and saved countless lives through our innovative platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Meet Our <span className="gradient-text">Founders</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              The visionary minds behind BloodLink
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <Card variant="glass" className="text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 p-6">
              <div className="relative mb-8">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-glow">
                  <i className="ri-user-line text-white text-4xl sm:text-5xl"></i>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Okpechi Chinedum Daniel</h3>
              <p className="text-pink-600 font-bold mb-4 text-lg">Co-Founder & CEO</p>
              <p>A passionate healthcare technology advocate with over 8 years of experience in medical systems. Chinedum's vision of accessible healthcare for all Nigerians drives BloodLink's mission to save lives through technology.</p>
            </Card>

            <Card variant="glass" className="text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 p-6">
              <div className="relative mb-8">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-glow">
                  <i className="ri-user-line text-white text-4xl sm:text-5xl"></i>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">Okpechi Chibuikem Michael</h3>
              <p className="text-purple-600 font-bold mb-4 text-lg">Co-Founder & CTO</p>
              <p>A brilliant software engineer and healthcare innovator with expertise in building scalable medical platforms. Michael's technical leadership ensures BloodLink remains at the forefront of healthcare technology in Nigeria.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="py-24 bg-gradient-to-r from-gray-50/50 to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Platform <span className="gradient-text">Goals</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <Card variant="glass" className="text-center p-8 hover:shadow-2xl transition-all duration-500">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-glow">
                <i className="ri-heart-pulse-fill text-white text-3xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Save Lives</h3>
              <p>Connect donors with those in need to ensure no Nigerian dies from blood shortage. Every donation through our platform has the potential to save up to three lives.</p>
            </Card>

            <Card variant="glass" className="text-center p-8 hover:shadow-2xl transition-all duration-500">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-glow">
                <i className="ri-global-line text-white text-3xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Nationwide Coverage</h3>
              <p>Expand our network to cover all 36 states and FCT, ensuring every Nigerian has access to life-saving blood when needed, regardless of location.</p>
            </Card>

            <Card variant="glass" className="text-center p-8 hover:shadow-2xl transition-all duration-500">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-glow">
                <i className="ri-shield-check-fill text-white text-3xl"></i>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Safety First</h3>
              <p>Maintain the highest safety standards by working only with verified, licensed blood banks that follow strict testing and storage protocols.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p>Everything you need to know about BloodLink and blood donation</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} variant="glass" className="hover:shadow-2xl transition-all duration-300 p-6 sm:p-8">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 pr-6">{faq.question}</h3>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 glass rounded-2xl flex items-center justify-center group-open:bg-pink-500 transition-all duration-300 shadow-lg">
                      <i className="ri-add-line group-open:ri-subtract-line text-pink-500 group-open:text-white transition-all duration-300 text-lg sm:text-xl"></i>
                    </div>
                  </summary>
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-gray-600 leading-relaxed text-base sm:text-lg">{faq.answer}</p>
                  </div>
                </details>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="floating-element absolute top-20 left-20 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
          <div className="floating-element absolute bottom-20 right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
          <div className="floating-element absolute top-1/2 left-1/2 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white mb-8 leading-tight">
              Join Our <span className="bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">Mission</span>
            </h2>
            <p className="text-lg sm:text-2xl text-pink-100 mb-16 max-w-4xl mx-auto leading-relaxed">
              Be part of Nigeria's largest blood donation network. Together, we can save lives and build a healthier future for all Nigerians.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-50 shadow-2xl hover:shadow-white/30 text-xl px-12 py-6">
                <i className="ri-heart-fill mr-4"></i> <Link to="/donate">Start Donating</Link>
              </Button>
              <Button variant="glass" size="lg" className="text-white shadow-2xl text-xl px-12 py-6">
                <i className="ri-team-line mr-4"></i> Join Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}