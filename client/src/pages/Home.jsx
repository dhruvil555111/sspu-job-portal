import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeaturedJobs from '../components/home/FeaturedJobs';
import TopRecruiters from '../components/home/TopRecruiters';
import Testimonials from '../components/home/Testimonials';
import { FAQ, CTASection } from '../components/home/FAQ';

const Home = () => {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <FeaturedJobs />
      <TopRecruiters />
      <Testimonials />
      <FAQ />
      <CTASection />
    </main>
  );
};

export default Home;
