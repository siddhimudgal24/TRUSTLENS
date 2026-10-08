import { useEffect, useState } from "react";
import PageHeader from "../components/layout/PageHeader";

function Inspection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (selectedImage) URL.revokeObjectURL(selectedImage);
    },
    [selectedImage]
  );

  useEffect(() => {
    if (!isAnalyzing) return;

    const timeoutId = window.setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [isAnalyzing]);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Choose an image file to continue.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("The image must be 10 MB or smaller.");
      return;
    }

    setUploadError(null);
    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);
    setAnalysisComplete(false);
  };

  const runInspection = () => {
    if (!selectedImage || isAnalyzing) return;

    setAnalysisComplete(false);
    setIsAnalyzing(true);
  };

  return (
    <div className="space-y-6 text-white">
      <PageHeader
        eyebrow="AI damage assessment"
        title="AI Inspection"
        description="Analyze shelter and infrastructure conditions using AI-assisted visual inspection."
        status={
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-[10px] font-semibold text-blue-700">

            DEMO ASSESSMENT

          </div>
        }
      />

      <p className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] text-blue-800">
        This page demonstrates an assessment workflow; no image-analysis service is connected.
        Outputs are illustrative only. Human verification is required.
      </p>


      {/* TOP STATS */}

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">


        {/* UPLOAD / IMAGE */}

        <div className="rounded-xl border border-white/10 bg-[#0D1320] p-4 sm:p-6 xl:col-span-2">

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

          <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-[#070B14] sm:min-h-[360px]">

            {selectedImage ? (

              <img
                src={selectedImage}
                alt="Inspection"
                className="h-[280px] w-full object-cover sm:h-[360px]"
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
                    aria-label="Select inspection image"
                  />

                </label>

              </div>

            )}

          </div>

          {uploadError && (
            <p role="alert" className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {uploadError}
            </p>
          )}

          {/* ACTION BUTTON */}

          <div className="flex gap-3 mt-5">

            <label className="flex-1 py-3 rounded-lg border border-white/10 bg-white/5 text-center text-xs font-semibold cursor-pointer hover:bg-white/10">

              CHANGE IMAGE

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Change inspection image"
              />

            </label>


            <button
              onClick={runInspection}
              disabled={!selectedImage || isAnalyzing}
              aria-busy={isAnalyzing}
              className={`flex-1 py-3 rounded-lg text-xs font-semibold transition ${
                !selectedImage
                  ? "bg-white/5 text-gray-600 cursor-not-allowed"
                  : "bg-cyan-500 text-black hover:bg-cyan-400"
              }`}
            >

              {isAnalyzing
                ? "ANALYZING..."
                : "                RUN DEMO ASSESSMENT"}

            </button>

          </div>

        </div>


        {/* AI RESULT PANEL */}

        <div className="rounded-xl border border-white/10 bg-[#0D1320] p-4 sm:p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <p className="text-xs text-gray-500 uppercase">
                Demo Assessment
              </p>

              <h2 className="text-lg font-semibold mt-1">
                Sample Result
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
                Upload an image to preview the local assessment demonstration.
              </p>

            </div>

          )}


          {isAnalyzing && (

            <div aria-live="polite" className="text-center py-16">

              <div className="w-12 h-12 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />

              <p className="text-sm text-cyan-400 mt-5">
                Running demo assessment...
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Preparing the illustrative result
              </p>

            </div>

          )}


          {analysisComplete && (

            <div className="space-y-5">

              <p role="status" className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] text-amber-800">
                Illustrative demo output. It is not generated by an AI service.
              </p>

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
                    Sample confidence score
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">


        {/* RECOMMENDED ACTION */}

        <div className="rounded-xl border border-white/10 bg-[#0D1320] p-4 sm:p-6">

          <p className="text-xs text-cyan-400 uppercase tracking-wider">
            Human Verification
          </p>

          <h2 className="text-lg font-semibold mt-2">
            Field Review Guidance
          </h2>


          <div className="mt-5 border border-orange-500/20 bg-orange-500/5 rounded-xl p-5">

            <div className="flex items-start gap-4">

              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                ⚠
              </div>

              <div>

                <p className="text-sm font-semibold">
                  Do not use this demonstration to assess safety
                </p>

                <p className="text-xs text-gray-500 mt-2 leading-5">
                  This prototype does not analyze the uploaded image. Any
                  operational decision requires qualified field verification
                  and the applicable response protocols.
                </p>

              </div>

            </div>

          </div>


          <div className="grid grid-cols-2 gap-3 mt-4">

            <div className="bg-[#070B14] rounded-lg p-4">

              <p className="text-[10px] text-gray-500 uppercase">
                Assessment mode
              </p>

              <p className="text-sm font-bold text-blue-600 mt-2">
                Demonstration only
              </p>

            </div>


            <div className="bg-[#070B14] rounded-lg p-4">

              <p className="text-[10px] text-gray-500 uppercase">
                Safety decisions
              </p>

              <p className="text-sm font-bold mt-2">
                Human review
              </p>

            </div>

          </div>

        </div>


        {/* INSPECTION HISTORY */}

        <div className="rounded-xl border border-white/10 bg-[#0D1320] p-4 sm:p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-xs text-gray-500 uppercase">
                Recent Activity
              </p>

              <h2 className="text-lg font-semibold mt-1">
                Inspection History
              </h2>

            </div>

            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] text-slate-500">
              No saved records
            </span>

          </div>


          <div className="mt-5 flex min-h-32 items-center justify-center rounded-md bg-white px-4 text-center">
            <p className="max-w-xs text-xs leading-5 text-slate-500">
              Inspection history is not saved in this version.
            </p>
          </div>

        </div>

      </div>


      {/* DISCLAIMER */}

      <div className="mt-6 border border-cyan-500/10 bg-cyan-500/5 rounded-xl p-4">

        <p className="text-[10px] text-cyan-400 font-semibold uppercase">
        SHELTERX INSPECTION DEMONSTRATION
        </p>

        <p className="text-[10px] text-gray-500 mt-2 leading-5">
          This local workflow does not analyze uploaded images with an AI service.
          Its illustrative results must not be used to assess or certify structural
          safety; qualified human inspection is required.
        </p>

      </div>

    </div>
  );
}

export default Inspection;