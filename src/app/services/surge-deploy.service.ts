import { Injectable, signal } from '@angular/core';

export interface DeploymentConfig {
  domain: string;
  projectFolder: string;
  isCustomDomain: boolean;
  spaFallbackEnabled: boolean;
  sslEnabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SurgeDeployService {
  readonly customSubdomain = signal<string>('pyadvance-academy');
  readonly customDomainInput = signal<string>('');
  readonly isCustom = signal<boolean>(false);
  readonly isGeneratingBundle = signal<boolean>(false);

  getEffectiveDomain(): string {
    if (this.isCustom() && this.customDomainInput().trim()) {
      return this.customDomainInput().trim().toLowerCase();
    }
    const sub = this.customSubdomain().trim().toLowerCase() || 'pyadvance-academy';
    return `${sub}.surge.sh`;
  }

  getTerminalCommands(): { label: string; cmd: string; desc: string }[] {
    const domain = this.getEffectiveDomain();
    return [
      {
        label: '1. Install Surge CLI',
        cmd: 'npm install --global surge',
        desc: 'Installs the official Surge CLI globally across Linux, Mac, or Windows.'
      },
      {
        label: '2. Build High-Performance Production Bundle',
        cmd: 'npm run build',
        desc: 'Compiles Angular AOT code with minification, tree-shaking, and inline CSS.'
      },
      {
        label: '3. Enable Single-Page App (SPA) Routing',
        cmd: 'cp dist/app/browser/index.html dist/app/browser/200.html',
        desc: 'Surge serves 200.html when routes reload, preventing 404 Page Not Found.'
      },
      {
        label: '4. Assign Free Domain (CNAME)',
        cmd: `echo "${domain}" > dist/app/browser/CNAME`,
        desc: `Binds your selected domain to the deployment bundle automatically.`
      },
      {
        label: '5. Deploy to Surge Live CDN',
        cmd: `surge dist/app/browser ${domain}`,
        desc: `Uploads directly to Surge's global edge CDN with free automatic SSL/TLS certificate.`
      }
    ];
  }

  generateDeployScript(): string {
    const domain = this.getEffectiveDomain();
    return `#!/usr/bin/env bash
# ==========================================================
# PyAdvance - Automatic Surge.sh Deployment Script
# Target Domain: ${domain}
# ==========================================================

set -e

echo "🚀 Step 1: Building production bundle..."
npm run build

echo "📄 Step 2: Creating 200.html for client-side routing..."
cp dist/app/browser/index.html dist/app/browser/200.html

echo "🌐 Step 3: Setting CNAME to ${domain}..."
echo "${domain}" > dist/app/browser/CNAME

echo "⚡ Step 4: Deploying to Surge.sh..."
npx surge dist/app/browser ${domain}

echo "✅ Successfully deployed to https://${domain} !"
`;
  }

  downloadDeployScript(): void {
    if (typeof window === 'undefined') return;
    const content = this.generateDeployScript();
    const blob = new Blob([content], { type: 'text/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deploy-surge.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
