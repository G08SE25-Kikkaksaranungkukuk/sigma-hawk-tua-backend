export interface ApiVersionConfig {
    version: string;
    prefix: string;
    isActive: boolean;
    deprecatedAt?: Date;
    sunsetAt?: Date;
    description: string;
}

export const API_VERSIONS: Record<string, ApiVersionConfig> = {
    v1: {
        version: "1.0.0",
        prefix: "/api/v1",
        isActive: true,
        description: "Initial API version with core travel companion functionality",
    },
    // Future versions
    v2: {
        version: "2.0.0", 
        prefix: "/api/v2",
        isActive: true,
        description: "Enhanced API with advanced matching algorithms"
    }
};

export const DEFAULT_API_VERSION = "v1";

export class ApiVersionManager {
    static getSupportedVersions(): string[] {
        return Object.keys(API_VERSIONS).filter(
            version => API_VERSIONS[version].isActive
        );
    }

    static getVersionConfig(version: string): ApiVersionConfig | null {
        return API_VERSIONS[version] || null;
    }

    static isVersionSupported(version: string): boolean {
        const config = this.getVersionConfig(version);
        return config?.isActive ?? false;
    }

    static getLatestVersion(): string {
        const activeVersions = this.getSupportedVersions();
        return activeVersions[activeVersions.length - 1] || DEFAULT_API_VERSION;
    }

    static extractVersionFromPath(path: string): string | null {
        const versionMatch = path.match(/^\/api\/(v\d+)/);
        return versionMatch ? versionMatch[1] : null;
    }

    static buildVersionedPath(version: string, path: string): string {
        const config = this.getVersionConfig(version);
        if (!config) {
            throw new Error(`Unsupported API version: ${version}`);
        }
        return `${config.prefix}${path}`;
    }
}