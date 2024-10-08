import type { NextPage } from "next";
import Head from "next/head";
import * as THREE from "three";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial, OrbitControls } from "@react-three/drei";
import Image from "next/image";
import { load, inference } from "lib/inference";
import { BertTokenizer } from "lib/bert_tokenizer";
import Link from "next/link";
import Navbar from "components/Navbar";

const Home: NextPage = () => {
  const [globalScore, setGlobalScore] = useState(0);
  const [tokenizer, setTokenizer] = useState<BertTokenizer>();
  const [session, setSession] = useState<any>();
  const [emotion, setEmotion] = useState<any>();
  const [emotionTime, setEmotionTime] = useState<any>();
  const [depression, setDepression] = useState<any>();
  const [depressionTime, setDepressionTime] = useState<any>();
  // console.log(tokenizer, session);

  const nlp = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == "") {
      setEmotion([]);
      setEmotionTime("");
      setDepression([]);
      setDepressionTime("");
    } else {
      const { emotion, depression }: any = await inference(
        tokenizer,
        session[0],
        session[1],
        e.target.value
      );
      setEmotionTime(emotion[0]);
      setDepressionTime(depression[0]);
      // @ts-ignore
      setEmotion([emotion[1][1], emotion[1][2]]);
      setDepression([depression[1][1], depression[1][2]]);
    }
  };

  const download = async () => {
    const { tokenizer, emotion, depression } = await load();
    setTokenizer(tokenizer);
    setSession([emotion, depression]);
  };
  

  useEffect(() => {
    const ds = window.localStorage.getItem("ds");
    // const ps = window.localStorage.getItem("ps");
    setGlobalScore(Number(ds));
    download();
  }, []);

  return (
    <div>
      <Head>
        <title>WellVerse.ai</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Navbar />
      <main className="layout">
        <div className="lg:grid w-full grid-cols-3 gap-4 min-h-[40vh]">
          <div className="col-span-2">
            <h1 className="mb-3 text-6xl font-bold">
              Welcome to <span className="text-green-600">WellVerse.ai</span>
            </h1>
            <h3 className="text-green-600  bg-white bg-opacity-50 backdrop-blur-sm">
              <span className="text-shadow-glow">
                AI-powered mental health platform designed to provide real-time,
                personalized support for individuals in need. 
              </span>
            </h3>
            <h4 className="mt-6 text-justify">
              <span className="font-bold text-green-600">Depression</span> is a
              common and serious medical illness that negatively affects how you
              feel, the way you think and how you act.{" "}
              <a
                href="https://psychiatry.org/patients-families/depression/what-is-depression"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline hover:font-bold"
              >
                (Read More)
              </a>
            </h4>
            <div className="mb-20">
              <div className="flex items-center gap-5 mt-5">
                <div className="box-border relative z-30 inline-flex items-center justify-center w-auto overflow-hidden font-bold text-white transition-all duration-300 bg-green-600 rounded-md cursor-pointer active:scale-95 group ring-offset-2 ring-1 ring-green-300 ring-offset-green-200 hover:ring-offset-green-500 ease focus:outline-none">
                  <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                  <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                  <input
                    className="relative z-20 flex items-center px-5 py-3 text-base text-green-600 bg-white outline-none disabled:cursor-not-allowed"
                    type="text"
                    placeholder="Your thoughts today?"
                    disabled={!tokenizer}
                    onChange={nlp}
                  ></input>
                </div>
                <div>or</div>
                <Link
                  href="/test"
                  // href="#_"
                  className="box-border relative z-30 inline-flex items-center justify-center w-auto px-10 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-green-600 rounded-md cursor-pointer active:scale-95 group ring-offset-2 ring-1 ring-green-300 ring-offset-green-200 hover:ring-offset-green-500 ease focus:outline-none"
                >
                  <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                  <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                  <span className="relative z-20 flex items-center text-base">
                    Take a test
                  </span>
                </Link>
              </div>
              {!tokenizer && (
                <div className="mt-3 text-xs text-gray-600">
                  loading model ...
                </div>
              )}
              {emotion && emotionTime && (
                <div className="flex items-end gap-3 mt-3">
                  {emotion?.map((e: string, i: number) => (
                    <span
                      key={i}
                      style={{
                        // @ts-ignore
                        opacity: e[1] / 100 + 0.5,
                      }}
                    >
                      {e[0]} ({e[1]})
                    </span>
                  ))}
                  <span className="text-sm text-gray-300">{`- ${emotionTime} ms inference time`}</span>
                </div>
              )}
              {depression && depressionTime && (
                <div className="flex items-end gap-3 mt-3">
                  {depression?.map((d: string, i: number) => (
                    <span
                      key={i}
                      style={{
                        // @ts-ignore
                        opacity: d[1] / 100 + 0.5,
                      }}
                    >
                      {d[0]} ({d[1]})
                    </span>
                  ))}
                  <span className="text-sm text-gray-300">{`- ${depressionTime} ms inference time`}</span>
                </div>
              )}
            </div>
          </div>

        </div>
        <div className="flex justify-start w-full mt-10 mb-8 md:mt-0">
          <h1 className="text-5xl">
            Our <span className="text-green-600">Solutions</span>
          </h1>
        </div>
        <div className="grid w-full gap-5 md:grid-cols-3 md:grid-rows-2">
          <Link href="/test" passHref legacyBehavior>
            <div className="box-border relative z-30 inline-flex items-center justify-center w-auto px-10 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-white rounded-md cursor-pointer hover:bg-green-600 group active:scale-95 ring-offset-2 ring-1 ring-green-600 ring-offset-green-200 hover:ring-offset-green-700 ease focus:outline-none">
              <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
              <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
              <div className="relative z-20 flex flex-col items-center">
                <path
                  d="M7.75432 1.81954C7.59742 1.72682 7.4025 1.72682 7.24559 1.81954L1.74559 5.06954C1.59336 5.15949 1.49996 5.32317 1.49996 5.5C1.49996 5.67683 1.59336 5.84051 1.74559 5.93046L7.24559 9.18046C7.4025 9.27318 7.59742 9.27318 7.75432 9.18046L13.2543 5.93046C13.4066 5.84051 13.5 5.67683 13.5 5.5C13.5 5.32317 13.4066 5.15949 13.2543 5.06954L7.75432 1.81954ZM7.49996 8.16923L2.9828 5.5L7.49996 2.83077L12.0171 5.5L7.49996 8.16923ZM2.25432 8.31954C2.01658 8.17906 1.70998 8.2579 1.56949 8.49564C1.42901 8.73337 1.50785 9.03998 1.74559 9.18046L7.24559 12.4305C7.4025 12.5232 7.59742 12.5232 7.75432 12.4305L13.2543 9.18046C13.4921 9.03998 13.5709 8.73337 13.4304 8.49564C13.2899 8.2579 12.9833 8.17906 12.7456 8.31954L7.49996 11.4192L2.25432 8.31954Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>

                <h2 className="text-green-600 group-hover:text-white text-center">
                  Advance Mood Tracking
                </h2>
                <h4 className="mt-4 text-base text-center text-gray-500 group-hover:text-white">
                  Analyze your result.
                </h4>
              </div>
            </div>
          </Link>

          <Link href="/journalEntries" passHref legacyBehavior>
            <div className="box-border relative z-30 inline-flex items-center justify-center w-auto px-10 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-white rounded-md cursor-pointer hover:bg-green-600 group active:scale-95 ring-offset-2 ring-1 ring-green-600 ring-offset-green-200 hover:ring-offset-green-700 ease focus:outline-none">
              <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
              <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
              <div className="relative z-20 flex flex-col items-center">
                {/* <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-black group-hover:text-white"
                >
                  <path
                    d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM3 10.5C3 10.2239 3.22386 10 3.5 10H11.5C11.7761 10 12 10.2239 12 10.5C12 10.7761 11.7761 11 11.5 11H3.5C3.22386 11 3 10.7761 3 10.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg> */}
                <h2 className="text-green-600 group-hover:text-white">
                  ContentVerse
                </h2>
                <h4 className="mt-4 text-base text-center text-gray-500 group-hover:text-white">
                  Analyze your content and thoughts
                </h4>
              </div>
            </div>
          </Link>
          <Link href="/fitbit" passHref legacyBehavior>
            <div className="box-border relative z-30 inline-flex items-center justify-center w-auto px-10 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-white rounded-md cursor-pointer hover:bg-green-600 group active:scale-95 ring-offset-2 ring-1 ring-green-600 ring-offset-green-200 hover:ring-offset-green-700 ease focus:outline-none">
              <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
              <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
              <div className="relative z-20 flex flex-col items-center">
                {/* <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-black group-hover:text-white"
                >
                  <path
                    d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM3 10.5C3 10.2239 3.22386 10 3.5 10H11.5C11.7761 10 12 10.2239 12 10.5C12 10.7761 11.7761 11 11.5 11H3.5C3.22386 11 3 10.7761 3 10.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg> */}
                <h2 className="text-green-600 group-hover:text-white">
                  WatchOS
                </h2>
                <h4 className="mt-4 text-base text-center text-gray-500 group-hover:text-white">
                  Analyze your movement and emotions using FitBit
                </h4>
              </div>
            </div>
          </Link>
          <Link href="/quiz" passHref legacyBehavior>
            <div className="box-border relative z-30 inline-flex items-center justify-center w-auto px-10 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-white rounded-md cursor-pointer hover:bg-green-600 group active:scale-95 ring-offset-2 ring-1 ring-green-600 ring-offset-green-200 hover:ring-offset-green-700 ease focus:outline-none">
              <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
              <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
              <div className="relative z-20 flex flex-col items-center">
                {/* <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-black group-hover:text-white"
                >
                  <path
                    d="M7.75432 1.81954C7.59742 1.72682 7.4025 1.72682 7.24559 1.81954L1.74559 5.06954C1.59336 5.15949 1.49996 5.32317 1.49996 5.5C1.49996 5.67683 1.59336 5.84051 1.74559 5.93046L7.24559 9.18046C7.4025 9.27318 7.59742 9.27318 7.75432 9.18046L13.2543 5.93046C13.4066 5.84051 13.5 5.67683 13.5 5.5C13.5 5.32317 13.4066 5.15949 13.2543 5.06954L7.75432 1.81954ZM7.49996 8.16923L2.9828 5.5L7.49996 2.83077L12.0171 5.5L7.49996 8.16923ZM2.25432 8.31954C2.01658 8.17906 1.70998 8.2579 1.56949 8.49564C1.42901 8.73337 1.50785 9.03998 1.74559 9.18046L7.24559 12.4305C7.4025 12.5232 7.59742 12.5232 7.75432 12.4305L13.2543 9.18046C13.4921 9.03998 13.5709 8.73337 13.4304 8.49564C13.2899 8.2579 12.9833 8.17906 12.7456 8.31954L7.49996 11.4192L2.25432 8.31954Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg> */}
                <h2 className="text-green-600 group-hover:text-white">
                  Roadmap
                </h2>
                <h4 className="mt-4 text-base text-center text-gray-500 group-hover:text-white">
                  Personalised Roadmap
                </h4>
              </div>
            </div>
          </Link>

          <Link href="/test" passHref legacyBehavior>
            <div className="relative z-30 inline-flex items-center justify-center w-auto px-10 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-gradient-to-r from-green-300 to-green-500 rounded-lg cursor-not-allowed bg-opacity-40 backdrop-blur-md hover:bg-opacity-20 group active:scale-95 ring-offset-2 ring-1 ring-green-600 ring-offset-green-200 ease focus:outline-none shadow-lg">
              <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
              <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
              <div className="relative z-20 flex flex-col items-center">
                <h2 className="text-white text-xl font-semibold">
                  TherapyConnect
                </h2>
                <h4 className="mt-2 text-base text-center text-gray-200">
                  Teletherapy Integration
                </h4>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg -mx-2 -my-1">
                  <span className="text-white text-lg font-bold uppercase">
                    Upcoming
                  </span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/test" passHref legacyBehavior>
            <div className="relative z-30 inline-flex items-center justify-center w-auto px-10 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-300 to-blue-500 rounded-lg cursor-not-allowed bg-opacity-40 backdrop-blur-md hover:bg-opacity-20 group active:scale-95 ring-offset-2 ring-1 ring-blue-600 ring-offset-blue-200 ease focus:outline-none shadow-lg">
              <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
              <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
              <div className="relative z-20 flex flex-col items-center">
                <h2 className="text-white text-xl font-semibold">
                  KnowYourMetric
                </h2>
                <h4 className="mt-2 text-base text-center text-gray-200">
                  Correlate with mood data
                </h4>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg -mx-2 -my-1">
                  <span className="text-white text-lg font-bold uppercase">
                    Upcoming
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
        {/* <div className="flex justify-start w-full mb-10 mt-28">
          <h1 className="text-6xl break-all">
            <span className="text-green-600">Tech</span>nologies
          </h1>
        </div>
        <div className="w-full mb-10">
          <div className="w-full grid-cols-2 md:grid">
            <div className="relative w-full h-full min-h-[30vh]">
              <Image
                src="/images/web_tech.png"
                layout="fill"
                objectFit="contain"
                className=""
              />
            </div>
            <div className="md:p-8">
              <h3 className="mb-2 font-bold text-green-600 underline">Web</h3>
              <h4 className="mb-2">
                We use amazing web technologies to build this application.
              </h4>
              <h4>
                <b>Next.js</b> - Full stack React framework
              </h4>
              <h4>
                <b>Tailwind</b> - Style
              </h4>
              <h4>
                <b>Three.js</b> - JS 3D library
              </h4>
              <h4>
                <b>Planetscale</b> - MySQL Serverless DB
              </h4>
              <h4>
                <b>Prisma</b> - ORM
              </h4>
              <h4>
                <b>Framer/Spring</b> - Animations
              </h4>
            </div>
          </div>
        </div>
        <div className="w-full mb-10">
          <div className="w-full grid-cols-2 md:grid">
            <div className="md:p-8 md:text-right">
              <h3 className="mb-2 font-bold text-green-600 underline">
                Machine Learning
              </h3>
              <h4 className="mb-2">
                We use amazing machine learning technologies to train the model.
              </h4>
              <h4>
                Exporting production model - <b>TensorFlow</b>
              </h4>
              <h4>
                Research modelling params - <b>PyTorch</b>
              </h4>
              <h4>
                Utility modelling package - <b>Scikit Learn</b>
              </h4>
              <h4>
                Transformer - <b>HuggingFace</b>
              </h4>
              <h4>
                Logging and visualizing - <b>WANDB</b>
              </h4>
            </div>
            <div className="relative w-full h-full min-h-[30vh]">
              <Image
                src="/images/ml_tech.png"
                layout="fill"
                objectFit="contain"
                className=""
              />
            </div>
          </div>
        </div> */}
      </main>

      <footer className="flex items-center justify-center w-full h-24 mt-20 border-t">
        <div className="flex items-center justify-center gap-2">
          Powered by{" "}
          <h4 className="font-bold text-green-600">
            <a href="/">@dods</a>
          </h4>
        </div>
      </footer>
    </div>
  );
};

export default Home;

// const SpinningMesh = ({ position, color, speed, args }: any) => {
//   const mesh = useRef<THREE.Mesh>(null!);
//   useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

//   const [expand, setExpand] = useState(false);
//   return (
//     <mesh
//       position={position}
//       ref={mesh}
//       onClick={() => setExpand(!expand)}
//       castShadow
//     >
//       <boxBufferGeometry attach="geometry" args={args} />
//       <MeshWobbleMaterial
//         color="green"
//         speed={speed}
//         attach="material"
//         factor={0.6}
//       />
//     </mesh>
//   );
// };

// function Box(props: JSX.IntrinsicElements["mesh"]) {
//   const mesh = useRef<THREE.Mesh>(null!);
//   const [hovered, setHover] = useState(false);
//   const [active, setActive] = useState(false);
//   useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
//   return (
//     <mesh
//       {...props}
//       ref={mesh}
//       scale={active ? 1.5 : 1}
//       onClick={(event) => setActive(!active)}
//       onPointerOver={(event) => setHover(true)}
//       onPointerOut={(event) => setHover(false)}
//     >
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
//     </mesh>
//   );
// }
