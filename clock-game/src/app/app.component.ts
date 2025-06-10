import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ClockExercise, ClockExerciseTemplate } from './clock-exercise.model';
import { ExerciseGeneratorService } from './exercise-generator.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { initMain8 } from '../assets/scripts/main8.js';

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

  constructor(private http: HttpClient, private generator: ExerciseGeneratorService) { }

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
  

  private loadExercises() {
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
    //this.toast.success('Great job, try the next', 'Well done', 3000);
  }
  showWarning(message:string) {
    //this.toast.warning(message, 'Ops.', 3000);
  }
}
