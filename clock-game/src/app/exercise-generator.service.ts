import { Injectable } from '@angular/core';
import { ClockExerciseTemplate, ClockExercise } from './clock-exercise.model';

@Injectable({ providedIn: 'root' })
export class ExerciseGeneratorService {
  generateExercise(template: ClockExerciseTemplate[]): ClockExercise {

    console.log('Generando ejercicio con la plantilla:', template);

    const time = this.random(template);
    const expr = this.random(time.expressions);
    const hour = this.random(expr.hours);
    const minute = this.random(expr.minutes);
    const image = this.random(time.images);

    let currentHour = hour;
    if(expr.hourAdjustment !== undefined) {
        console.log(`Ajustando hora: ${hour} + ${expr.hourAdjustment}`);
      currentHour = (hour + expr.hourAdjustment) % 12;
      if (currentHour === 0) {
        currentHour = 12; // Ajuste para que 0 se convierta en 12
      }
    }

    return {
      id: crypto.randomUUID(),
      time: time.time,
      image,
      expression: expr.label,
      hour: hour,
      minute: minute,
      correctHour: currentHour,
      correctMinute: minute
    };
  }

  private random<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}