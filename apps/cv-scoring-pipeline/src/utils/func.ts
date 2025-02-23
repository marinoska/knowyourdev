// function composition: pipe(2, f1, f2)
export function pipe(input: any, ...func: ((...args: any[]) => any)[]) {
    return func.reduce(async (a, f) => await f(a), input);
}

