import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { PatientsPageComponent } from './pages/patients-page/patients-page.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { AddPatientPageComponent } from './pages/add-patient-page/add-patient-page.component';
import { ReportPageComponent } from './pages/report-page/report-page.component';
import { canActivateAuth } from './auth/access.guard';
import { PatientProfilePageComponent } from './pages/patient-profile-page/patient-profile-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { DoctorsPageComponent } from './pages/doctors-page/doctors-page.component';

export const routes: Routes = [
    {path: '', component: LayoutComponent, children: [
        {path: '', redirectTo: 'calendar', pathMatch: 'prefix'},
        {path: 'profile/:id', component: PatientProfilePageComponent},
        {path: 'calendar', component: CalendarPageComponent},
        {path: 'services', component: ServicesPageComponent},
        {path: 'patients', component: PatientsPageComponent},
        {path: 'add-patient', component: AddPatientPageComponent},
        {path: 'report', component: ReportPageComponent},
        {path: 'chats', component: ChatPageComponent},
        {path: 'doctors', component: DoctorsPageComponent}


    ],
    canActivate: [canActivateAuth]
    },
    {path: 'login', component: LoginPageComponent},
    {path: 'registration', component: RegistrationPageComponent}
];
