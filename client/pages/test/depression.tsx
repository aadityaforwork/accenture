import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import data from "data/depression_test";
import advice from "data/generated_text";
import Link from "next/link";
import { useRouter } from "next/router";
import { loadModel, predict } from "lib/tf";
import QuizComponent from "components/QuizComponent"


const Home: NextPage = ({
  advice,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [response, setResponse] = useState({});
  const [result, setResult] = useState("");
  const [pred, setPred] = useState<any>();
  const [depressionScore, setDepressionScore] = useState(0);
  const [globalScore, setGlobalScore] = useState(0);

  useEffect(() => {
    (async () => {
      await loadModel("/model/depression/model.json");
    })();
    const n = Number(window.sessionStorage.getItem("dt"));
    const ds = Number(window.localStorage.getItem("ds"));
    const ps = Number(window.localStorage.getItem("ps"));
    if (!ds) {
      window.localStorage.setItem("ds", "0");
    }
    if (!ps) {
      window.localStorage.setItem("ps", "0");
    }
    setDepressionScore(Number(ds));
    // setGlobalScore(Number(ds) + Number(ps));
    let r = window.sessionStorage.getItem("dtr") || {};
    if (typeof r === "string") {
      r = JSON.parse(r);
    } else if (Object.keys(r).length === 0) {
      window.sessionStorage.setItem("dt", String(counter));
      window.sessionStorage.setItem(
        "dtr",
        JSON.stringify({
          0: -1,
          1: -1,
          2: -1,
          3: -1,
          4: -1,
          5: -1,
          6: -1,
          7: -1,
          8: -1,
          9: -1,
        })
      );
    }
    setCounter(n);
    setResponse(r);
    setMounted(true);
    let timer = setTimeout(() => setLoading(false), 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div>
     <QuizComponent/>
      <main className="">
        <div className="layout">
          {loading && (
            <div className="flex items-center justify-center w-full">
              <div className="md:w-[50vw] xl:w-[30vw] 2xl:w-[20vw] text-justify space-y-6">
                <h2 className="">Loading Test</h2>
                <h2 className="">...</h2>
              </div>
            </div>
          )}
          {!loading && counter === 0 ? (
            <div className="flex items-center justify-center w-full">
              <div className="md:w-[50vw] xl:w-[30vw] 2xl:w-[20vw] text-justify space-y-6">
                <h2 className="">Depression Test</h2>
                <h4>
                  Take a test with total of{" "}
                  <span className="text-green-600">{data.length}</span> question
                  to identify how severe your depression level is and our AI
                  model will analyze the depression rate and provide advices.
                </h4>
                <h4>
                  No personal details are being asked and stored. We used your
                  browser local storage to keep track of your score.
                </h4>
                <button
                  onClick={() => setCounter(1)}
                  className="box-border relative z-30 inline-flex items-center justify-center w-full px-10 py-4 overflow-hidden font-bold text-white transition-all duration-300 bg-green-600 rounded-md cursor-pointer active:scale-95 group ring-offset-2 ring-1 ring-green-300 ring-offset-green-200 hover:ring-offset-green-500 ease focus:outline-none"
                >
                  <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                  <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                  <span className="relative z-20 flex items-center text-base">
                    Continue
                  </span>
                </button>
                <h5 className="text-xs text-gray-600">
                  * By continuing, you're agreeing to the terms and conditions.
                </h5>
              </div>
            </div>
          ) : null}
          {mounted && !loading && counter > 0 && counter <= 10 ? (
            <div className="flex items-center justify-center w-full">
              <div className="md:w-[50vw] xl:w-[30vw] 2xl:w-[20vw] text-justify space-y-6">
                <h2 className="">Question {counter}</h2>
                <h4>{data[counter - 1]?.question ?? "--"}</h4>
                {data[counter - 1]?.answer?.map((ans, idx) => {
                  return (
                    <div key={idx} className="flex items-center mb-4">
                      <input
                        id={`radio-${idx}`}
                        onChange={(e) => {
                          setResponse({
                            ...response,
                            [`${counter - 1}`]: e.target.value,
                          });
                          window.sessionStorage.setItem("dt", String(counter));
                          window.sessionStorage.setItem(
                            "dtr",
                            JSON.stringify(response)
                          );
                        }}
                        type="radio"
                        value={idx}
                        name="radio"
                        checked={
                          // @ts-ignore
                          Number(response[counter - 1]) === idx
                        }
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded-md focus:ring-green-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`radio-${idx}`}
                        className="ml-2 text-sm font-medium text-gray-800"
                      >
                        {ans}
                      </label>
                    </div>
                  );
                })}
                <div className="grid w-full grid-cols-2 gap-5 pt-5">
                  <button
                    onClick={() => {
                      setCounter(counter - 1);
                      window.sessionStorage.setItem("dt", String(counter));
                      window.sessionStorage.setItem(
                        "dtr",
                        JSON.stringify(response)
                      );
                    }}
                    className="box-border relative z-30 inline-flex items-center justify-center w-full px-10 py-4 overflow-hidden font-bold text-white transition-all duration-300 bg-green-600 rounded-md cursor-pointer active:scale-95 group ring-offset-2 ring-1 ring-green-300 ring-offset-green-200 hover:ring-offset-green-500 ease focus:outline-none"
                  >
                    <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="relative z-20 flex items-center text-base">
                      Back
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      if (
                        // @ts-ignore
                        response[counter - 1] &&
                        // @ts-ignore
                        response[counter - 1] !== -1
                      ) {
                        window.sessionStorage.setItem(
                          "dtr",
                          JSON.stringify(response)
                        );
                        if (counter === 10) {
                          setCounter(11);
                          (async () => {
                            const result = await predict(
                              [
                                Object.keys(response).map(function (key) {
                                  // @ts-ignore
                                  return Number(response[key]);
                                }),
                              ],
                              0
                            );
                            // @ts-ignore
                            setResult(result?.class);
                            setPred(result?.pred);
                          })();
                          window.sessionStorage.setItem("dt", String(11));
                          let previous_score =
                            window.localStorage.getItem("ds");
                          const score = Object.keys(response).reduce(function (
                            previous,
                            key
                          ) {
                            // @ts-ignore
                            return previous + Number(response[key]);
                          },
                          0);
                          if (previous_score) {
                            // @ts-ignore
                            previous_score = 0;
                            setDepressionScore((score / 30) * 100);
                            window.localStorage.setItem(
                              "ds",
                              String((score / 30) * 100)
                            );
                          } else {
                            const ave =
                              ((Number(previous_score) + score) / 2 / 30) * 100;
                            setDepressionScore(ave);
                            window.localStorage.setItem("ds", String(ave));
                          }
                        } else {
                          setCounter(counter + 1);
                          window.sessionStorage.setItem("dt", String(counter));
                        }
                      } else {
                      }
                    }}
                    className="box-border relative z-30 inline-flex items-center justify-center w-full px-10 py-4 overflow-hidden font-bold text-white transition-all duration-300 bg-green-600 rounded-md cursor-pointer active:scale-95 group ring-offset-2 ring-1 ring-green-300 ring-offset-green-200 hover:ring-offset-green-500 ease focus:outline-none"
                  >
                    <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                    <span className="relative z-20 flex items-center text-base">
                      Continue
                    </span>
                  </button>
                </div>
                <h5 className="text-xs text-gray-600">
                  {counter === 0
                    ? "* By continuing, you're agreeing to the terms and conditions."
                    : "* Please choose 1 selection."}
                </h5>
              </div>
            </div>
          ) : null}
          {mounted && !loading && counter > 10 ? (
            <div className="w-full">
              <div className="flex items-center justify-center w-full">
                <div className="md:w-[50vw] xl:w-[30vw] 2xl:w-[20vw] text-justify space-y-6">
                  <div>
                    <h2 className="">Test Result</h2>
                  </div>
                  <div className="grid grid-cols-6 border-2 border-green-600 rounded-md">
                    <div className="col-span-5 p-4">
                      <h5 className="text-xs">
                        {result === "Normal"
                          ? "You are: "
                          : "You suffered from: "}
                      </h5>
                      <h4 className="font-bold">
                        {result !== "" ? result : "--"}
                      </h4>
                    </div>
                    <div
                      className="flex items-center justify-center font-bold text-white bg-green-600"
                      style={{
                        opacity: pred
                          ? pred[0] === 0
                            ? 0.2
                            : pred[0] / 4
                          : 0.2,
                      }}
                    >
                      {Math.round(depressionScore)}
                    </div>
                  </div>
                  <h4 className="pt-5 font-bold">Advices</h4>
                  <h5>
                    {advice[Math.floor(Math.random() * 50)]
                      ?.split(".")
                      .slice(0, -1)
                      .join(".")}
                    ...
                  </h5>
                  <h5>
                    {advice[Math.floor(Math.random() * 100) + 50]
                      ?.split(".")
                      .slice(0, -1)
                      .join(".")}
                    ...
                  </h5>
                  <h5 className="text-xs text-gray-600">
                    Result and advices generated from AI models.{" "}
                    <a
                      className="font-bold text-green-600"
                      href="http://"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Report Issue
                    </a>
                  </h5>
                  <div className="grid w-full grid-cols-5 gap-5 pt-5">
                    <button
                      onClick={() => {
                        window.sessionStorage.setItem("dt", String(0));
                        window.sessionStorage.setItem("dtr", "");
                        // setCounter(0);
                        router.reload();
                      }}
                      className="box-border relative z-30 inline-flex items-center justify-center w-full col-span-3 px-10 py-4 overflow-hidden font-bold text-white transition-all duration-300 bg-green-600 rounded-md cursor-pointer active:scale-95 group ring-offset-2 ring-1 ring-green-300 ring-offset-green-200 hover:ring-offset-green-500 ease focus:outline-none"
                    >
                      <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                      <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                      <span className="relative z-20 flex items-center text-base">
                        Retake the test
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        window.sessionStorage.setItem("dt", String(0));
                        window.sessionStorage.setItem("dtr", "");
                        router.push("/");
                      }}
                      className="box-border relative z-30 inline-flex items-center justify-center w-full col-span-2 px-10 py-4 overflow-hidden font-bold text-white transition-all duration-300 bg-green-600 rounded-md cursor-pointer active:scale-95 group ring-offset-2 ring-1 ring-green-300 ring-offset-green-200 hover:ring-offset-green-500 ease focus:outline-none"
                    >
                      <span className="absolute bottom-0 right-0 w-8 h-20 -mb-8 -mr-5 transition-all duration-300 ease-out transform rotate-45 translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                      <span className="absolute top-0 left-0 w-20 h-8 -mt-1 -ml-12 transition-all duration-300 ease-out transform -rotate-45 -translate-x-1 bg-white opacity-10 group-hover:translate-x-0"></span>
                      <span className="relative z-20 flex items-center text-base">
                        Go Home
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {!loading && (
        <footer className="flex items-center justify-center w-full h-24 mt-20 border-t">
          <div className="flex items-center justify-center gap-2">
            Powered by{" "}
            <h4 className="font-bold text-green-600"><a href='/'>@dods</a></h4>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      advice: advice.slice(100),
    },
  };
};
