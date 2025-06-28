export interface SeederServiceOptions {
    name?: string | string[];
    refresh?: boolean;
    dummyData?: boolean;
}

export interface Seeder {
    seed(options: SeederServiceOptions): Promise<any>;
    drop(options: SeederServiceOptions): Promise<any>;
}
