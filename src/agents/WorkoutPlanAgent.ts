import { Member, WorkoutPlan, Exercise } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

export class WorkoutPlanAgent {

    async generatePlan(member: Member): Promise<WorkoutPlan> {
        // Logic to select exercises based on goal
        const exercises: Exercise[] = [];

        if (member.goal === 'muscle_gain') {
            exercises.push(
                { name: 'Squats', sets: 4, reps: '8-10', rest: '90s' },
                { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90s' },
                { name: 'Bent Over Rows', sets: 4, reps: '10-12', rest: '60s' }
            );
        } else {
            exercises.push(
                { name: 'Bodyweight Squats', sets: 3, reps: '15', rest: '45s' },
                { name: 'Pushups', sets: 3, reps: '12-15', rest: '45s' },
                { name: 'Plank', sets: 3, reps: '45s', rest: '45s' }
            );
        }

        const plan: WorkoutPlan = {
            plan_id: uuidv4(),
            member_id: member.member_id,
            version: 1,
            exercises: exercises,
            created_by: 'AI',
            status: 'draft'
        };

        return plan;
    }
}
