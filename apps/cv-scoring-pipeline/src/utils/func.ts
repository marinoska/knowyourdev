// function composition: pipe(2, f1, f2)
export function pipe<T>(
    input: T | Promise<T>,
    ...funcs: ((arg: T) => T | Promise<T>)[]
): Promise<T> {
    return funcs.reduce<Promise<T>>(
        async (prevPromise, fn) => fn(await prevPromise),
        Promise.resolve(input)
    );
}

export const generateTechCode = (techName: string) => techName.replace(/[^a-zA-Z0-9#+]/g, '').toLowerCase();