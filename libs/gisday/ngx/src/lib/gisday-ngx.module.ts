import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './modules/footer/footer.component';
import { HeaderComponent } from './modules/header/header.component';

import { LandingModule } from './pages/landing/landing.module';
import { SessionsModule } from './pages/sessions/sessions.module';
import { FaqModule } from './pages/faq/faq.module';
import { SponsorsModule } from './pages/sponsors/sponsors.module';

@NgModule({
  imports: [CommonModule, FaqModule, LandingModule, SessionsModule, SponsorsModule],
  declarations: [FooterComponent, HeaderComponent],
  exports: [FaqModule, FooterComponent, HeaderComponent, LandingModule, SessionsModule, SponsorsModule]
})
export class GisdayNgxModule {}