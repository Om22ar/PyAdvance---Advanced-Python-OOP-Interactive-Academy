import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from './components/sidebar/sidebar';
import { TopbarComponent } from './components/topbar/topbar';
import { OverviewComponent } from './components/overview/overview';
import { CurriculumComponent } from './components/curriculum/curriculum';
import { PlaygroundComponent } from './components/playground/playground';
import { SimulatorsComponent } from './components/simulators/simulators';
import { SurgeHubComponent } from './components/surge-hub/surge-hub';
import { VscodeEditorComponent } from './components/vscode-editor/vscode-editor';
import { StudyReaderComponent } from './components/study-reader/study-reader';
import { LearningStateService } from './services/learning-state.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [
    CommonModule,
    MatIconModule,
    SidebarComponent,
    TopbarComponent,
    OverviewComponent,
    CurriculumComponent,
    PlaygroundComponent,
    SimulatorsComponent,
    SurgeHubComponent,
    VscodeEditorComponent,
    StudyReaderComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly state = inject(LearningStateService);
}

