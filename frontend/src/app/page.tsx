import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import BusSeatLayout from '@/components/BusSeatLayout'
import { generateBusSeats } from '@/utils/busSeats'
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata() {
  const ua = (headers().get("user-agent") || "").toLowerCase();

  // User-Agent로 채널 판별
  let channel = "default";
  if (ua.includes("kakao")) channel = "kakao";
  else if (ua.includes("discord")) channel = "discord";

  // DB 조회
  const { data, error } = await supabase
    .from("og_meta")
    .select("*")
    .eq("channel", channel)
    .single();

  // fallback 처리
  if (error || !data) {
    const { data: fallback } = await supabase
      .from("og_meta")
      .select("*")
      .eq("channel", "default")
      .single();

    return {
      title: fallback?.title || "지식정보타운 통근버스 예매",
      description: fallback?.description || "기본 설명입니다.",
      openGraph: {
        images: [fallback?.image_url || "/default.png"],
      },
    };
  }

  // 정상 데이터 반환
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.image_url],
    },
  };
}


export default function Home() {
  const demoSeats = generateBusSeats()

  demoSeats[4].status = 'occupied'
  demoSeats[8].status = 'occupied'
  demoSeats[15].status = 'occupied'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🚌</span>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">커뮤니티 버스</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            통근 버스 예약 시스템
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            간편하고 안전한 커뮤니티 버스 예약 서비스입니다.
            원하는 목적지로 편리하게 이동하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Features & Navigation */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">빠른 시작</h3>
              <Link
                href="/user"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <span className="mr-2">🎫</span>
                버스 예약하기
              </Link>
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">👤</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">일반 사용자</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  목적지별 버스 조회, 좌석 선택 및 예약 관리
                </p>
                <div className="flex space-x-2">
                  <Link
                    href="/user"
                    className="flex-1 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-700 dark:text-green-400 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                  >
                    예약하기
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">⚙️</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">관리자</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  버스 배차 관리, 예약 관리, 탑승률 확인 및 통계
                </p>
                <div className="flex space-x-2">
                  <Link
                    href="/admin"
                    className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-400 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                  >
                    관리하기
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">🚛</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">기사님</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  오늘의 탑승객 정보 확인 및 좌석 배치 현황
                </p>
                <div className="flex space-x-2">
                  <Link
                    href="/driver"
                    className="flex-1 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-800/30 text-orange-700 dark:text-orange-400 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                  >
                    운행하기
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Demo & Info */}
          <div className="space-y-8">
            {/* Demo Bus Layout */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                좌석 배치 미리보기
              </h3>
              <BusSeatLayout seats={demoSeats} busType="28-seat" />
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">주요 기능</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-3">✓</span>
                  실시간 좌석 현황 확인
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-3">✓</span>
                  목적지별 버스 조회
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-3">✓</span>
                  간편한 좌석 선택
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-3">✓</span>
                  예약 내역 관리
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-3">✓</span>
                  관리자 배차 시스템
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-3">✓</span>
                  기사님 탑승 관리
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>&copy; 2024 커뮤니티 버스 예약 시스템. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}