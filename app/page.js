
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="w-full overflow-x-hidden pb-0 pt-[64px] mt-[80px]">

        <div className="home flex flex-col justify-center border items-center min-h-[82vh] inset-0 z-10 
   w-full bg-[url('/homepage.jpg')] bg-cover bg-center relative opacity-70 lg:bg-h-[600px]">

          <div className="flex flex-col justify-center items-center gap-4 w-full">
            <h1 className="absolute top-[35%] sm:top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 
text-xl sm:text-2xl md:text-4xl lg:text-[42px] 
font-bold text-white text-center px-4 w-full">
              Connecting Farms to Stores
            </h1>
            <p className="absolute top-[48%] sm:top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2
text-xs sm:text-sm md:text-base lg:text-lg
text-white text-center px-4 max-w-[95%] sm:max-w-[90%] md:max-w-[70%] lg:max-w-[60%]">
              Bridge the gap between fresh farm produce and grocery stores. Direct, simple, and efficient vegetable supply chain
            </p>


          </div>
          <div className="absolute top-[58%] sm:top-[60%] flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full px-4">

            <Link href="/add-farmer" passHref>
              <button className="text-green-900 font-bold border border-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base lg:text-lg rounded-xl transition duration-300 hover:bg-green-100/50 whitespace-nowrap">
                Register as Farmer
              </button>
            </Link>

            <Link href="/add-store" passHref>
              <button className="text-white font-bold border border-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base lg:text-lg rounded-xl transition duration-300 hover:bg-white hover:opacity-50 hover:text-black whitespace-nowrap">
                Register as Store
              </button>
            </Link>

          </div>

        </div>

        <div className="how flex flex-col min-h-[80vh] py-16 sm:py-20   mt-[1px] justify-center
bg-[url('/farm2.png')] bg-cover bg-center">
          <div className="howtitle font-bold text-2xl justify-center items-center flex mt-[-20px]">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#1a432e]">How it Works</h1>
          </div>

          <div className="cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8  text-black mt-12 sm:mt-20 px-4 sm:px-6 ">

            {/* CARD1 */}
            <div className="w-full p-4 sm:p-5 hover:shadow-xl rounded-lg backdrop-blur-[5px]">
              <script src="https://cdn.lordicon.com/lordicon.js"></script>
              <lord-icon
                src="https://cdn.lordicon.com/wjhxvnmc.json"
                trigger="in"
                delay="500"
                state="in-reveal"
                colors="primary:#5c230a,secondary:#109121"
               style={{ width: "50px", height: "50px" }}
               >
              </lord-icon>
              <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold tracking-tight text-[#cfd2cd]">
                For Farmers
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-[#cfd2cd]">
                List your fresh vegetables with prices and quantities. Reach grocery stores directly.
              </p>
            </div>

            {/* CARD2 */}
            <div className="w-full p-4 sm:p-5 hover:shadow-xl rounded-lg backdrop-blur-[5px]">
              <script src="https://cdn.lordicon.com/lordicon.js"></script>
              <lord-icon
                src="https://cdn.lordicon.com/xazzumfu.json"
                trigger="loop"
                state=""
                style={{ width: "50px", height: "50px" }}
              ></lord-icon>
              <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold tracking-tight text-[#cfd2cd]">
                For Stores
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-[#cfd2cd]">
                Browse available vegetables from local farmers. Place orders with ease.
              </p>
            </div>

            {/* CARD3 */}
            <div className="w-full p-4 sm:p-5 hover:shadow-xl rounded-lg backdrop-blur-[5px]">
              <script src="https://cdn.lordicon.com/lordicon.js"></script>
              <lord-icon
                src="https://cdn.lordicon.com/anwjdbhf.json"
                trigger="loop"
                delay="1500"
                state="in-reveal"
                colors="primary: black ,secondary:#08a88a"
                style={{ width: "50px", height: "50px" }}
              ></lord-icon>
              <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold tracking-tight text-[#cfd2cd]">
                Direct Trading
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-[#cfd2cd]">
                No middlemen. Fair prices for farmers, fresh produce for stores.
              </p>
            </div>

            {/* CARD4 */}
            <div className="w-full p-4 sm:p-5 hover:shadow-xl rounded-lg backdrop-blur-[5px]">
              <script src="https://cdn.lordicon.com/lordicon.js"></script>
              <lord-icon
                src="https://cdn.lordicon.com/uisoczqi.json"
                trigger="loop"
                delay="1500"
                colors="primary:#242424,secondary:#16c72e"
                style={{ width: "50px", height: "50px" }}
              ></lord-icon>
              <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold tracking-tight text-[#cfd2cd]">
                Easy Management
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-[#cfd2cd]">
                Track orders, manage inventory, and grow your business efficiently.
              </p>
            </div>

          </div>

        </div>

        <section className="relative flex items-center justify-center min-h-[400px] py-12 sm:py-16 px-4 sm:px-6 mt-[1px] text-center bg-gray-100 justify-center
bg-[url('/register.jpg')] bg-cover bg-center opacity-90">

          <div className="relative z-10 max-w-2xl mx-auto mt-[-10px] sm:mt-[-20px] px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a432e] mb-3 sm:mb-4">
              Ready to Get Started?
            </h2>

            <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-6 sm:mb-10">
              Join our community of farmers and grocery stores today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <a
                href="/farmer-login"
                className="w-full sm:w-auto px-6 sm:px-10 py-2.5 sm:py-3 bg-[#1a432e] text-white font-medium rounded-full hover:text-white hover:bg-[#143524] hover:opacity-70 transition-colors duration-300 text-center"
              >
                Farmer Login
              </a>

              <a
                href="/store-login"
                className="w-full sm:w-auto px-6 sm:px-10 py-2.5 sm:py-3 border border-gray-50 text-white font-medium rounded-full hover:bg-white hover:opacity-30 hover:text-black transition-colors duration-300 text-center"
              >
                Store Login
              </a>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}

