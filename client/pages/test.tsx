import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import data from "data/depression_test";
import advice from "data/generated_text";
import Link from "next/link";
import { useRouter } from "next/router";
import { loadModel, predict } from "lib/tf";
import Navbar from "components/Navbar";

// const Question: React.FC = () => {
//   return <div></div>;
// };

const Home: NextPage = () => {
  const [globalScore, setGlobalScore] = useState(0);

  useEffect(() => {
    const ds = Number(window.localStorage.getItem("ds"));
    // const ps = Number(window.localStorage.getItem("ps"));
    if (!ds) {
      window.localStorage.setItem("ds", "0");
    }
    setGlobalScore(Number(ds));
  }, []);

  return (
    <div>
      <Navbar/>
      <Head>
        <title>Wellverse.ai</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className="layout">
      </div>
      <main className="">
        <div className="layout">
          <div className="flex items-center justify-center w-full">
            <div className="md:w-[50vw] xl:w-[30vw] 2xl:w-[20vw] text-justify space-y-6">
              <h2 className="">Test</h2>
              <h4>
                Take a test to identify how severe your depression level is and
                our AI model will analyze the depression rate and provide
                advices.
              </h4>
              <Link href="/test/depression" passHref legacyBehavior>
                <div className="p-4 transition-all duration-200 border-2 border-green-600 rounded-md cursor-pointer hover:bg-green-600 hover:text-white">
                  <h4 className="font-bold">Depression Test</h4>
                  <h5 className="">
                    Take a test with 10 questions regarding symptoms of
                    depression.
                  </h5>
                </div>
              </Link>
              <Link href="/test/personality" passHref legacyBehavior>
                <div className="p-4 transition-all duration-200 border-2 border-green-600 rounded-md cursor-pointer hover:bg-green-600 hover:text-white">
                  <h4 className="font-bold">Personality Test</h4>
                  <h5 className="">
                    Take a test with 30 questions regarding your personal
                    lifestyle and living behaviour.
                  </h5>
                </div>
              </Link>
              {/* <div className="grid w-full grid-cols-2 gap-5">
                <Link href="/test/depression">
                  <a className="box-border relative z-30 inline-flex items-center justify-center w-full px-10 py-4 overflow-hidden font-bold text-white transition-all duration-300 bg-green-600 rounded-md cursor-pointer active:scale-95 group ring-offset-2 ring-1 ring-green-300 ring-offset-green-200 hover:ring-offset-green-500 ease focus:outline-none">
                    <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="relative z-20 flex items-center text-base">
                      Depression
                    </span>
                  </a>
                </Link>
                <Link href="/test/personality">
                  <a className="box-border relative z-30 inline-flex items-center justify-center w-full px-10 py-4 overflow-hidden font-bold text-white transition-all duration-300 bg-green-600 rounded-md cursor-pointer active:scale-95 group ring-offset-2 ring-1 ring-green-300 ring-offset-green-200 hover:ring-offset-green-500 ease focus:outline-none">
                    <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="relative z-20 flex items-center text-base">
                      Personality
                    </span>
                  </a>
                </Link>
              </div> */}
              <h5 className="text-xs text-gray-600">
                * By continuing, you're agreeing to the terms and conditions.
              </h5>
            </div>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 mt-20 border-t">
        <div className="flex items-center justify-center gap-2">
          Powered by{" "}
          <h4 className="font-bold text-green-600"><a href='/'>@dods</a></h4>
        </div>
      </footer>
    </div>
  );
};

export default Home;

// export const getStaticProps: GetStaticProps = () => {
//   return {
//     props: {
//       advice: advice.slice(100),
//     },
//   };
// };
