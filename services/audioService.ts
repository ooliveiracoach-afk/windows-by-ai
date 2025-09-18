// File: services/audioService.ts
// Description: Manages and plays synthesized UI sounds using the Web Audio API.

type SoundType = 'startup' | 'open' | 'close' | 'minimize' | 'click' | 'shutdown';

class AudioService {
    private audioContext: AudioContext | null = null;
    private isUnlocked = false;

    private initialize() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    // Must be called after a user interaction
    unlockAudio = () => {
        if (this.isUnlocked) return;
        this.initialize();
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        this.isUnlocked = true;
        console.log("Audio unlocked.");
    }

    playSound(type: SoundType) {
        if (!this.isUnlocked || !this.audioContext) {
            // Silently fail if audio is not ready
            return;
        }

        const now = this.audioContext.currentTime;

        switch (type) {
            case 'startup': {
                // A pleasant major chord
                const freqs = [261.63, 329.63, 392.00]; // C4, E4, G4
                freqs.forEach((freq, i) => {
                    const osc = this.audioContext!.createOscillator();
                    const gain = this.audioContext!.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now);
                    gain.gain.setValueAtTime(0, now + i * 0.05);
                    gain.gain.linearRampToValueAtTime(0.1, now + i * 0.05 + 0.1);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
                    osc.connect(gain);
                    gain.connect(this.audioContext!.destination);
                    osc.start(now + i * 0.05);
                    osc.stop(now + 0.8);
                });
                break;
            }
             case 'open': {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
            }
            case 'close': {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
            }
             case 'minimize': {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
            }
            case 'click': {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1000, now);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            }
            case 'shutdown': {
                // A descending arpeggio
                const freqs = [261.63, 196.00, 164.81, 130.81]; // C4, G3, E3, C3
                freqs.forEach((freq, i) => {
                    const osc = this.audioContext!.createOscillator();
                    const gain = this.audioContext!.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now);
                    gain.gain.setValueAtTime(0, now + i * 0.1);
                    gain.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
                    osc.connect(gain);
                    gain.connect(this.audioContext!.destination);
                    osc.start(now + i * 0.1);
                    osc.stop(now + 1.2);
                });
                break;
            }
        }
    }
}

export const audioService = new AudioService();
