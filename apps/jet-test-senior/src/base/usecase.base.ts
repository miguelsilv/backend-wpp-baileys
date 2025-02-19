export interface IUseCase<Output> {
    execute(...params: any[]): Promise<Output>;
}