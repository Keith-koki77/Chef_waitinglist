const features = [
    { title: "Verified Chefs", desc: "Every chef on Qavaeat undergoes a rigorous vetting process.", icon: "👨‍🍳" },
    { title: "Custom Menus", desc: "Tailor your dining experience to your dietary needs and cravings.", icon: "📜" },
    { title: "Seamless Booking", desc: "Schedule, pay, and chat all within the Qavaeat mobile app.", icon: "📱" }
  ];
  
  export default function Features() {
    return (
      <section className="py-20 bg-white px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 underline decoration-accent underline-offset-8">
            Why Qavaeat?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <div key={i} className="text-center p-6 rounded-2xl hover:bg-off-white transition-all">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }