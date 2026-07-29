

import React from 'react';

const AboutSection = () => {
  const content = {
    title: "About FarmVege",
    imageAlt: "Farmer working in the fields",
    imageSrc: "/about.png",
    paragraphs: [
      "FarmVege is a bridge between the agricultural heartland and urban grocery stores. We believe in creating direct connections that benefit both farmers and store owners, eliminating unnecessary middlemen and ensuring fresh produce reaches consumers faster.",
      "Our platform enables farmers to showcase their harvest and allows grocery stores to source directly from the source, creating a win-win ecosystem for all stakeholders in the vegetable supply chain."
    ]
  };

  return (
    <section className="relative bg-gradient-to-b from-[#fefcf5] via-[#fdf8ed] to-[#fefcf5] py-24 px-6 overflow-hidden bg-[url('/farm3.png')]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#1a432e]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#e6b422]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#4a9e7a]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Section Heading with decorative underline */}
        <div className="mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1a432e] mb-4 tracking-tight">
            {content.title}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#e6b422] to-[#1a432e] rounded-full mx-auto"></div>
          <p className="text-[#5a6e5a] mt-4 text-lg font-medium">Fresh from farm to your table</p>
        </div>

        {/* Card Container - enhanced with glass morphism effect */}
        <div className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2">
          
          {/* Image Wrapper with overlay gradient */}
          <div className="relative p-4 md:p-6 bg-gradient-to-br from-[#f5f0e0] to-white">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
            <img 
              src={content.imageSrc} 
              alt={content.imageAlt} 
              className="w-full h-auto rounded-2xl object-cover shadow-lg transform transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
            />
            {/* Floating badge */}
            <div className="absolute bottom-8 left-8 bg-[#1a432e]/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              🌱 100% Fresh
            </div>
          </div>

          {/* Text Content with elegant styling */}
          <div className="px-6 md:px-10 pb-12 pt-6 text-left md:text-center max-w-3xl mx-auto">
            {content.paragraphs.map((text, index) => (
              <p 
                key={index} 
                className={`text-gray-700 text-lg leading-relaxed ${index === 0 ? 'mb-8' : 'mb-0'} ${index === 0 ? 'border-l-4 md:border-l-0 md:border-t-4 border-[#e6b422] pl-5 md:pl-0 md:pt-4' : ''}`}
              >
                {/* Optional: Logic to bold "FarmConnect" specifically in the first paragraph */}
                {index === 0 ? (
                  <>
                    <span className="font-bold text-[#1a432e] bg-gradient-to-r from-[#1a432e]/10 to-transparent px-2 py-1 rounded-lg inline-block">FarmVege</span>
                    {text.replace('FarmVege', '')}
                  </>
                ) : (
                  <span className="block">
                    <span className="text-[#e6b422] text-xl mr-1">✦</span>
                    {text}
                  </span>
                )}
              </p>
            ))}
            
            {/* Decorative leaf icon row */}
            <div className="flex justify-center gap-3 mt-8 opacity-60">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="text-[#1a432e] text-xl">🌿</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;