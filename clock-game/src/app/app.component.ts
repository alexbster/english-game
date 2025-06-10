import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ClockExercise, ClockExerciseTemplate } from './clock-exercise.model';
import { ExerciseGeneratorService } from './exercise-generator.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { initMain8 } from '../assets/scripts/main8.js';
import { ToastrService } from 'ngx-toastr';

declare global {
  interface Window {
    hour: any;
    minute: any;
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'clock-game';
  current!: ClockExercise;
  data!: ClockExerciseTemplate[];
  hour = 0;
  minute = 0;
  welldoneToggle: boolean | undefined = undefined
  result = '';
  hours: Map<number, string> = new Map<number, string>();
  minutes: Map<number, string> = new Map<number, string>();
  successImages: string[] = [
    './assets/gifs/success00.gif',
    './assets/gifs/success01.gif',
    './assets/gifs/success02.gif',
    './assets/gifs/success03.gif',
    './assets/gifs/success04.gif',
    './assets/gifs/success05.gif',
    './assets/gifs/success06.gif',
    './assets/gifs/success07.gif',
    './assets/gifs/success08.gif',
    './assets/gifs/success09.gif',
    './assets/gifs/success10.gif',
    './assets/gifs/success11.gif',
    './assets/gifs/success12.gif',
    './assets/gifs/success13.gif',
  ]
  wrongImages: string[] = [
    './assets/gifs/wrong00.gif',
    './assets/gifs/wrong01.gif',
    './assets/gifs/wrong02.gif',
    './assets/gifs/wrong03.gif',
    './assets/gifs/wrong04.gif',
    './assets/gifs/wrong05.gif',
    './assets/gifs/wrong06.gif',
    './assets/gifs/wrong07.gif',
    './assets/gifs/wrong08.gif',
    './assets/gifs/wrong09.gif',
    './assets/gifs/wrong10.gif',
  ]

  constructor(private http: HttpClient, private generator: ExerciseGeneratorService, private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {
    // Aquí puedes realizar acciones adicionales después de que el contenido se haya inicializado
    console.log('Contenido inicializado');
    // Por ejemplo, podrías llamar a un método para cargar datos o inicializar componentes
    // this.loadExercises(); // Si deseas cargar ejercicios inmediatamente
    window.addEventListener("load", initMain8, false);
    window.addEventListener('timeClockAssigned', this.handler);
    this.loadHours();
  }


  loadExercises() {
    this.http.get('assets/data/exercises.json').subscribe({
      next: (res) => {
        this.data = res as ClockExerciseTemplate[];
        console.log('JSON Cargado:', this.data);

        this.processExercise();
      },
      error: (err) => {
        console.error('Error al cargar JSON:', err);
      }
    });
  }

  private loadMinutes() {
    this.http.get('assets/data/minutes.json').subscribe({
      next: (res) => {
        const minutesData = res as { [key: number]: string; };
        for (const [key, value] of Object.entries(minutesData)) {
          this.minutes.set(Number(key), value);
        }
        console.log('Minutos cargados:', this.minutes);
        this.loadExercises();
      },
      error: (err) => {
        console.error('Error al cargar minutos:', err);
      }
    });
  }

  private loadHours() {
    this.http.get('assets/data/hours.json').subscribe({
      next: (res) => {
        const hoursData = res as { [key: number]: string; };
        for (const [key, value] of Object.entries(hoursData)) {
          this.hours.set(Number(key), value);
        }
        console.log('Horas cargadas:', this.hours);
        this.loadMinutes();
      },
      error: (err) => {
        console.error('Error al cargar horas:', err);
      }
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('timeClockAssigned', this.handler);
  }

  processExercise(): void {
    this.current = this.generator.generateExercise(this.data);

    this.current.expression = this.current.expression.replace('_hour_', this.hours.get(this.current.hour) as string).replace('_minute_', this.minutes!.get(this.current.minute) as string)

    console.info('Modelo generado:', this.current);
    this.result = '';
    this.welldoneToggle = undefined;
  }

  check(): void {
    if (this.hour == this.current.correctHour && this.minute == this.current.correctMinute) {
      this.result = '✅ Well done!';
      this.showSuccess();
      this.welldoneToggle = true;
    } else {
      this.result = `❌ Try again. The correct time is ${this.formatTime(this.current.correctHour, this.current.correctMinute)}`;
      this.showWarning(this.result);
      this.welldoneToggle = false;
    }
  }

  private handler = (event: any) => {
    this.hour = event.detail.hour;
    this.minute = event.detail.minute;
    console.log('✅ Evento recibido en Angular: hora %d:%d', this.hour, this.minute);
  };

  private formatTime(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  showSuccess() {
    this.toastr.success('<img class="img" src="'+ this.successImages[Math.floor(Math.random() * this.successImages.length)] +'" width="200px" alt="Well done"/><p class="fs-2">Great job, try the next</p>', 'Well done');
  }
  showWarning(message: string) {
    this.toastr.warning('<img class="img" src="'+ this.wrongImages[Math.floor(Math.random() * this.wrongImages.length)] +'" width="200px" alt="Try again" /><p class="fs-2">' + message + '</p>', 'Ops.');
  }
}
