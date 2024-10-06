import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import QuizComponent from "components/QuizComponent"
import Link from "next/link";

const Home: NextPage = () => {
  const [globalScore, setGlobalScore] = useState(0);

  useEffect(() => {
    const ds = Number(window.localStorage.getItem("ds"));
    if (!ds) {
      window.localStorage.setItem("ds", "0");
    }
    setGlobalScore(Number(ds));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <QuizComponent/>

      <main className="flex-grow flex items-center justify-center w-full p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h2 className="text-3xl font-semibold">Test</h2>
            <h4 className="text-xl max-w-2xl">
              Take a test to identify how severe your depression level is and
              our AI model will analyze the depression rate and provide
              advice.
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <Link href="/test/depression" passHref>
                <div className="p-6 transition-all duration-200 border-2 border-green-600 rounded-md cursor-pointer hover:bg-green-600 hover:text-white h-full flex flex-col justify-between">
                  <h4 className="font-bold text-xl mb-2">Depression Test</h4>
                  <h5>
                    Take a test with 10 questions regarding symptoms of
                    depression.
                  </h5>
                </div>
              </Link>
              <Link href="/test/personality" passHref>
                <div className="p-6 transition-all duration-200 border-2 border-green-600 rounded-md cursor-pointer hover:bg-green-600 hover:text-white h-full flex flex-col justify-between">
                  <h4 className="font-bold text-xl mb-2">Personality Test</h4>
                  <h5>
                    Take a test with 30 questions regarding your personal
                    lifestyle and living behavior.
                  </h5>
                </div>
              </Link>
            </div>
            <h5 className="text-sm text-gray-600 mt-4">
              * By continuing, you're agreeing to the terms and conditions.
            </h5>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <div className="flex items-center justify-center gap-2">
          Powered by{" "}
          <h4 className="font-bold text-green-600"><a href='/'>@dods</a></h4>
        </div>
      </footer>
    </div>
  );
};

export default Home;