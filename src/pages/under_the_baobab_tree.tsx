import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
export default function page() {
    return (
        <>
            <Navbar />
            <div className="bg-[url('/baobab.jpg')] bg-cover bg-fixed text-xl text-gray-900 min-h-[95vh]">
            </div>
            <Footer />
        </>
    )
}