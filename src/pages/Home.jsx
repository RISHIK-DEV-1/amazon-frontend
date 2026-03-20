import Categories from "../components/Categories/Categories";
import Banner from "../components/Banner/Banner";
import DealsOfDay from "../components/DealsOfDay/DealsOfDay";
import Recommended from "../components/Recommended/Recommended";
import ContinueShopping from "../components/ContinueShopping/ContinueShopping";

function Home() {
  return (
    <main className="home-container">
      <Categories />
      <Banner />
      <DealsOfDay />
      <Recommended />
      <ContinueShopping />
    </main>
  );
}

export default Home;
