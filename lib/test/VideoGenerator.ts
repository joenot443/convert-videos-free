/**
 * VideoGenerator - Creates test videos programmatically for automated testing
 */

export class VideoGenerator {
  /**
   * Generate a simple test video using Canvas and MediaRecorder
   * @param durationMs Duration of the video in milliseconds
   * @param options Video options
   * @returns A Blob containing the video
   */
  static async generateTestVideo(
    durationMs: number = 3000,
    options: {
      width?: number;
      height?: number;
      fps?: number;
      text?: string;
      includeAudio?: boolean;
    } = {}
  ): Promise<Blob> {
    const {
      width = 640,
      height = 480,
      fps = 30,
      text = 'TEST VIDEO',
      includeAudio = true,
    } = options;

    // Create canvas for video frames
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Create video stream from canvas
    const stream = canvas.captureStream(fps);

    // Add audio track if requested
    if (includeAudio) {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = 440; // A4 note
      gainNode.gain.value = 0.1; // Low volume

      oscillator.connect(gainNode);
      const dest = audioContext.createMediaStreamDestination();
      gainNode.connect(dest);

      stream.addTrack(dest.stream.getAudioTracks()[0]);
      oscillator.start();

      // Stop audio after duration
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, durationMs);
    }

    // Setup MediaRecorder
    const chunks: Blob[] = [];
    const mimeType = this.getSupportedMimeType();

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 2_500_000, // 2.5 Mbps
    });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    // Create animation function
    let frameCount = 0;
    const totalFrames = Math.floor((durationMs / 1000) * fps);
    const startTime = performance.now();

    const drawFrame = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw animated background
      const hue = (progress * 360) % 360;
      ctx.fillStyle = `hsl(${hue}, 50%, 20%)`;
      ctx.fillRect(0, 0, width, height);

      // Draw center circle
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 50 + Math.sin(progress * Math.PI * 4) * 20, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${(hue + 180) % 360}, 70%, 50%)`;
      ctx.fill();

      // Draw text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, height / 2);

      // Draw frame counter
      ctx.font = '20px Arial';
      ctx.fillStyle = '#FFFF00';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`Frame: ${frameCount}/${totalFrames}`, 10, 10);
      ctx.fillText(`Time: ${(elapsed / 1000).toFixed(2)}s`, 10, 40);

      frameCount++;

      if (elapsed < durationMs) {
        requestAnimationFrame(drawFrame);
      } else {
        recorder.stop();
      }
    };

    // Start recording
    return new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob);
      };

      recorder.onerror = (event) => {
        reject(new Error('MediaRecorder error: ' + event));
      };

      recorder.start();
      drawFrame();
    });
  }

  /**
   * Generate a simple WebM video without using MediaRecorder (fallback)
   */
  static async generateSimpleWebM(): Promise<Blob> {
    // This is a minimal WebM file with a single black frame
    // Generated using minimal WebM structure
    const webmHeader = new Uint8Array([
      0x1a, 0x45, 0xdf, 0xa3, // EBML header
      0x9f, 0x42, 0x86, 0x81, 0x01, // EBML version
      0x42, 0xf7, 0x81, 0x01, // DocType version
      0x42, 0xf2, 0x81, 0x04, // DocTypeReadVersion
      0x42, 0xf3, 0x81, 0x08, // DocType
      0x82, 0x84, 0x77, 0x65, 0x62, 0x6d, // "webm"
      0x87, 0x81, 0x02, // DocTypeVersion
      0x85, 0x81, 0x02, // DocTypeReadVersion
    ]);

    return new Blob([webmHeader], { type: 'video/webm' });
  }

  /**
   * Get supported MIME type for MediaRecorder
   */
  private static getSupportedMimeType(): string {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'video/webm'; // fallback
  }

  /**
   * Create a File object from a video blob
   */
  static blobToFile(blob: Blob, filename: string): File {
    return new File([blob], filename, {
      type: blob.type,
      lastModified: Date.now()
    });
  }

  /**
   * Generate test videos of various types
   */
  static async generateTestSuite(): Promise<File[]> {
    const files: File[] = [];

    // Small video with audio
    const smallVideo = await this.generateTestVideo(2000, {
      width: 320,
      height: 240,
      text: 'SMALL',
      includeAudio: true,
    });
    files.push(this.blobToFile(smallVideo, 'test_small.webm'));

    // Medium video without audio
    const mediumVideo = await this.generateTestVideo(3000, {
      width: 640,
      height: 480,
      text: 'MEDIUM',
      includeAudio: false,
    });
    files.push(this.blobToFile(mediumVideo, 'test_medium_no_audio.webm'));

    // HD video with audio
    const hdVideo = await this.generateTestVideo(4000, {
      width: 1280,
      height: 720,
      text: 'HD TEST',
      includeAudio: true,
    });
    files.push(this.blobToFile(hdVideo, 'test_hd.webm'));

    return files;
  }
}