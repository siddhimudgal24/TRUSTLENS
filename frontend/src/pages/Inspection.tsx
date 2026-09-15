import { useState } from "react";

function Inspection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);
    setAnalysisComplete(false);
  };

  const runInspection = () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisComplete(false);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-2">
            SHELTERX / AI DAMAGE ASSESSMENT
          </p>

          <h1 className="text-3xl font-bold">
            AI Inspection
          </h1>

          <p className="text-sm text-gray-400 mt-2">
            Analyze shelter and infrastructure conditions using AI-assisted
            visual inspection.
          </p>
        </div>

        <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 rounded-lg">

          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-xs font-semibold text-emerald-400">
            AI ENGINE ONLINE
          </span>

        </div>

      </div>


      {/* TOP STATS */}

      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5">

          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Inspections
          </p>

          <p className="text-3xl font-bold mt-2">
            24
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Completed today
          </p>

        </div>


        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5">

          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Critical Findings
          </p>

          <p className="text-3xl font-bold mt-2 text-red-400">
            3
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Require immediate action
          </p>

        </div>


        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5">

          <p className="text-xs text-gray-500 uppercase tracking-wider">
            AI Accuracy
          </p>

          <p className="text-3xl font-bold mt-2 text-cyan-400">
            94%
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Model confidence
          </p>

        </div>


        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-5">

          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Response Time
          </p>

          <p className="text-3xl font-bold mt-2 text-emerald-400">
            1.8s
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Average analysis
          </p>

        </div>

      </div>


      {/* MAIN GRID */}

      <div className="grid grid-cols-3 gap-6">


        {/* UPLOAD / IMAGE */}

        <div className="col-span-2 bg-[#0D1320] border border-white/10 rounded-xl p-6">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-lg font-semibold">
                Infrastructure Inspection
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Upload an image captured by a field responder.
              </p>

            </div>

            <span className="text-[10px] px-2 py-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              AI VISION
            </span>

          </div>


          {/* IMAGE AREA */}

          <div className="border border-dashed border-white/15 rounded-xl min-h-[360px] flex items-center justify-center overflow-hidden bg-[#070B14]">

            {selectedImage ? (

              <img
                src={selectedImage}
                alt="Inspection"
                className="w-full h-[360px] object-cover"
              />

            ) : (

              <div className="text-center">

                <div className="w-16 h-16 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl">
                  📷
                </div>

                <p className="text-sm font-semibold mt-4">
                  Upload inspection image
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG or field inspection photograph
                </p>

                <label className="inline-block mt-5 px-5 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold cursor-pointer hover:bg-cyan-500/20">

                  SELECT IMAGE

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                </label>

              </div>

            )}

          </div>


          {/* ACTION BUTTON */}

          <div className="flex gap-3 mt-5">

            <label className="flex-1 py-3 rounded-lg border border-white/10 bg-white/5 text-center text-xs font-semibold cursor-pointer hover:bg-white/10">

              CHANGE IMAGE

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

            </label>


            <button
              onClick={runInspection}
              disabled={!selectedImage || isAnalyzing}
              className={`flex-1 py-3 rounded-lg text-xs font-semibold transition ${
                !selectedImage
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-cyan-500 text-black hover:bg-cyan-400"
              }`}
            >

              {isAnalyzing
                ? "ANALYZING..."
                : "RUN AI INSPECTION"}

            </button>

          </div>

        </div>


        {/* AI RESULT PANEL */}

        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <p className="text-xs text-gray-500 uppercase">
                AI Assessment
              </p>

              <h2 className="text-lg font-semibold mt-1">
                Inspection Result
              </h2>

            </div>

            {analysisComplete && (
              <span className="text-[10px] px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                COMPLETE
              </span>
            )}

          </div>


          {!analysisComplete && !isAnalyzing && (

            <div className="text-center py-16">

              <div className="text-4xl opacity-30">
                ◉
              </div>

              <p className="text-sm text-gray-400 mt-4">
                Awaiting inspection
              </p>

              <p className="text-xs text-gray-600 mt-2">
                Upload an image and run AI analysis.
              </p>

            </div>

          )}


          {isAnalyzing && (

            <div className="text-center py-16">

              <div className="w-12 h-12 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />

              <p className="text-sm text-cyan-400 mt-5">
                AI analyzing image...
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Detecting structural damage and hazards
              </p>

            </div>

          )}


          {analysisComplete && (

            <div className="space-y-5">


              {/* SEVERITY */}

              <div className="bg-[#070B14] rounded-xl p-4">

                <div className="flex justify-between">

                  <span className="text-xs text-gray-400">
                    Damage Severity
                  </span>

                  <span className="text-sm font-bold text-orange-400">
                    MODERATE
                  </span>

                </div>

                <div className="h-2 bg-white/5 rounded-full mt-3">

                  <div
                    className="h-full bg-orange-400 rounded-full"
                    style={{ width: "58%" }}
                  />

                </div>

              </div>


              {/* STRUCTURAL SAFETY */}

              <div className="bg-[#070B14] rounded-xl p-4">

                <div className="flex justify-between">

                  <span className="text-xs text-gray-400">
                    Structural Safety
                  </span>

                  <span className="text-sm font-bold text-yellow-400">
                    67%
                  </span>

                </div>

                <div className="h-2 bg-white/5 rounded-full mt-3">

                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: "67%" }}
                  />

                </div>

              </div>


              {/* AI CONFIDENCE */}

              <div className="bg-[#070B14] rounded-xl p-4">

                <div className="flex justify-between">

                  <span className="text-xs text-gray-400">
                    AI Confidence
                  </span>

                  <span className="text-sm font-bold text-emerald-400">
                    94%
                  </span>

                </div>

                <div className="h-2 bg-white/5 rounded-full mt-3">

                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: "94%" }}
                  />

                </div>

              </div>


              {/* FINDINGS */}

              <div>

                <p className="text-xs text-gray-500 uppercase mb-3">
                  Detected Findings
                </p>

                <div className="space-y-2">

                  <div className="flex gap-3 items-center bg-orange-500/5 border border-orange-500/20 rounded-lg p-3">

                    <span className="text-orange-400">
                      ⚠
                    </span>

                    <div>

                      <p className="text-xs font-semibold">
                        Wall cracking detected
                      </p>

                      <p className="text-[10px] text-gray-500">
                        Moderate structural concern
                      </p>

                    </div>

                  </div>


                  <div className="flex gap-3 items-center bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">

                    <span className="text-yellow-400">
                      ⚠
                    </span>

                    <div>

                      <p className="text-xs font-semibold">
                        Roof condition requires review
                      </p>

                      <p className="text-[10px] text-gray-500">
                        Manual inspection recommended
                      </p>

                    </div>

                  </div>


                  <div className="flex gap-3 items-center bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">

                    <span className="text-emerald-400">
                      ✓
                    </span>

                    <div>

                      <p className="text-xs font-semibold">
                        Entrance appears accessible
                      </p>

                      <p className="text-[10px] text-gray-500">
                        No major obstruction detected
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>


      {/* LOWER SECTION */}

      <div className="grid grid-cols-2 gap-6 mt-6">


        {/* RECOMMENDED ACTION */}

        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-6">

          <p className="text-xs text-cyan-400 uppercase tracking-wider">
            Decision Support
          </p>

          <h2 className="text-lg font-semibold mt-2">
            Recommended Action
          </h2>


          <div className="mt-5 border border-orange-500/20 bg-orange-500/5 rounded-xl p-5">

            <div className="flex items-start gap-4">

              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                ⚠
              </div>

              <div>

                <p className="text-sm font-semibold">
                  Schedule manual structural inspection
                </p>

                <p className="text-xs text-gray-500 mt-2 leading-5">
                  AI assessment indicates moderate structural damage.
                  The facility should be manually verified before being
                  classified as fully operational.
                </p>

              </div>

            </div>

          </div>


          <div className="grid grid-cols-2 gap-3 mt-4">

            <div className="bg-[#070B14] rounded-lg p-4">

              <p className="text-[10px] text-gray-500 uppercase">
                Priority
              </p>

              <p className="text-sm font-bold text-orange-400 mt-2">
                HIGH
              </p>

            </div>


            <div className="bg-[#070B14] rounded-lg p-4">

              <p className="text-[10px] text-gray-500 uppercase">
                Response
              </p>

              <p className="text-sm font-bold mt-2">
                &lt; 2 HOURS
              </p>

            </div>

          </div>

        </div>


        {/* INSPECTION HISTORY */}

        <div className="bg-[#0D1320] border border-white/10 rounded-xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-xs text-gray-500 uppercase">
                Recent Activity
              </p>

              <h2 className="text-lg font-semibold mt-1">
                Inspection History
              </h2>

            </div>

            <button className="text-xs text-cyan-400">
              VIEW ALL
            </button>

          </div>


          <div className="mt-5 space-y-3">


            <div className="flex items-center justify-between border-b border-white/5 pb-3">

              <div>

                <p className="text-sm font-medium">
                  Shelter A-102
                </p>

                <p className="text-[10px] text-gray-500 mt-1">
                  Structural inspection
                </p>

              </div>

              <div className="text-right">

                <p className="text-xs text-emerald-400">
                  SAFE
                </p>

                <p className="text-[10px] text-gray-600 mt-1">
                  12 min ago
                </p>

              </div>

            </div>


            <div className="flex items-center justify-between border-b border-white/5 pb-3">

              <div>

                <p className="text-sm font-medium">
                  Shelter B-204
                </p>

                <p className="text-[10px] text-gray-500 mt-1">
                  Damage assessment
                </p>

              </div>

              <div className="text-right">

                <p className="text-xs text-orange-400">
                  MODERATE
                </p>

                <p className="text-[10px] text-gray-600 mt-1">
                  27 min ago
                </p>

              </div>

            </div>


            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium">
                  Shelter C-301
                </p>

                <p className="text-[10px] text-gray-500 mt-1">
                  Infrastructure check
                </p>

              </div>

              <div className="text-right">

                <p className="text-xs text-red-400">
                  CRITICAL
                </p>

                <p className="text-[10px] text-gray-600 mt-1">
                  41 min ago
                </p>

              </div>

            </div>


          </div>

        </div>

      </div>


      {/* DISCLAIMER */}

      <div className="mt-6 border border-cyan-500/10 bg-cyan-500/5 rounded-xl p-4">

        <p className="text-[10px] text-cyan-400 font-semibold uppercase">
          SHELTERX AI DECISION SUPPORT
        </p>

        <p className="text-[10px] text-gray-500 mt-2 leading-5">
          AI-generated inspection results are intended to support emergency
          response teams and prioritize field verification. They do not
          replace certified structural or safety inspections.
        </p>

      </div>

    </div>
  );
}

export default Inspection;