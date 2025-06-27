import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
export default function page() {
    return (
        <>
            <Navbar />
            <div className="bg-[url('/background.jpg')] bg-cover bg-fixed text-xl text-gray-900 min-h-[90vh]">
            </div>
            <Footer />
        </>
    )
}