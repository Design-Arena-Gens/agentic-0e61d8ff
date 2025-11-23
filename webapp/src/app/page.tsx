import { AnimationPlayer } from "@/components/AnimationPlayer";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 via-sky-50 to-white px-6 py-12">
      <div className="flex w-full max-w-5xl flex-col gap-6 text-center">
        <header className="space-y-4">
          <p className="inline-flex items-center justify-center rounded-full bg-sunrise-100 px-4 py-1 text-sm font-semibold text-sunrise-600">
            बच्चों के लिए १ मिनट की सीख
          </p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl">
            ज़िप्पी का सोलर एडवेंचर
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            5 से 15 साल के बच्चों के लिए तैयार किया गया यह 2D एनीमेशन उन्हें
            सोलर ऊर्जा के महत्व को मज़ेदार तरीके से समझाता है। हिंदी वॉइसओवर के
            साथ, बच्चे खुद को कहानी से जोड़ पाएंगे और ऊर्जा बचत के सच्चे हीरो
            बनेंगे।
          </p>
        </header>

        <AnimationPlayer />

        <footer className="space-y-2 text-sm text-slate-500">
          <p>
            देखने के बाद बच्चों से सवाल करें: “हम अपने घर में ऊर्जा कैसे बचा
            सकते हैं?” — इससे सीख और गहरी होगी।
          </p>
          <p>एनीमेशन मोबाइल, टैबलेट और डेस्कटॉप पर 16:9 अनुपात में चलता है।</p>
        </footer>
      </div>
    </main>
  );
}
