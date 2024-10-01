import NavbarComponent from "@/components/NavbarCompent";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <NavbarComponent />
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen w-full">
        <section className="grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-12 max-w-7xl mx-auto gap-6  h-screen">

          {/* Text Section */}
          <div className="text-white space-y-4 md:space-y-8 max-w-lg animate-fade-up animate-once ">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              การจัดการงานซ่อมที่มีประสิทธิภาพ
            </h1>
            <p className="text-sm md:text-lg leading-relaxed">
              ระบบที่ช่วยให้คุณติดตามงานซ่อม จัดการข้อมูลเครื่องจักร และบริหารจัดการทีมช่างได้อย่างครบถ้วน รวดเร็ว และแม่นยำ
            </p>
            <div>
              <a
                href="/login"
                className="bg-white text-blue-600 font-semibold py-5 px-4 md:py-3 md:px-6 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
              >
                เริ่มต้นใช้งาน
              </a>
            </div>

          </div>

          {/* Image Section */}
          <div className="flex justify-center items-center">
            <Image
              className="animate-fade-down animate-ease-in max-w-xs md:max-w-md"
              alt="logo-main"
              src="/assets/backlogo.png"
              width={500}
              height={500}
            />
          </div>
        </section>

        
      </div>
    </div>
  );
}
