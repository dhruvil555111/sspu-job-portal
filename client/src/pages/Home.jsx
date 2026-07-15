import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import PopularCategories from '../components/home/PopularCategories';
import WhyChooseSSPU from '../components/home/WhyChooseSSPU';
import FeaturedJobs from '../components/home/FeaturedJobs';
import UpcomingDrivesSection from '../components/home/UpcomingDrivesSection';
import InternshipOpportunities from '../components/home/InternshipOpportunities';
import TopRecruiters from '../components/home/TopRecruiters';
import Testimonials from '../components/home/Testimonials';
import CareerGuidance from '../components/home/CareerGuidance';
import { FAQ, CTASection } from '../components/home/FAQ';

const Home = () => {
  return (
    <main className="relative">
      <HeroSection />
      <StatsSection />
      <PopularCategories />
      <FeaturedJobs />
      <UpcomingDrivesSection />
      <InternshipOpportunities />
      <WhyChooseSSPU />
      <TopRecruiters />
      <Testimonials />
      <CareerGuidance />
      <FAQ />
      <CTASection />
    </main>
  );
};

export default Home;
