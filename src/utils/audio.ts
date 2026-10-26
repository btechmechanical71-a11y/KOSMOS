// Subtle, high-tech synthesized sound feedback using Web Audio API

class SoundEffects {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled && !this.ctx) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      } catch {
        // AudioContext not supported or restricted in iframe
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private initCtx() {
    if (!this.ctx && this.enabled) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      } catch {
        // Ignore
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playStepPulse() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // safe fallback
    }
  }

  public playScanChime() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [880, 1100, 1320].forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.04);

        gain.gain.setValueAtTime(0.025, now + index * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.04 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.04);
        osc.stop(now + index * 0.04 + 0.2);
      });
    } catch {
      // safe fallback
    }
  }

  public playSuccessChime() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.03, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {
      // safe fallback
    }
  }

  private alarmNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private alarmActive: boolean = false;

  public playAlarmBuzzer() {
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.alarmActive = true;
      const now = this.ctx.currentTime;
      // Synthesize dual-tone emergency alert buzzer pulse pattern
      const bursts = [0, 0.18, 0.36];
      bursts.forEach((offset) => {
        if (!this.ctx || !this.alarmActive) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(820, now + offset);
        osc.frequency.setValueAtTime(640, now + offset + 0.08);

        gain.gain.setValueAtTime(0.09, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.16);

        this.alarmNodes.push({ osc, gain });

        // Auto remove when finished
        setTimeout(() => {
          this.alarmNodes = this.alarmNodes.filter(n => n.osc !== osc);
        }, (offset + 0.2) * 1000);
      });
    } catch {
      // safe fallback
    }
  }

  public stopAlarmBuzzer() {
    this.alarmActive = false;
    try {
      if (this.ctx) {
        const now = this.ctx.currentTime;
        this.alarmNodes.forEach(({ osc, gain }) => {
          try {
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(0, now);
            osc.stop(now);
            osc.disconnect();
          } catch {
            // Already ended
          }
        });
      }
      this.alarmNodes = [];
    } catch {
      // safe fallback
    }
  }

  public playPurgeConfirmationChime() {
    if (!this.ctx) this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // High-tech calming resolution chord [D5, F#5, A5]
      const notes = [587.33, 739.99, 880.00];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.06, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.38);
      });
    } catch {
      // safe fallback
    }
  }
}

export const soundEffects = new SoundEffects();
