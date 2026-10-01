import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SurgeDeployService } from '../../services/surge-deploy.service';

@Component({
  selector: 'app-surge-hub',
  imports: [CommonModule, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 max-w-7xl mx-auto">
      <!-- Hub Header Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2024] via-[#102d33] to-[#0a181c] text-white p-7 sm:p-10 border border-teal-500/30 shadow-md">
        <div class="relative z-10 max-w-3xl space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <mat-icon class="text-sm">verified</mat-icon>
            <span>FREE CUSTOM DOMAIN &amp; ZERO-CONFIG HOSTING</span>
          </div>

          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Deploy to Surge.sh &amp; Free Custom Domain
          </h1>

          <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
            Publish this entire Advanced Python Academy to a global CDN with free automatic SSL/TLS encryption. Runs at peak performance on both mobile phones and desktops with zero maintenance cost.
          </p>

          <div class="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-teal-300">
            <span class="flex items-center gap-1.5">
              <mat-icon class="text-base text-emerald-400">check_circle</mat-icon>
              <span>100% Free *.surge.sh Subdomains</span>
            </span>
            <span class="flex items-center gap-1.5">
              <mat-icon class="text-base text-emerald-400">check_circle</mat-icon>
              <span>Custom Domain DNS Support</span>
            </span>
            <span class="flex items-center gap-1.5">
              <mat-icon class="text-base text-emerald-400">check_circle</mat-icon>
              <span>Automated 200.html SPA Routing</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Domain Configuration Card -->
      <div class="bg-white dark:bg-[#11232B] rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">
            1. Select Your Target Domain
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Choose a free <code class="font-mono text-teal-600 dark:text-teal-400">.surge.sh</code> subdomain or specify your own custom domain.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div class="md:col-span-8 space-y-2">
            <div class="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  [checked]="!surge.isCustom()"
                  (change)="surge.isCustom.set(false)"
                  class="accent-teal-500" />
                <span>Free Surge Subdomain (*.surge.sh)</span>
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  [checked]="surge.isCustom()"
                  (change)="surge.isCustom.set(true)"
                  class="accent-teal-500" />
                <span>Own Custom Domain</span>
              </label>
            </div>

            @if (!surge.isCustom()) {
              <div class="flex items-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 focus-within:border-teal-500 transition-colors">
                <input
                  type="text"
                  [ngModel]="surge.customSubdomain()"
                  (ngModelChange)="surge.customSubdomain.set($event)"
                  placeholder="my-python-academy"
                  class="bg-transparent text-sm font-mono text-slate-900 dark:text-white font-bold flex-1 focus:outline-none" />
                <span class="text-xs font-mono font-bold text-slate-400">.surge.sh</span>
              </div>
            } @else {
              <div class="flex items-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 focus-within:border-teal-500 transition-colors">
                <input
                  type="text"
                  [ngModel]="surge.customDomainInput()"
                  (ngModelChange)="surge.customDomainInput.set($event)"
                  placeholder="learn.python-oop.com"
                  class="bg-transparent text-sm font-mono text-slate-900 dark:text-white font-bold flex-1 focus:outline-none" />
              </div>
            }
          </div>

          <div class="md:col-span-4 flex items-center gap-2">
            <button
              (click)="surge.downloadDeployScript()"
              class="w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm">
              <mat-icon class="text-base">download</mat-icon>
              <span>Download deploy-surge.sh</span>
            </button>
          </div>
        </div>

        <!-- Live Destination Link Box -->
        <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200">
            <mat-icon class="text-emerald-600 dark:text-emerald-400">link</mat-icon>
            <span>Your academy will be accessible at:</span>
            <strong class="font-mono text-emerald-700 dark:text-emerald-300 underline">{{ 'https://' + surge.getEffectiveDomain() }}</strong>
          </div>
          <span class="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
            SSL Enabled Free
          </span>
        </div>
      </div>

      <!-- Step-by-Step Terminal Guide (5 Steps) -->
      <div class="bg-white dark:bg-[#11232B] rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">
            2. Run Deployment Commands
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Execute these commands in your project terminal to build and push live to Surge.
          </p>
        </div>

        <div class="space-y-4">
          @for (step of surge.getTerminalCommands(); track step.label; let i = $index) {
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#0b1419] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="space-y-1">
                <div class="text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-[10px] font-bold">
                    {{ i + 1 }}
                  </span>
                  <span>{{ step.label }}</span>
                </div>
                <div class="text-xs font-mono text-teal-600 dark:text-teal-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 select-all overflow-x-auto">
                  {{ step.cmd }}
                </div>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                  {{ step.desc }}
                </p>
              </div>

              <button
                (click)="copyToClipboard(step.cmd, i)"
                class="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1 shrink-0 self-start sm:self-center transition-colors">
                <mat-icon class="text-sm">content_copy</mat-icon>
                <span>{{ copiedStepIndex() === i ? 'Copied!' : 'Copy' }}</span>
              </button>
            </div>
          }
        </div>
      </div>

      <!-- High Performance Optimization Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Performance Checklist -->
        <div class="bg-white dark:bg-[#11232B] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <mat-icon>speed</mat-icon>
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Mobile &amp; Desktop High Performance</h3>
              <p class="text-xs text-slate-500">Configured for 100/100 Lighthouse score</p>
            </div>
          </div>

          <ul class="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed">
            <li class="flex items-start gap-2">
              <mat-icon class="text-emerald-500 text-base shrink-0 mt-0.5">check_circle</mat-icon>
              <span><strong>Zoneless Angular 21 Architecture:</strong> Eliminates runtime Zone.js overhead for instant 60 FPS rendering.</span>
            </li>
            <li class="flex items-start gap-2">
              <mat-icon class="text-emerald-500 text-base shrink-0 mt-0.5">check_circle</mat-icon>
              <span><strong>Lazy WebAssembly Loader:</strong> Python runtime downloads in the background so mobile devices render content in under 300ms.</span>
            </li>
            <li class="flex items-start gap-2">
              <mat-icon class="text-emerald-500 text-base shrink-0 mt-0.5">check_circle</mat-icon>
              <span><strong>Edge CDN Caching:</strong> Surge automatically serves Gzip/Brotli compressed assets globally from locations nearest your learners.</span>
            </li>
          </ul>
        </div>

        <!-- Custom Domain DNS Records Table -->
        <div class="bg-white dark:bg-[#11232B] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <mat-icon>dns</mat-icon>
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Custom Domain DNS Settings</h3>
              <p class="text-xs text-slate-500">For Cloudflare, Namecheap, GoDaddy, etc.</p>
            </div>
          </div>

          <div class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                <tr>
                  <th class="p-2.5 font-semibold">Type</th>
                  <th class="p-2.5 font-semibold">Host</th>
                  <th class="p-2.5 font-semibold">Target / Value</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 text-[11px]">
                <tr>
                  <td class="p-2.5 font-bold text-teal-600">CNAME</td>
                  <td class="p-2.5">learn / www</td>
                  <td class="p-2.5 text-slate-400">na-bootstrap1.surge.sh</td>
                </tr>
                <tr>
                  <td class="p-2.5 font-bold text-teal-600">A Record</td>
                  <td class="p-2.5">&#64; (root)</td>
                  <td class="p-2.5 text-slate-400">45.55.110.124</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="text-[11px] text-slate-400 leading-relaxed">
            Once configured, Surge provisions an automatic SSL certificate for your custom domain within minutes.
          </p>
        </div>
      </div>
    </div>
  `
})
export class SurgeHubComponent {
  readonly surge = inject(SurgeDeployService);
  readonly copiedStepIndex = signal<number | null>(null);

  copyToClipboard(cmd: string, index: number) {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(cmd);
      this.copiedStepIndex.set(index);
      setTimeout(() => this.copiedStepIndex.set(null), 2000);
    }
  }
}
