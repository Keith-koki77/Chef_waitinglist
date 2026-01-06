export default function Success({ onBack }) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6 animate-bounce">
          ✓
        </div>
        <h2 className="text-4xl font-black text-q-dark mb-4">You're on the list!</h2>
        <p className="text-gray-600 text-lg max-w-md mb-8">
          We've received your application. We'll reach out to you as soon as Qavaeat is ready for launch in your area.
        </p>
        <button 
          onClick={onBack}
          className="text-primary font-bold hover:underline cursor-pointer"
        >
          ← Back to home
        </button>
      </div>
    );
  }