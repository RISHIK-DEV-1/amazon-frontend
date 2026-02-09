import Categories from "../components/Categories/Categories";
import Banner from "../components/Banner/Banner";
import DealsOfDay from "../components/DealsOfDay/DealsOfDay";
import Recommended from "../components/Recommended/Recommended";
import ContinueShopping from "../components/ContinueShopping/ContinueShopping";

function Home() {
  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <Categories />
      <Banner />
      <DealsOfDay />
      <Recommended />
      <ContinueShopping />
    </main>
  );
}

export default Home;
