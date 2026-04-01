import { instanceApi } from '../config';

export interface SeederInfo {
    name: string;
    key: string;
    description?: string;
    hasDrop: boolean;
}

export interface RunSeederResult {
    success: boolean;
    message: string;
}

export interface RunAllSeedersResult {
    success: boolean;
    message: string;
    results: {
        name: string;
        key: string;
        success: boolean;
        error?: string;
    }[];
}

export class SeederService {
    private static instance: SeederService;
    private apiPath = '/seeders';

    static getInstance(): SeederService {
        if (!SeederService.instance) {
            SeederService.instance = new SeederService();
        }
        return SeederService.instance;
    }

    async getSeeders(): Promise<SeederInfo[]> {
        const response = await instanceApi.get<SeederInfo[]>(this.apiPath);
        return response.data;
    }

    async runSeeder(seederKey: string, truncate: boolean = false): Promise<RunSeederResult> {
        const response = await instanceApi.post<RunSeederResult>(`${this.apiPath}/run`, {
            seederKey,
            truncate,
        });
        return response.data;
    }

    async runAllSeeders(truncate: boolean = false): Promise<RunAllSeedersResult> {
        const response = await instanceApi.post<RunAllSeedersResult>(`${this.apiPath}/run-all`, {
            truncate,
        });
        return response.data;
    }
}
