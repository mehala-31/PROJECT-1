class SpeechController {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private onStateChangeCallbacks: Array<(speaking: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isAvailable(): boolean {
    return Boolean(this.synth);
  }

  public subscribe(cb: (speaking: boolean) => void) {
    this.onStateChangeCallbacks.push(cb);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter((c) => c !== cb);
    };
  }

  private notify() {
    this.onStateChangeCallbacks.forEach((cb) => cb(this.isSpeaking));
  }

  public speak(text: string, rate: number = 1.0) {
    if (!this.synth) return;

    this.stop();

    // Clean markdown symbols for cleaner speech
    const cleanText = text
      .replace(/[#*`_~\[\]]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = this.synth.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (!this.synth) return;
    this.synth.cancel();
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.notify();
  }

  public getSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const speech = new SpeechController();
