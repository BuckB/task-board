import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { TaskDashboard } from './components/task-dashboard/task-dashboard';

describe('App Routes', () => {
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                provideRouter(routes)
            ]
        }).compileComponents();

        router = TestBed.inject(Router);
    });

    it('should navigate to "" and load TaskDashboard', async () => {
        const harness = await RouterTestingHarness.create();

        // This triggers the navigation to the default path ''
        const activatedComponent = await harness.navigateByUrl('', TaskDashboard);

        expect(activatedComponent).toBeInstanceOf(TaskDashboard);

        const element = harness.routeNativeElement;
        expect(element?.innerHTML).toContain('Task Board');
    });
});