import { ApiVersionManager } from "@/config/apiVersion";

export interface DocVersionInfo {
  version: string;
  title: string;
  description: string;
  path: string;
  isActive: boolean;
  spec?: any;
}

export class DocumentationVersionManager {
  private static versionSpecs: Map<string, any> = new Map();

  static async registerVersion(version: string, spec: any): Promise<void> {
    this.versionSpecs.set(version, spec);
  }

  static getVersionSpec(version: string): any | null {
    return this.versionSpecs.get(version) || null;
  }

  static getAvailableVersions(): DocVersionInfo[] {
    const apiVersions = ApiVersionManager.getSupportedVersions();
    
    return apiVersions.map(version => {
      const config = ApiVersionManager.getVersionConfig(version);
      return {
        version: config?.version || version,
        title: `ThamRoi Travel API - ${version.toUpperCase()}`,
        description: config?.description || `API documentation for ${version}`,
        path: `/api-docs/${version}`,
        isActive: config?.isActive || false,
        spec: this.versionSpecs.get(version)
      };
    });
  }

  static getLatestVersionInfo(): DocVersionInfo | null {
    const versions = this.getAvailableVersions();
    return versions.length > 0 ? versions[versions.length - 1] : null;
  }

  static generateVersionIndex(): any {
    const versions = this.getAvailableVersions();
    const latest = this.getLatestVersionInfo();

    return {
      title: "ThamRoi Travel API Documentation",
      description: "Choose an API version to view its documentation",
      latest_version: latest?.version,
      available_versions: versions.map(v => ({
        version: v.version,
        title: v.title,
        description: v.description,
        documentation_url: v.path,
        is_active: v.isActive
      })),
      endpoints: {
        version_discovery: "/api/versions",
        health_check: "/healthz",
        latest_docs: "/api-docs",
        version_specific_docs: "/api-docs/{version}"
      }
    };
  }
}